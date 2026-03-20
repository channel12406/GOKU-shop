# 🔐 Configuration de l'Administration

## Comment activer la page Admin fonctionnelle

### Étape 1 : Créer un compte administrateur dans Firebase

1. Allez sur la [Console Firebase](https://console.firebase.google.com/)
2. Sélectionnez votre projet : `shop-garena-bd558`
3. Dans le menu de gauche, cliquez sur **Authentication** → **Users**
4. Cliquez sur **Add User** (Ajouter un utilisateur)
5. Entrez :
   - **Email** : `admin@gamerecharge-togo.com` (ou votre email)
   - **Mot de passe** : Choisissez un mot de passe sécurisé (min 6 caractères)
6. Cliquez sur **Add User**

### Étape 2 : Activer l'authentification par email/mot de passe

1. Toujours dans **Authentication**, allez dans l'onglet **Sign-in method**
2. Cliquez sur **Email/Password**
3. Activez l'option **Enable**
4. Cliquez sur **Save**

### Étape 3 : Tester la connexion Admin

1. Ouvrez votre application : `http://localhost:8080/admin`
2. Entrez l'email et le mot de passe que vous venez de créer
3. Cliquez sur **Se connecter**
4. Vous devriez accéder au tableau de bord administratif

---

## 📊 Fonctionnalités du Tableau de Bord Admin

Une fois connecté, vous pouvez gérer :

### 1. 📈 Statistiques (Stats)
- Nombre total de commandes
- Nombre de messages contact
- Nombre de projets portfolio
- Nombre de témoignages

### 2. 📦 Gestion des Commandes
- Voir toutes les commandes clients
- Changer le statut (pending, confirmed, completed, cancelled)
- Supprimer des commandes

### 3. 💬 Messages Contact
- Lire les messages des clients
- Marquer comme lu/non lu
- Supprimer les anciens messages

### 4. 🖼️ Portfolio
- Ajouter de nouveaux projets
- Modifier les projets existants
- Supprimer des projets
- Gérer les images (URLs)

### 5. ⭐ Témoignages
- Approuver ou rejeter les témoignages
- Supprimer les témoignages inappropriés

### 6. 📧 Newsletter
- Voir tous les abonnés
- Envoyer une newsletter groupée
- Exporter la liste des emails

### 7. 🏷️ Codes Promo
- Créer des codes de réduction
- Définir le pourcentage de réduction
- Définir la date d'expiration
- Activer/Désactiver les codes

### 8. 🛍️ Produits
- Ajouter des produits (ex: codes sources)
- Gérer les prix et descriptions
- Upload des fichiers (via Firebase Storage)

### 9. 📥 Codes de Téléchargement
- Générer des codes uniques
- Associer à des fichiers
- Suivre l'utilisation
- Définir des dates d'expiration

### 10. 🏆 Tournois
- Créer des tournois
- Gérer les inscriptions
- Approuver les équipes
- Suivre l'avancement

---

## 🔒 Sécurité

### Bonnes pratiques :
- ✅ Utilisez un mot de passe fort (12+ caractères)
- ✅ Ne partagez jamais vos identifiants
- ✅ Déconnectez-vous après chaque session
- ✅ Changez régulièrement votre mot de passe

### Dans Firebase Console :
Vous pouvez voir tous les utilisateurs connectés et révoquer l'accès si nécessaire.

---

## 🚀 Déploiement en Production

Pour mettre l'admin en ligne :

1. **Build** : `npm run build`
2. **Deploy** sur votre hébergement (Firebase Hosting, Vercel, Netlify, etc.)
3. **Configurez** les variables d'environnement Firebase si nécessaire
4. **Testez** la connexion admin en production

---

## 📝 Notes Importantes

- Les données sont stockées dans Firebase Realtime Database
- L'authentification utilise Firebase Auth
- Les fichiers sont stockés dans Firebase Storage
- Toutes les modifications sont en temps réel

---

## 🆘 Support

En cas de problème :
1. Vérifiez que Firebase est bien configuré dans `src/lib/firebase.ts`
2. Assurez-vous que l'utilisateur existe dans Firebase Console
3. Vérifiez les règles de sécurité de la database
4. Consultez les logs dans la console du navigateur (F12)

---

**URL d'accès** : `http://localhost:8080/admin`

**Identifiants par défaut** : Ceux que vous avez créés dans Firebase Console
