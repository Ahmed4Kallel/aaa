@echo off
echo ======================================
echo DÉMARRAGE AVEC NPX - DELIVERY TRACKER
echo ======================================
echo.

echo ✅ Vérification de la base de données...
cd backend
python check_mysql.py

echo.
echo ✅ Démarrage du backend FastAPI...
start "" cmd /k "cd /d %~dp0backend && python main.py"

echo.
echo ✅ Démarrage du frontend avec npx...
start "" cmd /k "cd /d %~dp0app && npx next dev"

echo.
echo ======================================
echo L'application est en cours de démarrage...
echo ======================================
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo Documentation API: http://localhost:8000/docs
echo.
echo Appuyez sur une touche pour continuer...
pause 