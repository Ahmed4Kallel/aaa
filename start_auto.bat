@echo off
echo ========================================
echo DEMARRAGE AUTOMATIQUE - DELIVERY TRACKER
echo ========================================

echo.
echo 1. Verification de MySQL (WAMP Server)...
echo.

REM Vérifier si MySQL est accessible
python backend/check_mysql.py
if %errorlevel% neq 0 (
    echo ERREUR: MySQL n'est pas accessible!
    echo Assurez-vous que WAMP Server est demarre (icone verte)
    pause
    exit /b 1
)

echo.
echo 2. Demarrage du backend FastAPI (port 8080)...
echo.

REM Démarrer le backend en arrière-plan
start "Backend FastAPI" cmd /k "cd backend && python start_server.py"

REM Attendre que le backend démarre
timeout /t 5 /nobreak > nul

echo.
echo 3. Demarrage du frontend Next.js...
echo.

REM Démarrer le frontend
start "Frontend Next.js" cmd /k "npm run dev"

echo.
echo ========================================
echo SERVICES DEMARRES!
echo ========================================
echo.
echo Frontend: http://localhost:3000 (ou port suivant)
echo Backend:  http://localhost:8080
echo API Docs: http://localhost:8080/docs
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul 