# 🎮 Commandes Utiles - EnergiePlus

## 📦 Installation & Démarrage

```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement
npm run dev
# → Application disponible sur http://localhost:5173

# Build de production
npm run build
# → Fichiers générés dans /dist

# Prévisualiser le build
npm run preview
# → Test du build de production

# Linter le code
npm run lint
# → Vérification Oxlint
```

---

## 🔧 Commandes de développement

### Installer une nouvelle dépendance

```bash
# Dépendance de production
npm install nom-du-package

# Dépendance de développement
npm install -D nom-du-package

# Exemples
npm install moment
npm install -D vitest
```

### Mettre à jour les dépendances

```bash
# Voir les packages obsolètes
npm outdated

# Mettre à jour tous les packages
npm update

# Mettre à jour un package spécifique
npm update react
```

### Nettoyer et réinstaller

```bash
# Supprimer node_modules et package-lock
rm -rf node_modules package-lock.json
# OU sur Windows CMD
rmdir /s /q node_modules
del package-lock.json

# Réinstaller
npm install
```

---

## 🌳 Navigation dans le projet

```bash
# Aller dans le dossier du projet
cd d:\projetS4\FRONT-END-energy-platform

# Lister les fichiers
dir             # Windows CMD
ls              # PowerShell/Linux

# Voir l'arborescence
tree /F /A      # Windows
```

---

## 📝 Git (si utilisé)

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "feat: Initial commit - MVP EnergiePlus v1.0.0"

# Ajouter remote
git remote add origin <url-du-repo>

# Pousser vers GitHub
git push -u origin main

# Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# Voir le status
git status

# Voir l'historique
git log --oneline
```

---

## 🔍 Recherche dans le code

```bash
# Rechercher un terme dans tous les fichiers
grep -r "terme" src/                    # Linux/Mac
findstr /s "terme" src\*                # Windows

# Rechercher dans les fichiers JS/JSX uniquement
grep -r "terme" src/ --include="*.jsx"
```

---

## 📊 Analyser le projet

```bash
# Compter les lignes de code
# Linux/Mac
find src -name "*.jsx" -o -name "*.js" | xargs wc -l

# Taille du projet
du -sh .                    # Linux/Mac
dir /s                      # Windows

# Nombre de fichiers
find src -type f | wc -l    # Linux/Mac
```

---

## 🐛 Debugging

```bash
# Lancer avec les logs détaillés
npm run dev -- --debug

# Nettoyer le cache Vite
rm -rf node_modules/.vite   # Linux/Mac
rmdir /s /q node_modules\.vite  # Windows

# Vérifier les erreurs
npm run lint

# Voir les warnings build
npm run build
```

---

## 🧪 Tests (à implémenter)

```bash
# Installer Vitest
npm install -D vitest

# Lancer les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 📦 Build & Déploiement

### Build local

```bash
# Build de production
npm run build

# Vérifier la taille du build
ls -lh dist/                # Linux/Mac
dir dist                    # Windows

# Tester le build localement
npm run preview
```

### Déploiement Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

### Déploiement Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy

# Déployer en production
netlify deploy --prod
```

---

## 🎨 Personnalisation rapide

### Changer le port de développement

```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 3000,  // Au lieu de 5173
  },
});
```

### Ouvrir automatiquement dans le navigateur

```javascript
// vite.config.js
export default defineConfig({
  server: {
    open: true,  // Ouvre automatiquement
  },
});
```

---

## 📚 Commandes de documentation

```bash
# Générer l'arborescence
tree /F /A > TREE.txt       # Windows

# Lire un fichier
type README.md              # Windows CMD
cat README.md               # Linux/Mac

# Éditer un fichier
code README.md              # VS Code
notepad README.md           # Windows
```

---

## 🔒 Environnement

```bash
# Créer le fichier .env
cp .env.example .env        # Linux/Mac
copy .env.example .env      # Windows

# Éditer les variables
# Puis redémarrer npm run dev
```

---

## 🚀 Commandes rapides essentielles

```bash
# Démarrer en 3 commandes
cd d:\projetS4\FRONT-END-energy-platform
npm install
npm run dev

# Problème ? Réinitialiser
rm -rf node_modules package-lock.json
npm install
npm run dev

# Build pour production
npm run build
npm run preview

# Déployer (exemple Vercel)
npm run build
vercel --prod
```

---

## 💡 Astuces

### Raccourcis clavier dans npm

- `Ctrl + C` : Arrêter le serveur
- `Ctrl + Z` : Suspendre (puis `fg` pour reprendre)

### VS Code

```bash
# Ouvrir le projet dans VS Code
code .

# Formater automatiquement
Shift + Alt + F
```

### Chrome DevTools

- `F12` : Ouvrir DevTools
- `Ctrl + Shift + C` : Inspecter élément
- `Ctrl + Shift + I` : Console

---

## 📝 Scripts personnalisés possibles

Ajouter dans `package.json` :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "oxlint",
    
    // Nouveaux scripts
    "clean": "rm -rf node_modules dist",
    "reset": "npm run clean && npm install",
    "format": "prettier --write \"src/**/*.{js,jsx}\"",
    "analyze": "vite build --mode analyze",
    "deploy": "npm run build && vercel --prod"
  }
}
```

Puis utiliser :

```bash
npm run clean
npm run reset
npm run format
npm run deploy
```

---

## 🎯 Commande ultime de démarrage

```bash
# Tout en une seule ligne (Windows PowerShell)
cd d:\projetS4\FRONT-END-energy-platform; npm install; npm run dev

# Linux/Mac
cd d:\projetS4\FRONT-END-energy-platform && npm install && npm run dev
```

---

## 📞 Aide

**En cas de problème**, vérifier :

1. Node.js installé : `node --version`
2. npm installé : `npm --version`
3. Dépendances installées : `ls node_modules` / `dir node_modules`
4. Port 5173 libre : Changer dans `vite.config.js`

**Documentation** :
- README.md
- QUICK_START.md
- DEVELOPMENT.md

---

**Commandes créées pour : EnergiePlus v1.0.0**  
**Date : 10 août 2026**
