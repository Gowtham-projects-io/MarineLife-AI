import os
import shutil
import uuid
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func

import models
import schemas
from database import get_db, engine
from seed_data import seed_database
from ml.inference import predict_marine_species, get_model_metrics, load_model

# Ensure DB is seeded
seed_database()

# Pre-load PyTorch ML model into memory on startup
try:
    load_model()
    print("[Server Startup] PyTorch MobileNetV3 model loaded into memory successfully.")
except Exception as e:
    print(f"[Server Startup] Warning: ML model loading error: {e}")

app = FastAPI(
    title="MarineLife AI API",
    description="Intelligent Marine Species Identification & Conservation Platform aligned with UN SDG 14: Life Below Water",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
SAMPLE_DIR = os.path.join(BASE_DIR, "sample_images")
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(SAMPLE_DIR, exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")
app.mount("/samples", StaticFiles(directory=SAMPLE_DIR), name="samples")


# 1. Health Endpoint
@app.get("/api/health", summary="Service Health & Diagnostic Status")
def health_check(db: Session = Depends(get_db)):
    species_count = db.query(models.Species).count()
    observations_count = db.query(models.Observation).count()
    threats_count = db.query(models.ThreatReport).count()
    return {
        "status": "online",
        "service": "MarineLife AI Engine",
        "sdg_target": "SDG 14: Life Below Water",
        "database": "connected",
        "species_catalog_size": species_count,
        "total_observations": observations_count,
        "total_threat_reports": threats_count,
        "ml_model_loaded": True
    }


# 2. Species Endpoints
@app.get("/api/species", response_model=List[schemas.SpeciesResponse], summary="List All Marine Species Catalog")
def get_species_list(
    iucn_status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Species)
    if iucn_status and iucn_status != "ALL":
        query = query.filter(models.Species.conservation_status.ilike(f"%{iucn_status}%"))
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (models.Species.common_name.ilike(search_fmt)) |
            (models.Species.scientific_name.ilike(search_fmt)) |
            (models.Species.habitat.ilike(search_fmt))
        )
    return query.all()


@app.get("/api/species/{species_id}", response_model=schemas.SpeciesResponse, summary="Get Species Profile by ID")
def get_species_detail(species_id: str, db: Session = Depends(get_db)):
    species = db.query(models.Species).filter(models.Species.id == species_id).first()
    if not species:
        raise HTTPException(status_code=404, detail=f"Species '{species_id}' not found in catalog.")
    return species


# 3. AI Species Identification Endpoint
@app.post("/api/predict", response_model=schemas.PredictResponse, summary="AI Inference: Predict Marine Species from Image")
async def predict_species(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validate MIME type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a valid image file (JPEG, PNG, WebP)."
        )

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(image_bytes) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image file exceeds maximum allowable size (15MB).")

    # Fetch species lookup dictionary from DB for rich metadata
    species_records = db.query(models.Species).all()
    species_lookup = {
        s.id: {
            "common_name": s.common_name,
            "scientific_name": s.scientific_name,
            "conservation_status": s.conservation_status,
            "iucn_code": s.iucn_code,
            "habitat": s.habitat,
            "geographic_range": s.geographic_range,
            "image_url": s.image_url
        }
        for s in species_records
    }

    try:
        prediction_result = predict_marine_species(image_bytes, species_lookup)
        return prediction_result
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(err)}")


