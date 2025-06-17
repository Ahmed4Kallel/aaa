#!/usr/bin/env python3
"""
Test rapide pour vérifier que la route driver assignments fonctionne
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"
DRIVER_EMAIL = "titou@gmail.com"
DRIVER_PASSWORD = "123456"

def test_driver_assignments():
    """Teste la route driver assignments"""
    try:
        # 1. Connexion du driver
        print("🔐 Connexion du driver...")
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": DRIVER_EMAIL,
            "password": DRIVER_PASSWORD
        })
        
        if login_response.status_code != 200:
            print(f"❌ Échec de connexion: {login_response.status_code}")
            return False
            
        token = login_response.json()["access_token"]
        print("✅ Connexion réussie")
        
        # 2. Test de la route assignments
        print("📦 Test de la route driver assignments...")
        headers = {"Authorization": f"Bearer {token}"}
        assignments_response = requests.get(f"{BASE_URL}/api/driver/assignments", headers=headers)
        
        if assignments_response.status_code == 200:
            data = assignments_response.json()
            print(f"✅ Route assignments fonctionne! {len(data)} livraisons trouvées")
            for delivery in data:
                print(f"   - {delivery['trackingNumber']} ({delivery['status']})")
            return True
        else:
            print(f"❌ Erreur {assignments_response.status_code}: {assignments_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Test de la correction driver assignments")
    print("=" * 50)
    
    success = test_driver_assignments()
    
    if success:
        print("\n🎉 Tous les tests passent! Le problème est résolu.")
    else:
        print("\n💥 Il y a encore des problèmes à résoudre.") 