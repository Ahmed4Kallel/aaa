import requests
import json

def test_endpoint(url, method="GET", json_data=None, headers=None):
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=json_data, headers=headers)
        else:
            return False, f"Méthode non supportée: {method}"
        
        return True, f"Code: {response.status_code} - Réponse: {response.text[:200]}"
    except Exception as e:
        return False, f"Erreur: {str(e)}"

def main():
    base_url = "http://127.0.0.1:8000"
    
    print("Test de l'API - Delivery Tracker\n" + "="*50)
    
    # 1. Test de la racine
    print("\n1. Test de la racine de l'API:")
    success, message = test_endpoint(f"{base_url}/")
    print(f"   - {message}")
    
    # 2. Test de login avec des identifiants invalides
    print("\n2. Test de login avec identifiants invalides:")
    success, message = test_endpoint(
        f"{base_url}/api/auth/login",
        method="POST",
        json_data={"email": "fake@test.com", "password": "wrongpass"}
    )
    print(f"   - {message}")
    
    # 3. Test de login avec des identifiants valides (si disponible)
    print("\n3. Test de login avec identifiants valides:")
    success, message = test_endpoint(
        f"{base_url}/api/auth/login",
        method="POST",
        json_data={"email": "test@test.com", "password": "123456"}
    )
    print(f"   - {message}")
    
    # Essayer d'extraire le token si le login réussit
    token = None
    if success and "access_token" in message:
        try:
            token = json.loads(message.split("RÉPONSE: ")[1])["access_token"]
            print("   - Token JWT extrait avec succès")
        except:
            print("   - Impossible d'extraire le token JWT")
    
    # 4. Test d'une route protégée si on a un token
    if token:
        print("\n4. Test d'accès à une route protégée:")
        headers = {"Authorization": f"Bearer {token}"}
        success, message = test_endpoint(
            f"{base_url}/api/driver/assignments",
            headers=headers
        )
        print(f"   - {message}")
    
    print("\n" + "="*50)
    print("Tests terminés")

if __name__ == "__main__":
    main()
