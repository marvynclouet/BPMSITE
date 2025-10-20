# 💳 Configuration Stripe pour BPM Formation

## 🚀 Installation et Configuration

### 1. Installer les dépendances Node.js
```bash
npm install
```

### 2. Configurer vos clés Stripe

#### A. Clé publique (Frontend)
Dans `script.js` ligne 1019, remplacez :
```javascript
const stripe = Stripe('pk_test_51234567890abcdefghijklmnopqrstuvwxyz');
```
Par votre vraie clé publique Stripe.

#### B. Clé secrète (Backend)
Dans `stripe-server.js` ligne 5, remplacez :
```javascript
const stripe = require('stripe')('sk_test_VOTRE_CLÉ_SECRÈTE_STRIPE');
```
Par votre vraie clé secrète Stripe.

### 3. Démarrer le serveur
```bash
npm start
```
Le serveur démarre sur `http://localhost:3000`

## 🔧 Fonctionnalités Implémentées

### ✅ Paiements Stripe Checkout
- **Formation Digitale** : 500€
- **Formation Intensive** : 899€ 
- **Formation Complète** : 999€

### ✅ Pages de Résultat
- **Page de succès** : `success.html`
- **Redirection d'annulation** : retour vers `#pricing`

### ✅ Sécurité
- Validation côté serveur
- Métadonnées de tracking
- Gestion d'erreurs complète

### ✅ UX Optimisée
- Loading states sur les boutons
- Messages d'erreur utilisateur
- Design cohérent avec le site

## 🌍 Configuration Production

### 1. Variables d'environnement
Créez un fichier `.env` :
```
STRIPE_SECRET_KEY=sk_live_votre_clé_secrète_live
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook
NODE_ENV=production
```

### 2. Domaine de production
Mettez à jour les URLs dans `stripe-server.js` :
- `success_url` : `https://bpmformation.com/success.html`
- `cancel_url` : `https://bpmformation.com/#pricing`

### 3. Webhooks Stripe
Configurez un webhook sur `https://votre-domaine.com/stripe-webhook` pour :
- `checkout.session.completed`
- `payment_intent.succeeded`

## 🧪 Test en Développement

### Cartes de test Stripe :
- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0025 0000 3155`

### URLs de test :
- Site : `http://localhost:3000`
- Paiement : Cliquer sur "Payer maintenant" sur une formation

## 📧 Emails et Notifications

Après un paiement réussi, vous pouvez :
1. Envoyer un email de bienvenue
2. Créer un compte utilisateur
3. Donner accès aux ressources de formation
4. Envoyer les informations de connexion

## 🔒 Sécurité Important

⚠️ **JAMAIS** exposer vos clés secrètes Stripe dans le code frontend !
✅ Toujours valider les paiements côté serveur
✅ Utiliser HTTPS en production
✅ Configurer les webhooks pour la confirmation