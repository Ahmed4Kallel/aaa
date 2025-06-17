#!/usr/bin/env python3
"""
Script pour lister tous les utilisateurs dans la base de données
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, DBUser

def list_users():
    """Liste tous les utilisateurs dans la base de données"""
    db = SessionLocal()
    
    try:
        users = db.query(DBUser).all()
        
        print("=" * 80)
        print("LISTE DE TOUS LES UTILISATEURS")
        print("=" * 80)
        
        if not users:
            print("Aucun utilisateur trouvé dans la base de données.")
            return
        
        for user in users:
            print(f"ID: {user.id}")
            print(f"Email: {user.email}")
            print(f"Rôle: {user.role}")
            print(f"Nom: {user.first_name} {user.last_name}")
            print(f"Téléphone: {user.phone}")
            print(f"Email vérifié: {user.email_verified}")
            print(f"Date de création: {user.created_at}")
            print("-" * 40)
        
        # Statistiques
        admin_count = len([u for u in users if u.role == "admin"])
        driver_count = len([u for u in users if u.role == "driver"])
        customer_count = len([u for u in users if u.role == "customer"])
        
        print("=" * 80)
        print("STATISTIQUES")
        print("=" * 80)
        print(f"Total d'utilisateurs: {len(users)}")
        print(f"Admins: {admin_count}")
        print(f"Drivers: {driver_count}")
        print(f"Customers: {customer_count}")
        print("=" * 80)
        
    except Exception as e:
        print(f"❌ Erreur lors de la récupération des utilisateurs: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_users() 