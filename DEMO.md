# 🎬 Guide de démonstration - EnergiePlus

## Parcours utilisateur

### 📱 Scénario 1 : Simulation directe depuis l'accueil

**Persona** : Sophie, 35 ans, propriétaire d'une maison à Bruxelles

**Parcours** :

1. **Page d'accueil** (`/`)
   - Cliquer sur **"Commencer la simulation"** (bouton principal)

2. **Formulaire** (`/formulaire`)
   
   **Étape 1** - Profil :
   - Sélectionner "Particulier"
   
   **Étape 2** - Région :
   - Sélectionner "Bruxelles"
   
   **Étape 3** - Coordonnées :
   - Nom : Sophie Dubois
   - Email : sophie.dubois@email.com
   - Téléphone : +32 2 123 45 67
   
   **Étape 4** - Logement :
   - Adresse : Avenue Louise 123, 1050 Bruxelles
   - Type : Maison
   - Surface : 180 m²
   - Consommation : 4500 kWh/an
   
   **Étape 5** - Besoins énergétiques :
   - Sélectionner "☀️ Panneaux solaires"
   
   **Étape 6** - Objectifs :
   - ✓ Réduire mes factures
   - ✓ Réduire mon empreinte carbone

3. **Simulation** (`/simulation/xxx`)
   - **Produit recommandé** : Panneaux Solaires Premium 6 kWc
   - **Score attendu** : ~8.5/10
   - **Coût initial** : 8500€
   - **Primes** : ~3500€ (3000€ Bruxelles + 500€ fédéral)
   - **Coût final** : ~5000€
   - **Économies annuelles** : ~1200€/an
   - **ROI** : ~4.2 ans

4. **Rendez-vous** (`/rendez-vous`)
   - Type : Visite technique
   - Date : Choisir une date future
   - Heure : 10:00
   - Confirmer

---

### 🏢 Scénario 2 : Parcours via le catalogue

**Persona** : Marc, intéressé par un produit spécifique

**Parcours** :

1. **Page d'accueil** (`/`)
   - Cliquer sur "Découvrir le catalogue"

2. **Catalogue** (`/catalogue`)
   - Filtrer par "Pompes à chaleur"
   - Sélectionner "Pompe à Chaleur Air-Eau 12 kW"

3. **Détail produit** (`/produit/5`)
   - Consulter les spécifications
   - Cliquer sur "Obtenir ma simulation"

4. **Formulaire** (`/formulaire/5`)
   - Remplir les 6 étapes (produit pré-sélectionné)

5. **Simulation**
   - Résultats personnalisés pour la pompe à chaleur

---

### 🏢 Scénario 3 : Société - Solution complète en Wallonie

**Persona** : Jean, directeur d'une PME en Wallonie

**Parcours** :

1. **Page d'accueil** (`/`)
   - Cliquer sur "Commencer la simulation"

2. **Formulaire** (`/formulaire`)
   
   **Étape 1** - Profil :
   - Sélectionner "Société"
   
   **Étape 2** - Région :
   - Sélectionner "Wallonie"
   
   **Étape 3** - Coordonnées :
   - Raison sociale : TechSolutions SA
   - Numéro TVA : BE0123456789
   - Secteur : Services
   - Email : contact@techsolutions.be
   
   **Étape 4** - Bâtiment :
   - Adresse : Rue de l'Industrie 45, 5000 Namur
   - Surface : 350 m²
   - Consommation : 12000 kWh/an
   
   **Étape 5** - Besoins énergétiques :
   - Sélectionner "⚡ Solution complète"
   
   **Étape 6** - Objectifs :
   - ✓ Réduire mes factures
   - ✓ Valoriser mon bien

3. **Simulation**
   - **Produit recommandé** : Panneaux Solaires Premium (solution complète)
   - **Score attendu** : ~8.0/10
   - **Recommandations personnalisées** pour une solution complète

---

### 💬 Scénario 4 : Utilisation du Chatbot

**Questions à tester** :

1. "Quels sont vos panneaux solaires ?"
   - **Réponse** : Information sur panneaux avec suggestion de consulter catalogue

2. "Combien coûte une batterie ?"
   - **Réponse** : Informations sur batteries avec détails de capacité

3. "Je veux comparer les produits"
   - **Réponse** : Demande de profil et région pour recommandations

4. "Quelles primes pour la Wallonie ?"
   - **Réponse** : Explication sur primes régionales et formulaire

5. "Je veux prendre rendez-vous"
   - **Réponse** : Proposition de planifier un rendez-vous

**Actions rapides à tester** :
- Cliquer sur "Voir le catalogue"
- Cliquer sur "Prendre rendez-vous"
- Cliquer sur "Comparer les produits"

---

## 🎯 Points de démonstration clés

### Design & UX

✅ **Design moderne inspiré Google Material**
- Palette de couleurs cohérente
- Animations fluides
- Cards avec ombres et effets hover
- Transitions smooth entre pages

✅ **Navigation intuitive**
- Menu fixe avec indicateur de page active
- Bouton chatbot flottant toujours accessible
- Fil d'Ariane clair
- CTAs bien visibles

