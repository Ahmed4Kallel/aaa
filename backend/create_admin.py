import sys
import os
import bcrypt
from sqlalchemy.orm import Session
from database import SessionLocal, User

def create_admin_user():
    """Create an admin user in the database"""
    db = SessionLocal()
    try:
        email = "kallelahmed63@gmail.com"
        password = "changeme007*"
        phone = "+216 44 128 307"
        
        # Check if admin user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"Admin user with email {email} already exists!")
            return
        
        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create new admin user
        new_user = User(
            email=email,
            password=hashed_password,
            first_name="Admin",
            last_name="User",
            phone=phone,
            role="admin",
            email_verified=True
        )
        
        # Add to database
        db.add(new_user)
        db.commit()
        print(f"Admin user {email} created successfully!")
        
    except Exception as e:
        print(f"Error creating admin user: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
