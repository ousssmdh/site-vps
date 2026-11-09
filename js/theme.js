/* ==========================================================================
   VPS – Vigilance Protection Sécurité — affichage clair ou sombre (js/theme.js)
   --------------------------------------------------------------------------
   Ce petit script est chargé en haut de chaque page, AVANT la mise en forme :
   le bon affichage est appliqué dès le premier instant, sans clignotement.

   AFFICHAGE PROPOSÉ À UN NOUVEAU VISITEUR : modifiez la ligne ci-dessous.
     'clair'  → affichage clair (réglage actuel)
     'sombre' → affichage sombre
     'auto'   → suit le réglage de l'appareil du visiteur (clair ou sombre)

   Ensuite, chaque visiteur change d'affichage avec le bouton lune / soleil
   de l'en-tête (ou la ligne « Affichage » du menu sur téléphone). Son choix
   est mémorisé dans son propre navigateur (stockage local, clé
   « vps-affichage ») : aucun cookie, rien n'est envoyé à personne.
   Sans JavaScript, le site s'affiche en sombre et le bouton est masqué.
   Couleurs : css/style.css, section 2 (sombre) et section 18 (clair).
   ========================================================================== */
(function () {
  'use strict';

  var AFFICHAGE_PAR_DEFAUT = 'clair';

  var CLE = 'vps-affichage';
  var racine = document.documentElement;
  // Couleur de la barre du navigateur sur téléphone
  var COULEUR_BARRE = { clair: '#ffffff', sombre: '#05080f' };
  var anglais = (racine.getAttribute('lang') || '').toLowerCase().indexOf('en') === 0;
  var systeme = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function valide(valeur) {
    return valeur === 'clair' || valeur === 'sombre';
  }
  function choixMemorise() {
    try {
      var valeur = window.localStorage.getItem(CLE);
      return valide(valeur) ? valeur : null;
    } catch (e) {
      return null;
    }
  }
  function memoriser(valeur) {
    try {
      window.localStorage.setItem(CLE, valeur);
    } catch (e) {
      // Stockage indisponible (navigation privée stricte) : le choix vaut pour la page affichée.
    }
  }
  function affichageInitial() {
    var choix = choixMemorise();
    if (choix) return choix;
    if (AFFICHAGE_PAR_DEFAUT === 'auto') return systeme && systeme.matches ? 'sombre' : 'clair';
    return AFFICHAGE_PAR_DEFAUT === 'sombre' ? 'sombre' : 'clair';
  }
  // Bulle d'aide des boutons (le texte lu par les lecteurs d'écran est dans la page)
  function majBoutons(valeur) {
    var aide = valeur === 'clair'
      ? (anglais ? 'Switch to dark mode' : 'Passer en affichage sombre')
      : (anglais ? 'Switch to light mode' : 'Passer en affichage clair');
    var boutons = document.querySelectorAll('[data-bascule-theme]');
    for (var i = 0; i < boutons.length; i++) boutons[i].setAttribute('title', aide);
  }
  function appliquer(valeur) {
    racine.setAttribute('data-theme', valeur);
    var barre = document.querySelector('meta[name="theme-color"]');
    if (barre) barre.setAttribute('content', COULEUR_BARRE[valeur]);
    var schema = document.querySelector('meta[name="color-scheme"]');
    if (schema) schema.setAttribute('content', valeur === 'clair' ? 'light' : 'dark');
    majBoutons(valeur);
  }

  appliquer(affichageInitial());

  document.addEventListener('DOMContentLoaded', function () {
    majBoutons(racine.getAttribute('data-theme'));
  });

  document.addEventListener('click', function (evenement) {
    var cible = evenement.target;
    var bouton = cible && cible.closest ? cible.closest('[data-bascule-theme]') : null;
    if (!bouton) return;
    var nouveau = racine.getAttribute('data-theme') === 'clair' ? 'sombre' : 'clair';
    // Fondu des couleurs, sauf si l'appareil demande de réduire les animations
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      racine.classList.add('theme-transition');
      window.setTimeout(function () { racine.classList.remove('theme-transition'); }, 450);
    }
    memoriser(nouveau);
    appliquer(nouveau);
  });

  // Choix fait dans un autre onglet du site : appliqué ici aussi
  window.addEventListener('storage', function (evenement) {
    if (evenement.key === CLE && valide(evenement.newValue)) appliquer(evenement.newValue);
  });

  // Réglage « auto » : suit l'appareil tant que le visiteur n'a rien choisi
  if (AFFICHAGE_PAR_DEFAUT === 'auto' && systeme) {
    var suivre = function () {
      if (!choixMemorise()) appliquer(systeme.matches ? 'sombre' : 'clair');
    };
    if (systeme.addEventListener) systeme.addEventListener('change', suivre);
    else if (systeme.addListener) systeme.addListener(suivre);
  }
})();
