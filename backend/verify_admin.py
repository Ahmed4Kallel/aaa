#!/usr/bin/env python3
"""
Script pour vérifier que l'admin a été créé correctement
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, DBUser
from passlib.context import CryptContext

# Configuration du hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie un mot de passe"""
    return pwd_context.verify(plain_password, hashed_password)

def verify_admin():
    """Vérifie que l'admin existe et que le mot de passe fonctionne"""
    db = SessionLocal()
    
    try:
        # Rechercher l'admin
        admin = db.query(DBUser).filter(
            DBUser.email == "kallelahmed63@gmail.com"
        ).first()
        
        if not admin:
            print("❌ ERREUR: Admin non trouvé dans la base de données")
            return False
        
        print("=" * 50)
        print("VÉRIFICATION DE L'ADMIN")
        print("=" * 50)
        print(f"ID: {admin.id}")
        print(f"Email: {admin.email}")
        print(f"Rôle: {admin.role}")
        print(f"Prénom: {admin.first_name}")
        print(f"Nom: {admin.last_name}")
        print(f"Téléphone: {admin.phone}")
        print(f"Email vérifié: {admin.email_verified}")
        print(f"Date de création: {admin.created_at}")
        print("=" * 50)
        
        # Tester le mot de passe
        password_test = "changeme007*"
        if verify_password(password_test, admin.password):
            print("✅ Mot de passe vérifié avec succès!")
        else:
            print("❌ ERREUR: Le mot de passe ne correspond pas")
            return False
        
        # Vérifier le rôle
        if admin.role == "admin":
            print("✅ Rôle admin confirmé!")
        else:
            print(f"❌ ERREUR: Rôle incorrect ({admin.role})")
            return False
        
        print("=" * 50)
        print("🎉 TOUTES LES VÉRIFICATIONS SONT PASSÉES!")
        print("L'admin est prêt à être utilisé.")
        print("=" * 50)
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la vérification: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    verify_admin() 