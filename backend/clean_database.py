#!/usr/bin/env python3
"""
Script pour nettoyer complètement la base de données et la redémarrer proprement
"""

import sys
import os

# Ajouter le répertoire courant au path pour importer les modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, User, Delivery, TrackingHistory, Base

def clean_database():
    """Nettoie complètement la base de données"""
    
    db = SessionLocal()
    
    try:
        print("🧹 Nettoyage de la base de données...")
        
        # Supprimer toutes les données
        db.query(TrackingHistory).delete()
        db.query(Delivery).delete()
        db.query(User).delete()
        
        # Commit les changements
        db.commit()
        
        print("✅ Base de données nettoyée avec succès !")
        print("📋 Toutes les tables ont été vidées")
        
    except Exception as e:
        print(f"❌ Erreur lors du nettoyage : {str(e)}")
        db.rollback()
    finally:
        db.close()

def recreate_tables():
    """Recrée les tables avec la structure correcte"""
    
    try:
        print("🔨 Recréation des tables...")
        
        # Supprimer toutes les tables existantes
        Base.metadata.drop_all(bind=engine)
        
        # Recréer toutes les tables
        Base.metadata.create_all(bind=engine)
        
        print("✅ Tables recréées avec succès !")
        
    except Exception as e:
        print(f"❌ Erreur lors de la recréation des tables : {str(e)}")

if __name__ == "__main__":
    print("🚀 Nettoyage complet de la base de données")
    print("=" * 50)
    
    recreate_tables()
    clean_database()
    
    print("\n🎉 Base de données prête pour une utilisation propre !")
    print("\n📝 Prochaines étapes :")
    print("   1. Créer de nouveaux utilisateurs via l'interface")
    print("   2. Ajouter des livraisons via l'API")
    print("   3. Tester l'authentification avec de vrais comptes") 