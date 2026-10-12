import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Species(Base):
    __tablename__ = "species"

    id = Column(String(64), primary_key=True, index=True)
    common_name = Column(String(128), nullable=False)
    scientific_name = Column(String(128), nullable=False)
    class_taxonomy = Column(String(64), nullable=False)
    family = Column(String(64), nullable=False)
    conservation_status = Column(String(64), nullable=False)
    iucn_code = Column(String(16), nullable=False)
    habitat = Column(Text, nullable=False)
    geographic_range = Column(Text, nullable=False)
    depth_range = Column(String(64), nullable=True)
    diet = Column(Text, nullable=True)
    population_trend = Column(String(64), default="Decreasing")
    threats = Column(Text, nullable=False)  # JSON string or detailed text
    conservation_actions = Column(Text, nullable=False)  # JSON string or detailed text
    traceable_sources = Column(Text, nullable=False)  # JSON string of source citations
    image_url = Column(String(256), nullable=False)
    sdg_alignment = Column(String(256), default="SDG 14.1, 14.2, 14.4")

    observations = relationship("Observation", back_populates="species")


class Observation(Base):
    __tablename__ = "observations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    species_id = Column(String(64), ForeignKey("species.id"), nullable=True)
    species_name = Column(String(128), nullable=False)
    confidence = Column(Float, nullable=True)
    date_observed = Column(String(32), nullable=False)
    location_name = Column(String(256), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    image_url = Column(String(256), nullable=True)
    observer_name = Column(String(128), default="Ocean Community Contributor")
    consent_given = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    species = relationship("Species", back_populates="observations")


class ThreatReport(Base):
    __tablename__ = "threat_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    threat_type = Column(String(64), nullable=False)  # Plastic Pollution, Ghost Gear, Injured Animal, etc.
    description = Column(Text, nullable=False)
    severity = Column(String(32), default="Medium")
    location_name = Column(String(256), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    image_url = Column(String(256), nullable=True)
    status = Column(String(32), default="Unverified")  # Unverified until reviewed
    reporter_contact = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
