import mysql.connector

def create_database():
    try:
        # Connect to MySQL server (without specifying a database)
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password=''
        )
        
        cursor = conn.cursor()
        
        # Create database if it doesn't exist
        cursor.execute("CREATE DATABASE IF NOT EXISTS tracker_delivery")
        print("✓ Database 'tracker_delivery' created successfully!")
        
        # Close the connection
        cursor.close()
        conn.close()
        
        return True
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return False

if __name__ == "__main__":
    print("Creating database 'tracker_delivery'...")
    if create_database():
        print("\nNow please run 'python init_db.py' to initialize the database tables.")
    else:
        print("\nFailed to create the database. Please check your MySQL server and credentials.")
