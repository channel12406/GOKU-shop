# Test du système d'affiliation

## Étapes de test :

1. **Créer un code d'affiliation dans l'admin** :
   - Aller dans l'admin
   - Section "Affiliations"
   - Créer un code avec :
     - Code: TEST10
     - Pourcentage: 10
     - Actif: oui

2. **Tester le code** :
   - Aller sur la boutique
   - Choisir un produit (ex: 110 Diamants - 800 FCFA)
   - Cliquer sur "Code Promo / Parrainage"
   - Entrer "TEST10"
   - Vérifier que la réduction s'applique (800 - 10% = 720 FCFA)

3. **Vérifier les logs** :
   - Ouvrir la console du navigateur
   - Vérifier les logs de débogage

## Problèmes possibles :

1. **Pas de codes dans la base de données** : Aucun code d'affiliation n'a été créé
2. **Code non actif** : Le code existe mais n'est pas actif
3. **Code expiré** : Le code a une date d'expiration dépassée
4. **Limite atteinte** : Le code a déjà été utilisé 4 fois
5. **Utilisateur non connecté** : Le champ n'était visible que pour les utilisateurs connectés (corrigé)

## Logs attendus :

```
Recherche du code: TEST10
Recherche du code d'affiliation: TEST10
Codes trouvés: ["id1", "id2", ...]
Vérification du code: TEST10 contre: TEST10
Code valide trouvé: {code: "TEST10", discountPercentage: 10, ...}
Calcul de la réduction: 800 x 10 % = 80
Réduction appliquée: 80 Nouveau prix: 720
Données de commande: {affiliateCode: "TEST10", discountAmount: 80, finalPrice: 720, ...}
```
