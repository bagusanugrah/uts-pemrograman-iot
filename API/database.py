# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Konfigurasi koneksi database
DATABASE_URL = "mysql+pymysql://root:@localhost:3306/uts_iot"

# Membuat engine SQLAlchemy untuk MySQL
engine = create_engine(DATABASE_URL)

# Membuat session untuk interaksi dengan database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Mendefinisikan model dasar untuk semua tabel
Base = declarative_base()
