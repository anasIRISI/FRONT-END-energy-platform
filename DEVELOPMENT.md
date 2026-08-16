# Guide de développement - EnergiePlus

## 🏗️ Architecture du projet

### Structure des dossiers

```
src/
├── components/          # Composants réutilisables
│   ├── Layout/         # Layout principal (Header + Footer + Container)
│   ├── Navbar/         # Barre de navigation
│   ├── Footer/         # Pied de page
│   ├── Chatbot/        # Assistant IA
│   ├── ProductCard/    # Carte produit
│   ├── Loading/        # Indicateur de chargement
│   └── ErrorBoundary/  # Gestion des erreurs
│
├── pages/              # Pages de l'application
│   ├── Home/           # Page d'accueil
│   ├── Catalogue/      # Liste des produits
│   ├── ProductDetail/  # Détails d'un produit
│   ├── Formulaire/     # Formulaire multi-étapes
│   ├── Simulation/     # Résultats de simulation
│   └── RendezVous/     # Prise de rendez-vous
│
├── data/               # Données statiques
│   ├── products.js     # Base de données des produits
│   └── regions.js      # Données des régions belges
│
├── services/           # Services API
│   └── api.js          # Client API Axios
│
├── utils/              # Fonctions utilitaires
│   └── simulation.js   # Calculs de simulation
│
├── hooks/              # Hooks personnalisés
│   ├── useLocalStorage.js
│   ├── useMediaQuery.js
│   └── index.js
│
├── config/             # Configuration
│   └── constants.js    # Constantes de l'application
│
├── App.jsx             # Composant racine avec routes
├── main.jsx            # Point d'entrée
└── index.css           # Styles globaux
```

## 🎨 Système de design

### Palette de couleurs

```css
--primary-color: #1a73e8;      /* Bleu principal (Google) */
--secondary-color: #34a853;    /* Vert (succès, écologie) */
--accent-color: #fbbc04;       /* Jaune (attention) */
--danger-color: #ea4335;       /* Rouge (erreur) */
--text-primary: #202124;       /* Texte principal */
--text-secondary: #5f6368;     /* Texte secondaire */
--bg-primary: #ffffff;         /* Fond principal */
--bg-secondary: #f8f9fa;       /* Fond secondaire */
--border-color: #dadce0;       /* Bordures */
```

### Typographie

- **Police principale** : Inter, -apple-system, Roboto
- **Échelle typographique** :
  - h1: 3rem (48px)
  - h2: 2.25rem (36px)
  - h3: 1.75rem (28px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### Espacements

```css
8px, 16px, 24px, 32px, 48px, 64px, 80px
```

### Ombres

```css
--shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.15);
```

## 🔧 Composants

### Boutons

```jsx
<button className="btn btn-primary">Action principale</button>
<button className="btn btn-secondary">Action secondaire</button>
```

### Cards

```jsx
<div className="card">
  {/* Contenu */}
</div>
```

### Layout

```jsx
<div className="container">
  {/* Contenu centré avec max-width: 1200px */}
</div>
```

## 📡 API et Services

### Configuration API

Dans `.env` :

```
REACT_APP_API_URL=http://localhost:3001/api
```

### Utilisation

```jsx
import { getProducts, createSimulation } from '../services/api';

// Récupérer les produits
const products = await getProducts();

// Créer une simulation
const simulation = await createSimulation(data);
```

## 🎯 Hooks personnalisés

### useLocalStorage

```jsx
import { useLocalStorage } from '../hooks';

function MyComponent() {
  const [value, setValue, removeValue] = useLocalStorage('key', defaultValue);
  
  return (
    <button onClick={() => setValue('new value')}>
      Update
    </button>
  );
}
```

### useMediaQuery

```jsx
import { useIsMobile, useIsTablet, useIsDesktop } from '../hooks';

function MyComponent() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

## 🧮 Logique métier

### Calcul de simulation

```jsx
import { generateSimulation } from '../utils/simulation';

const simulation = generateSimulation(formData, productId);
// Retourne: score, primes, économies, ROI, etc.
```

### Calcul des primes

```jsx
import { calculatePrimes } from '../data/regions';

const primes = calculatePrimes('Wallonie', 'panneaux', 8500);
// Retourne: { total, details, finalPrice, tva }
```

## 🔄 Flux de données

### Parcours utilisateur

1. **Accueil** → Découverte
2. **Catalogue** → Sélection produit
3. **Formulaire** → 5 étapes :
   - Profil (Particulier/Société)
   - Région (Wallonie/Bruxelles/Flandre)
   - Coordonnées
   - Logement/Bâtiment
   - Objectifs
4. **Simulation** → Résultats avec score
5. **Rendez-vous** → Planification

### État de l'application

- **Formulaire** : État local (useState)
- **Simulation** : Passée via navigation state
- **Chatbot** : État local avec messages
- **Navigation** : React Router

## 🧪 Tests (à implémenter)

### Tests unitaires

```bash
npm test
```

### Tests E2E

```bash
npm run test:e2e
```

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

Le build sera dans le dossier `dist/`

### Variables d'environnement

Créer un fichier `.env` basé sur `.env.example`

## 📝 Convention de code

### Naming

- **Composants** : PascalCase (`MyComponent.jsx`)
- **Fichiers** : camelCase (`myHelper.js`)
- **CSS** : kebab-case (`.my-class`)
- **Constants** : UPPER_SNAKE_CASE (`API_BASE_URL`)

### Structure des composants

```jsx
import { useState } from 'react';
import './MyComponent.css';

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  const handleAction = () => {
    // Logic
  };

  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### Imports

```jsx
// 1. Bibliothèques externes
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Composants locaux
import MyComponent from './components/MyComponent';

// 3. Hooks
import { useLocalStorage } from './hooks';

// 4. Utilitaires et services
import { api } from './services/api';

// 5. Données et constantes
import { products } from './data/products';

// 6. Styles
import './MyComponent.css';
```

## 🐛 Debugging

### React DevTools

Installer l'extension React DevTools pour Chrome/Firefox

### Console

```jsx
console.log('Debug:', data);
console.error('Error:', error);
console.warn('Warning:', warning);
```

### ErrorBoundary

Les erreurs sont automatiquement capturées par ErrorBoundary

## 📚 Ressources

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Axios](https://axios-http.com/)
