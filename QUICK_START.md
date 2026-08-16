# 🚀 Guide de démarrage rapide

## Installation

```bash
# Cloner le projet (si depuis Git)
git clone <url-du-repo>
cd FRONT-END-energy-platform

# Installer les dépendances
npm install
```

## Lancer l'application

```bash
# Mode développement (avec hot-reload)
npm run dev

# L'application sera disponible sur http://localhost:5173
```

## Structure de navigation

### Pages disponibles

- **`/`** - Page d'accueil
- **`/catalogue`** - Liste des produits
- **`/produit/:id`** - Détail d'un produit (ex: /produit/1)
- **`/formulaire/:productId`** - Formulaire de simulation (ex: /formulaire/1)
- **`/simulation/:simulationId`** - Résultats de simulation
- **`/rendez-vous`** - Prise de rendez-vous

## Fonctionnalités principales

### 1. Parcours complet

```
Accueil → Catalogue → Produit → Formulaire (5 étapes) → Simulation → Rendez-vous
```

### 2. Chatbot

- Accessible depuis toutes les pages (bouton flottant en bas à droite)
- Répond aux questions sur les produits
- Aide au choix
- Informations sur les primes

### 3. Formulaire multi-étapes

**Étape 1** : Choix du profil
- Particulier
- Société

**Étape 2** : Sélection de la région
- Wallonie
- Bruxelles
- Flandre

**Étape 3** : Coordonnées
- Nom, email, téléphone (Particulier)
- Raison sociale, TVA, secteur (Société)

**Étape 4** : Informations logement
- Adresse
- Type de logement
- Surface
- Consommation actuelle

**Étape 5** : Objectifs
- Réduire les factures
- Autonomie énergétique
- Écologie
- Valorisation du bien

### 4. Simulation

Après validation du formulaire, génération automatique de :
- **Score** (0-10) basé sur le profil
- **Estimation financière** avec primes régionales
- **Économies annuelles** estimées
- **Retour sur investissement**
- **Production** (pour panneaux solaires)
- **Réduction CO2**
- **Recommandations personnalisées**

## Données disponibles

### Produits (6 au total)

**Panneaux solaires**
- Premium 6 kWc - 8500€
- Standard 4 kWc - 5500€

**Batteries**
- Lithium 10 kWh - 6500€
- Lithium 5 kWh - 3800€

**Pompes à chaleur**
- Air-Eau 12 kW - 12000€
- Air-Air 5 kW - 4500€

### Primes par région

**Wallonie**
- Panneaux : 2500€
- Batteries : 1500€
- Pompes : 3500€

**Bruxelles**
- Panneaux : 3000€
- Batteries : 2000€
- Pompes : 4000€

**Flandre**
- Panneaux : 2000€
- Batteries : 1200€
- Pompes : 3000€

*+ Prime fédérale de 500€ pour tous*

## Personnalisation

### Modifier les produits

Fichier : `src/data/products.js`

```js
export const products = [
  {
    id: 1,
    name: 'Nouveau produit',
    type: 'panneaux',
    price: 9000,
    // ...
  },
];
```

### Modifier les primes

Fichier : `src/data/regions.js`

```js
export const regions = [
  {
    id: 'wallonie',
    name: 'Wallonie',
    primes: {
      panneaux: { base: 2500, ... },
      // ...
    },
  },
];
```

### Modifier les couleurs

Fichier : `src/App.css` ou `src/index.css`

```css
:root {
  --primary-color: #1a73e8;
  --secondary-color: #34a853;
  /* ... */
}
```

## Développement

### Ajouter une nouvelle page

1. Créer le dossier dans `src/pages/`
2. Créer `MaPage.jsx` et `MaPage.css`
3. Ajouter la route dans `App.jsx`
4. Exporter depuis `src/pages/index.js`

### Ajouter un composant

1. Créer le dossier dans `src/components/`
2. Créer `MonComposant.jsx` et `MonComposant.css`
3. Exporter depuis `src/components/index.js`

### Utiliser les hooks

```jsx
import { useLocalStorage, useIsMobile } from './hooks';

function MyComponent() {
  const [data, setData] = useLocalStorage('myKey', {});
  const isMobile = useIsMobile();
  
  // ...
}
```

## Build de production

```bash
# Créer le build optimisé
npm run build

# Tester le build localement
npm run preview
```

Les fichiers seront générés dans le dossier `dist/`

## Problèmes courants

### Port déjà utilisé

Si le port 5173 est occupé :
```bash
# Modifier vite.config.js
export default defineConfig({
  server: {
    port: 3000, // Changer le port
  },
});
```

### Erreurs de build

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Hot-reload ne fonctionne pas

```bash
# Redémarrer le serveur
Ctrl+C
npm run dev
```

## Prochaines étapes

1. **Backend API** : Connecter à un backend Node.js/Express
2. **Base de données** : MongoDB ou PostgreSQL
3. **Authentification** : JWT ou OAuth
4. **Paiement** : Stripe ou autre
5. **Email** : Nodemailer pour confirmations
6. **Déploiement** : Vercel, Netlify, ou serveur dédié

## Support

Pour toute question :
- Documentation complète : `DEVELOPMENT.md`
- Email : info@energieplus.be
- Issues GitHub : [Lien vers repo]
