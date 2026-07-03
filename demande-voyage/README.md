# Demande en voyage 💛

Mini-site interactif pour une demande en voyage : elle choisit le lieu, les dates et les activités, puis répond à la grande question. Vanilla JS + GSAP + canvas-confetti, sans framework.

## Démarrer en local

```bash
npm install
npm run dev
```

## Avant de partager le lien : 3 choses à faire

### 1. Ajouter les photos (optionnel mais recommandé)

Le site fonctionne déjà sans photo (jolis dégradés + icônes à la place), mais c'est bien mieux avec de vraies images. Dépose-les dans `public/images/destinations/` — la liste exacte des noms de fichiers attendus est dans `public/images/destinations/README.md`.

Deux nouvelles destinations ont été ajoutées à ta demande, en plus de celles du brief initial, décrites comme sportives (beaucoup de marche) et très proches de la nature :

- **Cirque du Fer à Cheval** — à Sixt-Fer-à-Cheval, Haute-Savoie. Petite précision géographique : c'est dans les **Alpes françaises**, à quelques kilomètres de la frontière suisse (pas dans les Alpes suisses à proprement parler) — je l'ai décrit ainsi pour rester exact.
- **Brèche de Roland** — dans le Cirque de Gavarnie (Hautes-Pyrénées), à 2807 m d'altitude.

Les deux sont marquées d'un badge « 🥾 Sportif · nature » sur leur carte. Si tu préfères n'en garder qu'une, supprime l'entrée correspondante dans `src/data/destinations.js`.

### 2. Activer l'envoi des réponses (pour recevoir sa réponse par email)

Le site est prévu pour **Vercel**, qui n'exécute pas PHP — j'ai donc branché [Web3Forms](https://web3forms.com) (gratuit, zéro serveur à gérer) :

1. Va sur https://web3forms.com, entre `alexy.beauvarlet@gmail.com`, récupère ta clé d'accès (email de confirmation en ~30 secondes).
2. Colle-la dans `src/config.js` → `web3formsAccessKey: "TA_CLE_ICI"`.

Tant que cette clé n'est pas renseignée, le site reste pleinement fonctionnel : à la fin, un bouton « M'envoyer ta réponse par email » (mailto pré-rempli) apparaît à la place.

*(Une version PHP alternative existe dans `api/submit.php`, pour un hébergement mutualisé type Hostinger si tu changes d'avis un jour — elle n'est pas utilisée sur Vercel.)*

### 3. Personnaliser les textes

Tout est dans `src/config.js` : prénoms, fenêtre de dates sélectionnables, texte de la question, message final, et le bouton « Hmm… » qui s'enfuit (`boutonFuyant`, désactivable).

## Déployer sur Vercel

1. Pousse ce repo sur GitHub (déjà fait si tu lis ceci depuis la branche).
2. Sur [vercel.com](https://vercel.com) → **New Project** → importe le repo `capweb`.
3. **Root Directory** : `demande-voyage` (important, le site est un sous-dossier du repo).
4. Framework preset : Vite (détecté automatiquement). Build command `npm run build`, output `dist`.
5. Déploie. Le lien Vercel (ou un domaine perso branché dessus) est ce que tu partages.

## Structure

```
demande-voyage/
├── index.html
├── src/
│   ├── config.js        # tout le personnalisable
│   ├── data/             # destinations + activités
│   ├── steps/             # une étape = un fichier
│   ├── components/        # cartes, calendrier, particules, progression
│   ├── animations/        # timelines GSAP réutilisables
│   └── services/api.js    # envoi Web3Forms + fallback mailto
└── api/submit.php         # alternative PHP (non utilisée sur Vercel)
```
