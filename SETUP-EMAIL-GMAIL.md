# 📧 Configuration Email Gmail pour BPM Formation

## 🚨 Problème EmailJS Résolu

L'erreur `insufficient authentication scopes` d'EmailJS est résolue avec **Nodemailer** (plus fiable).

## 🔧 Configuration Gmail App Password

### 1️⃣ **Activer l'Authentification à 2 Facteurs**
1. Aller sur [myaccount.google.com](https://myaccount.google.com)
2. **Sécurité** → **Authentification à 2 facteurs**
3. **Activer** si pas déjà fait

### 2️⃣ **Créer un Mot de Passe d'Application**
1. **Sécurité** → **Mots de passe d'application**
2. **Sélectionner l'application** : Autre (nom personnalisé)
3. **Nom** : "BPM Formation Website"
4. **Générer** → Copier le mot de passe (16 caractères)

### 3️⃣ **Intégrer dans le Code**
Dans `stripe-server.js` ligne 16, remplacer :
```javascript
pass: 'VOTRE_MOT_DE_PASSE_APP_GMAIL'
```
Par votre **mot de passe d'application** généré.

## 🚀 **Démarrage**

### 1. **Lancer le serveur**
```bash
npm start
```

### 2. **Tester le formulaire**
- Site : `http://localhost:3000`
- Formulaire de contact → "Envoyer ma demande"
- Vérifier `bpmformation@gmail.com`

## ✅ **Avantages Nodemailer vs EmailJS**

### ✅ **Plus Fiable**
- Pas de problèmes d'authentification
- Contrôle total sur l'envoi
- Pas de limite de 200 emails/mois

### ✅ **Plus Sécurisé**
- Mot de passe d'application dédié
- Révocable à tout moment
- Logs côté serveur

### ✅ **Plus Professionnel**
- Emails HTML stylés
- Gestion d'erreurs avancée
- Reply-to automatique

## 🎯 **Ce qu'il vous faut**

**1 seule chose** : Le **mot de passe d'application Gmail** de 16 caractères.

**Format** : `abcd efgh ijkl mnop` (avec espaces)

Donnez-moi ce mot de passe et le formulaire fonctionnera instantanément ! 📧🔥