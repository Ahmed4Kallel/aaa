import bcrypt
from database import SessionLocal, User

def fix_test_user():
    db = SessionLocal()
    try:
        # Supprimer l'utilisateur existant s'il existe
        existing_user = db.query(User).filter(User.email == "test@test.com").first()
        if existing_user:
            print("Suppression de l'utilisateur existant...")
            db.delete(existing_user)
            db.commit()
        
        # Créer un nouvel utilisateur avec le bon format de mot de passe
        print("Création d'un nouvel utilisateur de test...")
        hashed_password = bcrypt.hashpw("123456".encode('utf-8'), bcrypt.gensalt())
        
        new_user = User(
            email="test@test.com",
            password=hashed_password,
            first_name="Test",
            last_name="User",
            phone="0123456789",
            role="driver",
            email_verified=True
        )
        
        db.add(new_user)
        db.commit()
        print("✅ Utilisateur de test créé avec succès!")
        
        # Vérifier que l'utilisateur peut être trouvé
        user = db.query(User).filter(User.email == "test@test.com").first()
        if user:
            print(f"✅ Utilisateur trouvé: {user.email}")
            print(f"Mot de passe hashé: {user.password[:20]}...")
        else:
            print("❌ Utilisateur non trouvé après création")
            
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_test_user() 