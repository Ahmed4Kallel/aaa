from sqlalchemy import text
from database import engine, SessionLocal

def test_connection():
    try:
        # Test de connexion directe
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Connexion à la base de données réussie!")
            
        # Test de session
        db = SessionLocal()
        try:
            result = db.execute(text("SELECT DATABASE()"))
            db_name = result.scalar()
            print(f"✅ Base de données connectée: {db_name}")
            
            # Vérifier les tables existantes
            result = db.execute(text("SHOW TABLES"))
            tables = [row[0] for row in result]
            print("✅ Tables disponibles:", ", ".join(tables) if tables else "Aucune table trouvée")
            
        finally:
            db.close()
            
    except Exception as e:
        print("❌ Erreur de connexion à la base de données:", str(e))
        print("Vérifiez que:")
        print("1. WAMP est bien démarré (icône verte dans la barre des tâches)")
        print("2. Le service MySQL est en cours d'exécution dans WAMP")
        print("3. La base de données 'tracker_delivery' existe dans phpMyAdmin")
        print("4. L'utilisateur 'root' n'a pas de mot de passe (ou utilisez le bon mot de passe)")

if __name__ == "__main__":
    test_connection()
