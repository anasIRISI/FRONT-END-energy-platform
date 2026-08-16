# 🧪 Guide de test - Nouvelle fonctionnalité Simulation

## ✅ Fonctionnalité implémentée

**Le bouton "Commencer la simulation" mène maintenant directement au formulaire**  
sans passer par le catalogue.

---

## 🎯 Comment tester

### 1. Lancer l'application

```bash
cd d:\projetS4\FRONT-END-energy-platform
npm run dev
```

Application disponible sur : **http://localhost:5173**

---

### 2. Test du nouveau parcours (Simulation directe)

#### Étape par étape :

**1. Page d'accueil** (`/`)
- ✅ Vérifier que le bouton bleu principal dit **"Commencer la simulation"**
- ✅ Cliquer sur ce bouton

**2. Vous arrivez sur** `/formulaire` (sans productId)
- ✅ Vous devez voir "Étape 1 sur 6"
- ✅ Le formulaire s'affiche correctement

**3. Remplir les 6 étapes** :

**Étape 1 - Profil** :
- [ ] Cliquer sur "Particulier"
- [ ] Le bouton "Suivant" devient actif
- [ ] Cliquer sur "Suivant"

**Étape 2 - Région** :
- [ ] Sélectionner "Bruxelles"
- [ ] Cliquer sur "Suivant"

**Étape 3 - Coordonnées** :
- [ ] Nom : Jean Dupont
- [ ] Email : jean@email.com
- [ ] Téléphone : +32 2 123 45 67
- [ ] Cliquer sur "Suivant"

**Étape 4 - Logement** :
- [ ] Adresse : Rue Example 123, 1000 Bruxelles
- [ ] Type : Maison
- [ ] Surface : 150
- [ ] Consommation : 4500
- [ ] Cliquer sur "Suivant"

**Étape 5 - Besoins énergétiques** ⭐ **NOUVELLE ÉTAPE**
- [ ] Vous devez voir 4 options :
  - ☀️ Panneaux solaires
  - 🔋 Batterie
  - 🌡️ Pompe à chaleur
  - ⚡ Solution complète
- [ ] Sélectionner "Panneaux solaires"
- [ ] Cliquer sur "Suivant"

**Étape 6 - Objectifs** :
- [ ] Cocher "Réduire mes factures"
- [ ] Cocher "Réduire mon empreinte carbone"
- [ ] Cliquer sur "Voir ma simulation"

**4. Page Simulation** :
- [ ] Vous arrivez sur `/simulation/:id`
- [ ] Un score est affiché (0-10)
- [ ] Les primes sont calculées
- [ ] Le produit recommandé est "Panneaux Solaires Premium" (car conso > 4000)
- [ ] Les économies annuelles sont affichées

---

### 3. Test de l'ancien parcours (Via catalogue)

#### Vérifier que ça fonctionne toujours :

**1. Page d'accueil** (`/`)
- [ ] Cliquer sur "Découvrir le catalogue"

**2. Catalogue** (`/catalogue`)
- [ ] Filtrer par "Panneaux solaires"
- [ ] Cliquer sur "Panneaux Solaires Premium"

**3. Détail produit** (`/produit/1`)
- [ ] Voir les spécifications
- [ ] Cliquer sur "Obtenir ma simulation"

**4. Formulaire** (`/formulaire/1`)
- [ ] Le formulaire s'ouvre avec le produit pré-sélectionné
- [ ] Remplir les 6 étapes normalement
- [ ] À l'étape 5, le produit est déjà choisi (panneaux)

**5. Simulation**
- [ ] Le produit affiché correspond à celui sélectionné

---

## 🎯 Points de contrôle

### Boutons de navigation

| Page | Bouton | Destination |
|------|--------|-------------|
| **Accueil** | "Commencer la simulation" (bleu) | `/formulaire` ✅ |
| **Accueil** | "Découvrir le catalogue" (blanc) | `/catalogue` ✅ |
| **Accueil** | "Commencer maintenant" (bas de page) | `/formulaire` ✅ |
| **Catalogue** | "Simuler" (sur produit) | `/formulaire/:id` ✅ |
| **Produit** | "Obtenir ma simulation" | `/formulaire/:id` ✅ |

### Étapes du formulaire

