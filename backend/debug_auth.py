import requests
import json

def test_auth_debug():
    url = "http://127.0.0.1:8000/api/auth/login"
    headers = {"Content-Type": "application/json"}
    
    # Test avec des identifiants valides
    data = {
        "email": "test@test.com",
        "password": "123456"
    }
    
    try:
        print("Test d'authentification...")
        response = requests.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Login réussi!")
            result = response.json()
            print(f"Token: {result.get('access_token', 'Non trouvé')}")
            print(f"User: {result.get('user', 'Non trouvé')}")
        else:
            print(f"❌ Login échoué: {response.status_code}")
            try:
                error_detail = response.json()
                print(f"Erreur détail: {error_detail}")
            except:
                print(f"Réponse brute: {response.text}")
                
    except Exception as e:
        print(f"❌ Erreur de connexion: {str(e)}")

if __name__ == "__main__":
    test_auth_debug() 