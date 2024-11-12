# schemas.py
from pydantic import BaseModel
from datetime import datetime

class SensorDataCreate(BaseModel):
    temperature: float
    humidity: float
    brightness: int  # Kolom brightness tetap ada, tapi tanpa timestamp

class SensorData(SensorDataCreate):
    id: int
    timestamp: datetime  # timestamp hanya akan ada pada output, bukan input

    class Config:
        orm_mode = True