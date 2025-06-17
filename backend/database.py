from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime

# Configuration de la connexion à MySQL (WAMP Server)
# Pour WAMP, utilisez '127.0.0.1' au lieu de 'localhost' pour éviter les problèmes de résolution DNS
# Port par défaut de WAMP : 3306
# Utilisateur par défaut : root (sans mot de passe)
DATABASE_URL = "mysql+pymysql://root:@127.0.0.1:3306/tracker_delivery?charset=utf8mb4"

# Alternative si vous rencontrez des problèmes avec PyMySQL
# DATABASE_URL = "mysql+mysqlconnector://root:@127.0.0.1:3306/tracker_delivery?charset=utf8mb4"

# Création du moteur SQLAlchemy avec des paramètres optimisés pour WAMP
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Vérifier la connexion avant utilisation
    pool_recycle=3600,   # Recycler les connexions toutes les heures
    echo=False           # Désactiver les logs SQL pour la production
)

# Création de la session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Création de la base
Base = declarative_base()

# Modèle User
class DBUser(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(50), default="driver")  # admin, driver, customer
    first_name = Column(String(100))
    last_name = Column(String(100))
    phone = Column(String(20))
    address = Column(Text)
    email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)
    
    # Relations
    deliveries = relationship("DBDelivery", back_populates="driver")

# Modèle Delivery
class DBDelivery(Base):
    __tablename__ = "deliveries"
    
    id = Column(Integer, primary_key=True, index=True)
    tracking_number = Column(String(50), unique=True, index=True)
    sender = Column(String(100))
    recipient = Column(String(100))
    destination = Column(String(255))
    weight = Column(Float)
    status = Column(String(50), default="pending")  # pending, in_transit, delivered, cancelled
    driver_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    current_location = Column(String(255), nullable=True)
    estimated_delivery = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)
    
    # Relations
    driver = relationship("DBUser", back_populates="deliveries")
    history = relationship("DBDeliveryHistory", back_populates="delivery", cascade="all, delete-orphan")

# Modèle DeliveryHistory
class DBDeliveryHistory(Base):
    __tablename__ = "delivery_history"
    
    id = Column(Integer, primary_key=True, index=True)
    delivery_id = Column(Integer, ForeignKey("deliveries.id"))
    timestamp = Column(DateTime, default=datetime.datetime.now)
    status = Column(String(50))
    description = Column(Text, nullable=True)
    
    # Relations
    delivery = relationship("DBDelivery", back_populates="history")

# Création des tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Fonction pour obtenir la session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialiser la base de données
if __name__ == "__main__":
    create_tables()
    print("Tables créées avec succès!")
