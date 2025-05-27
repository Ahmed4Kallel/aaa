from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime

# Configuration de la connexion à MySQL (WAMP Server)
DATABASE_URL = "mysql://root:@localhost/delivery_tracker"

# Création du moteur SQLAlchemy
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modèles SQLAlchemy
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255), nullable=False)  # S'assurer que le champ est assez long et non nullable
    first_name = Column(String(50))
    last_name = Column(String(50))
    phone = Column(String(20))
    role = Column(String(20))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    email_verified = Column(Boolean, default=False, nullable=False)  # S'assurer que le champ est non nullable avec une valeur par défaut

class TrackingHistory(Base):
    __tablename__ = "tracking_history"

    id = Column(Integer, primary_key=True, index=True)
    delivery_id = Column(Integer, ForeignKey("deliveries.id"))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(50))
    description = Column(Text)
    
    # Relation avec Delivery
    delivery = relationship("Delivery", back_populates="history")

class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, index=True)
    tracking_number = Column(String(50), unique=True, index=True)
    status = Column(String(50))
    sender = Column(String(100))
    recipient = Column(String(100))
    current_location = Column(String(100))
    estimated_delivery = Column(String(50))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    weight = Column(Float)
    destination = Column(String(255))
    priority = Column(String(20), default="normal")
    
    # Relation avec TrackingHistory
    history = relationship("TrackingHistory", back_populates="delivery", cascade="all, delete-orphan")

# Fonction pour obtenir une session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Fonction pour initialiser la base de données
def init_db():
    Base.metadata.create_all(bind=engine)
