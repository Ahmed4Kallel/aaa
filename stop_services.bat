@echo off
echo ================================================
echo  ARRÊT DES SERVICES - DELIVERY TRACKER
echo ================================================
echo.

echo Arrêt des processus Python (Backend)...
taskkill /f /im python.exe > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend arrêté
) else (
    echo ℹ️  Aucun processus backend en cours
)

echo.
echo Arrêt des processus Node.js (Frontend)...
taskkill /f /im node.exe > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Frontend arrêté
) else (
    echo ℹ️  Aucun processus frontend en cours
)

echo.
echo ================================================
echo  ✅ TOUS LES SERVICES ONT ÉTÉ ARRÊTÉS
echo ================================================
echo.
echo Pour redémarrer, utilisez start_auto.bat
echo.
pause 