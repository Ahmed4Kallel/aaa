import mysql.connector

def check_database():
    try:
        # Connect to MySQL server
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='tracker_delivery'
        )
        
        cursor = conn.cursor()
        
        # Get list of tables
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        print("\nTables in the database:")
        for table in tables:
            print(f"- {table[0]}")
        
        # Close the connection
        cursor.close()
        conn.close()
        
        return True
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return False

if __name__ == "__main__":
    print("Checking database connection and tables...")
    if check_database():
        print("\nDatabase connection successful!")
    else:
        print("\nFailed to connect to the database. Please check your MySQL server and credentials.")
