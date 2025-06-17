#!/usr/bin/env python3
"""
Script pour supprimer l'admin existant et créer un nouvel admin
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, DBUser
from passlib.context import CryptContext
import datetime

# Configuration du hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hache un mot de passe"""
    return pwd_context.hash(password)

def create_new_admin():
    """Supprime l'admin existant et crée un nouvel admin"""
    db = SessionLocal()
    
    try:
        # 1. Supprimer l'admin existant (kallelahmed63@gmail.com)
        existing_admin = db.query(DBUser).filter(
            DBUser.email == "kallelahmed63@gmail.com"
        ).first()
        
        if existing_admin:
            print(f"Suppression de l'admin existant: {existing_admin.email}")
            db.delete(existing_admin)
            db.commit()
            print("Admin existant supprimé avec succès!")
        else:
            print("Aucun admin existant trouvé avec cet email.")
        
        # 2. Créer le nouvel admin
        new_admin = DBUser(
            email="kallelahmed63@gmail.com",
            password=hash_password("changeme007*"),
            role="admin",
            first_name="Ahmed",
            last_name="Kallel",
            phone="+216 44 128 307",
            address="",
            email_verified=True,
            created_at=datetime.datetime.now(),
            updated_at=datetime.datetime.now()
        )
        
        # Ajouter à la base de données
        db.add(new_admin)
        db.commit()
        
        print("=" * 50)
        print("NOUVEL ADMIN CRÉÉ AVEC SUCCÈS!")
        print("=" * 50)
        print(f"Email: {new_admin.email}")
        print(f"Mot de passe: changeme007*")
        print(f"Rôle: {new_admin.role}")
        print(f"Téléphone: {new_admin.phone}")
        print(f"ID: {new_admin.id}")
        print("=" * 50)
        
        # Vérifier que l'admin a été créé
        created_admin = db.query(DBUser).filter(
            DBUser.email == "kallelahmed63@gmail.com"
        ).first()
        
        if created_admin:
            print("✅ Vérification: Admin trouvé dans la base de données")
            print(f"   ID: {created_admin.id}")
            print(f"   Email: {created_admin.email}")
            print(f"   Rôle: {created_admin.role}")
        else:
            print("❌ Erreur: Admin non trouvé après création")
            
    except Exception as e:
        print(f"❌ Erreur lors de la création de l'admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Suppression de l'admin existant et création d'un nouvel admin...")
    create_new_admin() 