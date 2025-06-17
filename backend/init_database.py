import mysql.connector
from mysql.connector import Error

def create_database():
    """Crée la base de données si elle n'existe pas déjà."""
    try:
        # Connexion à MySQL sans spécifier de base de données
        connection = mysql.connector.connect(
            host='127.0.0.1',
            user='root',
            password='',
            port=3306
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Vérifier si la base de données existe déjà
            cursor.execute("SHOW DATABASES LIKE 'tracker_delivery'")
            db_exists = cursor.fetchone()
            
            if not db_exists:
                # Créer la base de données
                print("Création de la base de données 'tracker_delivery'...")
                cursor.execute("CREATE DATABASE tracker_delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
                print("✅ Base de données créée avec succès")
            else:
                print("✅ La base de données 'tracker_delivery' existe déjà")
            
            # Sélectionner la base de données
            cursor.execute("USE tracker_delivery")
            
            # Vérifier si la table users existe
            cursor.execute("SHOW TABLES LIKE 'users'")
            if not cursor.fetchone():
                print("\nLa table 'users' n'existe pas. Exécutez 'python database.py' pour créer les tables.")
            else:
                print("✅ La table 'users' existe déjà")
            
            cursor.close()
            
    except Error as e:
        print(f"❌ Erreur lors de la création de la base de données: {e}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            connection.close()

if __name__ == "__main__":
    print("="*50)
    print("INITIALISATION DE LA BASE DE DONNÉES")
    print("="*50 + "\n")
    
    create_database()
    
    print("\n" + "="*50)
    print("Étapes suivantes :")
    print("1. Exécutez 'python database.py' pour créer les tables")
    print("2. Puis 'python main.py' pour démarrer le serveur API")
    print("="*50)
