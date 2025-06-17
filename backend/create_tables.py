from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime

def init_db():
    try:
        # Configuration de la connexion
        DATABASE_URL = "mysql+pymysql://root@127.0.0.1:3306/tracker_delivery?charset=utf8mb4"
        
        print("Connexion à la base de données...")
        engine = create_engine(DATABASE_URL)
        Base = declarative_base()
        
        # Définition des modèles
        class User(Base):
            __tablename__ = "users"
            id = Column(Integer, primary_key=True, index=True)
            email = Column(String(100), unique=True, index=True)
            password = Column(String(255), nullable=False)
            first_name = Column(String(50))
            last_name = Column(String(50))
            phone = Column(String(20))
            role = Column(String(20), default="user")
            created_at = Column(DateTime, default=datetime.datetime.utcnow)
        
        class TrackingHistory(Base):
            __tablename__ = "tracking_history"
            id = Column(Integer, primary_key=True, index=True)
            delivery_id = Column(Integer, ForeignKey("deliveries.id"))
            timestamp = Column(DateTime, default=datetime.datetime.utcnow)
            status = Column(String(50))
            description = Column(Text)
        
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
            history = relationship("TrackingHistory", back_populates="delivery", cascade="all, delete-orphan")
        
        # Création des tables
        print("Création des tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tables créées avec succès")
        
        # Vérification des tables créées
        with engine.connect() as conn:
            result = conn.execute("SHOW TABLES")
            tables = [row[0] for row in result]
            print("\nTables disponibles:", ", ".join(tables))
        
    except Exception as e:
        print(f"❌ Erreur lors de la création des tables: {e}")
        if 'engine' in locals():
            print(f"URL de connexion: {DATABASE_URL}")
    
    print("\n" + "="*50)
    print("Pour démarrer le serveur API, exécutez:")
    print("python main.py")
    print("="*50)

if __name__ == "__main__":
    print("="*50)
    print("CRÉATION DES TABLES DE LA BASE DE DONNÉES")
    print("="*50 + "\n")
    init_db()
