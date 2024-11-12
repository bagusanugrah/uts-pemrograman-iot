# models.py
from sqlalchemy import Column, Float, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class SensorData(Base):
    __tablename__ = 'sensor_data'
    
    id = Column(Integer, primary_key=True, index=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    brightness = Column(Integer)  # Kolom brightness tetap ada
    timestamp = Column(DateTime(timezone=True), default=func.now())  # Otomatis diisi saat data disimpan
