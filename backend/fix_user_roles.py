#!/usr/bin/env python3
"""
Script pour vérifier et corriger les rôles des utilisateurs dans la base de données
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db, User as DBUser
from sqlalchemy.orm import Session

def check_and_fix_user_roles():
    """Vérifie et corrige les rôles des utilisateurs"""
    db = next(get_db())
    
    try:
        # Récupérer tous les utilisateurs
        users = db.query(DBUser).all()
        
        print(f"Nombre total d'utilisateurs trouvés: {len(users)}")
        print("\nÉtat actuel des utilisateurs:")
        print("-" * 50)
        
        for user in users:
            print(f"ID: {user.id}, Email: {user.email}, Rôle: {user.role}")
            
            # Si l'utilisateur n'a pas de rôle, lui assigner 'driver'
            if not user.role:
                print(f"  -> Correction: Attribution du rôle 'driver' à {user.email}")
                user.role = "driver"
        
        # Commit les changements
        db.commit()
        
        print("\nVérification après correction:")
        print("-" * 50)
        
        users_after = db.query(DBUser).all()
        for user in users_after:
            print(f"ID: {user.id}, Email: {user.email}, Rôle: {user.role}")
            
        print("\nCorrection terminée!")
        
    except Exception as e:
        print(f"Erreur lors de la vérification: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    check_and_fix_user_roles() 