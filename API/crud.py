# crud.py
from sqlalchemy.orm import Session
from models import SensorData
from schemas import SensorDataCreate

def create_sensor_data(db: Session, data: SensorDataCreate):
    db_data = SensorData(
        temperature=data.temperature,
        humidity=data.humidity,
        brightness=data.brightness  # Tidak perlu timestamp karena akan diisi otomatis
    )
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data