✅ **Responsive Design**
- Parfaitement adapté mobile, tablette, desktop
- Menu burger sur mobile
- Grilles qui s'adaptent
- Textes lisibles sur toutes tailles

### Fonctionnalités

✅ **Formulaire multi-étapes intelligent**
- Progression visuelle claire (5/5 étapes)
- Validation en temps réel
- Champs adaptés selon profil (Particulier/Société)
- Sauvegarde automatique possible (localStorage)

✅ **Simulation personnalisée**
- Score calculé selon profil
- Primes régionales automatiques
- Économies estimées
- ROI calculé
- Recommandations personnalisées

✅ **Chatbot IA**
- Interface chat moderne
- Réponses contextuelles
- Actions rapides
- Historique de conversation

✅ **Système de rendez-vous**
- Choix type (visite/appel)
- Sélection date et créneau
- Confirmation visuelle
- Résumé clair

### Architecture technique

✅ **React moderne**
- Hooks (useState, useEffect, custom hooks)
- React Router pour navigation
- Composants réutilisables
- Structure modulaire claire

✅ **Gestion d'état**
- État local avec useState
- Passage de données via navigation state
- LocalStorage pour persistance
- Context API ready (si besoin)

✅ **Code quality**
- Composants bien structurés
- Séparation des préoccupations
- Utilitaires centralisés
- Constants configuration

---

## 📊 Données de test disponibles

### Produits (6)
- 2 Panneaux solaires (Premium 6kWc, Standard 4kWc)
- 2 Batteries (10kWh, 5kWh)
- 2 Pompes à chaleur (Air-Eau 12kW, Air-Air 5kW)

### Régions (3)
- Wallonie (primes différentes)
- Bruxelles (primes les plus élevées)
- Flandre (primes moyennes)

### Calculs automatiques
- **Score** : 0-10 basé sur profil
- **Primes** : Région + Fédéral
- **ROI** : Coût final / Économies annuelles
- **CO2** : Réduction estimée en tonnes

---

## 🎨 Personnalisations à montrer

### Facile à modifier

1. **Couleurs** : `src/App.css`
   ```css
   --primary-color: #1a73e8;
   --secondary-color: #34a853;
   ```

2. **Produits** : `src/data/products.js`
   ```js
   { id: 7, name: 'Nouveau', price: 9999, ... }
   ```

3. **Primes** : `src/data/regions.js`
   ```js
   primes: { panneaux: { base: 3000 } }
   ```

4. **Textes chatbot** : `src/config/constants.js`

---

## 🚀 Points forts à mettre en avant

### Pour le client

✅ **Expérience utilisateur fluide**
- Parcours intuitif du début à la fin
- Informations claires à chaque étape
- Aide disponible via chatbot

✅ **Personnalisation complète**
- Selon profil (Particulier/Société)
- Selon région (3 régions belges)
- Calculs précis et personnalisés

✅ **Modern & Professional**
- Design inspiré des leaders tech
- Interface épurée et moderne
- Confiance et crédibilité

### Pour les développeurs

✅ **Code maintenable**
- Structure claire et modulaire
- Composants réutilisables
- Documentation complète

✅ **Évolutif**
- Facile d'ajouter produits/régions
- Prêt pour backend API
- Hooks personnalisés disponibles

✅ **Performance**
- Vite pour build ultra-rapide
- Code optimisé
- Lazy loading possible

---

## 📝 Checklist de démo

### Avant de commencer
- [ ] Application lancée (`npm run dev`)
- [ ] Navigateur ouvert sur http://localhost:5173
- [ ] Console développeur ouverte (pour montrer logs)
- [ ] Réseau stable

### Pendant la démo
- [ ] Montrer page d'accueil et design
- [ ] Parcourir le catalogue (filtres)
- [ ] Détail d'un produit
- [ ] Remplir formulaire complet
- [ ] Afficher simulation avec calculs
- [ ] Tester le chatbot
- [ ] Prendre un rendez-vous
- [ ] Montrer responsive (resize browser)

### Points techniques
- [ ] Montrer structure de fichiers
- [ ] Expliquer composants réutilisables
- [ ] Montrer fichiers de données (products, regions)
- [ ] Expliquer calculs (simulation.js)
- [ ] Montrer facilité de personnalisation

---

## 🎬 Script de présentation (5 min)

**0:00-1:00** - Introduction
- "Voici EnergiePlus, une plateforme moderne pour la transition énergétique en Belgique"
- Montrer page d'accueil, design moderne

**1:00-2:30** - Parcours utilisateur
- Naviguer vers catalogue
- Sélectionner un produit
- Commencer formulaire et montrer les 5 étapes

**2:30-3:30** - Simulation
- Montrer résultats avec score
- Expliquer calcul des primes régionales
- Montrer recommandations personnalisées

**3:30-4:30** - Fonctionnalités avancées
- Tester chatbot avec questions
- Montrer système de rendez-vous
- Démontrer responsive design

**4:30-5:00** - Architecture & Conclusion
- Montrer structure code
- Expliquer facilité de personnalisation
- Questions & discussion

---

Bonne démonstration ! 🚀
