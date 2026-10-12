import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- Species Schemas ---
class SpeciesBase(BaseModel):
    id: str
    common_name: str
    scientific_name: str
    class_taxonomy: str
    family: str
    conservation_status: str
    iucn_code: str
    habitat: str
    geographic_range: str
    depth_range: Optional[str] = None
    diet: Optional[str] = None
    population_trend: Optional[str] = "Decreasing"
    threats: str
    conservation_actions: str
    traceable_sources: str
    image_url: str
    sdg_alignment: Optional[str] = "SDG 14.1, 14.2, 14.4"

class SpeciesResponse(SpeciesBase):
    pass

    class Config:
        from_attributes = True


# --- ML Prediction Schemas ---
class PredictionItem(BaseModel):
    species_id: str
    common_name: str
    scientific_name: str
    confidence: float
    confidence_percentage: str
    conservation_status: str
    iucn_code: str
    habitat: str
    geographic_range: str
    image_url: str

class PredictResponse(BaseModel):
    status: str  # "success", "low_confidence", "unknown"
    is_confident: bool
    top_predictions: List[PredictionItem]
    top_species: Optional[PredictionItem] = None
    inference_time_ms: float
    message: str
    warning: Optional[str] = None


# --- Observation Schemas ---
class ObservationCreate(BaseModel):
    species_id: Optional[str] = None
    species_name: str
    confidence: Optional[float] = None
    date_observed: str
    location_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    notes: Optional[str] = None
    image_url: Optional[str] = None
    observer_name: Optional[str] = "Ocean Community Contributor"
    consent_given: bool = True

class ObservationResponse(ObservationCreate):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# --- Threat Report Schemas ---
class ThreatReportCreate(BaseModel):
    threat_type: str  # Plastic Pollution, Ghost Gear, Injured Animal, Oil Spill, etc.
    description: str
    severity: str = "Medium"
    location_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None
    reporter_contact: Optional[str] = None

class ThreatReportResponse(ThreatReportCreate):
    id: int
    status: str = "Unverified"
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# --- Model Metrics Schemas ---
class ModelMetricsResponse(BaseModel):
    model_config = {"protected_namespaces": ()}

    model_name: str
    architecture: str
    dataset_name: str
    num_classes: int
    classes: List[str]
    accuracy: float
    precision_macro: float
    recall_macro: float
    f1_macro: float
    top3_accuracy: float
    total_test_samples: int
    test_loss: float
    evaluation_date: str
    is_real_trained_model: bool
    class_metrics: Dict[str, Dict[str, float]]


# --- Biodiversity Dashboard Stats ---
class DashboardStatsResponse(BaseModel):
    total_species: int
    total_observations: int
    total_threat_reports: int
    endangered_species_count: int
    threats_by_type: Dict[str, int]
    observations_by_species: Dict[str, int]
    recent_observations: List[ObservationResponse]
    recent_threats: List[ThreatReportResponse]
    conservation_distribution: Dict[str, int]
