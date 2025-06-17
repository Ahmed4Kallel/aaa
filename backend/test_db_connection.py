import mysql.connector
from mysql.connector import Error

try:
    connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='tracker_delivery'
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
        
        cursor.close()
        
except Error as e:
    print(f"❌ Erreur de connexion à la base de données: {e}")
    
finally:
    if 'connection' in locals() and connection.is_connected():
        connection.close()
        print("\nConnexion à la base de données fermée")
