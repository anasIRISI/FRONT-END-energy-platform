# EnergiePlus - Plateforme Énergie Belgique

Application web React pour la transition énergétique en Belgique (Particuliers & Sociétés).

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

## 📁 Structure du projet

```
src/
├── components/
│   ├── Layout/         # Layout principal avec Header/Footer
│   ├── Navbar/         # Navigation
│   ├── Footer/         # Pied de page
│   └── Chatbot/        # Assistant IA intégré
├── pages/
│   ├── Home/           # Page d'accueil
│   ├── Catalogue/      # Liste des produits
│   ├── ProductDetail/  # Détail d'un produit
│   ├── Formulaire/     # Formulaire multi-étapes
│   ├── Simulation/     # Résultats de simulation
│   └── RendezVous/     # Prise de rendez-vous
├── App.jsx             # Routes principales
├── App.css             # Styles globaux
└── main.jsx            # Point d'entrée
```

## ⚡ Fonctionnalités

- ✅ Navigation fluide avec React Router
- ✅ Formulaire multi-étapes (5 étapes)
- ✅ Chatbot IA intégré
- ✅ Simulation avec calcul de primes régionales
- ✅ Système de prise de rendez-vous
- ✅ Design responsive (mobile-first)
- ✅ Animations et transitions fluides
- ✅ Support des 3 régions belges (Wallonie, Bruxelles, Flandre)

## 🎨 Technologies

- React 19
- React Router v7
- Vite 8
- Material-UI
- Bootstrap 5
- Axios pour les API

## 🌍 Régions supportées

- **Wallonie** : Primes et réglementations wallonnes
- **Bruxelles** : Primes et réglementations bruxelloises
- **Flandre** : Primes et réglementations flamandes

## 👥 Profils utilisateurs

- **Particuliers** : Pour habitations personnelles
  - Type de logement (maison/appartement)
  - Surface habitable
  - Consommation électrique
  
- **Sociétés** : Pour bâtiments professionnels
  - Raison sociale
  - Numéro TVA
  - Secteur d'activité

## 📦 Produits disponibles

1. **Panneaux photovoltaïques**
   - Premium (6 kWc) - 8500€
   - Standard (4 kWc) - 5500€

2. **Batteries de stockage**
   - 10 kWh - 6500€
   - 5 kWh - 3800€

3. **Pompes à chaleur**
   - Air-Eau (12 kW) - 12000€
   - Air-Air (5 kW) - 4500€

## 🎯 Parcours utilisateur

1. **Page d'accueil** → Découverte de la plateforme
2. **Catalogue** → Consultation des produits
3. **Détail produit** → Spécifications et avantages
4. **Formulaire** → Saisie des informations (5 étapes)
   - Étape 1: Choix du profil (Particulier/Société)
   - Étape 2: Sélection de la région
   - Étape 3: Coordonnées
   - Étape 4: Informations logement/bâtiment
   - Étape 5: Objectifs
5. **Simulation** → Résultats avec score et recommandations
6. **Rendez-vous** → Planification visite technique

## 🤖 Chatbot IA

Assistant intelligent disponible sur toutes les pages :
- Réponses aux questions
- Aide au choix de produits
- Calcul de simulations
- Prise de rendez-vous directe
- Informations sur les primes régionales

## 🔧 Configuration

Le projet utilise :
- **Vite** pour le build et le hot-reload
- **Oxlint** pour le linting
- Configuration dans `vite.config.js` et `.oxlintrc.json`

## 🎨 Design

Inspiré de Google Material Design avec :
- Palette de couleurs cohérente
- Animations fluides (cubic-bezier)
- Cards avec ombres et hover effects
- Responsive design (mobile-first)
- Gradients modernes

## 🚀 Prochaines étapes

- [ ] Intégration API backend
- [ ] Authentification utilisateur
- [ ] Dashboard administrateur
- [ ] Gestion CRM interne
- [ ] Export des données (Excel)
- [ ] Notifications email
- [ ] Paiement en ligne
- [ ] Multi-langue (FR/NL/EN)
