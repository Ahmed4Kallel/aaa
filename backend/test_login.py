import requests
import json

def test_login():
    url = "http://127.0.0.1:8000/api/auth/login"
    headers = {"Content-Type": "application/json"}
    
    # Test with correct credentials
    print("Testing login with correct credentials...")
    data = {
        "email": "test@test.com",
        "password": "123456"
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            print("Access Token:", response.json().get("access_token"))
        else:
            print("❌ Login failed:", response.json())
            
    except Exception as e:
        print(f"❌ Error during login test: {str(e)}")
        
    # Test with incorrect credentials
    print("\nTesting login with incorrect credentials...")
    data = {
        "email": "test@test.com",
        "password": "wrongpassword"
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("❌ Login should have failed but didn't!")
        else:
            print("✅ Login correctly rejected with wrong password")
            
    except Exception as e:
        print(f"❌ Error during failed login test: {str(e)}")

if __name__ == "__main__":
    test_login()
