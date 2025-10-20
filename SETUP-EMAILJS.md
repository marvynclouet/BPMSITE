# 📧 Configuration EmailJS pour BPM Formation

## 🚀 Étapes de Configuration

### 1️⃣ **Créer un Compte EmailJS**
1. Aller sur [emailjs.com](https://www.emailjs.com)
2. Créer un compte gratuit
3. Vérifier votre email

### 2️⃣ **Configurer le Service Email**
1. Dans le dashboard → **Email Services**
2. Cliquer **Add New Service**
3. Choisir **Gmail** (ou votre fournisseur)
4. Connecter votre compte `clouetmarvyn@gmail.com` ou `bpmformation2025@gmail.com`
5. Nommer le service : `service_bpm_formation`

### 3️⃣ **Créer le Template Email**
1. Aller dans **Email Templates**
2. Cliquer **Create New Template**
3. Nommer : `template_contact`
4. Configurer le template :

```
Sujet: Nouvelle demande de contact - BPM Formation

Bonjour,

Vous avez reçu une nouvelle demande de contact depuis le site BPM Formation :

👤 Nom : {{from_name}}
📧 Email : {{from_email}}
📱 Téléphone : {{phone}}
🎵 Formation souhaitée : {{formation}}

💬 Message :
{{message}}

---
Envoyé depuis bpmformation.com
```

### 4️⃣ **Récupérer les Clés**
1. Aller dans **Account** → **General**
2. Copier votre **Public Key** (commence par `user_...`)

### 5️⃣ **Intégrer dans le Code**
Dans `script.js` ligne 1126, remplacer :
```javascript
emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');
```
Par :
```javascript
emailjs.init('user_VOTRE_VRAIE_CLÉ');
```

## ✅ **Configuration des Emails de Réception**

### Emails configurés :
- ✅ `clouetmarvyn@gmail.com`
- ✅ `bpmformation2025@gmail.com`

### Informations collectées :
- ✅ Nom et prénom
- ✅ Email du contact
- ✅ Téléphone (optionnel)
- ✅ Formation souhaitée
- ✅ Message personnalisé

## 🎯 **Avantages EmailJS**

### ✅ **Gratuit**
- 200 emails/mois gratuits
- Pas de serveur nécessaire
- Configuration simple

### ✅ **Sécurisé**
- Pas d'exposition des emails côté client
- Protection anti-spam
- Templates sécurisés

### ✅ **Fiable**
- Delivery tracking
- Error handling
- Retry automatique

## 🧪 **Test du Formulaire**

1. Aller sur votre site
2. Remplir le formulaire de contact
3. Cliquer "Envoyer ma demande"
4. Vérifier la réception sur vos 2 emails

## 🔧 **Si Problème**

### Debug :
- Console navigateur (F12) pour voir les erreurs
- Dashboard EmailJS pour voir les envois
- Vérifier les spams dans vos boîtes mail

### Support :
- Documentation : [docs.emailjs.com](https://www.emailjs.com/docs/)
- Limite gratuite : 200 emails/mois

**🎯 Résultat** : Formulaire de contact 100% fonctionnel vers vos 2 emails !