from database import SessionLocal, User
import bcrypt

def create_test_user():
    db = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == "test@test.com").first()
        if existing_user:
            print("✅ Test user already exists")
            return

        # Hash the password
        hashed_password = bcrypt.hashpw("123456".encode('utf-8'), bcrypt.gensalt())
        
        # Create test user
        test_user = User(
            email="test@test.com",
            password=hashed_password.decode('utf-8'),
            first_name="Test",
            last_name="User",
            phone="1234567890",
            role="driver"
        )
        
        db.add(test_user)
        db.commit()
        print("✅ Test user created successfully!")
        print("Email: test@test.com")
        print("Password: 123456")
        
    except Exception as e:
        print(f"❌ Error creating test user: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
