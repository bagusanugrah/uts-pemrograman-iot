# main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, SensorData
from datetime import datetime
from sqlalchemy import func, desc
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
import random

# Membuat semua tabel berdasarkan model yang didefinisikan di `models.py`
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

# Variabel untuk menyimpan data sementara sebelum disimpan ke database
latest_temp = None
latest_hum = None

# Fungsi callback ketika terhubung ke broker MQTT
def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker with result code " + str(rc))
    client.subscribe("iot/hydroponic-152022029/temperature")
    client.subscribe("iot/hydroponic-152022029/humidity")

# Fungsi callback ketika menerima pesan dari broker MQTT
def on_message(client, userdata, msg):
    global latest_temp, latest_hum

    if msg.topic == "iot/hydroponic-152022029/temperature":
        latest_temp = float(msg.payload.decode())
        print(f"Temperature received: {latest_temp}")

    elif msg.topic == "iot/hydroponic-152022029/humidity":
        latest_hum = float(msg.payload.decode())
        print(f"Humidity received: {latest_hum}")

    # Jika keduanya tersedia, simpan ke database
    if latest_temp is not None and latest_hum is not None:
        brightness = random.randint(0, 100)
        db = SessionLocal()
        new_data = SensorData(
            temperature=latest_temp,
            humidity=latest_hum,
            brightness=brightness,
            timestamp=datetime.now()
        )
        db.add(new_data)
        db.commit()
        db.close()
        
        # Reset nilai setelah disimpan
        latest_temp = None
        latest_hum = None
        print(f"Data stored with brightness: {brightness}")

# Konfigurasi MQTT Client
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

# Hubungkan ke broker MQTT
mqtt_client.connect("broker.hivemq.com", 1883, 60)
mqtt_client.loop_start()

class MQTTPublishPayload(BaseModel):
    topic: str
    message: str

@app.post("/mqtt-publish")
async def mqtt_publish(payload: MQTTPublishPayload):
    try:
        publish.single(payload.topic, payload.message, hostname="broker.hivemq.com")
        return {"status": "Pesan dikirim ke MQTT"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint untuk membaca data dengan statistik tambahan
from sqlalchemy import and_

@app.get("/data/")
async def read_sensor_data(db: Session = Depends(get_db)):
    # Hitung statistik dasar
    suhu_max = db.query(func.max(SensorData.temperature)).scalar()
    suhu_min = db.query(func.min(SensorData.temperature)).scalar()
    suhu_rata = db.query(func.avg(SensorData.temperature)).scalar()
    humid_max = db.query(func.max(SensorData.humidity)).scalar()

    # Tampilkan suhu dan kelembapan maksimal untuk debugging
    print("Debug: suhu_max =", suhu_max)
    print("Debug: suhu_min =", suhu_min)
    print("Debug: suhu_rata =", suhu_rata)
    print("Debug: humid_max =", humid_max)

    # Menambahkan toleransi 0.1 untuk pencarian nilai maksimum
    tolerance = 0.1
    nilai_suhu_max_humid_max = db.query(SensorData).filter(
        and_(
            SensorData.temperature.between(suhu_max - tolerance, suhu_max + tolerance),
            SensorData.humidity.between(humid_max - tolerance, humid_max + tolerance)
        )
    ).all()

    # Debugging output untuk data yang ditemukan
    if nilai_suhu_max_humid_max:
        print("Debug: nilai_suhu_max_humid_max ditemukan:")
        for data in nilai_suhu_max_humid_max:
            print(f"ID: {data.id}, Temp: {data.temperature}, Hum: {data.humidity}, Brightness: {data.brightness}")
    else:
        print("Debug: nilai_suhu_max_humid_max tidak ditemukan atau kosong")

    # Cek juga data bulan-tahun untuk suhu maksimum dengan toleransi
    month_year_max = db.query(
        func.date_format(SensorData.timestamp, '%m-%Y').label('month_year')
    ).filter(
        and_(
            SensorData.temperature.between(suhu_max - tolerance, suhu_max + tolerance),
            SensorData.humidity.between(humid_max - tolerance, humid_max + tolerance)
        )
    ).distinct().all()

    # Debugging output untuk month_year_max
    if month_year_max:
        print("Debug: month_year_max ditemukan:", month_year_max)
    else:
        print("Debug: month_year_max tidak ditemukan atau kosong")

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
