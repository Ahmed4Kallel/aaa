from database import get_db, DBDelivery

def main():
    db = next(get_db())
    deliveries = db.query(DBDelivery).all()
    print("ID | Tracking | Driver ID | Recipient | Status")
    print("-" * 50)
    for d in deliveries:
        print(f"{d.id} | {d.tracking_number} | {d.driver_id} | {d.recipient} | {d.status}")

if __name__ == "__main__":
    main() 