from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Annotated
from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import PyJWTError, InvalidTokenError
import bcrypt
import uvicorn
import traceback
import logging
from typing_extensions import TypedDict
from sqlalchemy.orm import Session
from sqlalchemy import or_

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import des modèles de base de données
from database import get_db, DBUser, DBDelivery, DBDeliveryHistory

app = FastAPI(title="DeliveryTracker Pro API", version="1.0.0")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", 
        "http://localhost:3003", "http://localhost:3004", "http://localhost:3005",
        "http://localhost:3006", "http://localhost:3007", "http://localhost:3008",
        "http://localhost:3009", "http://localhost:3010",
        "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002",
        "http://127.0.0.1:3003", "http://127.0.0.1:3004", "http://127.0.0.1:3005",
        "http://127.0.0.1:3006", "http://127.0.0.1:3007", "http://127.0.0.1:3008",
        "http://127.0.0.1:3009", "http://127.0.0.1:3010"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration JWT
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600

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
    id: str
    trackingNumber: str
    status: str
    sender: str
    recipient: str
    currentLocation: str
    estimatedDelivery: str
    history: List[TrackingHistory]

class DeliveryCreate(BaseModel):
    tracking_number: str = Field(..., max_length=50)
    sender: str = Field(..., max_length=100)
    recipient: str = Field(..., max_length=100)
    destination: str = Field(..., max_length=255)
    weight: float
    status: str = Field("pending", max_length=50)
    driver_id: Optional[int] = None
    current_location: Optional[str] = None
    estimated_delivery: Optional[str] = None

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class DriverResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr

# Les données sont maintenant stockées dans la base de données MySQL
# Les fonctions ci-dessous remplacent les accès aux structures de données en mémoire

