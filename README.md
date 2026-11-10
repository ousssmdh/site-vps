# Site vitrine — VPS – Vigilance Protection Sécurité

Site statique multipage en HTML, CSS et JavaScript simples : aucun serveur, aucune base de données, aucune bibliothèque ni ressource externe (la police de caractères est hébergée avec le site). Il fonctionne en local et il est publié sur **GitHub Pages** à l'adresse **https://www.vps-securite.fr** (section 10).

Le site existe en **français** (racine du site) et en **anglais** (dossier `en/`) : un bouton **FR / EN** en haut de chaque page mène à la même page dans l'autre langue.

Il s'affiche en **clair** ou en **sombre** : un bouton **lune / soleil** en haut de chaque page (et la ligne « Affichage » du menu sur téléphone) passe d'un affichage à l'autre. L'affichage clair est proposé par défaut et le choix de chaque visiteur est mémorisé (section 3).

> **En ligne.** Le site est en ligne à son adresse définitive **https://www.vps-securite.fr** depuis le 10 novembre 2026 (domaine relié, certificat HTTPS délivré par GitHub) ; les réglages faits chez OVHcloud et sur GitHub sont détaillés en [section 10](#10-votre-domaine-wwwvps-securitefr).
> - L'adresse **contact@vps-securite.fr** est affichée sur le site et le **formulaire de devis fonctionne** (service gratuit FormSubmit, activé le 10 novembre 2026 ; section 8).
> - Le **référencement est ouvert** (`indexation = oui`), sauf pour la **galerie**, tenue hors des moteurs de recherche tant que ses **photos** ne sont pas en place (sections 6 et 9).
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
10. [Votre domaine www.vps-securite.fr](#10-votre-domaine-wwwvps-securitefr)
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
├── CNAME                    Domaine relié au site sur GitHub Pages (www.vps-securite.fr) : à conserver
├── README.md                Ce guide
├── config/infos-vps.ini     LE fichier à remplir : coordonnées, mentions légales, formulaire, textes anglais
├── css/style.css            Mise en forme (couleurs : section 2 pour l'affichage sombre, section 18 pour le clair)
├── js/main.js               Menu, onglets, carrousel, animations, lecture de config/infos-vps.ini, formulaire
├── js/theme.js              Affichage clair / sombre (affichage proposé par défaut réglable en haut du fichier)
├── fonts/                   Police Geist (+ sa licence libre, licence-geist.txt)
├── images/
│   ├── logo/                logo-vps-160.webp (en-tête), logo-vps-800.webp (référencement), apple-touch-icon.png
│   ├── ambiance/            7 visuels générés par IA : 4 vues de nuit, 2 scènes « sécurité incendie », 1 agent cynophile
│   ├── galerie/             emplacements photo « …-a-remplacer.svg » (versions « …-a-remplacer-en.svg » en anglais)
│   └── partage/             vps-partage.jpg (aperçu lors d'un partage de lien)
└── outils/                  FACULTATIF (Python 3), utile avant la mise en ligne
    ├── preparer_publication.py   Inscrit les informations dans les pages, règle l'indexation, l'adresse du site et le CNAME
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

L'envoi du formulaire de devis ne fonctionne pas depuis un fichier ouvert par double-clic : testez-le sur le site en ligne (section 8).

**Tests manuels conseillés** : bouton FR / EN et bouton lune / soleil (affichage clair / sombre) sur chaque page, menu sur téléphone (bouton « Menu »), navigation au clavier (`Tab`, `Maj + Tab`, `Entrée`, `Échap` pour fermer le menu), carrousel de la galerie, zoom à 200 %, affichage sur un vrai téléphone.

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
- **affichage clair ou sombre** : bouton lune / soleil dans l'en-tête et ligne « Affichage » dans le menu mobile. Les photos, les en-têtes posés sur une photo et les grands appels finaux restent sombres dans les deux affichages, pour que leurs textes restent lisibles ;
- pied de page avec le grand mot « VIGILANCE » et les mentions obligatoires.

**Couleurs de l'affichage sombre**, réglables en haut de `css/style.css` (section 2) :

| Variable | Couleur | Usage |
|---|---|---|
| `--encre` | `#05080f` | fond principal (bleu nuit presque noir) |
| `--papier` | `#f2f4f7` | textes sur fond sombre, sections claires |
| `--accent` | `#3d8bff` | bleu électrique du logo, sur fond sombre (numéros, onglet actif) |
| `--accent-clair` | `#0769da` | même bleu, sur fond clair |
| `--ambre` | `#e9c47a` | repères provisoires (« À compléter », « À valider ») |

### Affichage clair / sombre

- **Affichage proposé à un nouveau visiteur** : clair. Pour le changer, ouvrez `js/theme.js` et remplacez `'clair'` par `'sombre'` (ou par `'auto'` pour suivre le réglage de l'appareil du visiteur) sur la ligne `var AFFICHAGE_PAR_DEFAUT = 'clair';`.
- **Choix du visiteur** : mémorisé dans son navigateur (stockage local, clé `vps-affichage`), sans cookie ; la politique de confidentialité le mentionne. Sans JavaScript, le site s'affiche en sombre et le bouton est masqué.
- **Couleurs de l'affichage clair** : section 18 de `css/style.css`.

| Variable (affichage clair) | Couleur | Usage |
|---|---|---|
| `--encre` | `#ffffff` | fond principal |
| `--encre-2` | `#eef1f5` | fond des cartes et des emplacements d'images |
| `--papier` | `#05080f` | texte principal (bleu nuit du logo) |
| `--doux` | `#545d6b` | texte secondaire |
| `--accent` | `#0769da` | bleu du logo, lisible sur fond clair |

Les sections claires « Pourquoi VPS », « VPS en bref », « Valeurs », ainsi que les pages légales, gardent leur fond gris-bleu très clair (`#f2f4f7`) dans les deux affichages.

**Typographie** : Geist (police libre, licence SIL Open Font License 1.1, voir `fonts/licence-geist.txt`, hébergée avec le site) et, pour les étiquettes, la police à chasse fixe de l'appareil du visiteur.

**Accessibilité** : contrastes vérifiés, navigation au clavier (menu, onglets, FAQ, carrousel), lien d'évitement, textes alternatifs. Les animations (zoom lent des photos, texte révélé, bandeau défilant, apparitions) sont désactivées si l'appareil demande de réduire les animations, et tous les contenus restent lisibles sans JavaScript.

---

## 4. Informations officielles déjà intégrées

Sources : **autorisation d'exercer délivrée par le CNAPS** (document fourni) et **registres publics des entreprises**. À vérifier sur l'extrait Kbis à jour avant publication.

| Information | Valeur | Où elle apparaît |
|---|---|---|
| Autorisation d'exercer | n° AUT-013-2123-06-12-20240936040 (CNAPS) | pied de page (toutes les pages), accueil, menu mobile, devis, entreprise, mentions légales, image de partage |
| Activité autorisée | Surveillance ou gardiennage | entreprise, prestations, mentions légales |
| Spécialité (indiquée par VPS) | Agents de sécurité cynophiles | accueil, entreprise, prestations, devis |
| Autre activité (indiquée par VPS) | Sécurité incendie | accueil, entreprise, prestations, devis |
| Dénomination | VIGILANCE PROTECTION SECURITE (sigle VPS SECURITE) | pied de page, entreprise, mentions, confidentialité, devis |
| Forme juridique | SAS | entreprise, mentions légales |
| Siège social | 51 rue Sainte, 13001 Marseille | pied de page, entreprise, contact, mentions, confidentialité |
| SIRET (siège) | 929 091 593 00020 | entreprise, mentions légales |
| RCS | Marseille 929 091 593 | mentions, confidentialité |
| TVA intracommunautaire | FR64929091593 | mentions légales |

**Déjà renseignés** dans `config/infos-vps.ini` : téléphone, zone d'intervention, capital social (5 000 € : vérifiez-le sur un Kbis récent, les registres publics consultés indiquaient 100 € puis 1 000 €), directeur de la publication, crédits photos, adresse du site, téléphone de l'hébergeur, durée de conservation des demandes (3 ans à compter du dernier contact, durée indiquée par la CNIL pour les données de prospects), adresse e-mail (contact@vps-securite.fr, ajoutée le 10 novembre 2026), contact pour les données personnelles (même adresse e-mail), adresse de réception du formulaire de devis et date de mise à jour des pages légales.

**Reste à compléter** : rien dans ce fichier ; il reste seulement les photos de la galerie (section 6).

**Règles propres à la sécurité privée (code de la sécurité intérieure)** :

- **Article L612-15** : tout document informatif, contractuel ou publicitaire (site, plaquette, publication sur les réseaux sociaux, devis) doit reproduire le **numéro d'autorisation** et le texte de l'**article L612-14** : « L'autorisation d'exercice ne confère aucune prérogative de puissance publique à l'entreprise ou aux personnes qui en bénéficient. » Ces deux mentions figurent dans le pied de page de chaque page : ne les supprimez pas.
- Le même article **interdit** de faire état de la qualité d'ancien fonctionnaire de police ou d'ancien militaire d'un dirigeant ou d'un salarié.
- L'autorisation du CNAPS couvre la **surveillance ou le gardiennage**. La **sécurité incendie** n'est pas une activité soumise à cette autorisation : elle exige des agents titulaires de la qualification SSIAP adaptée au site (SSIAP 1, 2 ou 3, arrêté du 2 mai 2005). L'article L612-2 impose par ailleurs qu'une entreprise de surveillance ou de gardiennage ne propose que des prestations liées à ces activités : faites confirmer que vos missions de sécurité incendie s'inscrivent dans ce cadre.
- Les **agents cynophiles** exercent dans le cadre de l'activité de surveillance ou de gardiennage : chacun doit détenir une carte professionnelle du CNAPS portant la mention cynophile, et ses chiens doivent être identifiés et à jour de leurs obligations (vaccins, assurance).
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
| E-mail | `email` | pied de page, contact, mentions légales, page devis (sous le bouton d'envoi) |
| Zone d'intervention | `zone_intervention` | accueil (FAQ), entreprise, contact |
| Présentation de l'entreprise (facultatif) | `presentation` | entreprise (rien ne s'affiche si elle est vide) |
| Capital social | `capital_social` | mentions légales |
| Directeur de la publication | `directeur_publication` | mentions légales |
| Durée de conservation | `duree_conservation` | devis, confidentialité |
| Contact données personnelles | `contact_donnees` | confidentialité |
| Téléphone de l'hébergeur | `hebergeur_telephone` | mentions légales |
| Crédits photos | `credits_photos` | mentions légales |
| Date de mise à jour | `date_mise_a_jour` | mentions légales, confidentialité |
| Adresse du site | `adresse_site` | adresses de référence, partage, `sitemap.xml`, `robots.txt`, fichier `CNAME` (appliquée par l'outil de préparation) |
| Référencement | `indexation` (`oui` / `non`) | balise `robots` de chaque page et `sitemap.xml` ; la galerie reste exclue tant que ses photos sont à fournir (appliqué par l'outil de préparation) |
| Formulaire de devis | `adresse_reception`, `mode_envoi` | `devis.html` et `en/quote.html` (adresse d'envoi FormSubmit ; vide = formulaire inactif) |
| Textes des pages anglaises | section `[version_anglaise]` | pages du dossier `en/` |

Bon à savoir :

- vider une valeur fait réapparaître le repère « À compléter » ;
- la section `[version_anglaise]` reçoit la traduction des textes (zone d'intervention, présentation, capital social, directeur de la publication…) ; une ligne vide reprend le texte français ; une date écrite « 5 novembre 2026 » est traduite automatiquement ;
- le fichier est publié avec le site : n'y écrivez que des informations publiques, jamais de mot de passe ni de clé secrète.

**Avant la mise en ligne (facultatif)** : l'outil `outils/preparer_publication.py` inscrit aussi ces informations directement dans le code des pages (utile au référencement, et affichées même si le fichier ne pouvait pas être lu), règle l'indexation, reporte l'adresse définitive du site et met à jour le fichier `CNAME`. Il demande Python 3 (gratuit sur python.org) : double-cliquez sur `outils\preparer-publication.bat`, ou lancez `python outils/preparer_publication.py` depuis le dossier du site. Sans Python, le raccourci affiche simplement un message : ce n'est pas bloquant. Les informations renseignées au 10 novembre 2026 ont déjà été inscrites dans les pages.

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

Ils sont **répétés dans les 17 pages HTML** (9 en français, dont la page 404, et 8 en anglais). Toute modification doit être faite dans chaque fichier : utilisez « Rechercher et remplacer dans les fichiers » (Visual Studio Code : `Ctrl + Maj + H`).

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

### Visuels d'ambiance, « sécurité incendie » et « agents cynophiles »

Les 7 images du dossier `images/ambiance/` ont été **générées par intelligence artificielle** pour illustrer le site (ce que précisent les crédits des mentions légales, section 6, depuis le 10 novembre 2026) :

- **4 photos aériennes de nuit** (sites, bureaux, commerces, événements) : elles ne montrent ni l'équipe, ni les sites, ni les clients de VPS (aucune personne reconnaissable, aucun logo). Vous avez choisi de les conserver : la mention « Visuel d'ambiance provisoire » a été retirée le 6 novembre 2026 ;
- **2 visuels « sécurité incendie »** (ajoutés le 9 novembre 2026) : un agent en tenue « SÉCURITÉ INCENDIE » devant le tableau du système de sécurité incendie (SSI), et une ronde de contrôle d'un extincteur et d'un robinet d'incendie armé. Les agents représentés ne sont pas des membres de l'équipe VPS (visages non visibles, aucun logo) : vous pourrez les remplacer par de vraies photos de vos agents, avec leur accord.
- **1 visuel « agents cynophiles »** (ajouté le 9 novembre 2026) : un agent en tenue « SÉCURITÉ », vu de dos, en ronde de nuit avec son chien (berger belge malinois) tenu en laisse dans la cour d'un entrepôt. L'agent représenté n'est pas un membre de l'équipe VPS : vous pourrez le remplacer par une vraie photo de l'un de vos agents cynophiles, avec son accord.

Pour changer une image, enregistrez la nouvelle photo **sous le même nom** dans `images/ambiance/`.

| Fichier | Utilisé dans |
|---|---|
| `zone-logistique-nuit.jpg` | en-tête de l'accueil, onglet « Sites & entrepôts », appel final (accueil, galerie), en-tête Demande de devis, page 404 |
| `parc-bureaux-nuit.jpg` | en-têtes L'entreprise et Contact, appel final (L'entreprise), prestation « Surveillance » |
| `zone-commerciale-nuit.jpg` | onglet « Commerces », en-tête et appel final Prestations, prestation « Prévention en magasin » |
| `marche-nuit.jpg` | onglet « Événements », prestation « Sécurité événementielle » |
| `incendie-poste-ssi.jpg` | onglet « Sécurité incendie » de l'accueil |
| `incendie-ronde-extincteurs.jpg` | prestation « Sécurité incendie » |
| `agent-cynophile-ronde.jpg` | onglet « Agents cynophiles » de l'accueil, prestation « Agents de sécurité cynophiles » |

Les pages anglaises utilisent les mêmes images.

**Format conseillé** pour une photo de remplacement : JPG, environ 1600 à 2400 px de large, moins de 400 Ko, image plutôt sombre, sujet au centre (le titre s'affiche en haut et les boutons en bas). Les vues de nuit sont décoratives : laissez `alt=""`. Les trois visuels « sécurité incendie » et « agents cynophiles » sont décrits (attribut `alt`) : si vous les remplacez, adaptez cette description dans `index.html`, `prestations.html` et leurs versions anglaises, et ajustez au besoin leur cadrage (règles `.visuel-incendie-ssi`, `.visuel-incendie-ronde` et `.visuel-cynophile` de `css/style.css`).

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

### Prestations

Dans `prestations.html` (et `en/services.html`), chaque prestation est un bloc `<article class="service" id="…">` : modifiez le titre, la description et la liste « Pour qui ? ». Supprimez les blocs qui ne correspondent pas à l'activité de VPS, ainsi que leur lien dans l'accès rapide en haut de page. Mettez aussi à jour :

- les **onglets « Prestations »** (cinq onglets, dont « Sécurité incendie » et « Agents cynophiles ») et les colonnes « Comment nous intervenons » des deux pages d'accueil (les liens « En savoir plus » pointent vers les `id` des blocs) ;
- la liste « Besoin » du formulaire (`<select id="besoin">` dans `devis.html` et `en/quote.html`).

**Sécurité incendie** : prestation ajoutée le 5 novembre 2026 et validée par VPS le 6 novembre 2026.

**Agents cynophiles** : prestation ajoutée le 9 novembre 2026 à la demande de VPS (bloc `id="cynophile"` de la page Prestations, 5e onglet et question de la FAQ de l'accueil, choix « Agents de sécurité cynophiles » du formulaire de devis).

### Références

La page Références a été supprimée le 6 novembre 2026. Les noms restent affichés dans le bandeau « Références » de l'accueil (`index.html` et `en/index.html`, un nom par ligne `<li>`) : Auchan, Carrefour Market, Intermarché, Foire aux santons, Foncia, IGH, Pharmacie Totum, Cabesto, Q-Park. Conservez l'accord écrit de chaque organisation citée. Aucun logo de client n'est utilisé : il faudrait l'autorisation écrite du titulaire de la marque.

---

## 8. Activer la réception des demandes de devis

GitHub Pages héberge uniquement des fichiers statiques : il ne peut ni recevoir ni stocker un formulaire. Le formulaire de devis est donc relié à un service externe gratuit, **FormSubmit** (formsubmit.co), qui ne demande ni inscription ni mot de passe : il transmet chaque demande par e-mail.

**Réglage actuel** (`config/infos-vps.ini`, section `[formulaire_devis]`) :

```ini
adresse_reception = https://formsubmit.co/ajax/contact@vps-securite.fr
mode_envoi = ajax
```

Les demandes envoyées depuis `devis.html` et `en/quote.html` arrivent à **contact@vps-securite.fr**, sous forme de tableau, avec l'objet « Nouvelle demande de devis – site VPS » (« … (version anglaise) … » pour la page anglaise). Le bouton **Répondre** de votre messagerie écrit directement au demandeur.

### Activation (faite le 10 novembre 2026)

À refaire seulement si FormSubmit la redemande (par exemple après le passage au domaine www.vps-securite.fr) :

1. Ouvrez la page **Demande de devis** du site **en ligne** et envoyez une demande de test (l'envoi ne fonctionne pas depuis un fichier ouvert par double-clic).
2. FormSubmit envoie aussitôt à contact@vps-securite.fr un e-mail de confirmation : cliquez sur **Activate Form**. Regardez aussi dans les courriers indésirables.
3. Envoyez une deuxième demande de test : la page doit afficher « Merci : votre demande a bien été envoyée » et l'e-mail doit arriver dans la boîte contact@vps-securite.fr.

Tant que l'activation n'est pas faite, la page affiche « Le formulaire est en cours d'activation… » au lieu de la confirmation.

**Messagerie Zoho** : si contact@vps-securite.fr est un groupe Zoho Mail, il doit accepter les e-mails venant de l'extérieur (groupe public, réglage **Everyone** pour « Who can send emails to your group »). Sinon, les e-mails de FormSubmit sont retenus en modération ou refusés.

### Bon à savoir

- **Confirmation honnête** : « Merci : votre demande a bien été envoyée » ne s'affiche **que si FormSubmit confirme la réception**. En cas d'échec, la page invite à réessayer ou à utiliser la page Contact ; l'adresse e-mail est aussi affichée sous le bouton d'envoi.
- **Délai de confirmation** : FormSubmit répond souvent en quelques secondes, mais peut mettre **1 à 2 minutes** (constaté le 10 novembre 2026) ; ce délai vient du service, pas du site. Pendant l'attente, le bouton affiche « Envoi en cours… » et reste bloqué (pas de doublon), une barre animée tourne sous le message, le visiteur est prévenu que la confirmation peut prendre jusqu'à deux minutes, et le navigateur demande confirmation s'il tente de quitter la page. Au bout de 15 secondes, le message précise que l'envoi est toujours en cours ; au bout de 2 min 30, qu'il n'y a pas encore de confirmation ; au bout de 5 minutes sans réponse, l'attente s'arrête et le visiteur est invité à vous contacter plutôt qu'à renvoyer. Ces délais se règlent en tête de la fonction `envoyer` de `js/main.js`. Si la lenteur devient gênante, un autre service peut remplacer FormSubmit (voir « Données personnelles » ci-dessous).
- **Anti-spam** : un champ invisible (`_honey`) écarte les robots qui le remplissent. En cas de demandes indésirables, FormSubmit permet d'ajouter un champ caché `_blacklist` (liste de mots à bloquer).
- **Changement d'adresse du site** (passage au domaine www.vps-securite.fr) : FormSubmit peut redemander une confirmation ; refaites alors les étapes 1 et 2. Les demandes envoyées en attendant sont conservées par FormSubmit (30 jours selon son aide en ligne) et transmises après le clic.
- **Masquer l'adresse dans le code** (facultatif) : après l'activation, FormSubmit fournit une adresse de remplacement aléatoire, à mettre à la place de `contact@vps-securite.fr` à la fin de `adresse_reception`. Ce n'est pas indispensable : l'adresse est déjà affichée sur le site.
- **Mode `classique`** : le navigateur affiche alors les pages de FormSubmit (vérification anti-robot, puis confirmation). Le script adapte l'adresse d'envoi tout seul.
- **Données personnelles** : la politique de confidentialité (destinataires, transferts, sécurité) et l'encadré « Utilisation de vos données » de la page devis indiquent que les demandes transitent par FormSubmit. FormSubmit ne publie ni contrat de sous-traitance ni localisation de ses serveurs : pour un cadre plus solide (hébergement en Europe, contrat de sous-traitance), choisissez un autre service, collez l'adresse d'envoi qu'il fournit dans `adresse_reception`, et adaptez ces textes ainsi que le nom du champ anti-spam.
- **Désactiver** le formulaire : videz `adresse_reception`. L'avertissement « Formulaire non actif » réapparaît et le bouton d'envoi se désactive.

**Secrets** : l'adresse d'envoi d'un service de formulaire est publique par nature, c'est normal. Ne placez jamais de clé d'API, de mot de passe ou de jeton secret dans le code.

---

## 9. Référencement

**Déjà en place** : titre et description propres à chaque page (avec « Marseille »), adresse canonique, balises de partage (Open Graph) et image de partage, données structurées « Organization » sur l'accueil (nom, adresse, SIRET), `sitemap.xml`, `robots.txt`, langues déclarées (français et anglais) avec liens `hreflang` entre les deux versions, pages légères sans ressource externe.

**Réglage actuel** : `indexation = oui` dans `config/infos-vps.ini` (depuis le 10 novembre 2026). Les pages portent la balise `index, follow` et figurent dans `sitemap.xml`, sauf :

- la **galerie** (`galerie.html`, `en/gallery.html`) : tant qu'elle affiche des emplacements « photo à fournir », elle garde la balise `noindex` et sa ligne de `sitemap.xml` est mise en commentaire. Dès que les vraies photos remplacent les emplacements, l'outil de préparation l'ouvre automatiquement aux moteurs de recherche ;
- la page `404.html`, jamais référencée.

Pour bloquer de nouveau tout le référencement : `indexation = non`, puis lancez l'outil de préparation. Sans Python, utilisez « Rechercher et remplacer dans les fichiers » de Visual Studio Code (`Ctrl + Maj + H`) : `content="index, follow" data-info-meta="indexation"` devient `content="noindex" data-info-meta="indexation"` (et inversement pour rouvrir).

**Pour apparaître plus vite sur Google**, une fois le domaine actif (section 10) : dans Google Search Console, ajoutez une propriété de type « Domaine » `vps-securite.fr` (vérification par un enregistrement TXT chez OVHcloud, comme à l'étape 2 de la section 10), puis soumettez `https://www.vps-securite.fr/sitemap.xml`. Faites de même dans Bing Webmaster Tools, qui peut reprendre la propriété depuis Google Search Console. Une fiche d'établissement Google complète le référencement local.

---

## 10. Votre domaine www.vps-securite.fr

**Situation au 10 novembre 2026**

- Le site est publié sur GitHub Pages depuis le dépôt public `ousssmdh/site-vps` (Settings › Pages : « Deploy from a branch », branche `main`, dossier `/ (root)`) ; l'ancienne adresse https://ousssmdh.github.io/site-vps/ renvoie vers le domaine.
- Le nom de domaine `vps-securite.fr` est géré chez **OVHcloud** (serveurs DNS `dns103.ovh.net` et `ns103.ovh.net`) ; ses e-mails passent par **Zoho Mail**.
- Adresse du site : **https://www.vps-securite.fr** (avec www). `vps-securite.fr` sans www et l'ancienne adresse github.io y renvoient automatiquement.
- Côté site, tout est prêt : adresses des pages, `sitemap.xml`, `robots.txt`, page 404 (mise en forme à la racine du domaine) et fichier `CNAME` contenant `www.vps-securite.fr`.

**Domaine relié le 10 novembre 2026** : zone DNS modifiée chez OVHcloud, enregistrement de vérification GitHub en place, domaine saisi dans Settings › Pages (fichier `CNAME` enregistré par GitHub), certificat HTTPS délivré pour `www.vps-securite.fr` et `vps-securite.fr`. Dernier réglage : cocher **Enforce HTTPS** (étape 5).

Les étapes ci-dessous restent comme aide-mémoire, par exemple pour contrôler la zone DNS ou refaire la configuration.

### Étape 1 – GitHub : demander la vérification du domaine

Photo de profil (en haut à droite) › **Settings** › **Pages** (rubrique « Code, planning, and automation ») › **Add a domain** › saisissez `vps-securite.fr` › **Add domain**.

GitHub affiche un enregistrement TXT à créer : nom `_github-pages-challenge-ousssmdh`, valeur = un code. Gardez la page ouverte. Cette vérification empêche tout autre compte GitHub d'utiliser votre domaine ou ses sous-domaines.

### Étape 2 – OVHcloud : modifier la zone DNS

Espace client OVHcloud › **Web Cloud** › **Noms de domaine** › `vps-securite.fr` › onglet **Zone DNS**.

**a. Supprimez** les 3 enregistrements par défaut d'OVHcloud (menu ⋮ de la ligne › « Supprimer l'entrée ») :

| Sous-domaine | Type | Cible |
|---|---|---|
| `@` | A | `213.186.33.5` |
| `www` | A | `213.186.33.5` |
| `www` | TXT | `"3\|welcome"` |

**b. Ajoutez** ces enregistrements (« Ajouter une entrée » › type › champs › « Ajouter »). Dans le champ « Sous-domaine », OVHcloud n'accepte pas de valeur vide : saisissez **`@`** pour désigner le domaine lui-même (`vps-securite.fr`) ; l'aperçu affiche alors `vps-securite.fr. IN A …`. Ajoutez une entrée par adresse :

| Type | Sous-domaine | Cible / valeur |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `ousssmdh.github.io.` (avec le point final) |
| TXT | `_github-pages-challenge-ousssmdh` | le code affiché par GitHub à l'étape 1 |

Facultatif (IPv6) : quatre enregistrements AAAA, sous-domaine `@` : `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

**Ne touchez à aucun autre enregistrement**, surtout pas à ceux de Zoho Mail : MX (`mx.zoho.eu`, `mx2.zoho.eu`, `mx3.zoho.eu`), TXT `v=spf1 include:zohomail.eu ~all`, TXT `zoho-verification=…` et clé DKIM de Zoho. Le TXT `"1|www.vps-securite.fr"` (ancien réglage d'OVHcloud) peut rester : il est sans effet. N'ajoutez jamais d'enregistrement générique `*`.

### Étape 3 – GitHub : vérifier le domaine

Revenez sur la page de l'étape 1 et cliquez sur **Verify**. Si la vérification échoue, patientez 10 à 15 minutes (le temps qu'OVHcloud publie la zone), puis dans Settings › Pages cliquez sur **⋯** à droite du domaine › **Continue verifying** › **Verify**. Vous pouvez passer à l'étape 4 en attendant. Conservez ensuite l'enregistrement TXT.

### Étape 4 – GitHub : relier le domaine au site

Dépôt `site-vps` › **Settings** › **Pages** › **Custom domain** : saisissez exactement `www.vps-securite.fr` (avec www) › **Save**.

GitHub contrôle les DNS (« DNS check successful » quand tout est bon) et ajoute au dépôt un fichier `CNAME` identique à celui du site : ne le supprimez pas. À partir de là, l'adresse github.io renvoie vers www.vps-securite.fr.

### Étape 5 – Activer le HTTPS

Toujours dans Settings › Pages, cochez **Enforce HTTPS** dès que la case est disponible (certificat gratuit créé par GitHub : de quelques minutes à 24 heures).

### Étape 6 – Contrôles

- https://www.vps-securite.fr affiche le site avec le cadenas ; https://vps-securite.fr et https://ousssmdh.github.io/site-vps/ y renvoient.
- Une demande de devis test depuis le nouveau domaine : si FormSubmit envoie un nouvel e-mail « Activate Form » à contact@vps-securite.fr, cliquez dessus (section 8).
- Un e-mail envoyé à contact@vps-securite.fr arrive toujours (Zoho intact).
- `python outils/verifier_site.py --publication` (facultatif).

### En cas de problème

- **« DNS check unsuccessful »** : patientez (jusqu'à 24 heures), puis contrôlez les enregistrements, par exemple sur https://www.nslookup.io/domains/www.vps-securite.fr/dns-records/ : `www` doit être un CNAME vers `ousssmdh.github.io`, et `vps-securite.fr` doit renvoyer les quatre adresses `185.199.108.153` à `185.199.111.153` (et plus `213.186.33.5`).
- **« Enforce HTTPS » toujours grisé après 24 heures** : dans Custom domain, cliquez sur **Remove**, saisissez de nouveau `www.vps-securite.fr`, puis **Save** : GitHub relance la création du certificat.
- **Plus aucun e-mail reçu** : un enregistrement de Zoho a été modifié ; recréez-le avec les valeurs indiquées dans la console d'administration de Zoho Mail (rubrique des domaines).

Sources : documentation GitHub « Managing a custom domain for your GitHub Pages site » et « Verifying your custom domain for GitHub Pages », guide OVHcloud « Éditer une zone DNS OVHcloud ». Ces valeurs peuvent évoluer : vérifiez-les le jour de la configuration.

### Mettre à jour le site ensuite

Dans le dépôt, ouvrez le dossier concerné (par exemple `images/galerie/`), puis « Add file » › « Upload files », glissez les fichiers modifiés et validez avec « Commit changes ». Un fichier déposé à la racine au lieu de son dossier ne s'affiche pas sur le site. Ne supprimez jamais le fichier `CNAME`.

### Points d'attention

- **Dépôt public** : avec l'offre GitHub gratuite, GitHub Pages fonctionne uniquement avec un dépôt **public** (un dépôt privé nécessite une offre payante). Tous les fichiers **et leur historique** sont alors visibles : n'envoyez que la version validée.
- **Conditions d'utilisation** : GitHub indique que GitHub Pages n'est pas destiné à faire fonctionner une activité commerciale en ligne ou un site principalement consacré à des transactions commerciales. Relisez ces conditions pour vérifier qu'elles conviennent à votre usage.
- `README.md` et `outils/` sont exclus du site publié grâce à `_config.yml`. Le fichier `config/infos-vps.ini` est publié (le site y lit les informations) : il ne doit contenir que des informations publiques. Tout reste lisible dans le dépôt public.
- Les mentions légales indiquent GitHub, Inc. comme hébergeur (adresse et téléphone) : vérifiez ces informations le jour de la publication, ou remplacez-les si vous choisissez un autre hébergeur.

---

## 11. Liste de vérification avant publication

- [x] Adresse e-mail contact@vps-securite.fr ajoutée sur le site.
- [x] Formulaire de devis activé et testé depuis le site en ligne (10 novembre 2026).
- [x] Référencement ouvert (`indexation = oui`) ; galerie exclue tant que ses photos sont à fournir.
- [x] Domaine relié le 10 novembre 2026 (zone DNS OVHcloud, vérification GitHub, Custom domain, certificat HTTPS délivré).
- [ ] **Enforce HTTPS** coché dans Settings › Pages, puis demande de devis test depuis https://www.vps-securite.fr (section 10, étapes 5 et 6).
- [ ] Photos de la galerie ajoutées, dans les deux langues (accord des personnes photographiées, plaques et détails sensibles vérifiés, crédits indiqués), puis outil de préparation relancé.
- [ ] Capital social vérifié sur un Kbis récent.
- [ ] Site déclaré dans Google Search Console avec son `sitemap.xml` (section 9).
- [ ] Tests sur téléphone, tablette et ordinateur, dans les deux langues ; `python outils/verifier_site.py --publication` sans erreur.

---

## 12. Sécurité et données

- Aucun secret, mot de passe, clé d'API ni donnée personnelle dans le code : tout ce qui est publié est public.
- Le site ne dépose aucun cookie et ne charge aucune ressource externe (police, script, carte, vidéo, outil de statistiques) ; il lit seulement son propre fichier `config/infos-vps.ini`. Seul le choix d'affichage clair ou sombre d'un visiteur est enregistré dans son propre navigateur (stockage local), à sa demande ; la politique de confidentialité l'indique. Seul l'envoi du formulaire de devis contacte un service extérieur (FormSubmit), au moment où le visiteur clique sur le bouton d'envoi. Si vous en ajoutez, mettez à jour la politique de confidentialité et vérifiez si un recueil du consentement est nécessaire.
- Le formulaire invite les visiteurs à ne transmettre aucune information sensible (codes d'accès, plans de sécurité). Les demandes arrivent dans la boîte contact@vps-securite.fr : limitez son accès aux personnes qui traitent les devis.
- **Domaine** : gardez le domaine vérifié sur GitHub (enregistrement TXT `_github-pages-challenge-ousssmdh`) ; il empêche un autre compte d'utiliser vps-securite.fr. Si vous arrêtez un jour le site GitHub Pages, supprimez aussi chez OVHcloud les enregistrements qui pointent vers GitHub.
- Ne publiez pas le document d'autorisation du CNAPS lui-même : le numéro suffit.
- Conservez les preuves : accords des références, autorisations de droit à l'image.
