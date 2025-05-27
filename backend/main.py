from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Annotated
from datetime import datetime, timedelta
import jwt
from jwt.exceptions import PyJWTError, InvalidTokenError
import bcrypt
import uvicorn
import traceback
import logging
from typing_extensions import TypedDict
from sqlalchemy.orm import Session

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import des modèles de base de données
from database import get_db, User as DBUser, Delivery as DBDelivery, TrackingHistory as DBTrackingHistory

app = FastAPI(title="DeliveryTracker Pro API", version="1.0.0")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration JWT
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

# Modèles Pydantic
class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class DeliveryStatus(BaseModel):
    status: str

class TrackingHistory(BaseModel):
    timestamp: str
    status: str
    description: str

class Delivery(BaseModel):
    trackingNumber: str
    status: str
    sender: str
    recipient: str
    currentLocation: str
    estimatedDelivery: str
    history: List[TrackingHistory]

# Les données sont maintenant stockées dans la base de données MySQL
# Les fonctions ci-dessous remplacent les accès aux structures de données en mémoire

# Fonctions utilitaires
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return email
    except (PyJWTError, InvalidTokenError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_user_by_email(email: str, db: Session):
    return db.query(DBUser).filter(DBUser.email == email).first()

# Routes d'authentification
@app.post("/api/auth/register")
async def register(user: UserRegister, db: Session = Depends(get_db)):
    try:
        logger.info(f"Tentative d'inscription pour l'email: {user.email}")
        
        # Vérifier si l'utilisateur existe déjà
        if get_user_by_email(user.email, db):
            logger.warning(f"L'email {user.email} existe déjà dans la base de données")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un utilisateur avec cet email existe déjà"
            )
        
        # Hasher le mot de passe
        logger.info("Hachage du mot de passe")
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        
        # Créer le nouvel utilisateur
        logger.info("Création du nouvel utilisateur dans la base de données")
        new_user = DBUser(
            email=user.email,
            password=hashed_password,
            first_name=user.first_name,
            last_name=user.last_name,
            phone=user.phone,
            role="driver",
            email_verified=False
        )
        
        # Ajouter et commit à la base de données
        logger.info("Ajout de l'utilisateur à la session")
        db.add(new_user)
        
        logger.info("Commit des changements à la base de données")
        db.commit()
        
        logger.info(f"Utilisateur {user.email} créé avec succès")
        return {"message": "Utilisateur créé avec succès"}
    
    except Exception as e:
        # En cas d'erreur, rollback la transaction
        db.rollback()
        
        # Log l'erreur complète avec stack trace
        error_msg = f"Erreur lors de l'inscription: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())
        
        # Renvoyer une erreur 500 avec des détails
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'inscription: {str(e)}"
        )

@app.post("/api/auth/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    # Trouver l'utilisateur
    db_user = get_user_by_email(user.email, db)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )
    
    # Vérifier le mot de passe
    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )
    
    # Créer le token d'accès
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "name": f"{db_user.first_name} {db_user.last_name}",
            "role": db_user.role
        }
    }

# Routes de tracking
@app.get("/api/track/{tracking_number}")
async def track_package(tracking_number: str, db: Session = Depends(get_db)):
    # Rechercher la livraison dans la base de données
    delivery = db.query(DBDelivery).filter(DBDelivery.tracking_number == tracking_number).first()
    
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Numéro de suivi non trouvé"
        )
    
    # Récupérer l'historique de la livraison
    history = db.query(DBTrackingHistory).filter(DBTrackingHistory.delivery_id == delivery.id).all()
    
    # Formater la réponse
    result = {
        "trackingNumber": delivery.tracking_number,
        "status": delivery.status,
        "sender": delivery.sender,
        "recipient": delivery.recipient,
        "currentLocation": delivery.current_location,
        "estimatedDelivery": delivery.estimated_delivery,
        "history": [
            {
                "timestamp": h.timestamp,
                "status": h.status,
                "description": h.description
            } for h in history
        ]
    }
    
    return result

# Routes pour les livreurs
@app.get("/api/driver/assignments")
async def get_driver_assignments(current_user: str = Depends(verify_token), db: Session = Depends(get_db)):
    # Récupérer toutes les livraisons disponibles
    deliveries = db.query(DBDelivery).all()
    
    # Formater la réponse
    result = [
        {
            "id": str(delivery.id),
            "trackingNumber": delivery.tracking_number,
            "recipient": delivery.recipient,
            "destination": delivery.destination,
            "status": delivery.status,
            "weight": delivery.weight,
            "priority": delivery.priority,
            "estimatedDelivery": delivery.estimated_delivery
        } for delivery in deliveries
    ]
    
    return result

@app.put("/api/deliveries/{delivery_id}/status")
async def update_delivery_status(
    delivery_id: str, 
    status_update: DeliveryStatus,
    current_user: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    # Trouver la livraison dans la base de données
    delivery = db.query(DBDelivery).filter(DBDelivery.id == int(delivery_id)).first()
    
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Livraison non trouvée"
        )
    
    # Mettre à jour le statut
    delivery.status = status_update.status
    
    # Ajouter une entrée dans l'historique
    new_history = DBTrackingHistory(
        delivery_id=delivery.id,
        timestamp=datetime.utcnow(),
        status=status_update.status,
        description=f"Statut mis à jour par le livreur"
    )
    
    db.add(new_history)
    db.commit()
    
    return {"message": "Statut mis à jour avec succès"}

# Routes pour les statistiques
@app.get("/api/stats")
async def get_stats(db: Session = Depends(get_db)):
    # Calculer les statistiques réelles à partir de la base de données
    total = db.query(DBDelivery).count()
    pending = db.query(DBDelivery).filter(DBDelivery.status == "pending").count()
    in_transit = db.query(DBDelivery).filter(DBDelivery.status == "in_transit").count()
    delivered = db.query(DBDelivery).filter(DBDelivery.status == "delivered").count()
    picked_up = db.query(DBDelivery).filter(DBDelivery.status == "picked_up").count()
    
    return {
        "total": total,
        "pending": pending,
        "inTransit": in_transit,
        "delivered": delivered,
        "pickedUp": picked_up
    }

@app.get("/api/deliveries")
async def get_all_deliveries(db: Session = Depends(get_db)):
    # Récupérer toutes les livraisons depuis la base de données
    deliveries = db.query(DBDelivery).all()
    
    # Formater la réponse
    result = [
        {
            "id": str(delivery.id),
            "trackingNumber": delivery.tracking_number,
            "recipient": delivery.recipient,
            "destination": delivery.destination,
            "status": delivery.status,
            "createdAt": delivery.created_at.strftime("%Y-%m-%d") if delivery.created_at else None,
            "weight": delivery.weight
        } for delivery in deliveries
    ]
    
    return result

@app.get("/")
async def root():
    return {"message": "DeliveryTracker Pro API", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
