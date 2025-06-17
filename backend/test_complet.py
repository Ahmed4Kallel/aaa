#!/usr/bin/env python3
"""
Script de test complet pour l'API de livraison
Teste l'authentification, la création de livraisons, et l'accès aux données
"""

import requests
import json
import time
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://localhost:8000"
ADMIN_EMAIL = "kallelahmed63@gmail.com"
ADMIN_PASSWORD = "changeme007*"
DRIVER_EMAIL = "titou@gmail.com"
DRIVER_PASSWORD = "123456"

def print_test_result(test_name, success, message=""):
    """Affiche le résultat d'un test"""
    status = "✅ SUCCÈS" if success else "❌ ÉCHEC"
    print(f"{status} - {test_name}")
    if message:
        print(f"   {message}")
    print()

def test_backend_connection():
    """Teste la connexion au backend"""
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            return True, "Backend accessible"
        else:
            return False, f"Backend répond avec le statut {response.status_code}"
    except requests.exceptions.ConnectionError:
        return False, "Impossible de se connecter au backend"
    except Exception as e:
        return False, f"Erreur inattendue: {str(e)}"

def test_admin_login():
    """Teste la connexion admin"""
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                return True, f"Token admin obtenu: {data['access_token'][:20]}..."
            else:
                return False, "Token manquant dans la réponse"
        else:
            return False, f"Échec de connexion admin: {response.status_code}"
    except Exception as e:
        return False, f"Erreur lors de la connexion admin: {str(e)}"

def test_driver_login():
    """Teste la connexion driver"""
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": DRIVER_EMAIL,
            "password": DRIVER_PASSWORD
        })
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                return True, f"Token driver obtenu: {data['access_token'][:20]}..."
            else:
                return False, "Token manquant dans la réponse"
        else:
            return False, f"Échec de connexion driver: {response.status_code}"
    except Exception as e:
        return False, f"Erreur lors de la connexion driver: {str(e)}"

def test_create_delivery(admin_token):
    """Teste la création d'une livraison"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Créer une livraison de test
        delivery_data = {
            "tracking_number": f"TEST{int(time.time())}",
            "sender": "Test Sender",
            "recipient": "Test Recipient",
            "destination": "Test Address",
            "weight": 2.5,
            "status": "pending",
            "driver_id": 3,  # ID du driver titou@gmail.com (corrigé)
            "current_location": "Entrepôt central",
            "estimated_delivery": (datetime.now() + timedelta(days=2)).isoformat()
        }
        
        response = requests.post(f"{BASE_URL}/api/deliveries", 
                               json=delivery_data, 
                               headers=headers)
        
        if response.status_code == 201:
            data = response.json()
            return True, f"Livraison créée avec ID: {data.get('delivery_id')}"
        else:
            return False, f"Échec création livraison: {response.status_code} - {response.text}"
    except Exception as e:
        return False, f"Erreur lors de la création: {str(e)}"

def test_get_deliveries(admin_token):
    """Teste la récupération des livraisons (admin)"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/deliveries", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            return True, f"Récupéré {len(data)} livraisons"
        else:
            return False, f"Échec récupération livraisons: {response.status_code}"
    except Exception as e:
        return False, f"Erreur lors de la récupération: {str(e)}"

def test_driver_assignments(driver_token):
    """Teste l'accès aux assignations du driver"""
    try:
        headers = {"Authorization": f"Bearer {driver_token}"}
        response = requests.get(f"{BASE_URL}/api/driver/assignments", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            return True, f"Driver a {len(data)} assignations"
        else:
            return False, f"Échec accès assignations: {response.status_code} - {response.text}"
    except Exception as e:
        return False, f"Erreur lors de l'accès aux assignations: {str(e)}"

def test_stats(admin_token):
    """Teste l'accès aux statistiques"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/stats", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            return True, f"Stats: Total={data.get('total')}, En attente={data.get('pending')}"
        else:
            return False, f"Échec accès stats: {response.status_code}"
    except Exception as e:
        return False, f"Erreur lors de l'accès aux stats: {str(e)}"

def run_complete_test():
    """Exécute tous les tests"""
    print("=" * 60)
    print("🧪 TEST COMPLET DE L'API DE LIVRAISON")
    print("=" * 60)
    print()
    
    # Test 1: Connexion backend
    success, message = test_backend_connection()
    print_test_result("Connexion au backend", success, message)
    if not success:
        print("❌ Impossible de continuer sans connexion au backend")
        return
    
    # Test 2: Connexion admin
    success, message = test_admin_login()
    print_test_result("Connexion admin", success, message)
    if not success:
        print("❌ Impossible de continuer sans connexion admin")
        return
    
    # Extraire le token admin
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        admin_token = response.json()["access_token"]
    except:
        print("❌ Impossible d'obtenir le token admin")
        return
    
    # Test 3: Connexion driver
    success, message = test_driver_login()
    print_test_result("Connexion driver", success, message)
    if not success:
        print("❌ Impossible de continuer sans connexion driver")
        return
    
    # Extraire le token driver
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": DRIVER_EMAIL,
            "password": DRIVER_PASSWORD
        })
        driver_token = response.json()["access_token"]
    except:
        print("❌ Impossible d'obtenir le token driver")
        return
    
    # Test 4: Création de livraison
    success, message = test_create_delivery(admin_token)
    print_test_result("Création de livraison", success, message)
    
    # Test 5: Récupération des livraisons (admin)
    success, message = test_get_deliveries(admin_token)
    print_test_result("Récupération livraisons (admin)", success, message)
    
    # Test 6: Assignations du driver
    success, message = test_driver_assignments(driver_token)
    print_test_result("Assignations driver", success, message)
    
    # Test 7: Statistiques
    success, message = test_stats(admin_token)
    print_test_result("Accès aux statistiques", success, message)
    
    print("=" * 60)
    print("🏁 FIN DES TESTS")
    print("=" * 60)

if __name__ == "__main__":
    run_complete_test()
