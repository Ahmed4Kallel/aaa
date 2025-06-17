import subprocess
import os

def check_mysql_service():
    """Vérifie si le service MySQL est en cours d'exécution."""
    try:
        # Pour Windows
        if os.name == 'nt':
            result = subprocess.run(
                ['sc', 'query', 'wampmysqld64'],
                capture_output=True,
                text=True
            )
            if "RUNNING" in result.stdout:
                print("✅ Service MySQL (WAMP) est en cours d'exécution")
                return True
            else:
                print("❌ Service MySQL (WAMP) n'est pas en cours d'exécution")
                return False
    except Exception as e:
        print(f"❌ Erreur lors de la vérification du service MySQL: {e}")
        return False

def check_mysql_command():
    """Vérifie si la commande MySQL est accessible."""
    try:
        # Chez WAMP, le client MySQL est généralement ici
        mysql_path = r"C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe"
        if os.path.exists(mysql_path):
            print(f"✅ Client MySQL trouvé: {mysql_path}")
            return True
        else:
            print("❌ Client MySQL introuvable. Vérifiez l'installation de WAMP.")
            return False
    except Exception as e:
        print(f"❌ Erreur lors de la vérification du client MySQL: {e}")
        return False

def check_mysql_connection():
    """Tente de se connecter à MySQL."""
    try:
        import mysql.connector
        connection = mysql.connector.connect(
            host='127.0.0.1',
            user='root',
            password='',
            port=3306
        )
        if connection.is_connected():
            print("✅ Connexion à MySQL réussie")
            cursor = connection.cursor()
            cursor.execute("SHOW DATABASES;")
            databases = [db[0] for db in cursor.fetchall()]
            print("Bases de données disponibles:", ", ".join(databases))
            cursor.close()
            connection.close()
            return True
    except Exception as e:
        print(f"❌ Impossible de se connecter à MySQL: {e}")
        return False
    return False

if __name__ == "__main__":
    print("="*50)
    print("VÉRIFICATION DE MYSQL - WAMP SERVER")
    print("="*50)
    
    print("\n1. Vérification du service MySQL...")
    service_ok = check_mysql_service()
    
    print("\n2. Vérification du client MySQL...")
    client_ok = check_mysql_command()
    
    print("\n3. Test de connexion à MySQL...")
    connection_ok = check_mysql_connection()
    
    print("\n" + "="*50)
    print("RÉSUMÉ:")
    print(f"- Service MySQL: {'✅' if service_ok else '❌'}")
    print(f"- Client MySQL: {'✅' if client_ok else '❌'}")
    print(f"- Connexion MySQL: {'✅' if connection_ok else '❌'}")
    
    if not all([service_ok, client_ok, connection_ok]):
        print("\n⚠️  Problèmes détectés. Vérifiez que:")
        print("1. WAMP est démarré (icône verte dans la barre des tâches)")
        print("2. Le service MySQL est en cours d'exécution")
        print("3. Aucun autre service n'utilise le port 3306")
    else:
        print("\n✅ MySQL est correctement installé et accessible")
