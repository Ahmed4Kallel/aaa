import mysql.connector
from mysql.connector import Error

def test_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',  # Pas de mot de passe par défaut avec WAMP
            database='tracker_delivery'  # Vérifiez que cette base existe
        )
        
        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"✅ Connecté au serveur MySQL version {db_info}")
            
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE();")
            record = cursor.fetchone()
            print(f"✅ Connecté à la base de données: {record[0]}")
            
            # Vérification des tables
            cursor.execute("SHOW TABLES;")
            tables = cursor.fetchall()
            print("\nTables disponibles:")
            for table in tables:
                print(f"- {table[0]}")
            
    except Error as e:
        print(f"❌ Erreur de connexion à la base de données: {e}")
        print("\nVérifiez que:")
        print("1. WAMP est démarré (icône verte dans la barre des tâches)")
        print("2. Le service MySQL est en cours d'exécution")
        print("3. La base de données 'tracker_delivery' existe")
        print("4. L'utilisateur 'root' n'a pas de mot de passe")
        
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
            print("\nConnexion à la base de données fermée")

if __name__ == "__main__":
    test_connection()
