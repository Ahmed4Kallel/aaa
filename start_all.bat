@echo off
echo ======================================
echo DÉMARRAGE DE L'APPLICATION DELIVERY TRACKER
echo ======================================
echo.

REM Vérifier si WAMP est en cours d'exécution
tasklist | find /i "wamp" > nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ WAMP n'est pas en cours d'exécution.
    echo Veuillez démarrer WAMP et réessayer.
    pause
    exit /b 1
) else (
    echo ✅ WAMP est en cours d'exécution
)

echo.
echo Installation des dépendances Python...
pip install -r requirements.txt
pip install pymysql

echo.
echo Création de la base de données...
python init_database.py

echo.
echo Création des tables...
python create_tables.py

echo.
echo Démarrage du serveur FastAPI...
start "" cmd /k "cd /d %~dp0backend && python main.py"

echo.
echo Démarrage du frontend Next.js...
start "" cmd /k "cd /d %~dp0app && npm run dev"

echo.
echo ======================================
echo L'application est en cours de démarrage...
echo ======================================
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo Documentation API: http://localhost:8000/docs
echo.
pause
