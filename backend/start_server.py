import os
import sys
import subprocess
import time

def check_dependencies():
    """Vérifie que toutes les dépendances sont installées."""
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        import pymysql
        import bcrypt
        import jwt
        import pydantic
        print("✅ Toutes les dépendances sont installées")
        return True
    except ImportError as e:
        print(f"❌ Dépendance manquante: {e.name}")
        print("Installation des dépendances requises...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
            print("✅ Dépendances installées avec succès")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Erreur lors de l'installation des dépendances: {e}")
            return False

def check_database():
    """Vérifie la connexion à la base de données."""
    try:
        from database import engine
        with engine.connect() as conn:
            print("✅ Connexion à la base de données établie")
            return True
    except Exception as e:
        print(f"❌ Erreur de connexion à la base de données: {e}")
        print("Vérifiez que :")
        print("1. WAMP Server est démarré (icône verte dans la barre des tâches)")
        print("2. La base de données 'tracker_delivery' existe")
        print("3. Les identifiants dans database.py sont corrects")
        return False

def init_database():
    """Initialise la base de données si nécessaire."""
    try:
        from database import Base, engine
        print("Création des tables de la base de données...")
        Base.metadata.create_all(bind=engine)
        print("✅ Base de données initialisée avec succès")
        return True
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation de la base de données: {e}")
        return False

def start_server():
    """Démarre le serveur FastAPI."""
    print("\nDémarrage du serveur FastAPI...")
    print("URL de l'API: http://127.0.0.1:8080")
    print("Documentation Swagger: http://127.0.0.1:8080/docs")
    print("Appuyez sur Ctrl+C pour arrêter le serveur\n")
    
    try:
        import uvicorn
        uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
    except KeyboardInterrupt:
        print("\nArrêt du serveur...")
    except Exception as e:
        print(f"❌ Erreur lors du démarrage du serveur: {e}")

def main():
    print("="*50)
    print("VÉRIFICATION DU SYSTÈME - DELIVERY TRACKER")
    print("="*50)
    
    # Vérification des dépendances
    if not check_dependencies():
        return
    
    # Vérification de la base de données
    if not check_database():
        return
    
    # Initialisation de la base de données
    if not init_database():
        print("⚠️  Poursuite malgré les erreurs d'initialisation")
    
    # Démarrage du serveur
    start_server()

if __name__ == "__main__":
    main()
