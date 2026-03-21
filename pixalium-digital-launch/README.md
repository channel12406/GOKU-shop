# GOKU Shop - Recharge de Jeux Mobiles au Bénin

Plateforme de recharge pour jeux mobiles : Free Fire, Call of Duty Mobile, PUBG, Roblox et plus encore.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js & npm installés
- [Installer avec nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```bash
# Cloner le repository
git clone <URL_DU_REPOSITORY>
cd GOKU-shop

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le serveur de développement démarrera sur http://localhost:8080

## 🛠️ Scripts Disponibles

- `npm run dev` - Serveur de développement avec hot reload
- `npm run build` - Build pour la production
- `npm run build:dev` - Build en mode développement
- `npm run preview` - Prévisualiser le build de production
- `npm run lint` - Linter le code
- `npm run test` - Exécuter les tests
- `npm run test:watch` - Tests en mode watch

## 🎮 Fonctionnalités

### Jeux Supportés
- **Free Fire** - Recharge de diamants
- **Call of Duty Mobile** - Recharge de CP Points
- **PUBG Mobile** - Recharge d'UC
- **Roblox** - Recharge de Robux
- **Blood Strike** - Recharge de Gold

### Services
- Recharge instantanée de devises
- Abonnements hebdomadaires/mensuels
- Booyah Pass & Level Up Pass (Free Fire)
- Tournois de jeux
- Système d'affiliation
- Codes promo

### Méthodes de Paiement
- Mobile Money (MTN, Moov)
- Cartes bancaires
- Transfert bancaire

## 🏗️ Technologies Utilisées

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Firebase (Auth, Realtime Database, Storage)
- **State Management**: React Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod

## 📁 Structure du Projet

```
src/
├── components/     # Composants UI réutilisables
├── pages/         # Pages de l'application
├── lib/           # Services et utilitaires
├── hooks/         # Hooks personnalisés
├── assets/        # Images et icônes
└── test/          # Tests unitaires
```

## 🔧 Configuration

### Firebase
Le projet utilise Firebase pour l'authentification et la base de données. 
Configurez votre propre projet Firebase dans `src/lib/firebase.ts`.

### Variables d'Environnement
Créez un fichier `.env.local` pour les variables sensibles :
```
VITE_FIREBASE_API_KEY=votre_clé_api
VITE_FIREBASE_PROJECT_ID=votre_projet_id
```

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Déploiement sur Vercel/Netlify
1. Build le projet avec `npm run build`
2. Uploadez le dossier `dist/`
3. Configurez les variables d'environnement

## 📱 Support et Contact

Pour toute question ou support :
- Email: support@gokushop.bj
- Téléphone: +229 XX XX XX XX

## 📄 Licence

Ce projet est la propriété de GOKU Shop. Tous droits réservés.