# Fonctions utilitaires
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            logger.error("Token invalide: pas d'email dans le payload")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide",
                headers={"WWW-Authenticate": "Bearer"},
            )
        logger.info(f"Token vérifié avec succès pour l'email: {email}")
        return email
    except PyJWTError as e:
        logger.error(f"Erreur JWT lors de la vérification du token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_user_by_email(email: str, db: Session):
    return db.query(DBUser).filter(DBUser.email == email).first()

# Dépendance pour récupérer l'utilisateur courant de la base de données
async def get_current_user(email: str = Depends(verify_token), db: Session = Depends(get_db)):
    logger.info(f"Tentative de récupération de l'utilisateur pour l'email: {email}")
    user = db.query(DBUser).filter(DBUser.email == email).first()
    if user is None:
        logger.error(f"Utilisateur non trouvé pour l'email: {email}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")
    logger.info(f"Utilisateur trouvé: {user.email}, ID: {user.id}, Rôle: {user.role}")
    return user

# Nouvelle dépendance pour vérifier le rôle d'administrateur
async def verify_admin_role(current_user: DBUser = Depends(get_current_user)):
    logger.info(f"Vérification du rôle admin pour l'utilisateur: {current_user.email}, Rôle: {current_user.role}")
    if current_user.role != "admin":
        logger.warning(f"Accès refusé pour l'utilisateur {current_user.email} avec le rôle {current_user.role}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé. Seuls les administrateurs peuvent effectuer cette action.",
        )
    return current_user

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
    # Debug: logger les types des données reçues
    logger.info(f"Type de user.password: {type(user.password)}")
    logger.info(f"Valeur de user.password: {user.password}")
    
    # Trouver l'utilisateur
    db_user = get_user_by_email(user.email, db)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )
    
    # Debug: logger les types des données de la base
    logger.info(f"Type de db_user.password: {type(db_user.password)}")
    logger.info(f"Valeur de db_user.password (premiers 20 chars): {db_user.password[:20] if db_user.password else 'None'}")
    
    # Vérifier le mot de passe
    try:
        user_password_bytes = user.password.encode('utf-8')
        
        # Vérifier si le hash est au bon format
        if not db_user.password or not db_user.password.startswith('$2b$'):
            logger.error(f"Hash de mot de passe invalide pour l'utilisateur {db_user.email}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Format de mot de passe invalide dans la base de données"
            )
        
        db_password_bytes = db_user.password.encode('utf-8')
        logger.info(f"Type de user_password_bytes: {type(user_password_bytes)}")
        logger.info(f"Type de db_password_bytes: {type(db_password_bytes)}")
        
        if not bcrypt.checkpw(user_password_bytes, db_password_bytes):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou mot de passe incorrect"
            )
    except HTTPException:
        # Re-raise les HTTPException
        raise
    except Exception as e:
        logger.error(f"Erreur lors de la vérification du mot de passe: {str(e)}")
        logger.error(f"Type d'erreur: {type(e).__name__}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la vérification du mot de passe: {str(e)}"
        )
    
    # Créer le token d'accès
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )

    logger.info(f"Utilisateur connecté: {db_user.email}, ID: {db_user.id}, Rôle: {db_user.role}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "first_name": db_user.first_name,
            "last_name": db_user.last_name,
            "phone": db_user.phone,
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
    history = db.query(DBDeliveryHistory).filter(DBDeliveryHistory.delivery_id == delivery.id).all()
    
    # Formater la réponse
    result = {
        "trackingNumber": delivery.tracking_number,
        "status": delivery.status,
        "sender": delivery.sender,
        "recipient": delivery.recipient,
        "currentLocation": delivery.current_location,
        "estimatedDelivery": delivery.estimated_delivery.isoformat() if isinstance(delivery.estimated_delivery, datetime) else (delivery.estimated_delivery or ""),
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
async def get_driver_assignments(current_user: DBUser = Depends(get_current_user), db: Session = Depends(get_db)):
    # Debug: logger les informations de l'utilisateur
    logger.info(f"Token vérifié avec succès pour l'email: {current_user.email}")
    logger.info(f"Tentative de récupération de l'utilisateur pour l'email: {current_user.email}")
    logger.info(f"Utilisateur trouvé: {current_user.email}, ID: {current_user.id}, Rôle: {current_user.role}")
    logger.info(f"Utilisateur connecté: {current_user.email}, ID: {current_user.id}, Rôle: {current_user.role}")
    
    if current_user.role != "driver":
        logger.warning(f"Accès refusé pour l'utilisateur {current_user.email} avec le rôle {current_user.role}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé. Seuls les livreurs peuvent voir leurs assignations.",
        )

    # Récupérer les livraisons assignées au livreur courant
    deliveries = db.query(DBDelivery).filter(DBDelivery.driver_id == current_user.id).all()
    logger.info(f"Nombre de livraisons trouvées pour le livreur {current_user.id}: {len(deliveries)}")
    
    # Mapper les objets SQLAlchemy aux Pydantic models pour la réponse
    response_deliveries = []
    for delivery in deliveries:
        history_data = []
        for history_item in delivery.history:
            history_data.append(TrackingHistory(
                timestamp=history_item.timestamp.isoformat(),
                status=history_item.status,
                description=history_item.description
            ))
        response_deliveries.append(Delivery(
            id=str(delivery.id),
            trackingNumber=delivery.tracking_number,
            status=delivery.status,
            sender=delivery.sender,
            recipient=delivery.recipient,
            currentLocation=delivery.current_location or "", # Utiliser la valeur de la base de données
            estimatedDelivery=delivery.estimated_delivery.isoformat() if isinstance(delivery.estimated_delivery, datetime) else (delivery.estimated_delivery or ""),
            history=history_data
        ))
    return response_deliveries

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
    new_history = DBDeliveryHistory(
        delivery_id=delivery.id,
        timestamp=datetime.now(timezone.utc),
        status=status_update.status
    )
    
    db.add(new_history)
    db.commit()
    
    return {"message": "Statut mis à jour avec succès"}

# Routes pour les statistiques (maintenant protégées pour les admins)
@app.get("/api/stats")
async def get_stats(current_user: DBUser = Depends(verify_admin_role), db: Session = Depends(get_db)):
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
async def get_all_deliveries(current_user: DBUser = Depends(verify_admin_role), db: Session = Depends(get_db)):
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

@app.get("/api/drivers", response_model=List[DriverResponse])
async def get_drivers(current_user: DBUser = Depends(verify_admin_role), db: Session = Depends(get_db)):
    try:
        drivers = db.query(DBUser).filter(DBUser.role == "driver").all()
        return drivers
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des livreurs: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur lors de la récupération des livreurs")

@app.post("/api/deliveries", status_code=status.HTTP_201_CREATED)
async def create_delivery(delivery: DeliveryCreate, current_user: DBUser = Depends(verify_admin_role), db: Session = Depends(get_db)):
    try:
        # Vérifier si un livreur avec cet ID existe et a le rôle 'driver'
        if delivery.driver_id:
            driver = db.query(DBUser).filter(DBUser.id == delivery.driver_id, DBUser.role == "driver").first()
            if not driver:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="L'ID du livreur fourni n'existe pas ou n'est pas un livreur valide."
                )

        # Vérifier si le numéro de suivi existe déjà
        existing_delivery = db.query(DBDelivery).filter(DBDelivery.tracking_number == delivery.tracking_number).first()
        if existing_delivery:
            logger.warning(f"Numéro de suivi {delivery.tracking_number} existe déjà.")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce numéro de suivi existe déjà."
            )

        # Créer une nouvelle livraison
        new_delivery = DBDelivery(
            tracking_number=delivery.tracking_number,
            sender=delivery.sender,
            recipient=delivery.recipient,
            destination=delivery.destination,
            weight=delivery.weight,
            status=delivery.status,
            created_at=datetime.now(timezone.utc),
            driver_id=delivery.driver_id,
            current_location=delivery.current_location,
            estimated_delivery=delivery.estimated_delivery
        )

        db.add(new_delivery)
        db.commit()
        db.refresh(new_delivery)

        # Ajouter l'historique de suivi initial
        initial_history = DBDeliveryHistory(
            delivery_id=new_delivery.id,
            timestamp=datetime.now(timezone.utc),
            status=delivery.status,
            description=f"Création de la livraison avec le statut initial: {delivery.status}"
        )
        db.add(initial_history)
        db.commit()
        db.refresh(initial_history)

        return {"message": "Livraison créée avec succès", "delivery_id": new_delivery.id}

    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        logger.error(f"Erreur lors de la création de la livraison: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la création de la livraison: {str(e)}"
        )

