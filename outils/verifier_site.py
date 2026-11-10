#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Vérification du site VPS avant publication (outil facultatif, sans dépendance).

Utilisation, depuis le dossier du site :
    python outils/verifier_site.py                 rapport complet
    python outils/verifier_site.py --publication   contrôle final : échoue s'il reste
                                                   le moindre point à traiter
(Sous Windows, remplacez « python » par « py » si nécessaire.)

Pages contrôlées : pages françaises (racine du site) et pages anglaises (dossier en/).

Contrôles effectués :
  - liens internes, images, scripts et feuilles de style : le fichier existe avec
    exactement la même casse (GitHub Pages distingue majuscules et minuscules) ;
  - ancres (#...) existantes, identifiants en double ;
  - langue, titre, description, un seul titre h1, textes alternatifs des images ;
  - noms de fichiers compatibles (minuscules, sans espace ni accent) ;
  - éléments restant à compléter avant publication (e-mail, photos de la galerie…) ;
  - anciennes pages restées dans le dossier mais reliées à aucune autre page ;
  - fichier CNAME (domaine relié au site sur GitHub Pages) identique au domaine des pages.
"""
import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

RACINE = Path(__file__).resolve().parent.parent
EXTERNES = ('http://', 'https://', 'mailto:', 'tel:', 'data:', '//')
NOM_VALIDE = re.compile(r'^[a-z0-9][a-z0-9._-]*$')
IGNORES = {'README.md', '_config.yml', 'CNAME', '.git', '.github', '.gitignore', '.nojekyll',
           'outils', '.DS_Store', 'Thumbs.db', 'desktop.ini', '.vscode'}
DOMAINE_PROVISOIRE = 'votre-domaine.example'


class Analyse(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.references = []
        self.ids = {}
        self.images_sans_alt = []
        self.nb_h1 = 0
        self.titre = ''
        self._dans_titre = False
        self.description = None
        self.noindex = False
        self.langue = None
        self.formulaire = None

    def handle_starttag(self, balise, attributs):
        a = dict(attributs)
        ligne = self.getpos()[0]
        if balise == 'html':
            self.langue = a.get('lang')
        if a.get('id'):
            self.ids[a['id']] = self.ids.get(a['id'], 0) + 1
        if balise in ('a', 'link') and a.get('href') is not None:
            if 'canonical' not in (a.get('rel') or '').lower():
                self.references.append((a['href'], ligne))
        if balise in ('img', 'script', 'source', 'iframe', 'audio', 'video') and a.get('src'):
            self.references.append((a['src'], ligne))
        if balise in ('img', 'source') and a.get('srcset'):
            for morceau in a['srcset'].split(','):
                if morceau.strip():
                    self.references.append((morceau.strip().split()[0], ligne))
        if balise == 'img' and 'alt' not in a:
            self.images_sans_alt.append(ligne)
        if balise == 'h1':
            self.nb_h1 += 1
        if balise == 'title':
            self._dans_titre = True
        if balise == 'meta':
            nom = (a.get('name') or '').lower()
            if nom == 'description':
                self.description = (a.get('content') or '').strip()
            if nom == 'robots' and 'noindex' in (a.get('content') or '').lower():
                self.noindex = True
        if balise == 'form' and a.get('id') == 'formulaire-devis':
            self.formulaire = (a.get('data-adresse-reception') or '').strip()

    def handle_endtag(self, balise):
        if balise == 'title':
            self._dans_titre = False

    def handle_data(self, donnees):
        if self._dans_titre:
            self.titre += donnees


def existe_avec_casse(chemin):
    """Vrai si le fichier existe avec exactement cette casse, à l'intérieur du site."""
    try:
        relatif = Path(chemin).relative_to(RACINE)
    except ValueError:
        return False
    courant = RACINE
    for partie in relatif.parts:
        try:
            if partie not in os.listdir(courant):
                return False
        except OSError:
            return False
        courant = courant / partie
    return courant.is_file()


def verifier_reference(nom_page, valeur, analyses):
    """nom_page : chemin de la page depuis la racine du site (exemple : en/company.html)."""
    v = valeur.strip()
    if not v:
        return 'lien vide'
    if v.lower().startswith('javascript:'):
        return 'lien « javascript: » à éviter'
    if v.lower().startswith(EXTERNES):
        return None
    if '\\' in v:
        return f'barre oblique inversée dans « {v} » : utilisez /'
    morceaux = urlsplit(v)
    chemin = unquote(morceaux.path)
    if ' ' in chemin:
        return f'espace dans le chemin « {v} »'
    if chemin.startswith('/'):
        if nom_page != '404.html':
            return f'chemin absolu « {v} » : utilisez un chemin relatif (exemple : css/style.css)'
        cible = os.path.normpath(os.path.join(str(RACINE), chemin.lstrip('/')))
    elif chemin == '':
        cible = str(RACINE / nom_page)
    else:
        dossier_page = os.path.dirname(os.path.join(str(RACINE), nom_page))
        cible = os.path.normpath(os.path.join(dossier_page, chemin))
    if os.path.isdir(cible):
        cible = os.path.join(cible, 'index.html')
    if not existe_avec_casse(cible):
        return f'fichier introuvable ou casse différente : « {v} »'
    if morceaux.fragment and cible.endswith('.html'):
        analyse = analyses.get(os.path.relpath(cible, str(RACINE)).replace(os.sep, '/'))
        if analyse is not None and morceaux.fragment not in analyse.ids:
            return f'ancre introuvable : « {v} »'
    return None


def compter(motif, texte):
    return len(re.findall(motif, texte, flags=re.IGNORECASE))


def main():
    mode_publication = '--publication' in sys.argv
    erreurs, a_traiter = [], []
    pages = sorted(RACINE.glob('*.html')) + sorted((RACINE / 'en').glob('*.html'))
    analyses = {}
    for p in pages:
        analyse = Analyse()
        analyse.feed(p.read_text(encoding='utf-8'))
        analyses[p.relative_to(RACINE).as_posix()] = analyse

    # 1. Structure, liens et images
    for nom, an in analyses.items():
        langue_attendue = 'en' if nom.startswith('en/') else 'fr'
        if an.langue != langue_attendue:
            erreurs.append(f'{nom} : attribut lang="{langue_attendue}" absent')
        if not an.titre.strip():
            erreurs.append(f'{nom} : titre (<title>) absent')
        if not an.description:
            erreurs.append(f'{nom} : description (meta description) absente')
        if an.nb_h1 != 1:
            erreurs.append(f'{nom} : {an.nb_h1} titre(s) h1, il en faut exactement un')
        for ligne in an.images_sans_alt:
            erreurs.append(f'{nom}, ligne {ligne} : image sans attribut alt')
        for ident, nombre in an.ids.items():
            if nombre > 1:
                erreurs.append(f'{nom} : identifiant « {ident} » utilisé {nombre} fois')
        for valeur, ligne in an.references:
            probleme = verifier_reference(nom, valeur, analyses)
            if probleme:
                erreurs.append(f'{nom}, ligne {ligne} : {probleme}')

    # Noms de fichiers et images inutilisées
    toutes_refs = set()
    for nom, an in analyses.items():
        dossier = os.path.dirname(nom)
        for valeur, _ in an.references:
            v = valeur.strip()
            if v.lower().startswith(EXTERNES):
                continue
            chemin = unquote(urlsplit(v).path)
            if not chemin:
                continue
            relatif = chemin.lstrip('/') if chemin.startswith('/') else os.path.join(dossier, chemin)
            toutes_refs.add(os.path.normpath(relatif))
    css = (RACINE / 'css' / 'style.css')
    for dossier, sous_dossiers, fichiers in os.walk(RACINE):
        sous_dossiers[:] = [d for d in sous_dossiers if d not in IGNORES]
        for f in fichiers:
            if f in IGNORES:
                continue
            relatif = os.path.relpath(os.path.join(dossier, f), RACINE)
            for partie in Path(relatif).parts:
                if not NOM_VALIDE.match(partie):
                    erreurs.append(f'nom de fichier à corriger : « {relatif} » (minuscules, sans espace ni accent)')
                    break
            if relatif.startswith('images' + os.sep) and os.path.normpath(relatif) not in toutes_refs:
                # Une image citée ailleurs dans le code (données structurées, partage) compte comme utilisée
                cite = any(Path(relatif).as_posix() in pg.read_text(encoding='utf-8') for pg in pages)
                if not cite and 'apple-touch-icon' not in relatif:
                    a_traiter.append(f'image non utilisée (à supprimer si inutile) : {relatif}')

    # 2. Éléments à traiter avant publication
    for p in pages:
        nom = p.relative_to(RACINE).as_posix()
        texte = re.sub(r'<!--.*?-->', '', p.read_text(encoding='utf-8'), flags=re.S)
        # Les textes de secours (data-defaut) ne sont pas affichés quand l'information est renseignée
        texte = re.sub(r'\sdata-defaut="[^"]*"', '', texte)
        details = []
        for libelle, motif in [('« à compléter »', r'[àÀ][\s\u00a0]+compl[ée]ter'),
                               ('« à confirmer »', r'[àÀ][\s\u00a0]+confirmer'),
                               ('« à valider »', r'[àÀ][\s\u00a0]+valider'),
                               ('« to be completed »', r'to[\s\u00a0]+be[\s\u00a0]+completed'),
                               ('« to be confirmed »', r'to[\s\u00a0]+be[\s\u00a0]+confirmed'),
                               ('« to be validated »', r'to[\s\u00a0]+be[\s\u00a0]+validated'),
                               ("note(s) d'édition", r'class="note-edition"'),
                               ('photo(s) à fournir', r'-a-remplacer(?:-en)?\.svg')]:
            n = compter(motif, texte)
            if n:
                details.append(f'{n} {libelle}')
        if DOMAINE_PROVISOIRE in texte:
            details.append('adresse provisoire du site')
        if analyses[nom].noindex and nom != '404.html':
            if compter(r'-a-remplacer(?:-en)?\.svg', texte):
                details.append('balise noindex (normal : page tenue hors des moteurs de recherche '
                               'tant que ses photos sont à fournir)')
            else:
                details.append('balise noindex')
        if details:
            a_traiter.append(f'{nom} : ' + ', '.join(details))
    for nom in ('robots.txt', 'sitemap.xml'):
        f = RACINE / nom
        if f.exists() and DOMAINE_PROVISOIRE in f.read_text(encoding='utf-8'):
            a_traiter.append(f'{nom} : adresse provisoire du site')
    # Fichier CNAME : domaine relié au site sur GitHub Pages
    cname = RACINE / 'CNAME'
    if cname.exists():
        valeur = cname.read_text(encoding='utf-8').strip()
        m = re.search(r'<link rel="canonical" href="https?://([^/"]+)', (RACINE / 'index.html').read_text(encoding='utf-8'))
        domaine = m.group(1).lower() if m else ''
        if valeur.lower() != domaine or not re.fullmatch(r'[a-z0-9-]+(?:\.[a-z0-9-]+)+', valeur, re.I):
            erreurs.append(f'CNAME : « {valeur} » ne correspond pas au domaine des pages '
                           f'({domaine or "inconnu"}) : lancez outils/preparer_publication.py')
    # Pages qui ne sont plus reliées au site (par exemple une ancienne page restée dans le dossier)
    liees = set()
    for nom, an in analyses.items():
        dossier = os.path.dirname(nom)
        for valeur, _ in an.references:
            chemin = unquote(urlsplit(valeur.strip()).path)
            if chemin.endswith('.html') and not valeur.strip().lower().startswith(EXTERNES):
                cible = chemin.lstrip('/') if chemin.startswith('/') else os.path.normpath(os.path.join(dossier, chemin))
                if cible != nom:
                    liees.add(cible.replace(os.sep, '/'))
    for nom in analyses:
        if nom not in liees and nom not in ('index.html', '404.html'):
            a_traiter.append(f'{nom} : page reliée à aucune autre (ancienne page ? à supprimer si inutile)')
    for nom, an in analyses.items():
        if an.formulaire is not None and not an.formulaire:
            a_traiter.append(f'{nom} : formulaire de devis inactif (aucune adresse de réception configurée)')

    # Rapport
    print('=== Vérification du site VPS ===')
    print(f'Dossier analysé : {RACINE}')
    nb_en = sum(1 for nom in analyses if nom.startswith('en/'))
    print(f'Pages HTML : {len(pages)} ({len(pages) - nb_en} en français, {nb_en} en anglais)\n')
    print('[1] Liens, images et structure')
    if erreurs:
        for e in erreurs:
            print(f'  [ERREUR] {e}')
    else:
        print('  [OK] Aucun lien cassé, aucune image manquante, structure correcte.')
    print('\n[2] Avant publication : points restant à traiter')
    if a_traiter:
        for a in a_traiter:
            print(f'  [À FAIRE] {a}')
    else:
        print('  [OK] Aucun point en attente.')
    print(f'\nRésultat : {len(erreurs)} erreur(s), {len(a_traiter)} point(s) à traiter avant publication.')
    if erreurs or (mode_publication and a_traiter):
        sys.exit(1)


if __name__ == '__main__':
    main()
