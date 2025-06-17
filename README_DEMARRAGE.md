# 🚀 Guide de Démarrage Rapide - Delivery Tracker

## 📋 Prérequis

- ✅ **WAMP Server** installé et démarré (icône verte)
- ✅ **Python 3.10+** installé
- ✅ **Node.js** installé
- ✅ **Git** (optionnel)

## 🎯 Démarrage Automatique (Recommandé)

### Option 1 : Script Batch (Windows)
```bash
# Double-cliquez sur le fichier ou exécutez :
start_auto.bat
```

### Option 2 : Script PowerShell (Windows)
```powershell
# Dans PowerShell, exécutez :
.\start_auto.ps1
```

## 🔧 Démarrage Manuel

### 1. Vérifier WAMP/MySQL
- Assurez-vous que WAMP est démarré (icône verte dans la barre des tâches)
- MySQL doit être en cours d'exécution sur le port 3306

### 2. Backend (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
python init_database.py
python create_tables.py
python main.py
```

### 3. Frontend (Terminal 2)
```bash
cd app
npm install
npm run dev
```

## 🌐 Accès à l'Application

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000
- **Documentation API** : http://localhost:8000/docs

## 👤 Comptes de Test

### Utilisateur
- **Email** : test@test.com
- **Mot de passe** : 123456

### Numéros de Tracking
- TRK123456
- TRK789012
- TRK345678

## 🛑 Arrêt des Services

### Script automatique
```bash
stop_services.bat
```

### Manuel
- Fermez les fenêtres de terminal
- Ou utilisez Ctrl+C dans chaque terminal

## 🔍 Dépannage

### Problème : "MySQL n'est pas en cours d'exécution"
**Solution** : Démarrez WAMP Server

### Problème : "Port 3000 déjà utilisé"
**Solution** : Le frontend utilisera automatiquement le port 3001

### Problème : "Erreur de connexion à la base"
**Solution** : Vérifiez que WAMP est démarré et MySQL fonctionne

### Problème : "Dépendances manquantes"
**Solution** : Exécutez `pip install -r backend/requirements.txt`

## 📊 Fonctionnalités Disponibles

- ✅ **Authentification** (Login/Register)
- ✅ **Suivi de colis** (Recherche par numéro)
- ✅ **Dashboard** (Statistiques et liste)
- ✅ **Espace livreur** (Assignations)
- ✅ **API REST** complète
- ✅ **Mode démo** automatique

## 🎉 C'est tout !

L'application est maintenant prête à être utilisée ! 🚀 