@app.put("/api/driver/profile/{user_id}")
async def update_user_profile(
    user_id: int,
    profile_update: UserProfileUpdate,
    current_user_email: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    try:
        # Vérifier si l'utilisateur existe
        user_to_update = db.query(DBUser).filter(DBUser.id == user_id).first()
        if not user_to_update:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

        # Vérifier si l'utilisateur actuel a le droit de modifier ce profil (soit le même utilisateur, soit un admin)
        current_user = get_user_by_email(current_user_email, db)
        if not current_user or (current_user.id != user_id and current_user.role != "admin"):
            raise HTTPException(status_code=403, detail="Non autorisé à modifier ce profil")

        # Mettre à jour les champs si fournis
        if profile_update.first_name is not None:
            user_to_update.first_name = profile_update.first_name
        if profile_update.last_name is not None:
            user_to_update.last_name = profile_update.last_name
        if profile_update.email is not None and profile_update.email != user_to_update.email:
            # Vérifier si le nouvel email est déjà pris
            if get_user_by_email(profile_update.email, db):
                raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
            user_to_update.email = profile_update.email
        if profile_update.phone is not None:
            user_to_update.phone = profile_update.phone
        if profile_update.address is not None:
            user_to_update.address = profile_update.address

        db.commit()
        db.refresh(user_to_update)

        return {
            "message": "Profil mis à jour avec succès",
            "id": user_to_update.id,
            "first_name": user_to_update.first_name,
            "last_name": user_to_update.last_name,
            "email": user_to_update.email,
            "phone": user_to_update.phone,
            "address": user_to_update.address,
            "role": user_to_update.role
        }
    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        logger.error(f"Erreur inattendue lors de la mise à jour du profil: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Erreur interne du serveur lors de la mise à jour du profil")

@app.get("/")
async def root():
    return {"message": "DeliveryTracker Pro API", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
