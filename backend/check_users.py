from database import SessionLocal, User

def check_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print("ID | Email | First Name | Last Name | Role")
        print("--------------------------------------------")
        for user in users:
            print(f"{user.id} | {user.email} | {user.first_name} | {user.last_name} | {user.role}")
    finally:
        db.close()

if __name__ == "__main__":
    check_users() 