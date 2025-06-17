import mysql.connector
from sqlalchemy import create_engine, inspect

def test_mysql_connection():
    try:
        # Test direct MySQL connection
        print("Testing direct MySQL connection...")
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='tracker_delivery'
        )
        print("✓ Direct MySQL connection successful!")
        conn.close()
        return True
    except Exception as e:
        print(f"✗ Direct MySQL connection failed: {e}")
        return False

def test_sqlalchemy_connection():
    try:
        # Test SQLAlchemy connection
        print("\nTesting SQLAlchemy connection...")
        engine = create_engine('mysql://root:@localhost/tracker_delivery')
        with engine.connect() as conn:
            print("✓ SQLAlchemy connection successful!")
            
            # Check if tables exist
            print("\nChecking tables in database:")
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            if tables:
                print("✓ Found tables:")
                for table in tables:
                    print(f"  - {table}")
            else:
                print("✗ No tables found in the database.")
        return True
    except Exception as e:
        print(f"✗ SQLAlchemy connection failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing database connections...\n")
    mysql_ok = test_mysql_connection()
    sqlalchemy_ok = test_sqlalchemy_connection()
    
    print("\nTest Summary:")
    print(f"- MySQL Connection: {'✓' if mysql_ok else '✗'}")
    print(f"- SQLAlchemy Connection: {'✓' if sqlalchemy_ok else '✗'}")
