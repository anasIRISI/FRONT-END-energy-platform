# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2026-08-10

### ✨ Ajouté

#### Pages
- **Page d'accueil** avec hero section, features, produits et CTA
- **Catalogue de produits** avec filtres par catégorie (panneaux, batteries, pompes)
- **Page détail produit** avec specs complètes et avantages
- **Formulaire multi-étapes** (5 étapes) pour simulation personnalisée
- **Page simulation** avec score, calcul primes et recommandations
- **Page rendez-vous** pour planification visite technique

#### Composants
- **Layout** avec header, footer et container
- **Navbar** responsive avec menu mobile
- **Footer** avec liens et informations
- **Chatbot** IA intégré avec bouton flottant
- **ProductCard** réutilisable
- **Loading** spinner pour états de chargement
- **ErrorBoundary** pour gestion d'erreurs globale

#### Fonctionnalités
- **Navigation** fluide avec React Router v7
- **Formulaire intelligent** adapté selon profil (Particulier/Société)
- **Calcul automatique** des primes régionales (Wallonie, Bruxelles, Flandre)
- **Score personnalisé** basé sur consommation et objectifs
- **Recommandations** générées selon profil utilisateur
- **Chatbot contextuel** avec réponses adaptées
- **Système de RDV** avec sélection date/heure

#### Données
- **6 produits** : 2 panneaux, 2 batteries, 2 pompes à chaleur
- **3 régions** avec primes spécifiques
- **Calculs automatiques** : ROI, économies, CO2

#### Architecture
- **Hooks personnalisés** : useLocalStorage, useMediaQuery
- **Utilitaires** : calculs simulation, helpers, validation
- **Services** : API client avec Axios, analytics
- **Configuration** : constantes centralisées
- **Structure modulaire** avec exports centralisés

#### Design
- **Material Design** inspiré de Google
- **Responsive** : mobile, tablette, desktop
- **Animations** fluides avec transitions CSS
- **Palette cohérente** : bleu, vert, jaune, rouge
- **Typographie** moderne avec Inter font

#### Documentation
- **README.md** - Vue d'ensemble du projet
- **DEVELOPMENT.md** - Guide développeur complet
- **QUICK_START.md** - Démarrage rapide
- **DEMO.md** - Scénarios de démonstration
- **CHANGELOG.md** - Historique des versions

### 🛠️ Technique

- React 19.2.8
- React Router 7.18.2
- Vite 8.2.0
- Axios 1.19.0
- Material-UI 9.2.0
- Bootstrap 5.3.8
- Oxlint pour linting

### 📦 Fichiers principaux

```
src/
├── components/      # 7 composants réutilisables
├── pages/          # 6 pages complètes
├── data/           # 2 fichiers de données
├── services/       # API + Analytics
├── utils/          # Helpers + Simulation
├── hooks/          # 2 hooks personnalisés
├── config/         # Configuration centralisée
└── styles/         # CSS modulaire
```

### 🎨 Features UX/UI

- Navigation sticky avec indicateur page active
- Formulaire avec progression visuelle (5/5)
- Cards avec hover effects et ombres
- Chatbot avec historique conversation
- Simulation avec score circulaire animé
- RDV avec confirmation visuelle
- Loading states partout
- Error boundaries pour stabilité

### 🌍 Multi-région

- Support complet Wallonie, Bruxelles, Flandre
- Primes adaptées par région
- Calculs automatiques région-spécifiques
- TVA réduite (6%) incluse

### 📱 Responsive

- Mobile-first approach
- Breakpoints : 768px, 1024px
- Menu burger sur mobile
- Grids adaptatifs
- Touch-friendly

### ♿ Accessibilité

- Aria labels sur boutons
- Navigation clavier
- Contraste couleurs conforme
- Textes alternatifs
- Structure sémantique HTML

---

## [À venir] - Roadmap

### Version 1.1.0 (Q4 2026)

#### Backend & API
- [ ] Connexion API REST backend
- [ ] Authentification JWT
- [ ] Base de données MongoDB/PostgreSQL
- [ ] CRUD produits via admin

#### Fonctionnalités
- [ ] Espace utilisateur avec dashboard
- [ ] Historique des simulations
- [ ] Sauvegarde favoris
- [ ] Comparateur de produits
- [ ] Export PDF simulation

#### CRM & Admin
- [ ] Dashboard administrateur
- [ ] Gestion des RDV
- [ ] Suivi des leads
- [ ] Export Excel/CSV
- [ ] Statistiques avancées

### Version 1.2.0 (Q1 2027)

#### Paiement & Financement
- [ ] Intégration Stripe/Mollie
- [ ] Simulation financement
- [ ] Acompte en ligne
- [ ] Devis téléchargeables

#### Communication
- [ ] Emails automatiques (Nodemailer)
- [ ] SMS confirmations
- [ ] Newsletter
- [ ] Notifications push

#### Multi-langue
- [ ] Interface FR/NL/EN
- [ ] i18n avec react-i18next
- [ ] Contenu traduit

### Version 2.0.0 (Q2 2027)

#### IA & Intelligence
- [ ] Chatbot IA avancé (OpenAI/Claude)
- [ ] Recommandations ML
- [ ] Prédiction consommation
- [ ] Analyse satellite toiture

#### Mobile App
- [ ] Application React Native
- [ ] iOS et Android
- [ ] Notifications mobiles

#### Intégrations
- [ ] Google Maps pour localisation
- [ ] Météo pour prédictions
- [ ] Cadastre pour surface toiture
- [ ] API prix énergie temps réel

---

## Notes de version

### [1.0.0] - Version initiale

**Objectif** : MVP complet et fonctionnel

**Réalisations** :
✅ Toutes les pages principales développées
✅ Parcours utilisateur de bout en bout
✅ Calculs de simulation opérationnels
✅ Design moderne et responsive
✅ Code bien structuré et documenté
✅ Prêt pour démonstration client

**Limitations connues** :
⚠️ Données produits en dur (pas de backend)
⚠️ Pas d'authentification utilisateur
⚠️ Pas de persistance serveur
⚠️ Pas d'emails automatiques
⚠️ Chatbot avec réponses fixes (pas d'IA réelle)

**Prochaines priorités** :
🎯 Backend API Node.js/Express
🎯 Base de données
🎯 Authentification
🎯 CRM interne
🎯 Emails automatiques

---

## Maintenance

### Commits
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, CSS
- `refactor`: Refactoring code
- `test`: Ajout/modification tests
- `chore`: Tâches de maintenance

### Versions
- **MAJOR** : Changements incompatibles API
- **MINOR** : Ajout fonctionnalités compatibles
- **PATCH** : Corrections de bugs

---

**Dernière mise à jour** : 10 août 2026
