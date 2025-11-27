# 🎅 Secret Santa – Web App (React + GitHub Pages)

### Une petite application web de tirage au sort pour organiser un Secret Santa, entièrement gratuite, hébergée sur GitHub Pages, et utilisable depuis n’importe quel téléphone.

### L’organisateur prépare un tirage, les participants rejoignent via un code, et chacun découvre à qui il doit offrir un cadeau grâce à une animation de flip card façon Apple.

## ✨ Fonctionnalités principales
### 👩‍💼 Espace Organisateur
 
- Créer un nouveau tirage

- Ajouter / supprimer des participants

- Option “règle des couples” (certains participants ne peuvent pas se tirer entre eux)

- Génération d’un code unique pour le tirage

- Partage facile : code + QR Code

### 🎁 Espace Participant

- Accéder à un tirage via le code

- Sélectionner son nom

- Découvrir son destinataire à travers :

- une carte animée “flip card” 3D

- une révélation élégante et festive

## 🌟 UI & UX

- Design thème Noël : rouge, vert, doré

- Animations fluides et transitions façon Apple

- Composants responsive, mobile-first

- Effets visuels : neige légère, ombres douces, glow

## ⚙️ Technique

- React (Vite)

- Routing SPA compatible GitHub Pages

- Stockage simple (localStorage)

- Déployé automatiquement sur GitHub Pages

## 🚀 Déploiement GitHub Pages
>1. Installer les dépendances
   `npm install`

> 2. Lancer en local
  ``npm run dev``

> 3. Build pour production
   ``npm run build``

> 4. Déployer sur GitHub Pages
>
>Selon ton setup :
>
>Si tu utilises gh-pages :
``npm run deploy``
>
>Sinon, via GitHub Actions

>Assure-toi d’avoir dans .github/workflows/ un fichier du type deploy.yml configuré pour les apps React sur Pages.

>📁 Structure du projet

/ <br>
├─ src/ <br>
│  ├─ components/ <br>
│  ├─ pages/ <br>
│  ├─ hooks/ <br>
│  ├─ utils/ <br>
│  ├─ styles/ <br>
│  └─ App.jsx / App.tsx <br>
│ <br>
├─ public/ <br>
├─ package.json <br>
├─ README.md <br>
└─ vite.config.js <br>

## 🔐 Stockage des tirages

>Encodage JSON dans l’URL (optionnel)
Idéal pour les petits tirages et une app totalement stateless.

## 🎨 Design & Animations

La web app utilise :

- Effets spring pour le flip card

- Légère 3D

- Couleurs et textures festives

- UI mobile-first

- Petite texture de fond (flocons en transparence)

## 🎅 Exemple de flow

1. L'organisateur crée un tirage

2. Il ajoute les participants

3. Il active ou non la règle des couples

4. Il obtient un code de tirage

5. Il partage le code (ou le QR Code)

6. Chaque participant ouvre l’app

7. Il saisit le code, choisit son nom

8. Une carte apparaît → il appuie dessus

9. Flip → la personne à qui offrir le cadeau est révélée 🎁

## 🛠️ Scripts utiles

| Commande          | Action                                 |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Lance l’environnement de développement |
| `npm run build`   | Build production                       |
| `npm run deploy`  | Déploiement GitHub Pages               |
| `npm run preview` | Aperçu du build local                  |



## 📜 Licence

MIT — libre d’utilisation et de modification.