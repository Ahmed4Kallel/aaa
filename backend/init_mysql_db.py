#!/usr/bin/env python3
"""
Script pour initialiser la base de données MySQL avec WampServer
"""

import pymysql
from database import create_tables, engine, Base
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_database_if_not_exists():
    """Créer la base de données si elle n'existe pas"""
    try:
        # Connexion à MySQL sans spécifier de base de données
        connection = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        # Créer la base de données si elle n'existe pas
        cursor.execute("CREATE DATABASE IF NOT EXISTS tracker_delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        logger.info("Base de données 'tracker_delivery' créée ou déjà existante")
        
        cursor.close()
        connection.close()
        
    except Exception as e:
        logger.error(f"Erreur lors de la création de la base de données: {e}")
        raise

def create_admin_user():
    """Créer un utilisateur admin par défaut"""
    try:
        from database import SessionLocal, DBUser
        import bcrypt
        
        db = SessionLocal()
        
        # Vérifier si l'admin existe déjà
        admin = db.query(DBUser).filter(DBUser.email == "admin@tracker.com").first()
        if admin:
            logger.info("Utilisateur admin existe déjà")
            return
        
        # Créer l'utilisateur admin
        hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt())
        admin_user = DBUser(
            email="admin@tracker.com",
            password=hashed_password,
            first_name="Admin",
            last_name="System",
            role="admin",
            email_verified=True
        )
        
        db.add(admin_user)
        db.commit()
        logger.info("Utilisateur admin créé avec succès")
        
    except Exception as e:
        logger.error(f"Erreur lors de la création de l'utilisateur admin: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Fonction principale"""
    try:
        logger.info("Début de l'initialisation de la base de données MySQL...")
        
        # 1. Créer la base de données
        create_database_if_not_exists()
        
        # 2. Créer les tables
        create_tables()
        logger.info("Tables créées avec succès")
        
        # 3. Créer l'utilisateur admin
        create_admin_user()
        
        logger.info("Initialisation de la base de données terminée avec succès!")
        
    except Exception as e:
        logger.error(f"Erreur lors de l'initialisation: {e}")
        raise

if __name__ == "__main__":
    main() 