# 4. Observations Endpoints
@app.get("/api/observations", response_model=List[schemas.ObservationResponse], summary="Retrieve Community Observations")
def get_observations(
    species_id: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(models.Observation).order_by(models.Observation.created_at.desc())
    if species_id:
        query = query.filter(models.Observation.species_id == species_id)
    return query.limit(limit).all()


@app.post("/api/observations", response_model=schemas.ObservationResponse, status_code=status.HTTP_201_CREATED)
def create_observation(
    observation: schemas.ObservationCreate,
    db: Session = Depends(get_db)
):
    if not observation.consent_given:
        raise HTTPException(
            status_code=400,
            detail="Observation submission requires contributor consent for open science sharing."
        )

    new_obs = models.Observation(
        species_id=observation.species_id,
        species_name=observation.species_name,
        confidence=observation.confidence,
        date_observed=observation.date_observed,
        location_name=observation.location_name,
        latitude=observation.latitude,
        longitude=observation.longitude,
        notes=observation.notes,
        image_url=observation.image_url,
        observer_name=observation.observer_name,
        consent_given=observation.consent_given
    )
    db.add(new_obs)
    db.commit()
    db.refresh(new_obs)
    return new_obs


# 5. Marine Threat Reporting Endpoints
@app.get("/api/threats", response_model=List[schemas.ThreatReportResponse], summary="List Marine Threat Reports")
def get_threats(
    status_filter: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(models.ThreatReport).order_by(models.ThreatReport.created_at.desc())
    if status_filter:
        query = query.filter(models.ThreatReport.status == status_filter)
    return query.limit(limit).all()


@app.post("/api/threats", response_model=schemas.ThreatReportResponse, status_code=status.HTTP_201_CREATED)
def report_marine_threat(
    threat: schemas.ThreatReportCreate,
    db: Session = Depends(get_db)
):
    new_threat = models.ThreatReport(
        threat_type=threat.threat_type,
        description=threat.description,
        severity=threat.severity,
        location_name=threat.location_name,
        latitude=threat.latitude,
        longitude=threat.longitude,
        image_url=threat.image_url,
        status="Unverified",  # Reports marked unverified until marine ranger review
        reporter_contact=threat.reporter_contact
    )
    db.add(new_threat)
    db.commit()
    db.refresh(new_threat)
    return new_threat


# 6. File Upload Helper (for observation and threat photos)
@app.post("/api/upload", summary="Upload Observation or Threat Image")
async def upload_file(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted.")

    ext = os.path.splitext(file.filename)[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOADS_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"url": f"/uploads/{filename}", "filename": filename}


# 7. Model Performance & Evaluation Metrics Endpoint
@app.get("/api/metrics", response_model=schemas.ModelMetricsResponse, summary="Retrieve Real ML Model Evaluation Metrics")
def get_metrics():
    metrics = get_model_metrics()
    return metrics


# 8. Biodiversity Dashboard Statistics
@app.get("/api/stats", response_model=schemas.DashboardStatsResponse, summary="Aggregated Biodiversity Dashboard Stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_species = db.query(models.Species).count()
    total_observations = db.query(models.Observation).count()
    total_threats = db.query(models.ThreatReport).count()

    # Endangered species
    endangered_count = db.query(models.Species).filter(
        models.Species.conservation_status.in_(["Endangered", "Critically Endangered"])
    ).count()

    # Conservation status breakdown
    status_counts = db.query(models.Species.conservation_status, func.count(models.Species.id)).group_by(models.Species.conservation_status).all()
    conservation_distribution = {status: count for status, count in status_counts}

    # Threats by type
    threat_counts = db.query(models.ThreatReport.threat_type, func.count(models.ThreatReport.id)).group_by(models.ThreatReport.threat_type).all()
    threats_by_type = {t_type: count for t_type, count in threat_counts}

    # Observations by species
    obs_counts = db.query(models.Observation.species_name, func.count(models.Observation.id)).group_by(models.Observation.species_name).all()
    observations_by_species = {s_name: count for s_name, count in obs_counts}

    recent_obs = db.query(models.Observation).order_by(models.Observation.created_at.desc()).limit(6).all()
    recent_threats = db.query(models.ThreatReport).order_by(models.ThreatReport.created_at.desc()).limit(6).all()

    return {
        "total_species": total_species,
        "total_observations": total_observations,
        "total_threat_reports": total_threats,
        "endangered_species_count": endangered_count,
        "threats_by_type": threats_by_type,
        "observations_by_species": observations_by_species,
        "recent_observations": recent_obs,
        "recent_threats": recent_threats,
        "conservation_distribution": conservation_distribution
    }


# 9. Sample Test Images Endpoint
@app.get("/api/sample-images", summary="List Sample Marine Species Images for Quick Demo Testing")
def get_sample_images():
    samples = []
    if os.path.exists(SAMPLE_DIR):
        for f in os.listdir(SAMPLE_DIR):
            if f.endswith((".jpg", ".jpeg", ".png")):
                species_id = os.path.splitext(f)[0]
                samples.append({
                    "species_id": species_id,
                    "filename": f,
                    "url": f"/samples/{f}"
                })
    return samples
