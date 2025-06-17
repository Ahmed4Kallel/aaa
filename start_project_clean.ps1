# Script de démarrage propre pour DeliveryTracker Pro
# Auteur: Assistant IA
# Date: $(Get-Date)

Write-Host "🚀 Démarrage propre de DeliveryTracker Pro" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# 1. Arrêter tous les processus Node.js
Write-Host "1. Arrêt des processus Node.js existants..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 2. Nettoyer le cache Next.js
Write-Host "2. Nettoyage du cache Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
    Write-Host "   ✅ Cache .next supprimé" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Pas de cache .next à supprimer" -ForegroundColor Blue
}

# 3. Nettoyer le cache npm
Write-Host "3. Nettoyage du cache npm..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "   ✅ Cache npm nettoyé" -ForegroundColor Green

# 4. Vérifier les dépendances
Write-Host "4. Vérification des dépendances..." -ForegroundColor Yellow
npm install
Write-Host "   ✅ Dépendances à jour" -ForegroundColor Green

# 5. Démarrer le serveur de développement
Write-Host "5. Démarrage du serveur Next.js..." -ForegroundColor Yellow
Write-Host "   🌐 Le site sera disponible sur: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   📱 Interface réseau: http://192.168.1.126:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "   ⚠️  Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Red
Write-Host ""

# Démarrer le serveur
npm run dev 