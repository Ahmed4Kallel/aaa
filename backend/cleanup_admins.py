#!/usr/bin/env python3
"""
Script pour nettoyer tous les admins existants et ne garder que le nouvel admin
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, DBUser

def cleanup_admins():
    """Supprime tous les admins sauf kallelahmed63@gmail.com"""
    db = SessionLocal()
    
    try:
        # Récupérer tous les admins
        admins = db.query(DBUser).filter(DBUser.role == "admin").all()
        
        print("=" * 50)
        print("NETTOYAGE DES ADMINS")
        print("=" * 50)
        
        for admin in admins:
            if admin.email != "kallelahmed63@gmail.com":
                print(f"Suppression de l'admin: {admin.email} (ID: {admin.id})")
                db.delete(admin)
            else:
                print(f"Conservation de l'admin: {admin.email} (ID: {admin.id})")
        
        db.commit()
        
        # Vérifier le résultat
        remaining_admins = db.query(DBUser).filter(DBUser.role == "admin").all()
        
        print("=" * 50)
        print("RÉSULTAT DU NETTOYAGE")
        print("=" * 50)
        
        if len(remaining_admins) == 1 and remaining_admins[0].email == "kallelahmed63@gmail.com":
            print("✅ Nettoyage réussi!")
            print(f"Admin restant: {remaining_admins[0].email}")
        else:
            print("❌ Erreur: Plus d'un admin ou mauvais admin restant")
            for admin in remaining_admins:
                print(f"   - {admin.email}")
        
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ Erreur lors du nettoyage: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    cleanup_admins() 