from database import SessionLocal, Delivery

def check_deliveries_detailed():
    db = SessionLocal()
    try:
        deliveries = db.query(Delivery).all()
        print("ID | Tracking | Driver ID | Recipient | Status | Current Location | Estimated Delivery")
        print("--------------------------------------------------------------------------------")
        for delivery in deliveries:
            current_loc = delivery.current_location or "NULL"
            estimated = delivery.estimated_delivery or "NULL"
            print(f"{delivery.id} | {delivery.tracking_number} | {delivery.driver_id} | {delivery.recipient} | {delivery.status} | {current_loc} | {estimated}")
    finally:
        db.close()

if __name__ == "__main__":
    check_deliveries_detailed() 