# Site vitrine — VPS – Vigilance Protection Sécurité

Site statique multipage en HTML, CSS et JavaScript simples : aucun serveur, aucune base de données, aucune bibliothèque ni ressource externe (la police de caractères est hébergée avec le site). Il fonctionne en local et pourra être publié plus tard sur **GitHub Pages** avec votre nom de domaine.

Le site existe en **français** (racine du site) et en **anglais** (dossier `en/`) : un bouton **FR / EN** en haut de chaque page mène à la même page dans l'autre langue.

> **Presque prêt.** Il reste à ajouter l'**adresse e-mail** (dans `config/infos-vps.ini`) et les **photos de la galerie** (section 6). Jusqu'à la mise en ligne :
> - le **formulaire de devis est inactif** tant qu'aucun service de réception n'est branché (section 8) : rien ne peut être envoyé et la page l'indique clairement ;
> - chaque page contient une balise **`noindex`** qui empêche son référencement (à lever le jour de la mise en ligne, section 9).
>
> **Les informations manquantes (téléphone, e-mail, zone d'intervention, mentions légales…) se renseignent dans un seul fichier : `config/infos-vps.ini`. Enregistrez-le, puis actualisez la page (F5) : rien à installer, rien à lancer** — voir [section 5](#5-modifier-les-textes).
>
> Liste complète : [section 11](#11-liste-de-vérification-avant-publication).

## Sommaire

1. [Arborescence](#1-arborescence)
2. [Tester le site en local](#2-tester-le-site-en-local)
3. [Le design](#3-le-design)
4. [Informations officielles déjà intégrées](#4-informations-officielles-déjà-intégrées)
5. [Modifier les textes](#5-modifier-les-textes)
6. [Photos, logo et visuels](#6-photos-logo-et-visuels)
7. [Prestations et références](#7-prestations-et-références)
8. [Activer la réception des demandes de devis](#8-activer-la-réception-des-demandes-de-devis)
9. [Référencement](#9-référencement)
10. [Publier plus tard sur GitHub Pages avec votre domaine](#10-publier-plus-tard-sur-github-pages-avec-votre-domaine)
11. [Liste de vérification avant publication](#11-liste-de-vérification-avant-publication)
12. [Sécurité et données](#12-sécurité-et-données)

---

## 1. Arborescence

```text
site-vps/
├── index.html               Accueil
├── entreprise.html          L'entreprise
├── prestations.html         Prestations
├── galerie.html             Galerie (carrousel de photos)
├── devis.html               Demande de devis professionnel
├── contact.html             Contact
├── mentions-legales.html    Mentions légales
├── confidentialite.html     Politique de confidentialité
├── 404.html                 Page « introuvable », bilingue (affichée par GitHub Pages)
├── en/                      VERSION ANGLAISE : index, company (L'entreprise), services (Prestations),
│                            gallery (Galerie), quote (Devis), contact,
│                            legal-notice (Mentions légales), privacy (Confidentialité)
├── favicon.ico              Icône d'onglet (tirée du logo)
├── robots.txt · sitemap.xml Fichiers pour les moteurs de recherche (pages françaises et anglaises)
├── _config.yml              Exclut README.md et outils/ du site publié
├── README.md                Ce guide
├── config/infos-vps.ini     LE fichier à remplir : coordonnées, mentions légales, formulaire, textes anglais
├── css/style.css            Mise en forme (couleurs modifiables en haut du fichier)
├── js/main.js               Menu, onglets, carrousel, animations, lecture de config/infos-vps.ini, formulaire
├── fonts/                   Police Geist (+ sa licence libre, licence-geist.txt)
├── images/
│   ├── logo/                logo-vps-160.webp (en-tête), logo-vps-800.webp (référencement), apple-touch-icon.png
│   ├── ambiance/            6 visuels générés par IA : 4 vues de nuit + 2 scènes « sécurité incendie »
│   ├── galerie/             emplacements photo « …-a-remplacer.svg » (versions « …-a-remplacer-en.svg » en anglais)
│   └── partage/             vps-partage.jpg (aperçu lors d'un partage de lien)
└── outils/                  FACULTATIF (Python 3), utile avant la mise en ligne
    ├── preparer_publication.py   Inscrit les informations dans les pages, règle l'indexation et l'adresse du site
    ├── preparer-publication.bat  Raccourci Windows (double-clic) pour l'outil ci-dessus
    └── verifier_site.py          Vérification automatique avant publication
```

**Règle de nommage** : noms de fichiers en minuscules, sans espace ni accent (`equipe-vps.jpg`). GitHub Pages distingue les majuscules : `Photo.JPG` et `photo.jpg` sont deux fichiers différents.

---

## 2. Tester le site en local

**Méthode rapide** : double-cliquez sur `index.html`. Toutes les pages, les images, le menu et le bouton FR / EN fonctionnent (seule la page 404 s'affiche sans mise en forme dans ce mode). Les informations de `config/infos-vps.ini` sont lues dans ce mode aussi ; si le fichier ne peut pas être lu, un bandeau jaune l'indique (uniquement sur votre ordinateur).

**Méthode recommandée** (fonctionnement identique à l'hébergement en ligne) : depuis le dossier du site, lancez

```bash
python -m http.server 8000
```

puis ouvrez <http://localhost:8000>. Sous Windows, utilisez `py -m http.server 8000` si `python` n'est pas reconnu. Arrêt : `Ctrl + C`. L'extension « Live Server » de Visual Studio Code fait la même chose en un clic.

**Vérification automatique** (Python 3, aucune installation) :

```bash
python outils/verifier_site.py                 # liens, images, polices, ancres + points restant à traiter
python outils/verifier_site.py --publication   # contrôle final : échoue s'il reste un point à traiter
```

**Tests manuels conseillés** : bouton FR / EN sur chaque page, menu sur téléphone (bouton « Menu »), navigation au clavier (`Tab`, `Maj + Tab`, `Entrée`, `Échap` pour fermer le menu), carrousel de la galerie, zoom à 200 %, affichage sur un vrai téléphone.

---

## 3. Le design

Direction **« industrielle et éditoriale »**, validée sur maquette et inspirée des grands sites d'entreprises technologiques (sans en reprendre le code, les textes ni les images) :

- **grandes photos plein écran** dans les en-têtes, avec de fins coins de visée ;
- **titres géants**, textes courts, **étiquettes techniques** en police à chasse fixe (`[ 01 ]`, `[ PRESTATIONS ]`) ;
- **filets fins** plutôt que des cadres ;
- accueil : texte qui se révèle mot à mot au défilement, bandeau de secteurs qui défile, colonnes « Ponctuel / Régulier / Événement », **onglets de prestations** avec grande image, section claire « Pourquoi VPS », **FAQ** dépliable, grand appel final sur photo ;
- en-tête transparent qui devient opaque au défilement, **menu plein écran** sur téléphone et tablette ;
- **logo mis en avant** : grand emblème sur l'accueil (section « L'entreprise »), dans « VPS en bref » (page L'entreprise), sur la page Contact, dans le panneau de la demande de devis et dans le pied de page ;
- bouton **FR / EN** dans l'en-tête (ainsi que dans le menu mobile et le pied de page) : il mène à la même page dans l'autre langue ;
- pied de page avec le grand mot « VIGILANCE » et les mentions obligatoires.

**Couleurs**, réglables en haut de `css/style.css` :

| Variable | Couleur | Usage |
|---|---|---|
| `--encre` | `#05080f` | fond principal (bleu nuit presque noir) |
| `--papier` | `#f2f4f7` | textes sur fond sombre, sections claires |
| `--accent` | `#3d8bff` | bleu électrique du logo, sur fond sombre (numéros, onglet actif) |
| `--accent-clair` | `#0769da` | même bleu, sur fond clair |
| `--ambre` | `#e9c47a` | repères provisoires (« À compléter », « À valider ») |

**Typographie** : Geist (police libre, licence SIL Open Font License 1.1, voir `fonts/licence-geist.txt`, hébergée avec le site) et, pour les étiquettes, la police à chasse fixe de l'appareil du visiteur.

**Accessibilité** : contrastes vérifiés, navigation au clavier (menu, onglets, FAQ, carrousel), lien d'évitement, textes alternatifs. Les animations (zoom lent des photos, texte révélé, bandeau défilant, apparitions) sont désactivées si l'appareil demande de réduire les animations, et tous les contenus restent lisibles sans JavaScript.

---

## 4. Informations officielles déjà intégrées

Sources : **autorisation d'exercer délivrée par le CNAPS** (document fourni) et **registres publics des entreprises**. À vérifier sur l'extrait Kbis à jour avant publication.

| Information | Valeur | Où elle apparaît |
|---|---|---|
| Autorisation d'exercer | n° AUT-013-2123-06-12-20240936040 (CNAPS) | pied de page (toutes les pages), accueil, menu mobile, devis, entreprise, mentions légales, image de partage |
| Activité autorisée | Surveillance ou gardiennage | entreprise, prestations, mentions légales |
| Autre activité (indiquée par VPS) | Sécurité incendie | accueil, entreprise, prestations, devis |
| Dénomination | VIGILANCE PROTECTION SECURITE (sigle VPS SECURITE) | pied de page, entreprise, mentions, confidentialité, devis |
| Forme juridique | SAS | entreprise, mentions légales |
| Siège social | 51 rue Sainte, 13001 Marseille | pied de page, entreprise, contact, mentions, confidentialité |
| SIRET (siège) | 929 091 593 00020 | entreprise, mentions légales |
| RCS | Marseille 929 091 593 | mentions, confidentialité |
| TVA intracommunautaire | FR64929091593 | mentions légales |

**Déjà renseignés** dans `config/infos-vps.ini` : téléphone, zone d'intervention, capital social (5 000 € : vérifiez-le sur un Kbis récent, les registres publics consultés indiquaient 100 € puis 1 000 €), directeur de la publication, crédits photos, adresse du site, téléphone de l'hébergeur, durée de conservation des demandes (3 ans à compter du dernier contact, durée indiquée par la CNIL pour les données de prospects), contact pour les données personnelles (adresse du siège) et date de mise à jour des pages légales.

**Reste à compléter** : l'adresse e-mail (même fichier, voir section 5).

**Règles propres à la sécurité privée (code de la sécurité intérieure)** :

- **Article L612-15** : tout document informatif, contractuel ou publicitaire (site, plaquette, publication sur les réseaux sociaux, devis) doit reproduire le **numéro d'autorisation** et le texte de l'**article L612-14** : « L'autorisation d'exercice ne confère aucune prérogative de puissance publique à l'entreprise ou aux personnes qui en bénéficient. » Ces deux mentions figurent dans le pied de page de chaque page : ne les supprimez pas.
- Le même article **interdit** de faire état de la qualité d'ancien fonctionnaire de police ou d'ancien militaire d'un dirigeant ou d'un salarié.
- L'autorisation du CNAPS couvre la **surveillance ou le gardiennage**. La **sécurité incendie** n'est pas une activité soumise à cette autorisation : elle exige des agents titulaires de la qualification SSIAP adaptée au site (SSIAP 1, 2 ou 3, arrêté du 2 mai 2005). L'article L612-2 impose par ailleurs qu'une entreprise de surveillance ou de gardiennage ne propose que des prestations liées à ces activités : faites confirmer que vos missions de sécurité incendie s'inscrivent dans ce cadre.
- Le logo représente des drones : n'annoncez pas de surveillance par drone, de protection rapprochée ou de télésurveillance sans avoir vérifié que VPS dispose des autorisations correspondantes.

---

## 5. Modifier les textes

### Les informations manquantes : un seul fichier à remplir

Inutile de modifier les pages une par une : les informations ci-dessous se renseignent **une seule fois** dans `config/infos-vps.ini`, et le site les affiche partout (pied de page, contact, mentions légales, confidentialité, devis…), en français et en anglais.

1. Ouvrez `config/infos-vps.ini` avec le Bloc-notes (clic droit › Ouvrir avec › Bloc-notes) ou avec Visual Studio Code.
2. Écrivez chaque valeur après le signe `=`, par exemple `telephone = 04 91 00 00 00`, puis enregistrez (`Ctrl + S`).
3. Actualisez la page du site dans le navigateur (touche `F5`). C'est tout : **rien à installer, rien à lancer**.

Le site relit ce fichier à chaque affichage, qu'il soit ouvert par double-clic ou publié en ligne. Deux règles :

- ne modifiez pas la **toute première** ni la **toute dernière** ligne du fichier : ce sont des lignes techniques qui permettent au navigateur de le lire ;
- n'utilisez pas le caractère « accent grave » seul (touches `AltGr + 7`).

Si le fichier ne peut pas être lu, ou si une valeur est invalide (e-mail mal écrit, par exemple), un **bandeau jaune** l'indique en bas de la page. Il n'apparaît que sur votre ordinateur, lorsque le site est ouvert par double-clic, jamais en ligne ; les informations déjà inscrites dans les pages restent affichées.

| Information | Clé dans le fichier | Où elle apparaît |
|---|---|---|
| Téléphone | `telephone` | pied de page (toutes les pages), contact, mentions légales |
| E-mail | `email` | pied de page, contact, mentions légales, lien e-mail sur la page devis |
| Zone d'intervention | `zone_intervention` | accueil (FAQ), entreprise, contact |
| Présentation de l'entreprise (facultatif) | `presentation` | entreprise (rien ne s'affiche si elle est vide) |
| Capital social | `capital_social` | mentions légales |
| Directeur de la publication | `directeur_publication` | mentions légales |
| Durée de conservation | `duree_conservation` | devis, confidentialité |
| Contact données personnelles | `contact_donnees` | confidentialité |
| Téléphone de l'hébergeur | `hebergeur_telephone` | mentions légales |
| Crédits photos | `credits_photos` | mentions légales |
| Date de mise à jour | `date_mise_a_jour` | mentions légales, confidentialité |
| Adresse du site | `adresse_site` | adresses de référence, partage, `sitemap.xml`, `robots.txt` (appliquée par l'outil de préparation) |
| Référencement | `indexation` (`non` / `oui`) | balise `robots` de chaque page (appliquée par l'outil de préparation) |
| Formulaire de devis | `adresse_reception`, `mode_envoi` | `devis.html` et `en/quote.html` (active le formulaire) |
| Textes des pages anglaises | section `[version_anglaise]` | pages du dossier `en/` |

Bon à savoir :

- vider une valeur fait réapparaître le repère « À compléter » ;
- la section `[version_anglaise]` reçoit la traduction des textes (zone d'intervention, présentation, capital social, directeur de la publication…) ; une ligne vide reprend le texte français ; une date écrite « 5 novembre 2026 » est traduite automatiquement ;
- le fichier est publié avec le site : n'y écrivez que des informations publiques, jamais de mot de passe ni de clé secrète.

**Avant la mise en ligne (facultatif)** : l'outil `outils/preparer_publication.py` inscrit aussi ces informations directement dans le code des pages (utile au référencement, et affichées même si le fichier ne pouvait pas être lu), règle l'indexation et reporte l'adresse définitive du site. Il demande Python 3 (gratuit sur python.org) : double-cliquez sur `outils\preparer-publication.bat`, ou lancez `python outils/preparer_publication.py` depuis le dossier du site. Sans Python, le raccourci affiche simplement un message : ce n'est pas bloquant. Les informations renseignées au 5 novembre 2026 ont déjà été inscrites dans les pages.

Les autres contenus (textes de présentation des prestations, références, légendes des photos, paragraphes juridiques à faire valider) se modifient directement dans les pages, comme expliqué ci-dessous.

Chaque page correspond à un fichier HTML (les pages anglaises sont dans le dossier `en/`). Ouvrez-le avec un éditeur de texte (Visual Studio Code recommandé, ou le Bloc-notes), **jamais avec Word**.

### Repères visibles sur les pages

| Sur la page | Dans le code | Que faire |
|---|---|---|
| Texte entre crochets `[À compléter …]` | `<span class="a-completer">[À compléter]</span>` | Remplacer **toute la balise** par le texte réel |
| Encadré d'avertissement ou d'information | `<div class="note …">…</div>` | Supprimer ou adapter une fois le point réglé |

Exemple :

```html
<!-- Avant -->
<span class="coord-valeur"><span class="a-completer a-completer--court">[À compléter]</span></span>
<!-- Après (numéro réel, cliquable sur téléphone) -->
<span class="coord-valeur"><a href="tel:+33XXXXXXXXX">0X XX XX XX XX</a></span>
```

### Menu et pied de page

Ils sont **répétés dans les 19 pages HTML** (10 en français, 9 en anglais). Toute modification doit être faite dans chaque fichier : utilisez « Rechercher et remplacer dans les fichiers » (Visual Studio Code : `Ctrl + Maj + H`).

### Titres et descriptions

Balises `<title>` et `<meta name="description">` en haut de chaque page (ainsi que `og:title` et `og:description` pour les partages). Visez moins de 60 caractères pour le titre et environ 150 pour la description.

### Version anglaise (bouton FR / EN)

- Les pages anglaises sont dans le dossier `en/` : `index.html` (accueil), `company.html` (L'entreprise), `services.html` (Prestations), `gallery.html` (Galerie), `quote.html` (Devis), `contact.html`, `legal-notice.html` (Mentions légales) et `privacy.html` (Confidentialité).
- Le bouton **FR / EN** de l'en-tête, ainsi que le lien du menu mobile et du pied de page, mène à la même page dans l'autre langue. Les moteurs de recherche sont informés du lien entre les deux versions (balises `hreflang`).
- **Toute modification de texte se fait dans les deux langues** : un nom de référence retiré de `index.html` doit aussi l'être de `en/index.html`.
- Les informations de `config/infos-vps.ini` sont communes aux deux langues : rien à saisir en double, sauf la traduction facultative de la section `[version_anglaise]`.
- Les pages légales anglaises sont des traductions informatives : elles précisent que la version française fait foi. La mention de l'article L612-14 y figure en français, suivie de sa traduction.
- Faites relire les textes anglais par une personne à l'aise avec l'anglais professionnel avant publication.

---

## 6. Photos, logo et visuels

### Visuels d'ambiance et visuels « sécurité incendie »

Les 6 images du dossier `images/ambiance/` ont été **générées par intelligence artificielle** pour illustrer le site :

- **4 photos aériennes de nuit** (sites, bureaux, commerces, événements) : elles ne montrent ni l'équipe, ni les sites, ni les clients de VPS (aucune personne reconnaissable, aucun logo). Vous avez choisi de les conserver : la mention « Visuel d'ambiance provisoire » a été retirée le 6 novembre 2026 ;
- **2 visuels « sécurité incendie »** (ajoutés le 9 novembre 2026) : un agent en tenue « SÉCURITÉ INCENDIE » devant le tableau du système de sécurité incendie (SSI), et une ronde de contrôle d'un extincteur et d'un robinet d'incendie armé. Les agents représentés ne sont pas des membres de l'équipe VPS (visages non visibles, aucun logo) : vous pourrez les remplacer par de vraies photos de vos agents, avec leur accord.

Pour changer une image, enregistrez la nouvelle photo **sous le même nom** dans `images/ambiance/`.

| Fichier | Utilisé dans |
|---|---|
| `zone-logistique-nuit.jpg` | en-tête de l'accueil, onglet « Sites & entrepôts », appel final (accueil, galerie), en-tête Demande de devis, page 404 |
| `parc-bureaux-nuit.jpg` | en-têtes L'entreprise et Contact, appel final (L'entreprise), prestation « Surveillance » |
| `zone-commerciale-nuit.jpg` | onglet « Commerces », en-tête et appel final Prestations, prestation « Prévention en magasin » |
| `marche-nuit.jpg` | onglet « Événements », prestation « Sécurité événementielle » |
| `incendie-poste-ssi.jpg` | onglet « Sécurité incendie » de l'accueil |
| `incendie-ronde-extincteurs.jpg` | prestation « Sécurité incendie » |

Les pages anglaises utilisent les mêmes images.

**Format conseillé** pour une photo de remplacement : JPG, environ 1600 à 2400 px de large, moins de 400 Ko, image plutôt sombre, sujet au centre (le titre s'affiche en haut et les boutons en bas). Les vues de nuit sont décoratives : laissez `alt=""`. Les deux visuels « sécurité incendie » sont décrits (attribut `alt`) : si vous les remplacez, adaptez cette description dans `index.html`, `prestations.html` et leurs versions anglaises, et ajustez au besoin leur cadrage (règles `.visuel-incendie-ssi` et `.visuel-incendie-ronde` de `css/style.css`).

### Galerie

Dans `galerie.html` (et `en/gallery.html` pour l'anglais), chaque photo est un bloc `<li> … </li>` du carrousel. Pour remplacer un emplacement, dans les deux pages :

1. recadrez la photo au format 3:2 (par exemple 1800 × 1200 px), compressez-la et copiez-la dans `images/galerie/` ;
2. remplacez `src`, puis décrivez précisément la photo dans `alt` (exemple : `alt="Trois agents VPS en tenue devant l'entrée d'un magasin"`) et mettez à jour `width` et `height` ;
3. adaptez si besoin le titre affiché sous la photo ;
4. supprimez les fichiers `…-a-remplacer.svg` et `…-a-remplacer-en.svg` devenus inutiles.

Pour **ajouter** une photo, dupliquez un bloc `<li> … </li>` complet : le compteur du carrousel se met à jour tout seul.

### Logo

Le logo officiel fourni est intégré (détouré en cercle) et **mis en avant** sur l'accueil, la page L'entreprise, la demande de devis, la page Contact et le pied de page : `images/logo/logo-vps-160.webp` (en-tête), `logo-vps-800.webp` (données de référencement), `favicon.ico` et `apple-touch-icon.png` (icônes), `images/partage/vps-partage.jpg` (aperçu de partage). Pour une nouvelle version du logo, remplacez ces fichiers **sous les mêmes noms et aux mêmes dimensions**.

### Avant de publier une photo

- Accord écrit de chaque personne reconnaissable (droit à l'image), salariés compris.
- Plaques d'immatriculation, adresses, badges, documents, écrans, visages de passants : masquer ou flouter si nécessaire.
- Photo d'un site : accord de son exploitant et aucun élément sensible visible (caméras, accès techniques, alarmes, consignes affichées).
- Crédit photo à indiquer dans les mentions légales.
- Jamais de logo de client ou de partenaire sans son autorisation écrite.

---

## 7. Prestations et références

### Prestations (intitulés provisoires « à confirmer »)

Dans `prestations.html` (et `en/services.html`), chaque prestation est un bloc `<article class="service" id="…">` : modifiez le titre, la description et la liste « Pour qui ? ». Supprimez les blocs qui ne correspondent pas à l'activité de VPS, ainsi que leur lien dans l'accès rapide en haut de page. Mettez aussi à jour :

- les **onglets « Prestations »** (quatre onglets, dont « Sécurité incendie ») et les colonnes « Comment nous intervenons » des deux pages d'accueil (les liens « En savoir plus » pointent vers les `id` des blocs) ;
- la liste « Besoin » du formulaire (`<select id="besoin">` dans `devis.html` et `en/quote.html`).

**Sécurité incendie** : prestation ajoutée le 5 novembre 2026 et validée par VPS le 6 novembre 2026.

### Références

La page Références a été supprimée le 6 novembre 2026. Les noms restent affichés dans le bandeau « Références » de l'accueil (`index.html` et `en/index.html`, un nom par ligne `<li>`) : Auchan, Carrefour Market, Intermarché, Foire aux santons, Foncia, IGH, Pharmacie Totum, Cabesto, Q-Park. Conservez l'accord écrit de chaque organisation citée. Aucun logo de client n'est utilisé : il faudrait l'autorisation écrite du titulaire de la marque.

---

## 8. Activer la réception des demandes de devis

**Pourquoi le formulaire est inactif** : GitHub Pages héberge uniquement des fichiers statiques ; il ne peut ni recevoir ni stocker un formulaire. Deux possibilités :

- **A.** brancher un service externe de réception de formulaires (ci-dessous) ;
- **B.** laisser le formulaire inactif et afficher seulement de vraies coordonnées, voire supprimer le formulaire.

**État actuel** : `adresse_reception` est vide dans `config/infos-vps.ini` (et l'attribut `data-adresse-reception=""` est vide dans `devis.html` et `en/quote.html`). Le script garde donc le formulaire inactif : avertissement visible, bouton désactivé (« Envoi désactivé : formulaire non actif »), aucune donnée envoyée et aucune fausse confirmation possible.

### Option A — étapes

1. **Choisir un service** compatible avec les sites statiques (par exemple Formspree, Web3Forms, Basin ou Getform). Comparez : localisation des données et conformité au RGPD (contrat de sous-traitance), limites de l'offre gratuite, protection anti-spam, notifications par e-mail, prix.
2. **Créer le formulaire** dans ce service avec l'adresse e-mail professionnelle réelle qui recevra les demandes. Le service fournit une adresse d'envoi, par exemple pour Formspree : `https://formspree.io/f/xxxxxxxx`.
3. **Coller cette adresse** dans `config/infos-vps.ini` (`adresse_reception = https://formspree.io/f/xxxxxxxx`), puis actualiser la page : le formulaire s'active aussitôt, sur `devis.html` comme sur `en/quote.html`. Avant la mise en ligne, l'outil de préparation (section 5) l'inscrit aussi dans le code :

   ```html
   <form class="formulaire" id="formulaire-devis" method="post"
         data-adresse-reception="https://formspree.io/f/xxxxxxxx"
         data-mode-envoi="ajax" novalidate>
   ```

   Le script masque alors l'avertissement, active le bouton, vérifie les champs (obligatoires, e-mail, téléphone) et n'affiche « Votre demande a bien été envoyée » **que si le service confirme la réception**.
4. **Mode d'envoi** (`mode_envoi` dans le même fichier) : `ajax` (par défaut, message affiché sur la page ; le service doit répondre en JSON, comme Formspree) ou `classique` (le navigateur affiche la page de confirmation du service).
5. **Anti-spam** : le champ caché `_gotcha` et le champ `_subject` suivent la convention de Formspree ; adaptez-les à la documentation du service choisi.
6. **Tester** depuis le serveur local puis en ligne : envoyez une demande de test, vérifiez sa réception, puis testez un échec (connexion coupée) pour voir le message d'erreur.
7. **Mettre à jour** la politique de confidentialité (destinataire : nom et pays du service, transfert éventuel hors UE, durée de conservation) et l'encadré « Utilisation de vos données » de `devis.html`.
8. **Désactiver** à tout moment : videz `adresse_reception` (et relancez l'outil de préparation si vous l'aviez utilisé).

**Lien e-mail** : il s'affiche automatiquement (pied de page, contact, mentions légales et avertissement de la page devis) dès que `email` est renseigné dans `config/infos-vps.ini`. Tant qu'il est vide, aucun lien e-mail n'apparaît.

**Secrets** : l'adresse d'envoi d'un service de formulaire est publique par nature, c'est normal. En revanche, ne placez jamais de clé d'API, de mot de passe ou de jeton secret dans le code.

---

## 9. Référencement

**Déjà en place** : titre et description propres à chaque page (avec « Marseille »), adresse canonique, balises de partage (Open Graph) et image de partage, données structurées « Organization » sur l'accueil (nom, adresse, SIRET), `sitemap.xml`, `robots.txt`, langues déclarées (français et anglais) avec liens `hreflang` entre les deux versions, pages légères sans ressource externe.

**Avant publication** :

1. L'adresse `https://www.vps-securite.fr` est déjà inscrite partout (pages, `sitemap.xml`, `robots.txt`). Vérifiez que ce nom de domaine est bien réservé au nom de VPS. S'il change, modifiez `adresse_site` puis lancez l'outil de préparation.
2. Quand tout est complété et validé, passez `indexation = oui` dans `config/infos-vps.ini` et lancez l'outil de préparation : la balise `noindex` de chaque page (sauf `404.html`) devient `index, follow`. Sans Python, faites ce remplacement dans les 18 pages avec « Rechercher et remplacer dans les fichiers » de Visual Studio Code (`Ctrl + Maj + H`) : `content="noindex" data-info-meta="indexation"` devient `content="index, follow" data-info-meta="indexation"`.
3. Une fois la zone d'intervention confirmée, ajoutez-la dans les titres et descriptions.

**Après publication** : déclarez le site dans Google Search Console et Bing Webmaster Tools, puis soumettez l'adresse du `sitemap.xml`. Une fiche d'établissement Google peut compléter le référencement local.

---

## 10. Publier plus tard sur GitHub Pages avec votre domaine

> Rien n'a été publié ni connecté à GitHub. Ces étapes sont à suivre plus tard, une fois tous les contenus validés.

### Points d'attention

- **Dépôt public** : avec l'offre GitHub gratuite, GitHub Pages fonctionne uniquement avec un dépôt **public** (un dépôt privé nécessite une offre payante). Tous les fichiers **et leur historique** sont alors visibles : n'envoyez que la version validée.
- **Conditions d'utilisation** : GitHub indique que GitHub Pages n'est pas destiné à faire fonctionner une activité commerciale en ligne ou un site principalement consacré à des transactions commerciales. Relisez ces conditions pour vérifier qu'elles conviennent à votre usage.
- `README.md` et `outils/` sont exclus du site publié grâce à `_config.yml`. Le fichier `config/infos-vps.ini` est publié (le site y lit les informations) : il ne doit contenir que des informations publiques. Tout reste lisible dans le dépôt public.
- Les mentions légales indiquent GitHub, Inc. comme hébergeur (adresse et téléphone) : vérifiez ces informations le jour de la publication, ou remplacez-les si vous choisissez un autre hébergeur.

### Étapes

1. Créez un compte GitHub, puis un nouveau dépôt **public** (par exemple `site-vps`).
2. Ajoutez les fichiers : « Add file » › « Upload files », puis glissez **le contenu** du dossier `site-vps` (et non le dossier lui-même) afin que `index.html` soit à la racine. Validez avec « Commit changes ». Avec Git :

   ```bash
   cd chemin/vers/site-vps
   git init
   git add .
   git commit -m "Site vitrine VPS"
   git branch -M main
   git remote add origin https://github.com/<utilisateur>/<depot>.git
   git push -u origin main
   ```
3. Dans le dépôt : **Settings › Pages**, « Build and deployment » : Source « Deploy from a branch », branche `main`, dossier `/ (root)`, puis « Save ». Le site est visible quelques minutes plus tard à l'adresse `https://<utilisateur>.github.io/<depot>/` (la page 404 n'y est pas mise en forme ; elle le sera avec votre domaine).
4. **Recommandé** : vérifiez votre domaine dans les paramètres de votre compte GitHub (rubrique Pages, « Add a domain ») **avant** de modifier les DNS.
5. **Settings › Pages › Custom domain** : saisissez votre domaine (`www.vps-securite.fr`), puis « Save ». GitHub ajoute un fichier `CNAME` au dépôt : conservez-le.
6. Chez votre registraire (zone DNS du domaine) :

   | Type | Nom | Valeur |
   |---|---|---|
   | CNAME | `www` | `<utilisateur>.github.io` (sans le nom du dépôt) |
   | A | `@` (domaine sans www) | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA (facultatif) | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |

   Supprimez les enregistrements par défaut du registraire sur ces noms et n'utilisez pas d'enregistrement générique `*.vps-securite.fr`. La propagation peut prendre jusqu'à 24 heures.
7. De retour dans **Settings › Pages**, cochez **« Enforce HTTPS »** dès que l'option est disponible (jusqu'à 24 heures).
8. Contrôle final sur le vrai domaine : chaque page dans les deux langues, le bouton FR / EN, le menu sur téléphone, le formulaire, l'aperçu de partage, et `python outils/verifier_site.py --publication`.

Source : documentation GitHub « Managing a custom domain for your GitHub Pages site ». Ces valeurs peuvent évoluer : vérifiez-les le jour de la configuration.

---

## 11. Liste de vérification avant publication

- [ ] Adresse e-mail ajoutée dans `config/infos-vps.ini`.
- [ ] Photos de la galerie ajoutées, dans les deux langues (accord des personnes photographiées, plaques et détails sensibles vérifiés, crédits indiqués).
- [ ] Capital social vérifié sur un Kbis récent.
- [ ] Formulaire activé et testé (section 8), **ou** laissé inactif avec l'e-mail affiché sur la page Contact.
- [ ] Nom de domaine `vps-securite.fr` réservé au nom de VPS ; `indexation = oui`, puis outil de préparation lancé ou remplacement manuel (section 9).
- [ ] Tests sur téléphone, tablette et ordinateur, dans les deux langues ; `python outils/verifier_site.py --publication` sans erreur.

---

## 12. Sécurité et données

- Aucun secret, mot de passe, clé d'API ni donnée personnelle dans le code : tout ce qui est publié est public.
- Le site ne dépose aucun cookie et ne charge aucune ressource externe (police, script, carte, vidéo, outil de statistiques) ; il lit seulement son propre fichier `config/infos-vps.ini`. Si vous en ajoutez, mettez à jour la politique de confidentialité et vérifiez si un recueil du consentement est nécessaire.
- Le formulaire invite les visiteurs à ne transmettre aucune information sensible (codes d'accès, plans de sécurité). Faites arriver les demandes dans une boîte e-mail à accès restreint.
- Ne publiez pas le document d'autorisation du CNAPS lui-même : le numéro suffit.
- Conservez les preuves : accords des références, autorisations de droit à l'image.
