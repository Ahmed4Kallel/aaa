# Guide de Test - DeliveryTracker Pro

## ✅ Corrections Appliquées
- [x] **Problème de police résolu** : Suppression de la règle CSS qui forçait Arial/Helvetica
- [x] **Erreur de compilation corrigée** : Suppression de la fonction `handleDemoLogin` dupliquée
- [x] **Cache Next.js nettoyé** : Redémarrage propre du serveur

## 🧪 Tests à Effectuer

### 1. **Test de la Police (Font)**
- [ ] Vérifier que la police Inter s'affiche partout (pas d'Arial)
- [ ] Titres, paragraphes, boutons utilisent la même police
- [ ] Police cohérente sur toutes les pages

### 2. **Test de Navigation**
- [ ] Page d'accueil (/) se charge correctement
- [ ] Navigation vers /auth/login fonctionne
- [ ] Navigation vers /auth/register fonctionne
- [ ] Navigation vers /driver fonctionne (après connexion)
- [ ] Navigation vers /dashboard fonctionne
- [ ] Navigation vers /tracking fonctionne
- [ ] Navigation vers /services fonctionne
- [ ] Navigation vers /contact fonctionne

### 3. **Test des Formulaires**
- [ ] **Inscription** (/auth/register)
  - [ ] Tous les champs se remplissent
  - [ ] Validation côté client fonctionne
  - [ ] Messages d'erreur s'affichent
  - [ ] Connexion réussie redirige vers login
- [ ] **Connexion** (/auth/login)
  - [ ] Champs email et mot de passe fonctionnent
  - [ ] Bouton "Afficher/Masquer mot de passe" fonctionne
  - [ ] Mode démo fonctionne avec les identifiants de test
  - [ ] Bouton "Connexion démo rapide" fonctionne
  - [ ] Redirection vers /driver après connexion

### 4. **Test du Dashboard Livreur** (/driver)
- [ ] Page se charge après authentification
- [ ] Liste des livraisons s'affiche
- [ ] Boutons de changement de statut fonctionnent
- [ ] Bouton "Livré rapidement" fonctionne
- [ ] Bouton "Voir l'itinéraire" fonctionne
- [ ] Mode démo fonctionne si backend coupé

### 5. **Test du Profil** (/driver/profile)
- [ ] Informations utilisateur s'affichent
- [ ] Formulaire d'édition fonctionne
- [ ] Validation des champs fonctionne
- [ ] Sauvegarde des modifications fonctionne

### 6. **Test du Suivi de Colis** (/tracking)
- [ ] Champ de recherche fonctionne
- [ ] Recherche avec numéro de suivi fonctionne
- [ ] Résultats s'affichent correctement
- [ ] Messages d'erreur appropriés

### 7. **Test des Alertes et Notifications**
- [ ] Messages d'erreur s'affichent en rouge
- [ ] Messages de succès s'affichent en vert
- [ ] Toasts de notification apparaissent
- [ ] Alertes de mode démo s'affichent

### 8. **Test Responsive**
- [ ] Site fonctionne sur mobile
- [ ] Site fonctionne sur tablette
- [ ] Menu de navigation s'adapte
- [ ] Formulaires restent utilisables

### 9. **Test Mode Démo**
- [ ] Désactiver le backend (arrêter FastAPI)
- [ ] Vérifier que le mode démo s'active automatiquement
- [ ] Tester la connexion avec les identifiants de démo
- [ ] Vérifier que les fonctionnalités marchent en mode démo

### 10. **Test des Boutons et Interactions**
- [ ] Tous les boutons sont cliquables
- [ ] États de hover fonctionnent
- [ ] États de focus fonctionnent
- [ ] Animations de chargement s'affichent

## 🔧 Identifiants de Test
- **demo@livreur.com** / **demo123**
- **test@test.com** / **123456**
- **admin@admin.com** / **admin**
- Ou n'importe quel email valide avec mot de passe 6+ caractères

## 🚨 Problèmes Connus
- Erreur bcrypt côté backend (ne bloque pas le frontend)
- Mode démo automatique si backend indisponible

## 📝 Notes
- Le site fonctionne en mode démo si le backend n'est pas disponible
- Toutes les fonctionnalités sont testables sans backend
- La police Inter devrait maintenant s'afficher partout 