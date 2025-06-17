# Script de démarrage automatique pour Delivery Tracker
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DEMARRAGE AUTOMATIQUE - DELIVERY TRACKER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. Verification de MySQL (WAMP Server)..." -ForegroundColor Yellow

# Vérifier si MySQL est accessible
try {
    python backend/check_mysql.py
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR: MySQL n'est pas accessible!" -ForegroundColor Red
        Write-Host "Assurez-vous que WAMP Server est demarre (icone verte)" -ForegroundColor Red
        Read-Host "Appuyez sur Entree pour continuer"
        exit 1
    }
} catch {
    Write-Host "ERREUR: Impossible de verifier MySQL" -ForegroundColor Red
    Read-Host "Appuyez sur Entree pour continuer"
    exit 1
}

Write-Host ""
Write-Host "2. Demarrage du backend FastAPI (port 8080)..." -ForegroundColor Yellow

# Démarrer le backend en arrière-plan
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd backend && python start_server.py" -WindowStyle Normal

# Attendre que le backend démarre
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "3. Demarrage du frontend Next.js..." -ForegroundColor Yellow

# Démarrer le frontend
Start-Process -FilePath "cmd" -ArgumentList "/k", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "SERVICES DEMARRES!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000 (ou port suivant)" -ForegroundColor White
Write-Host "Backend:  http://localhost:8080" -ForegroundColor White
Write-Host "API Docs: http://localhost:8080/docs" -ForegroundColor White
Write-Host ""
Write-Host "Compte admin:" -ForegroundColor Cyan
Write-Host "Email: kallelahmed63@gmail.com" -ForegroundColor White
Write-Host "Mot de passe: changeme007*" -ForegroundColor White
Write-Host ""
Read-Host "Appuyez sur Entree pour fermer cette fenetre" 