# 🚀 Guide Complet : Connecter VOTRE Stripe à BPM Formation

## 📋 Ce dont vous avez besoin concrètement

### 1️⃣ **Compte Stripe** 
- Aller sur [stripe.com](https://stripe.com)
- Créer un compte (gratuit)
- Vérifier votre identité (pour recevoir les paiements)

### 2️⃣ **Récupérer vos clés API**

#### A. Clés de Test (pour développement)
Dans votre dashboard Stripe → **Développeurs** → **Clés API** :
- ✅ **Clé publique** : `pk_test_51ABC123...`
- ✅ **Clé secrète** : `sk_test_51ABC123...`

#### B. Clés de Production (pour le site en ligne)
Activer le **Mode Live** puis récupérer :
- ✅ **Clé publique** : `pk_live_51ABC123...`
- ✅ **Clé secrète** : `sk_live_51ABC123...`

## 🔧 Configuration dans vos fichiers

### 1. **Frontend** (`commande.html` ligne 188)
```javascript
const stripe = Stripe('pk_test_51234567890abcdefghijklmnopqrstuvwxyz');
```
**➡️ Remplacer par :** `pk_test_VOTRE_VRAIE_CLÉ`

### 2. **Backend** (`stripe-server.js` ligne 5)
```javascript
const stripe = require('stripe')('sk_test_VOTRE_CLÉ_SECRÈTE_STRIPE');
```
**➡️ Remplacer par :** `sk_test_VOTRE_VRAIE_CLÉ`

## 💳 Fonctionnalités Configurées

### ✅ **Paiement Intégral**
- **Réduction 5%** automatique
- Paiement unique sécurisé

### ✅ **Paiement en 3x SANS FRAIS**
- **Formation Digitale** : 167€ × 3 mois
- **Formation Intensive** : 300€ × 3 mois  
- **Formation Complète** : 333€ × 3 mois

### ✅ **Formulaire Complet**
- Informations personnelles
- Adresse de facturation
- Niveau d'expérience
- Objectifs de formation

## 🚀 Démarrage Rapide

### 1. **Lancer le serveur**
```bash
npm start
```
Serveur disponible sur : `http://localhost:3000`

### 2. **Tester les paiements**
- Aller sur : `http://localhost:3000`
- Cliquer sur "Choisir ce plan"
- Remplir le formulaire
- Utiliser carte test : `4242 4242 4242 4242`

## 🔐 Sécurité & Production

### ⚠️ **IMPORTANT** - Clés secrètes
- **JAMAIS** mettre `sk_live_` dans le code frontend
- **TOUJOURS** utiliser `pk_live_` côté client
- **TOUJOURS** utiliser `sk_live_` côté serveur

### 🌐 **Mise en production**
1. Remplacer `pk_test_` par `pk_live_` dans `commande.html`
2. Remplacer `sk_test_` par `sk_live_` dans `stripe-server.js`
3. Configurer un nom de domaine (ex: `bpmformation.com`)
4. Configurer HTTPS obligatoire

## 📧 **Configuration Email**

### Emails automatiques Stripe
Dans votre dashboard Stripe → **Paramètres** → **Emails** :
- ✅ Activer les reçus automatiques
- ✅ Personnaliser avec votre logo BPM
- ✅ Ajouter vos coordonnées

## 💰 **Commissions Stripe**

### Tarifs France :
- **2.9% + 0.25€** par transaction réussie
- **Pas de frais d'abonnement**
- **Pas de frais cachés**

### Exemple pour Formation Intensive (899€) :
- Commission Stripe : **26.37€**
- Vous recevez : **872.63€**

## 🛠️ **Support & Aide**

### Si problème :
1. **Dashboard Stripe** → **Logs** pour voir les erreurs
2. **Console navigateur** (F12) pour débugger
3. **Documentation Stripe** : [docs.stripe.com](https://docs.stripe.com)

### Cartes de test utiles :
- ✅ **Succès** : `4242 4242 4242 4242`
- ❌ **Échec** : `4000 0000 0000 0002`
- 🔐 **3D Secure** : `4000 0025 0000 3155`

## 📱 **Prochaines étapes**

1. ✅ Remplacer les clés API
2. ✅ Tester en mode développement
3. ✅ Vérifier les emails de confirmation
4. ✅ Passer en mode production
5. ✅ Configurer les webhooks (optionnel)

**🎯 Résultat** : Vos clients pourront payer directement leurs formations en 1x ou 3x !