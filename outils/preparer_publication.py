#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Prépare le site VPS pour la mise en ligne (outil FACULTATIF, Python 3 sans installation).

Au quotidien, aucun outil n'est nécessaire : le site lit lui-même
config/infos-vps.ini à chaque affichage (enregistrez le fichier, puis actualisez
la page). Cet outil sert avant la mise en ligne, pour :
  - inscrire les informations directement dans les pages françaises et anglaises
    (elles restent ainsi visibles même si le fichier ne peut pas être lu) ;
  - autoriser ou bloquer le référencement (indexation = oui / non) ; une page qui
    affiche encore un emplacement « photo à fournir » (galerie) reste hors des
    moteurs de recherche (balise noindex, ligne mise en commentaire dans sitemap.xml) ;
  - reporter l'adresse définitive du site (adresse_site) dans toutes les pages,
    sitemap.xml et robots.txt, et l'inscrire dans le fichier CNAME (domaine relié
    au site sur GitHub Pages) ;
  - activer le formulaire de devis (adresse_reception) dans le code des pages.

Utilisation, depuis le dossier du site :
    python outils/preparer_publication.py
(Windows : « py outils\\preparer_publication.py », ou double-clic sur outils\\preparer-publication.bat)

- L'opération peut être relancée autant de fois que nécessaire.
- Un champ laissé vide redevient « À compléter » sur le site.
- Aucun fichier n'est modifié si une valeur est invalide (e-mail, adresse…).
"""
import configparser
import html
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

RACINE = Path(__file__).resolve().parent.parent
FICHIER = RACINE / 'config' / 'infos-vps.ini'
DOMAINE_PROVISOIRE = 'https://www.votre-domaine.example'

CHAMPS = {
    'site': ['adresse_site', 'indexation'],
    'coordonnees': ['telephone', 'email', 'zone_intervention'],
    'entreprise': ['presentation', 'capital_social', 'directeur_publication'],
    'donnees_personnelles': ['duree_conservation', 'contact_donnees'],
    'mentions_legales': ['hebergeur_telephone', 'credits_photos', 'date_mise_a_jour'],
    'formulaire_devis': ['adresse_reception', 'mode_envoi'],
}
# Textes pouvant être traduits dans la section [version_anglaise]
TEXTES_ANGLAIS = ['zone_intervention', 'presentation', 'capital_social', 'directeur_publication',
                  'duree_conservation', 'contact_donnees', 'credits_photos', 'date_mise_a_jour']
LIBELLES = {
    'telephone': 'téléphone', 'email': 'e-mail', 'zone_intervention': "zone d'intervention",
    'presentation': "présentation de l'entreprise", 'capital_social': 'capital social',
    'directeur_publication': 'directeur de la publication', 'duree_conservation': 'durée de conservation',
    'contact_donnees': 'contact données personnelles',
    'hebergeur_telephone': "téléphone de l'hébergeur", 'credits_photos': 'crédits photos', 'date_mise_a_jour': 'date de mise à jour',
}
OUI = {'oui', 'o', 'yes', 'y', 'true', 'vrai', '1'}
NON = {'non', 'n', 'no', 'false', 'faux', '0', ''}
MOIS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
MOIS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
RE_EMAIL = re.compile(r'^[^@\s<>"]+@[^@\s<>"]+\.[^@\s<>"]{2,}$')
RE_SPAN = re.compile(r'<span(?P<attrs>[^>]*\sdata-info="(?P<cle>[a-z_]+)"[^>]*)>(?P<contenu>.*?)</span>', re.S)
RE_DEFAUT = re.compile(r'\sdata-defaut="(?P<defaut>[^"]*)"')
RE_ROBOTS = re.compile(r'<meta name="robots" content="[^"]*" data-info-meta="indexation">')
RE_PHOTO_A_FOURNIR = re.compile(r'-a-remplacer(?:-en)?\.svg')
RE_URL_SITEMAP = re.compile(r'^(?P<retrait>[ \t]*)(?:<!-- Page masquée \(photos à fournir\) : )?'
                            r'<url><loc>(?P<loc>[^<\s]+)</loc></url>(?: -->)?[ \t]*$', re.M)


def typo(texte, langue):
    """Typographie identique à celle des pages : apostrophes courbes ; en français,
    espaces insécables avant : ; ! ? » et après «."""
    texte = texte.replace("'", '\u2019')
    if langue == 'fr':
        texte = re.sub(r' ([:;!?»])', '\u00a0\\1', texte)
        texte = texte.replace('« ', '«\u00a0')
    return texte


def nettoyer(brut):
    brut = (brut or '').strip()
    if len(brut) >= 2 and brut[0] == brut[-1] and brut[0] in '"\'':
        brut = brut[1:-1].strip()
    return brut


def lire_configuration():
    if not FICHIER.exists():
        sys.exit(f'Fichier introuvable : {FICHIER}')
    cp = configparser.ConfigParser(interpolation=None, delimiters=('=',), comment_prefixes=(';', '#'),
                                   inline_comment_prefixes=None)
    try:
        try:
            cp.read_string(FICHIER.read_text(encoding='utf-8-sig'))
        except UnicodeDecodeError:
            cp.read_string(FICHIER.read_text(encoding='cp1252'))
    except configparser.Error as erreur:
        sys.exit(f'Le fichier {FICHIER.name} ne peut pas être lu : {erreur}')
    valeurs, anglais, alertes = {}, {}, []
    for section, options in CHAMPS.items():
        for option in options:
            valeurs[option] = nettoyer(cp.get(section, option, fallback='') if cp.has_section(section) else '')
    for option in TEXTES_ANGLAIS:
        valeur = nettoyer(cp.get('version_anglaise', option, fallback='') if cp.has_section('version_anglaise') else '')
        if valeur:
            anglais[option] = valeur
    connues = {o for opts in CHAMPS.values() for o in opts}
    for section in cp.sections():
        autorisees = TEXTES_ANGLAIS if section == 'version_anglaise' else CHAMPS.get(section)
        if autorisees is None:
            alertes.append(f'section inconnue ignorée : [{section}]')
            continue
        for option in cp.options(section):
            if option not in autorisees:
                alertes.append(f'information inconnue ignorée : {option} (section [{section}])')
    return valeurs, anglais, alertes


def verifier(v):
    erreurs = []
    if v['email'] and not RE_EMAIL.match(v['email']):
        erreurs.append(f'e-mail invalide : « {v["email"]} »')
    for cle in ('telephone', 'hebergeur_telephone'):
        if v[cle] and (re.search(r'[^0-9+().\s-]', v[cle]) or len(re.sub(r'\D', '', v[cle])) < 9):
            erreurs.append(f'{LIBELLES[cle]} invalide : « {v[cle]} » (chiffres, espaces, points, + uniquement)')
    if v['adresse_site'] and not re.match(r'^https?://[a-z0-9.-]+\.[a-z]{2,}/?$', v['adresse_site'], re.I):
        erreurs.append(f'adresse du site invalide : « {v["adresse_site"]} » (exemple : https://www.vps-securite.fr)')
    if v['adresse_reception'] and not re.match(r'^https://[^\s"\'<>]+$', v['adresse_reception']):
        erreurs.append(f'adresse de réception invalide : « {v["adresse_reception"]} » (elle doit commencer par https://)')
    if v['indexation'].lower() not in OUI | NON:
        erreurs.append(f'indexation : écrivez « oui » ou « non » (valeur actuelle : « {v["indexation"]} »)')
    if v['mode_envoi'].lower() not in ('', 'ajax', 'classique'):
        erreurs.append(f'mode_envoi : écrivez « ajax » ou « classique » (valeur actuelle : « {v["mode_envoi"]} »)')
    return erreurs


def date_en_anglais(valeur):
    m = re.match(r'^(\d{1,2})(?:er)?\s+(\S+)\s+(\d{4})$', valeur.strip(), re.I)
    if not m or m.group(2).lower() not in MOIS_FR:
        return ''
    return f'{int(m.group(1))} {MOIS_EN[MOIS_FR.index(m.group(2).lower())]} {m.group(3)}'


def valeurs_langue(v, anglais, langue):
    if langue == 'fr':
        return dict(v)
    resultat = dict(v)
    date = date_en_anglais(v['date_mise_a_jour'])
    if date:
        resultat['date_mise_a_jour'] = date
    resultat.update(anglais)
    return resultat


def lien_telephone(numero):
    chiffres = re.sub(r'[^\d+]', '', numero)
    if chiffres.startswith('00'):
        chiffres = '+' + chiffres[2:]
    elif chiffres.startswith('0') and len(chiffres) == 10:
        chiffres = '+33' + chiffres[1:]
    return chiffres


def rendus(v, langue):
    """Code HTML de chaque information (None = information vide)."""
    def texte(t):
        lignes = [ligne.strip() for ligne in t.splitlines() if ligne.strip()]
        return '<br>'.join(html.escape(typo(ligne, langue), quote=False) for ligne in lignes)
    r = {}
    for cle, valeur in v.items():
        if not valeur:
            r[cle] = None
        elif cle in ('telephone', 'hebergeur_telephone'):
            r[cle] = f'<a href="tel:{lien_telephone(valeur)}">{html.escape(valeur)}</a>'
        elif cle == 'email' or (cle == 'contact_donnees' and RE_EMAIL.match(valeur)):
            r[cle] = f'<a href="mailto:{html.escape(valeur)}">{html.escape(valeur)}</a>'
        else:
            r[cle] = texte(valeur)
    # Information dérivée : phrase avec lien e-mail dans l'avertissement du formulaire de devis
    phrase = ' Vous pouvez aussi nous écrire à ' if langue == 'fr' else ' You can also email us at '
    r['email_phrase'] = (f'{phrase}<a href="mailto:{html.escape(v["email"])}">{html.escape(v["email"])}</a>.'
                         if v['email'] else None)
    return r


def remplacer_spans(contenu, r, langue, compteur):
    def remplacement(m):
        cle = m.group('cle')
        if cle not in r:
            return m.group(0)
        d = RE_DEFAUT.search(m.group('attrs'))
        defaut_attr = d.group('defaut') if d else ''
        attr_defaut = f' data-defaut="{defaut_attr}"'
        valeur = r[cle]
        if valeur is not None:
            nouveau = f'<span data-info="{cle}"{attr_defaut}>{valeur}</span>'
        else:
            texte = typo(html.unescape(defaut_attr), langue)
            if not texte:
                nouveau = f'<span data-info="{cle}"{attr_defaut}></span>'
            else:
                classe = 'a-completer a-completer--court' if len(html.unescape(defaut_attr)) <= 16 else 'a-completer'
                nouveau = f'<span class="{classe}" data-info="{cle}"{attr_defaut}>[{html.escape(texte, quote=False)}]</span>'
        if nouveau != m.group(0):
            compteur[0] += 1
        return nouveau
    return RE_SPAN.sub(remplacement, contenu)


def photos_a_fournir(contenu):
    """Vrai si la page affiche encore un emplacement « photo à fournir » (commentaires exclus)."""
    return bool(RE_PHOTO_A_FOURNIR.search(re.sub(r'<!--.*?-->', '', contenu, flags=re.S)))


def url_page(relatif, adresse_site):
    """Adresse publique d'une page, telle qu'elle figure dans sitemap.xml."""
    if relatif == 'index.html':
        return adresse_site + '/'
    if relatif == 'en/index.html':
        return adresse_site + '/en/'
    return f'{adresse_site}/{relatif}'


def ajuster_sitemap(contenu, urls_masquees):
    """Met en commentaire les pages tenues hors des moteurs de recherche et rétablit les autres."""
    def remplacement(m):
        ligne = f'<url><loc>{m.group("loc")}</loc></url>'
        if m.group('loc') in urls_masquees:
            ligne = f'<!-- Page masquée (photos à fournir) : {ligne} -->'
        return m.group('retrait') + ligne
    return RE_URL_SITEMAP.sub(remplacement, contenu)


def main():
    valeurs, anglais, alertes = lire_configuration()
    erreurs = verifier(valeurs)
    print('=== Préparation de la publication (config/infos-vps.ini) ===')
    for a in alertes:
        print(f'  [ATTENTION] {a}')
    if erreurs:
        for e in erreurs:
            print(f'  [ERREUR] {e}')
        print('\nAucun fichier modifié. Corrigez le fichier config/infos-vps.ini puis relancez.')
        sys.exit(1)

    rendus_langue = {langue: rendus(valeurs_langue(valeurs, anglais, langue), langue) for langue in ('fr', 'en')}
    indexation = valeurs['indexation'].lower() in OUI
    mode = valeurs['mode_envoi'].lower() or 'ajax'
    adresse_site = (valeurs['adresse_site'].rstrip('/') or DOMAINE_PROVISOIRE)

    pages = sorted(RACINE.glob('*.html')) + sorted((RACINE / 'en').glob('*.html'))
    index = (RACINE / 'index.html').read_text(encoding='utf-8')
    m = re.search(r'<link rel="canonical" href="(https?://[^/"]+)/', index)
    domaine_actuel = m.group(1) if m else DOMAINE_PROVISOIRE

    modifications = {}
    masquees = []
    for fichier in pages + [RACINE / 'robots.txt', RACINE / 'sitemap.xml']:
        if not fichier.exists():
            continue
        avant = fichier.read_text(encoding='utf-8')
        apres = avant
        compteur = [0]
        if fichier.suffix == '.html':
            langue = 'en' if fichier.parent.name == 'en' else 'fr'
            apres = remplacer_spans(apres, rendus_langue[langue], langue, compteur)
            if fichier.name != '404.html':
                # Une page qui attend encore ses photos reste hors des moteurs de recherche
                masquee = photos_a_fournir(apres)
                if masquee:
                    masquees.append(fichier.relative_to(RACINE).as_posix())
                robots = 'index, follow' if indexation and not masquee else 'noindex'
                apres = RE_ROBOTS.sub(f'<meta name="robots" content="{robots}" data-info-meta="indexation">', apres)
            adresse = html.escape(valeurs['adresse_reception'], quote=True)
            # Seule la balise <form> est modifiée (pas les commentaires qui citent ces attributs)
            apres = re.sub(r'(<form\b[^>]*\sdata-adresse-reception=")[^"]*(")', lambda m: m.group(1) + adresse + m.group(2), apres, count=1)
            apres = re.sub(r'(<form\b[^>]*\sdata-mode-envoi=")[^"]*(")', lambda m: m.group(1) + mode + m.group(2), apres, count=1)
        if domaine_actuel != adresse_site:
            apres = apres.replace(domaine_actuel, adresse_site)
        if fichier.name == 'sitemap.xml':
            apres = ajuster_sitemap(apres, {url_page(r, adresse_site) for r in masquees})
        if apres != avant:
            modifications[fichier] = (apres, compteur[0])

    # Fichier CNAME : domaine relié au site sur GitHub Pages (une seule ligne, sans « https:// »)
    hote = urlsplit(adresse_site).hostname or ''
    cname = RACINE / 'CNAME'
    if adresse_site != DOMAINE_PROVISOIRE and hote:
        if not cname.exists() or cname.read_text(encoding='utf-8').strip() != hote:
            modifications[cname] = (hote, 0)

    for fichier, (contenu, _n) in modifications.items():
        fichier.write_text(contenu, encoding='utf-8')

    renseignees = [LIBELLES[c] for c in LIBELLES if valeurs[c]]
    vides = [LIBELLES[c] for c in LIBELLES if not valeurs[c]]
    a_traduire = [LIBELLES[c] for c in TEXTES_ANGLAIS if valeurs[c] and c not in anglais
                  and not (c == 'date_mise_a_jour' and date_en_anglais(valeurs[c]))]
    print(f'\nInformations renseignées ({len(renseignees)}) : ' + (', '.join(renseignees) or 'aucune'))
    print(f'Informations encore vides ({len(vides)}) : ' + (', '.join(vides) or 'aucune'))
    if a_traduire:
        print('Pages anglaises : texte français repris pour ' + ', '.join(a_traduire)
              + ' (traduction possible dans la section [version_anglaise]).')
    print(f'Adresse du site : {adresse_site}' + (' (adresse provisoire)' if adresse_site == DOMAINE_PROVISOIRE else ''))
    print('Référencement : ' + ('autorisé (index, follow)' if indexation else 'bloqué (noindex) tant que « indexation = non »'))
    if masquees:
        print('Pages tenues hors des moteurs de recherche (photos à fournir) : ' + ', '.join(masquees))
    if adresse_site != DOMAINE_PROVISOIRE and hote:
        print(f'Fichier CNAME (domaine relié sur GitHub Pages) : {hote}')
    print('Formulaire de devis : ' + (f'ACTIF, envoi vers {valeurs["adresse_reception"]} (mode {mode})' if valeurs['adresse_reception'] else 'inactif (aucune adresse de réception)'))
    if modifications:
        print('\nFichiers mis à jour :')
        for fichier, (_c, n) in sorted(modifications.items()):
            print(f'  - {fichier.relative_to(RACINE).as_posix()}' + (f' ({n} information(s))' if n else ''))
    else:
        print('\nAucun changement : les pages sont déjà à jour.')
    print('\nConseil : vérifiez ensuite le site avec  python outils/verifier_site.py')


if __name__ == '__main__':
    main()
