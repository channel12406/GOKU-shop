# ⚙️ Configuration des Services Externes

## 1. 📧 EmailJS - Envoi de Newsletters

### Étape 1 : Créer un compte EmailJS
1. Va sur [EmailJS.com](https://www.emailjs.com/)
2. Crée un compte gratuit
3. Dans le dashboard, note tes identifiants :
   - **Service ID**
   - **Template ID** 
   - **Public Key**

### Étape 2 : Configurer le service email
1. Clique sur **"Add Service"** → Choisis **Gmail** (ou autre)
2. Connecte ton compte Gmail
3. Note le **Service ID** généré

### Étape 3 : Créer le template d'email
1. Va dans **"Email Templates"** → **"Create New Template"**
2. Utilise ce modèle :

```html
Subject: {{subject}}
From: {{from_name}}

{{message}}

---
GameRecharge Togo - Recharge de Jeux Mobiles
🇹🇬 Lomé, Togo
WhatsApp: +228 72 12 21 91
```

3. Sauvegarde et note le **Template ID**

### Étape 4 : Mettre à jour le code
Dans `src/lib/emailService.ts`, remplace :

```typescript
const EMAILJS_SERVICE_ID = 'ton_service_id';
const EMAILJS_TEMPLATE_ID = 'ton_template_id';
const EMAILJS_PUBLIC_KEY = 'ta_public_key';
```

### Étape 5 : Tester l'envoi
```bash
npm run dev
```
Va dans l'admin → Newsletter → Teste l'envoi

---

## 2. 🔥 Firebase - Règles de Sécurité

### Accéder aux règles de la base de données

1. Va sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionne ton projet : `shop-garena-bd558`
3. Menu gauche → **Realtime Database** → Onglet **Rules**

### Copier-coller ces règles :

```json
{
  "rules": {
    "orders": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "contacts": {
      ".read": "auth != null",
      ".write": true
    },
    "portfolio": {
      ".read": true,
      ".write": "auth != null"
    },
    "testimonials": {
      ".read": true,
      ".write": "auth != null || !data.exists()",
      "approved": {
        ".validate": "auth != null"
      }
    },
    "newsletter": {
      ".read": "auth != null",
      ".write": true
    },
    "promoCodes": {
      ".read": true,
      ".write": "auth != null"
    },
    "products": {
      ".read": true,
      ".write": "auth != null"
    },
    "downloadCodes": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "tournaments": {
      ".read": true,
      ".write": "auth != null"
    },
    "tournamentApplications": {
      ".read": "auth != null",
      ".write": "auth != null || !data.exists()"
    },
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### Publier les règles
Clique sur **"Publish"** pour appliquer les règles.

---

## 3. 📦 Firebase Storage - Upload de Fichiers

### Activer Cloud Storage

1. Firebase Console → **Storage**
2. Clique sur **"Get Started"**
3. Commence en **production mode**
4. Choisis ta région (Europe ou Afrique)

### Règles de sécurité Storage

Onglet **Rules** dans Storage :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 4. ✅ Vérification du Fonctionnement

### Test Admin Complet

1. **Connexion** : http://localhost:8080/admin
   - Utilise tes identifiants Firebase Auth

2. **Test Portfolio** :
   - Ajoute un projet avec des URLs d'images
   - Vérifie qu'il apparaît sur `/portfolio`

3. **Test Tournois** :
   - Crée un tournoi
   - Vérifie qu'il apparaît sur `/tournaments`

4. **Test Newsletter** :
   - Configure EmailJS
   - Envoie une newsletter test à ton email

5. **Test Codes Promo** :
   - Crée un code promo (ex: REDUCTION10)
   - Teste-le sur la page de paiement

6. **Test Codes de Téléchargement** :
   - Crée un code avec un fichier
   - Teste le téléchargement sur `/download`

---

## 5. 🚀 Résolution des Problèmes

### EmailJS ne fonctionne pas
- ✅ Vérifie que ton compte EmailJS est actif
- ✅ Vérifie les IDs dans `emailService.ts`
- ✅ Regarde les logs dans la console (F12)
- ✅ Teste avec un seul email d'abord

### Firebase Auth ne fonctionne pas
- ✅ Vérifie que l'utilisateur existe dans Firebase Console → Authentication
- ✅ Active Email/Password dans Sign-in method
- ✅ Vérifie les règles de la database

### Les images ne s'affichent pas
- ✅ Utilise des URLs publiques (Unsplash, Imgur, etc.)
- ✅ Ou upload dans Firebase Storage
- ✅ Vérifie les CORS si hébergement externe

### Les tournois ne s'enregistrent pas
- ✅ Vérifie les règles Firebase (voir section 2)
- ✅ Regarde les erreurs dans la console
- ✅ Assure-toi d'être connecté en admin

---

## 6. 📊 Structure des Données Firebase

Voici comment sont organisées les données :

```
shop-garena-bd558/
├── orders/                 # Toutes les commandes
│   └── -order123/
│       ├── productName: "Pack 100 Diamants"
│       ├── price: "800"
│       ├── status: "pending"
│       └── ...
├── contacts/               # Messages contact
├── portfolio/              # Projets portfolio
├── testimonials/           # Témoignages (approuvés ou non)
├── newsletter/             # Abonnés newsletter
├── promoCodes/             # Codes de réduction
├── products/               # Produits (codes sources, etc.)
├── downloadCodes/          # Codes de téléchargement
├── tournaments/            # Tournois
└── tournamentApplications/ # Inscriptions aux tournois
```

---

## 7. 🎯 Prochaines Étapes

Une fois tout configuré :

1. ✅ **Teste toutes les fonctionnalités**
2. ✅ **Crée du contenu démo** (quelques projets, tournois, etc.)
3. ✅ **Vérifie que tout est sécurisé**
4. ✅ **Prépare le déploiement en production**

---

## 🆘 Besoin d'Aide ?

- **EmailJS Docs** : https://www.emailjs.com/docs/
- **Firebase Docs** : https://firebase.google.com/docs
- **Ton Projet** : Tous les fichiers sont dans `src/lib/`

**Tu es prêt ! Toutes les fonctionnalités admin sont 100% opérationnelles !** 🎉
