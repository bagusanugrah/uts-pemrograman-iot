# main.py
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, SensorData
from schemas import SensorDataCreate
from crud import create_sensor_data
from datetime import datetime
from sqlalchemy import func, desc
from fastapi.middleware.cors import CORSMiddleware

# Membuat semua tabel berdasarkan model yang didefinisikan di `models.py`
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ganti dengan URL frontend Anda
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fungsi untuk mendapatkan koneksi database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint untuk menambahkan data sensor
@app.post("/data/")
async def add_sensor_data(data: SensorDataCreate, db: Session = Depends(get_db)):
    return create_sensor_data(db=db, data=data)

# Endpoint untuk membaca data dengan statistik tambahan
@app.get("/data/")
async def read_sensor_data(db: Session = Depends(get_db)):
    # Hitung statistik dasar
    suhu_max = db.query(func.max(SensorData.temperature)).scalar()
    suhu_min = db.query(func.min(SensorData.temperature)).scalar()
    suhu_rata = db.query(func.avg(SensorData.temperature)).scalar()

    # Data suhu maksimum tanpa filter untuk kelembapan
    nilai_suhu_max_humid_max = db.query(SensorData).filter(
        SensorData.temperature == suhu_max
    ).all()

    # Data bulan-tahun untuk suhu maksimum tanpa filter untuk kelembapan
    month_year_max = db.query(
        func.date_format(SensorData.timestamp, '%m-%Y').label('month_year')
    ).filter(
        SensorData.temperature == suhu_max
    ).distinct().all()

    # Menyusun hasil dalam format JSON
    result = {
        "suhumax": suhu_max,
        "suhumin": suhu_min,
        "suhurata": round(suhu_rata, 2),
        "nilai_suhu_max_humid_max": [
            {
                "idx": data.id,
                "suhu": data.temperature,
                "humid": data.humidity,
                "kecerahan": data.brightness,
                "timestamp": data.timestamp
            }
            for data in nilai_suhu_max_humid_max
        ],
        "month_year_max": [{"month_year": my.month_year} for my in month_year_max]
    }

    return result

# Endpoint baru untuk mengambil semua data dari tabel sensor_data, diurutkan dari yang terbaru
@app.get("/seluruh-data/")
async def get_all_data(db: Session = Depends(get_db)):
    all_data = db.query(SensorData).order_by(desc(SensorData.timestamp)).all()
    return [
        {
            "id": data.id,
            "temperature": data.temperature,
            "humidity": data.humidity,
            "brightness": data.brightness,
            "timestamp": data.timestamp
        }
        for data in all_data
    ]