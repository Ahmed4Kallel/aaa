#!/usr/bin/env python3
"""
Script de test pour vérifier l'accès du livreur
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_driver_access():
    print("=== Test d'accès du livreur ===")
    
    # 1. Connexion du livreur
    print("\n1. Connexion du livreur...")
    login_data = {
        "email": "titou@gmail.com",
        "password": "123456"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get("access_token")
            print(f"Token obtenu: {token[:20]}...")
            
            # 2. Test d'accès aux assignations
            print("\n2. Test d'accès aux assignations...")
            headers = {"Authorization": f"Bearer {token}"}
            
            assignments_response = requests.get(f"{BASE_URL}/api/driver/assignments", headers=headers)
            print(f"Status: {assignments_response.status_code}")
            print(f"Response: {assignments_response.text}")
            
            if assignments_response.status_code == 200:
                assignments = assignments_response.json()
                print(f"Nombre d'assignations: {len(assignments)}")
                for assignment in assignments:
                    print(f"  - {assignment.get('trackingNumber')} -> {assignment.get('recipient')}")
            else:
                print("❌ Échec de l'accès aux assignations")
                
        else:
            print(f"❌ Échec de la connexion: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")

if __name__ == "__main__":
    test_driver_access() 