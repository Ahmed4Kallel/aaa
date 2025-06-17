import mysql.connector
from database import init_db
import bcrypt

# Configuration de la connexion à MySQL
config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
}

def create_database():
    # Connexion à MySQL
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    
    # Création de la base de données si elle n'existe pas
    cursor.execute("CREATE DATABASE IF NOT EXISTS tracker_delivery")
    
    # Fermeture de la connexion
    cursor.close()
    conn.close()
    
    print("Base de données 'delivery_tracker' créée avec succès.")

def drop_tables():
    from database import Base, engine
    Base.metadata.drop_all(bind=engine)
    print("Toutes les tables ont été supprimées.")

def insert_demo_data():
    from database import SessionLocal, User, Delivery, TrackingHistory
    
    db = SessionLocal()
    
    # Vérifier si des données existent déjà
    if db.query(User).count() > 0:
        print("Des données existent déjà dans la base de données.")
        db.close()
        return
    
    # Créer un utilisateur de démonstration
    demo_user = User(
        email="demo@livreur.com",
        password=bcrypt.hashpw("demo123".encode('utf-8'), bcrypt.gensalt()),
        first_name="Demo",
        last_name="Livreur",
        phone="0612345678",
        role="driver",
        email_verified=True
    )
    db.add(demo_user)
    
    # Créer des livraisons de démonstration
    delivery1 = Delivery(
        tracking_number="TRK123456",
        status="in_transit",
        sender="Amazon France",
        recipient="Jean Dupont",
        current_location="Centre de tri Paris Nord",
        estimated_delivery="2024-01-15",
        weight=2.5,
        destination="123 Rue de la Paix, 75001 Paris",
        priority="normal"
    )
    
    delivery2 = Delivery(
        tracking_number="TRK789012",
        status="delivered",
        sender="Fnac",
        recipient="Marie Martin",
        current_location="Livré",
        estimated_delivery="2024-01-14",
        weight=1.2,
        destination="456 Avenue des Champs, Lyon",
        priority="normal"
    )
    
    db.add(delivery1)
    db.add(delivery2)
    db.flush()  # Pour obtenir les IDs des livraisons
    
    # Ajouter l'historique pour la première livraison
    history1_1 = TrackingHistory(
        delivery_id=delivery1.id,
        timestamp="2024-01-12 09:00",
        status="pending",
        description="Commande créée"
    )
    
    history1_2 = TrackingHistory(
        delivery_id=delivery1.id,
        timestamp="2024-01-12 14:30",
        status="picked_up",
        description="Colis récupéré par le transporteur"
    )
    
    history1_3 = TrackingHistory(
        delivery_id=delivery1.id,
        timestamp="2024-01-13 08:15",
        status="in_transit",
        description="En transit vers le centre de tri Paris Nord"
    )
    
    # Ajouter l'historique pour la deuxième livraison
    history2_1 = TrackingHistory(
        delivery_id=delivery2.id,
        timestamp="2024-01-11 10:00",
        status="pending",
        description="Commande créée"
    )
    
    history2_2 = TrackingHistory(
        delivery_id=delivery2.id,
        timestamp="2024-01-11 16:45",
        status="picked_up",
        description="Colis récupéré par le transporteur"
    )
    
    history2_3 = TrackingHistory(
        delivery_id=delivery2.id,
        timestamp="2024-01-12 09:30",
        status="in_transit",
        description="En transit vers Lyon"
    )
    
    history2_4 = TrackingHistory(
        delivery_id=delivery2.id,
        timestamp="2024-01-14 11:20",
        status="delivered",
        description="Livré au destinataire"
    )
    
    db.add_all([history1_1, history1_2, history1_3, history2_1, history2_2, history2_3, history2_4])
    
    # Créer des assignations supplémentaires
    delivery3 = Delivery(
        tracking_number="TRK345678",
        status="pending",
        sender="Darty",
        recipient="Pierre Durand",
        current_location="Centre de tri Marseille",
        estimated_delivery="2024-01-15",
        weight=3.8,
        destination="789 Boulevard Saint-Michel, 13001 Marseille",
        priority="urgent"
    )
    
    delivery4 = Delivery(
        tracking_number="TRK901234",
        status="picked_up",
        sender="Boulanger",
        recipient="Sophie Leblanc",
        current_location="En route",
        estimated_delivery="2024-01-15",
        weight=0.8,
        destination="321 Rue Victor Hugo, 31000 Toulouse",
        priority="normal"
    )
    
    db.add_all([delivery3, delivery4])
    
    # Valider les changements
    db.commit()
    db.close()
    
    print("Données de démonstration insérées avec succès.")

if __name__ == "__main__":
    # Créer la base de données
    create_database()
    
    # Supprimer les tables existantes (pour recréer avec le nouveau schéma)
    drop_tables()
    
    # Initialiser les tables
    init_db()
    
    # Insérer les données de démonstration
    insert_demo_data()
    
    print("Initialisation de la base de données terminée.")
