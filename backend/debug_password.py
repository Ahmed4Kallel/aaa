import bcrypt
from database import SessionLocal, User

def debug_password():
    db = SessionLocal()
    try:
        # Récupérer l'utilisateur de test
        user = db.query(User).filter(User.email == "test@test.com").first()
        if not user:
            print("❌ Utilisateur test@test.com non trouvé")
            return
        
        print(f"✅ Utilisateur trouvé: {user.email}")
        print(f"Type du mot de passe stocké: {type(user.password)}")
        print(f"Mot de passe hashé (premiers 50 chars): {user.password[:50]}")
        
        # Tester la conversion
        try:
            password_bytes = user.password.encode('utf-8')
            print(f"Type après encode: {type(password_bytes)}")
            print(f"Longueur: {len(password_bytes)}")
            
            # Tester bcrypt.checkpw
            test_password = "123456".encode('utf-8')
            result = bcrypt.checkpw(test_password, password_bytes)
            print(f"✅ Test bcrypt.checkpw réussi: {result}")
            
        except Exception as e:
            print(f"❌ Erreur lors du test: {str(e)}")
            print(f"Type d'erreur: {type(e).__name__}")
            
    except Exception as e:
        print(f"❌ Erreur générale: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    debug_password() 