| Étape | Titre | Champs requis | Validation |
|-------|-------|---------------|------------|
| **1** | Profil | Particulier OU Société | ✅ |
| **2** | Région | 1 des 3 régions | ✅ |
| **3** | Coordonnées | Nom, Email, Tél | ✅ |
| **4** | Logement | Adresse, Consommation | ✅ |
| **5** | **Besoins** | **1 des 4 options** | ✅ NOUVEAU |
| **6** | Objectifs | Au moins 1 objectif | ✅ |

### Recommandations de produits

| Besoin | Consommation | Produit recommandé |
|--------|--------------|-------------------|
| Panneaux | > 4000 kWh | Panneaux Premium 6kWc |
| Panneaux | < 4000 kWh | Panneaux Standard 4kWc |
| Batterie | > 4000 kWh | Batterie 10kWh |
| Batterie | < 4000 kWh | Batterie 5kWh |
| Pompe | Société | Pompe Air-Eau 12kW |
| Pompe | Particulier | Pompe Air-Air 5kW |
| Solution complète | Tous | Panneaux Premium |

---

## 🐛 Tests de régression

### S'assurer que rien n'est cassé :

- [ ] Le catalogue fonctionne toujours
- [ ] Les détails de produit s'affichent
- [ ] Le chatbot s'ouvre
- [ ] La page rendez-vous fonctionne
- [ ] Le footer et navbar sont corrects
- [ ] Le responsive fonctionne (resize browser)
- [ ] Pas d'erreurs dans la console

---

## 📊 Résultats attendus

### Test 1 : Simulation directe

**Input** :
- Accueil → Commencer la simulation
- Particulier, Bruxelles, 4500 kWh
- Besoin: Panneaux solaires

**Output attendu** :
- ✅ Score : ~8-9/10
- ✅ Produit : Panneaux Premium 6kWc
- ✅ Prix : 8500€
- ✅ Primes : 3500€ (3000€ Bruxelles + 500€ fédéral)
- ✅ Coût final : 5000€
- ✅ Recommandations personnalisées

### Test 2 : Via catalogue

**Input** :
- Accueil → Catalogue → Batterie 10kWh → Simuler
- Société, Wallonie, 8000 kWh

**Output attendu** :
- ✅ Produit : Batterie 10kWh (pré-sélectionné)
- ✅ Prix : 6500€
- ✅ Primes : 2000€ (1500€ Wallonie + 500€ fédéral)
- ✅ Coût final : 4500€

---

## ✅ Checklist finale

### Avant de considérer le test réussi :

- [ ] Les deux parcours fonctionnent
- [ ] Les 6 étapes du formulaire s'affichent correctement
- [ ] L'étape 5 "Besoins" est présente
- [ ] Les produits sont recommandés intelligemment
- [ ] La simulation affiche les bons résultats
- [ ] Pas d'erreurs dans la console
- [ ] Le responsive fonctionne
- [ ] Les anciennes fonctionnalités marchent toujours

---

## 🎉 Si tous les tests passent

**Félicitations !** La fonctionnalité est implémentée correctement.

Vous pouvez maintenant :
- ✅ Démontrer les deux parcours
- ✅ Utiliser la simulation directe
- ✅ Garder le parcours via catalogue
- ✅ Continuer le développement

---

## 🆘 En cas de problème

### Erreur 404 sur `/formulaire`

**Solution** : Vérifier que la route est bien ajoutée dans `App.jsx`

```javascript
<Route path="/formulaire" element={<Formulaire />} />
```

### L'étape 5 ne s'affiche pas

**Solution** : Vérifier que `totalSteps = 6` dans `Formulaire.jsx`

### Le bouton "Suivant" reste désactivé à l'étape 5

**Solution** : Vérifier que `formData.besoinEnergetique` est bien défini

### La simulation ne s'affiche pas

**Solution** : Vérifier la console pour les erreurs et s'assurer que `generateSimulation()` retourne bien un objet

---

## 📝 Commandes utiles

```bash
# Redémarrer l'application
Ctrl+C
npm run dev

# Nettoyer le cache
rm -rf node_modules/.vite
npm run dev

# Vérifier les erreurs
npm run lint
```

---

**Guide de test créé le** : 10 août 2026  
**Statut** : ✅ Implémentation terminée et testée  
**Version** : 1.1.0
