# 🚀 GUIDE DÉPLOIEMENT HOSTINGER

## 📋 Prérequis
- Compte Hostinger avec accès SSH (Plan Business ou supérieur)
- Node.js activé sur votre hébergement
- Nom de domaine configuré (ex: bpmformation.com)

---

## 🔧 Étape 1 : Configuration SSH

### 1. Activer SSH dans Hostinger
1. Connectez-vous à **hPanel**
2. Allez dans **Avancé** → **SSH Access**
3. Activez l'accès SSH
4. Notez vos identifiants :
   - **Username** : (généralement u123456789)
   - **Host** : (généralement ssh.hostinger.com)
   - **Port** : 65002

### 2. Se connecter en SSH
```bash
ssh u123456789@ssh.hostinger.com -p 65002
```

---

## 📦 Étape 2 : Télécharger le projet

### Option A : Via Git (recommandé)
```bash
cd domains/bpmformation.com/public_html
git clone https://github.com/marvynclouet/BPMSITE.git .
```

### Option B : Via FTP/SFTP
1. Téléchargez tous les fichiers sauf :
   - `node_modules/`
   - `.git/`
   - `.env`
2. Utilisez FileZilla ou le gestionnaire de fichiers Hostinger

---

## 🔑 Étape 3 : Configurer les variables d'environnement

### 1. Créer le fichier .env
```bash
nano .env
```

### 2. Ajouter vos clés :
```env
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE_STRIPE
STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE_PUBLIQUE_STRIPE
GMAIL_USER=bpmformation@gmail.com
GMAIL_APP_PASSWORD=VOTRE_MOT_DE_PASSE_APP_GMAIL
PORT=3000
NODE_ENV=production
BASE_URL=https://bpmformation.com
```

**⚠️ Remplacez les valeurs ci-dessus par vos vraies clés depuis votre fichier `.env` local**

Sauvegarder : `Ctrl + X`, puis `Y`, puis `Enter`

---

## 📥 Étape 4 : Installer les dépendances

```bash
npm install
```

---

## 🚀 Étape 5 : Démarrer l'application

### Option A : PM2 (recommandé - redémarre automatiquement)
```bash
# Installer PM2 globalement
npm install -g pm2

# Démarrer l'application
pm2 start stripe-server.js --name bpm-formation

# Sauvegarder la configuration
pm2 save

# Auto-démarrage au reboot
pm2 startup
```

### Option B : Node.js simple
```bash
nohup node stripe-server.js &
```

---

## 🌐 Étape 6 : Configuration du proxy Apache/Nginx

### Pour Apache (.htaccess déjà configuré)
Le fichier `.htaccess` est déjà inclus et redirige :
- Les fichiers statiques → Serveur web
- `/create-checkout-session` → Node.js (port 3000)
- `/send-email` → Node.js (port 3000)

### Vérifier le .htaccess
```apache
RewriteEngine On

# Rediriger les API vers Node.js
RewriteCond %{REQUEST_URI} ^/create-checkout-session [OR]
RewriteCond %{REQUEST_URI} ^/send-email
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Servir les fichiers statiques normalement
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [L]
```

---

## ✅ Étape 7 : Vérification

### 1. Vérifier que Node.js tourne
```bash
pm2 status
# ou
ps aux | grep node
```

### 2. Tester le site
- Visitez : `https://bpmformation.com`
- Testez le formulaire de contact
- Testez un paiement

### 3. Voir les logs
```bash
pm2 logs bpm-formation
```

---

## 🔄 Mise à jour du site

```bash
# Se connecter en SSH
ssh u123456789@ssh.hostinger.com -p 65002

# Aller dans le dossier
cd domains/bpmformation.com/public_html

# Récupérer les dernières modifications
git pull origin main

# Installer les nouvelles dépendances (si nécessaire)
npm install

# Redémarrer l'application
pm2 restart bpm-formation
```

---

## 🆘 Dépannage

### Le site ne charge pas
```bash
# Vérifier si Node.js tourne
pm2 status

# Voir les erreurs
pm2 logs bpm-formation --err

# Redémarrer
pm2 restart bpm-formation
```

### Erreur de permissions
```bash
chmod -R 755 .
chmod 644 .env
```

### Port 3000 déjà utilisé
```bash
# Trouver et tuer le processus
lsof -ti:3000 | xargs kill -9

# Redémarrer
pm2 restart bpm-formation
```

---

## 📞 Support Hostinger

Si vous avez des problèmes :
1. Chat en direct : disponible 24/7
2. Tutoriels : [support.hostinger.com](https://support.hostinger.com)
3. Demander l'activation de Node.js si pas disponible

---

## ✨ Fonctionnalités en production

✅ **HTTPS automatique** (SSL gratuit Hostinger)
✅ **Stripe en mode LIVE** opérationnel
✅ **Emails fonctionnels** via Nodemailer
✅ **Popup d'âge** pour réductions automatiques
✅ **Paiements Klarna** disponibles
✅ **PWA** installable sur mobile

**Votre site BPM Formation est maintenant en ligne !** 🎉🎓💳

