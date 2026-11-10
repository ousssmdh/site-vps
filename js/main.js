/* ==========================================================================
   VPS – Vigilance Protection Sécurité — scripts du site (js/main.js)
   Aucun cookie, aucune dépendance. Seul l'envoi du formulaire de devis
   contacte un service externe (FormSubmit, voir README.md, section 8).
   1. En-tête : fond opaque après défilement
   2. Menu plein écran (écrans de moins de 64em)
   3. Texte révélé mot à mot au défilement
   4. Apparition progressive des contenus
   5. Onglets des prestations (accueil)
   6. Carrousel de la galerie
   7. Année du pied de page
   8. Informations de config/infos-vps.ini (téléphone, e-mail, mentions…)
      → relues à chaque affichage : enregistrez le fichier, puis actualisez
        la page (F5). Rien à installer, rien à lancer.
   9. Formulaire de demande de devis
      → envoyé à l'adresse de réception indiquée dans config/infos-vps.ini
        (adresse_reception) ; INACTIF si elle est vide. Voir README.md.
   Les messages existent en français et en anglais (pages du dossier en/).
   L'affichage clair / sombre est géré à part, par js/theme.js.
   ========================================================================== */
(function () {
  'use strict';

  var racine = document.documentElement;
  var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ANGLAIS = (racine.getAttribute('lang') || '').toLowerCase().indexOf('en') === 0;
  function t(fr, en) { return ANGLAIS ? en : fr; }
  // Dossier du site, déduit de l'adresse de ce script (fonctionne aussi depuis le dossier en/)
  var scriptActuel = document.currentScript;
  var baseSite = scriptActuel && scriptActuel.src ? scriptActuel.src.replace(/js\/main\.js(?:[?#].*)?$/, '') : '';

  /* 1. En-tête ----------------------------------------------------------- */
  var entete = document.getElementById('entete');
  var enAttente = false;
  function majEntete() {
    enAttente = false;
    if (entete) entete.classList.toggle('defile', window.scrollY > 10);
  }
  majEntete();
  window.addEventListener('scroll', function () {
    if (!enAttente) {
      enAttente = true;
      window.requestAnimationFrame(majEntete);
    }
  }, { passive: true });

  /* 2. Menu plein écran -------------------------------------------------- */
  var boutonMenu = document.querySelector('.entete .bouton-menu');
  var menu = document.getElementById('menu-mobile');
  // Doit rester identique au seuil de css/style.css (64em).
  var ecranLarge = window.matchMedia('(min-width: 64em)');

  function menuOuvert() {
    return !!menu && !menu.hidden;
  }
  function focalisables() {
    return Array.prototype.slice.call(menu.querySelectorAll('a[href], button:not([disabled])'));
  }
  function ouvrirMenu() {
    menu.hidden = false;
    boutonMenu.setAttribute('aria-expanded', 'true');
    racine.classList.add('menu-ouvert');
    var premier = menu.querySelector('.fermer');
    if (premier) premier.focus();
  }
  function fermerMenu(rendreLeFocus) {
    if (!menuOuvert()) return;
    menu.hidden = true;
    boutonMenu.setAttribute('aria-expanded', 'false');
    racine.classList.remove('menu-ouvert');
    if (rendreLeFocus) boutonMenu.focus();
  }
  if (boutonMenu && menu) {
    boutonMenu.addEventListener('click', ouvrirMenu);
    Array.prototype.forEach.call(menu.querySelectorAll('[data-fermer]'), function (el) {
      el.addEventListener('click', function () { fermerMenu(el.classList.contains('fermer')); });
    });
    document.addEventListener('keydown', function (evenement) {
      if (!menuOuvert()) return;
      if (evenement.key === 'Escape') {
        fermerMenu(true);
        return;
      }
      if (evenement.key === 'Tab') {
        // Le focus reste dans le menu tant qu'il est ouvert
        var liste = focalisables();
        var premier = liste[0];
        var dernier = liste[liste.length - 1];
        if (evenement.shiftKey && document.activeElement === premier) {
          evenement.preventDefault();
          dernier.focus();
        } else if (!evenement.shiftKey && document.activeElement === dernier) {
          evenement.preventDefault();
          premier.focus();
        }
      }
    });
    var surChangement = function (evenement) { if (evenement.matches) fermerMenu(false); };
    if (ecranLarge.addEventListener) ecranLarge.addEventListener('change', surChangement);
    else if (ecranLarge.addListener) ecranLarge.addListener(surChangement);
  }

  /* 3. Texte révélé mot à mot ---------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-reveler]'), function (texte) {
    if (mouvementReduit.matches) return;
    var mots = texte.textContent.trim().split(/\s+/);
    texte.innerHTML = mots.map(function (mot) {
      return '<span class="mot">' + mot.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>';
    }).join(' ');
    var spans = texte.querySelectorAll('.mot');
    var maj = function () {
      var r = texte.getBoundingClientRect();
      var h = window.innerHeight;
      var p = Math.min(1, Math.max(0, (h * 0.85 - r.top) / (r.height + h * 0.3)));
      var n = Math.round(p * spans.length);
      for (var i = 0; i < spans.length; i++) spans[i].classList.toggle('vu', i < n);
    };
    maj();
    window.addEventListener('scroll', maj, { passive: true });
    window.addEventListener('resize', maj);
  });

  /* 4. Apparition progressive ------------------------------------------------ */
  var aMontrer = document.querySelectorAll('.apparition');
  if (!('IntersectionObserver' in window) || mouvementReduit.matches) {
    Array.prototype.forEach.call(aMontrer, function (el) { el.classList.add('vu'); });
  } else {
    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) {
          entree.target.classList.add('vu');
          observateur.unobserve(entree.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.12 });
    Array.prototype.forEach.call(aMontrer, function (el) { observateur.observe(el); });
  }

  /* 5. Onglets ----------------------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[role="tablist"]'), function (liste) {
    var onglets = Array.prototype.slice.call(liste.querySelectorAll('[role="tab"]'));
    function activer(onglet, focus) {
      onglets.forEach(function (o) {
        var actif = o === onglet;
        o.setAttribute('aria-selected', actif ? 'true' : 'false');
        o.tabIndex = actif ? 0 : -1;
        var panneau = document.getElementById(o.getAttribute('aria-controls'));
        if (panneau) panneau.hidden = !actif;
      });
      if (focus) onglet.focus();
    }
    onglets.forEach(function (o, i) {
      o.addEventListener('click', function () { activer(o, false); });
      o.addEventListener('keydown', function (e) {
        var cible = null;
        if (e.key === 'ArrowRight') cible = onglets[(i + 1) % onglets.length];
        if (e.key === 'ArrowLeft') cible = onglets[(i - 1 + onglets.length) % onglets.length];
        if (e.key === 'Home') cible = onglets[0];
        if (e.key === 'End') cible = onglets[onglets.length - 1];
        if (cible) {
          e.preventDefault();
          activer(cible, true);
        }
      });
    });
  });

  /* 6. Carrousel ---------------------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-carrousel]'), function (carrousel) {
    var piste = carrousel.querySelector('.carrousel-piste');
    var precedent = carrousel.querySelector('[data-precedent]');
    var suivant = carrousel.querySelector('[data-suivant]');
    var compteur = carrousel.querySelector('.carrousel-compteur');
    if (!piste || !precedent || !suivant) return;
    var elements = piste.children;
    function pas() {
      return elements.length > 1 ? elements[1].offsetLeft - elements[0].offsetLeft : piste.clientWidth;
    }
    function maj() {
      var max = piste.scrollWidth - piste.clientWidth;
      precedent.disabled = piste.scrollLeft <= 2;
      suivant.disabled = piste.scrollLeft >= max - 2;
      var index = Math.min(elements.length - 1, Math.round(piste.scrollLeft / Math.max(1, pas())));
      if (piste.scrollLeft >= max - 2) index = elements.length - 1;
      if (compteur) compteur.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(elements.length).padStart(2, '0');
    }
    function defiler(sens) {
      piste.scrollBy({ left: sens * pas(), behavior: mouvementReduit.matches ? 'auto' : 'smooth' });
    }
    precedent.addEventListener('click', function () { defiler(-1); });
    suivant.addEventListener('click', function () { defiler(1); });
    piste.addEventListener('scroll', function () { window.requestAnimationFrame(maj); }, { passive: true });
    window.addEventListener('resize', maj);
    carrousel.classList.add('carrousel--actif');
    maj();
  });

  /* 7. Année du pied de page ------------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('[data-annee]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* 8. Informations de config/infos-vps.ini ---------------------------------------
     Chaque élément portant data-info="cle" reçoit la valeur correspondante du
     fichier. Une valeur vide fait réapparaître le repère « À compléter »
     (texte de data-defaut). Les pages anglaises utilisent en priorité la
     section [version_anglaise]. Les mêmes règles sont appliquées par
     outils/preparer_publication.py, qui inscrit les valeurs dans les pages
     avant la mise en ligne. */
  var FICHIER_INFOS = 'config/infos-vps.ini';
  var RE_EMAIL = /^[^@\s<>"]+@[^@\s<>"]+\.[^@\s<>"]{2,}$/;
  var MOIS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var MOIS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var avertissements = [];

  function chargerInfos(suite) {
    var termine = false;
    function terminer(texte, erreur) {
      if (termine) return;
      termine = true;
      suite(texte, erreur);
    }
    if (!baseSite) {
      terminer(null, '');
      return;
    }
    if (window.location.protocol === 'file:') {
      // Site ouvert par double-clic : le navigateur interdit de lire un fichier
      // directement, il est donc chargé comme un script (c'est le rôle de la
      // première et de la dernière ligne de config/infos-vps.ini).
      window.VPS_INFOS = undefined;
      var balise = document.createElement('script');
      balise.src = baseSite + FICHIER_INFOS;
      balise.charset = 'utf-8';
      balise.onload = function () {
        if (typeof window.VPS_INFOS === 'string') terminer(window.VPS_INFOS, '');
        else terminer(null, 'illisible');
      };
      balise.onerror = function () { terminer(null, 'introuvable'); };
      document.head.appendChild(balise);
      return;
    }
    if (!window.fetch) {
      terminer(null, '');
      return;
    }
    window.fetch(baseSite + FICHIER_INFOS, { cache: 'no-cache' })
      .then(function (reponse) { return reponse.ok ? reponse.text() : null; })
      .then(function (texte) { terminer(texte, texte === null ? 'introuvable' : ''); },
        function () { terminer(null, 'introuvable'); });
  }

  function lireIni(texte) {
    var sections = {};
    var section = null;
    var cle = null;
    String(texte).replace(/^\uFEFF/, '').split(/\r\n|\r|\n/).forEach(function (ligne) {
      var nette = ligne.trim();
      if (!nette || nette.charAt(0) === ';' || nette.charAt(0) === '#') return;
      var titre = /^\[([^\]]+)\]$/.exec(nette);
      if (titre) {
        section = titre[1].trim();
        sections[section] = sections[section] || {};
        cle = null;
        return;
      }
      if (/^\s/.test(ligne) && section && cle) {
        sections[section][cle] += '\n' + nette; // suite d'une valeur écrite sur plusieurs lignes
        return;
      }
      var egal = ligne.indexOf('=');
      if (!section || egal < 1) {
        cle = null;
        return;
      }
      cle = ligne.slice(0, egal).trim().toLowerCase();
      sections[section][cle] = ligne.slice(egal + 1).trim();
    });
    return sections;
  }

  function nettoyer(valeur) {
    var v = String(valeur || '').trim();
    var c = v.charAt(0);
    if (v.length >= 2 && (c === '"' || c === "'") && v.charAt(v.length - 1) === c) v = v.slice(1, -1).trim();
    return v;
  }

  function dateEnAnglais(valeur) {
    var m = /^(\d{1,2})(?:er)?\s+(\S+)\s+(\d{4})$/i.exec(String(valeur || '').trim());
    if (!m) return '';
    var i = MOIS_FR.indexOf(m[2].toLowerCase());
    return i < 0 ? '' : parseInt(m[1], 10) + ' ' + MOIS_EN[i] + ' ' + m[3];
  }

  function valeursInfos(sections) {
    var v = {};
    Object.keys(sections).forEach(function (nom) {
      if (nom === 'version_anglaise') return;
      Object.keys(sections[nom]).forEach(function (cle) { v[cle] = nettoyer(sections[nom][cle]); });
    });
    if (ANGLAIS) {
      var date = dateEnAnglais(v.date_mise_a_jour);
      if (date) v.date_mise_a_jour = date;
      var anglais = sections.version_anglaise || {};
      Object.keys(anglais).forEach(function (cle) {
        var valeur = nettoyer(anglais[cle]);
        if (valeur) v[cle] = valeur;
      });
    }
    return v;
  }

  function typo(texte) {
    var r = String(texte).replace(/'/g, '\u2019');
    if (!ANGLAIS) r = r.replace(/ ([:;!?»])/g, '\u00a0$1').replace(/« /g, '«\u00a0');
    return r;
  }

  function numeroTelephone(numero) {
    var chiffres = numero.replace(/[^\d+]/g, '');
    if (chiffres.indexOf('00') === 0) chiffres = '+' + chiffres.slice(2);
    else if (chiffres.charAt(0) === '0' && chiffres.length === 10) chiffres = '+33' + chiffres.slice(1);
    return chiffres;
  }

  function telephoneValide(numero) {
    return !/[^0-9+().\s-]/.test(numero) && numero.replace(/\D/g, '').length >= 9;
  }

  function ajouterLien(el, adresse, texte) {
    var a = document.createElement('a');
    a.setAttribute('href', adresse);
    a.textContent = texte;
    el.appendChild(a);
  }

  function remplir(el, cle, valeur) {
    while (el.firstChild) el.removeChild(el.firstChild);
    if (!valeur) {
      var defaut = el.getAttribute('data-defaut') || '';
      if (defaut) {
        el.className = defaut.length <= 16 ? 'a-completer a-completer--court' : 'a-completer';
        el.textContent = '[' + typo(defaut) + ']';
      } else {
        el.removeAttribute('class');
      }
      return;
    }
    el.removeAttribute('class');
    if (cle === 'telephone' || cle === 'hebergeur_telephone') {
      ajouterLien(el, 'tel:' + numeroTelephone(valeur), valeur);
    } else if (cle === 'email_phrase') {
      el.appendChild(document.createTextNode(t(' Vous pouvez aussi nous écrire à ', ' You can also email us at ')));
      ajouterLien(el, 'mailto:' + valeur, valeur);
      el.appendChild(document.createTextNode('.'));
    } else if (cle === 'email' || (cle === 'contact_donnees' && RE_EMAIL.test(valeur))) {
      ajouterLien(el, 'mailto:' + valeur, valeur);
    } else {
      valeur.split('\n').forEach(function (ligne, i) {
        if (i) el.appendChild(document.createElement('br'));
        el.appendChild(document.createTextNode(typo(ligne.trim())));
      });
    }
  }

  function appliquerInfos(texte) {
    var v = valeursInfos(lireIni(texte));
    if (v.email && !RE_EMAIL.test(v.email)) {
      avertissements.push('e-mail invalide « ' + v.email + ' »');
      v.email = '';
    }
    ['telephone', 'hebergeur_telephone'].forEach(function (cle) {
      if (v[cle] && !telephoneValide(v[cle])) {
        avertissements.push('numéro invalide « ' + v[cle] + ' » (' + cle + ')');
        v[cle] = '';
      }
    });
    if (Object.prototype.hasOwnProperty.call(v, 'email')) v.email_phrase = v.email;
    Array.prototype.forEach.call(document.querySelectorAll('[data-info]'), function (el) {
      var cle = el.getAttribute('data-info');
      if (Object.prototype.hasOwnProperty.call(v, cle)) remplir(el, cle, v[cle]);
    });
    var form = document.getElementById('formulaire-devis');
    if (form && Object.prototype.hasOwnProperty.call(v, 'adresse_reception')) {
      var adresse = v.adresse_reception;
      if (adresse && !/^https:\/\/[^\s"'<>]+$/i.test(adresse)) {
        avertissements.push('adresse de réception invalide (elle doit commencer par https://)');
        adresse = '';
      }
      form.setAttribute('data-adresse-reception', adresse);
      form.setAttribute('data-mode-envoi', (v.mode_envoi || '').toLowerCase() === 'classique' ? 'classique' : 'ajax');
    }
  }

  function avertirEnLocal(messages) {
    // Message visible uniquement sur l'ordinateur où le site est ouvert par
    // double-clic : il n'apparaît jamais sur le site en ligne.
    if (window.location.protocol !== 'file:' || !messages.length) return;
    var bandeau = document.createElement('div');
    bandeau.className = 'alerte-locale';
    bandeau.setAttribute('role', 'status');
    bandeau.setAttribute('lang', 'fr');
    var texte = document.createElement('p');
    texte.textContent = 'Aperçu local (message visible seulement sur votre ordinateur) : ' + messages.join(' ; ') + '.';
    var fermer = document.createElement('button');
    fermer.type = 'button';
    fermer.textContent = 'Fermer';
    fermer.addEventListener('click', function () { bandeau.parentNode.removeChild(bandeau); });
    bandeau.appendChild(texte);
    bandeau.appendChild(fermer);
    document.body.appendChild(bandeau);
  }

  /* 9. Formulaire de demande de devis ------------------------------------------- */
  var formulaire = document.getElementById('formulaire-devis');

  chargerInfos(function (texte, erreur) {
    var messages = [];
    if (texte !== null) {
      try {
        appliquerInfos(texte);
      } catch (e) {
        erreur = 'illisible';
      }
    }
    if (erreur === 'introuvable') {
      messages.push('le fichier config/infos-vps.ini est introuvable, les informations affichées sont celles inscrites dans les pages');
    } else if (erreur === 'illisible') {
      messages.push("le fichier config/infos-vps.ini n'a pas pu être lu : vérifiez que sa première et sa dernière ligne n'ont pas été modifiées et qu'il ne contient pas d'accent grave seul");
    }
    if (avertissements.length) {
      messages.push('valeur(s) ignorée(s) dans config/infos-vps.ini : ' + avertissements.join(', '));
    }
    avertirEnLocal(messages);
    if (formulaire) initialiserFormulaire(formulaire);
  });

  function initialiserFormulaire(form) {
    var adresse = (form.getAttribute('data-adresse-reception') || '').trim();
    var bouton = form.querySelector('button[type="submit"]');
    var statut = form.querySelector('.statut-formulaire');
    var avis = document.getElementById('formulaire-inactif');
    var actif = /^https:\/\/[^\s"'<>]+$/i.test(adresse);

    if (!actif) {
      // FORMULAIRE NON ACTIF : le bouton reste désactivé et rien n'est envoyé.
      form.addEventListener('submit', function (evenement) {
        evenement.preventDefault();
        afficherStatut(statut, t("Formulaire non actif : aucune donnée n'a été envoyée.", 'Form not active: no data has been sent.'), 'erreur');
      });
      return;
    }

    // FORMULAIRE ACTIF : un service de réception a été configuré.
    var classique = form.getAttribute('data-mode-envoi') === 'classique';
    adresse = adresseSelonMode(adresse, classique);
    if (avis) avis.hidden = true;
    form.setAttribute('action', adresse);
    bouton.disabled = false;
    bouton.textContent = bouton.getAttribute('data-libelle-actif') || t('Envoyer', 'Send');

    form.addEventListener('input', function (evenement) {
      if (evenement.target.getAttribute('aria-invalid') === 'true') verifierChamp(evenement.target);
    });
    form.addEventListener('change', function (evenement) {
      if (evenement.target.getAttribute('aria-invalid') === 'true') verifierChamp(evenement.target);
    });

    form.addEventListener('submit', function (evenement) {
      var premierInvalide = verifierFormulaire(form);
      if (premierInvalide) {
        evenement.preventDefault();
        afficherStatut(statut, t('Merci de corriger les champs signalés.', 'Please correct the highlighted fields.'), 'erreur');
        premierInvalide.focus();
        return;
      }

      // Mode « classique » : le navigateur envoie le formulaire lui-même.
      if (classique) return;

      // Mode « ajax » (par défaut) : envoi en arrière-plan, confirmation
      // affichée UNIQUEMENT si le service confirme la bonne réception.
      evenement.preventDefault();
      bouton.disabled = true;
      afficherStatut(statut, t('Envoi en cours…', 'Sending…'), '');

      fetch(adresse, {
        method: 'POST',
        body: new URLSearchParams(new FormData(form)),
        headers: { Accept: 'application/json' }
      })
        .then(lireReponse)
        .then(function () {
          form.reset();
          afficherStatut(statut, t('Merci : votre demande a bien été envoyée.', 'Thank you: your request has been sent.'), 'succes');
        })
        .catch(function (erreur) {
          afficherStatut(statut, messageEchec(erreur), 'erreur');
        })
        .then(function () {
          bouton.disabled = false;
        });
    });
  }

  // FormSubmit : adresse « /ajax/ » pour l'envoi en arrière-plan, sans « /ajax/ »
  // en mode classique. Les adresses des autres services restent telles quelles.
  function adresseSelonMode(adresse, classique) {
    var m = /^(https:\/\/formsubmit\.co\/)(?:ajax\/)?(.+)$/i.exec(adresse);
    return m ? m[1] + (classique ? '' : 'ajax/') + m[2] : adresse;
  }

  // Réponse du service : la demande n'est confirmée que si le service l'indique
  // (FormSubmit : « success » ; Formspree : « ok » et « errors »).
  function lireReponse(reponse) {
    return reponse.text().then(function (texte) {
      var d = {};
      try { d = JSON.parse(texte) || {}; } catch (e) { d = {}; }
      var refus = d.success === false || d.success === 'false' || d.ok === false || !!(d.errors && d.errors.length);
      if (!reponse.ok || refus) {
        var erreur = new Error('Réponse ' + reponse.status);
        erreur.detail = typeof d.message === 'string' ? d.message : '';
        throw erreur;
      }
    });
  }

  function messageEchec(erreur) {
    if (window.location.protocol === 'file:') {
      return t("Aperçu local : l'envoi ne fonctionne que sur le site en ligne (voir README.md, section 8).", 'Local preview: sending only works on the live website (see README.md, section 8).');
    }
    if (/activat/i.test((erreur && erreur.detail) || '')) {
      return t("Le formulaire est en cours d'activation : votre demande n'a pas pu être confirmée. Merci de réessayer plus tard ou d'utiliser les coordonnées de la page Contact.", 'The form is being activated: your request could not be confirmed. Please try again later or use the details on the Contact page.');
    }
    return t("L'envoi a échoué. Merci de réessayer plus tard ou d'utiliser les coordonnées de la page Contact.", 'Sending failed. Please try again later or use the details on the Contact page.');
  }

  function verifierFormulaire(form) {
    var champs = form.querySelectorAll('input:not([type="hidden"]):not([tabindex="-1"]), select, textarea');
    var premierInvalide = null;
    for (var i = 0; i < champs.length; i++) {
      if (!verifierChamp(champs[i]) && !premierInvalide) premierInvalide = champs[i];
    }
    return premierInvalide;
  }

  function verifierChamp(champ) {
    var valeur = (champ.value || '').trim();
    var message = '';

    if (champ.required && !valeur) {
      message = champ.tagName === 'SELECT' ? t('Sélectionnez une option.', 'Please select an option.') : t('Ce champ est obligatoire.', 'This field is required.');
    } else if (valeur && champ.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valeur)) {
      message = t('Saisissez une adresse e-mail valide (exemple : prenom.nom@entreprise.fr).', 'Enter a valid email address (for example: firstname.lastname@company.com).');
    } else if (valeur && champ.type === 'tel' && (/[^0-9+().\s-]/.test(valeur) || valeur.replace(/\D/g, '').length < 9)) {
      message = t('Saisissez un numéro de téléphone valide.', 'Enter a valid phone number.');
    }

    var idErreur = champ.id + '-erreur';
    var zone = document.getElementById(idErreur);

    if (message) {
      if (!zone) {
        zone = document.createElement('p');
        zone.id = idErreur;
        zone.className = 'erreur-champ';
        champ.parentNode.appendChild(zone);
      }
      zone.textContent = message;
      zone.hidden = false;
      champ.setAttribute('aria-invalid', 'true');
      ajouterDescription(champ, idErreur);
      return false;
    }

    if (zone) {
      zone.textContent = '';
      zone.hidden = true;
    }
    champ.removeAttribute('aria-invalid');
    retirerDescription(champ, idErreur);
    return true;
  }

  function ajouterDescription(champ, id) {
    var ids = (champ.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    if (ids.indexOf(id) === -1) ids.push(id);
    champ.setAttribute('aria-describedby', ids.join(' '));
  }

  function retirerDescription(champ, id) {
    var ids = (champ.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (x) {
      return x && x !== id;
    });
    if (ids.length) champ.setAttribute('aria-describedby', ids.join(' '));
    else champ.removeAttribute('aria-describedby');
  }

  function afficherStatut(zone, texte, type) {
    if (!zone) return;
    zone.textContent = texte;
    zone.classList.remove('est-succes', 'est-erreur');
    if (type) zone.classList.add('est-' + type);
  }
})();
