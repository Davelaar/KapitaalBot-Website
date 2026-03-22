/**
 * KapitaalBot — lightweight GA4 + first-visit consent (NL/EN/DE/FR).
 * Default: analytics allowed until user explicitly rejects; reject → site blocked (overlay).
 *
 * Include after optional CSS: kapitaalbot-analytics.css
 * <script src="kapitaalbot-analytics.js" data-measurement-id="G-TLP1NT0CYH" defer></script>
 *
 * Optional: mark main app root for cleaner blocking:
 *   <div data-kapitaalbot-site-root>...</div>
 * Optional locale override: window.__KAPITAALBOT_LOCALE__ = 'de';
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'kapitaalbot_analytics_choice';
  var CHOICE_ACCEPTED = 'accepted';
  var CHOICE_REJECTED = 'rejected';
  var DEFAULT_MEASUREMENT_ID = 'G-TLP1NT0CYH';

  var MESSAGES = {
    nl: {
      consentDialogTitle: 'Cookie- en analyticskeuze',
      intro:
        'Deze site maakt gebruik van Google voor analytische doeleinden en plaatst daarom een cookie. Indien u hier niet mee instemt, kunt u geen gebruik maken van de site.',
      accept: 'Accepteren',
      reject: 'Afwijzen',
      blocked:
        'U heeft analytics geweigerd. Deze site is daardoor niet beschikbaar.',
    },
    en: {
      consentDialogTitle: 'Cookie and analytics choice',
      intro:
        'This site uses Google for analytics and therefore sets a cookie. If you do not agree, you cannot use this site.',
      accept: 'Accept',
      reject: 'Decline',
      blocked:
        'You declined analytics. This site is therefore not available.',
    },
    de: {
      consentDialogTitle: 'Auswahl zu Cookies und Analytics',
      intro:
        'Diese Website nutzt Google zu Analysezwecken und setzt daher ein Cookie. Wenn Sie nicht einverstanden sind, können Sie die Website nicht nutzen.',
      accept: 'Akzeptieren',
      reject: 'Ablehnen',
      blocked:
        'Sie haben Analytics abgelehnt. Diese Website steht Ihnen daher nicht zur Verfügung.',
    },
    fr: {
      consentDialogTitle: 'Choix cookies et analytique',
      intro:
        'Ce site utilise Google à des fins analytiques et dépose donc un cookie. Si vous n’acceptez pas, vous ne pouvez pas utiliser le site.',
      accept: 'Accepter',
      reject: 'Refuser',
      blocked:
        'Vous avez refusé les analyses. Ce site n’est donc pas disponible.',
    },
  };

  function getLocale() {
    if (typeof window.__KAPITAALBOT_LOCALE__ === 'string') {
      var o = window.__KAPITAALBOT_LOCALE__.toLowerCase().split('-')[0];
      if (MESSAGES[o]) return o;
    }
    var htmlLang = (document.documentElement.getAttribute('lang') || '')
      .toLowerCase()
      .split('-')[0];
    if (MESSAGES[htmlLang]) return htmlLang;
    var path = typeof location.pathname === 'string' ? location.pathname : '';
    var m = path.match(/^\/(nl|en|de|fr)(\/|$)/);
    if (m && MESSAGES[m[1]]) return m[1];
    return 'nl';
  }

  function t() {
    var loc = getLocale();
    return MESSAGES[loc] || MESSAGES.nl;
  }

  function getMeasurementId() {
    var el = document.currentScript;
    if (el && el.getAttribute) {
      var id = el.getAttribute('data-measurement-id');
      if (id && /^G-[A-Z0-9]+$/i.test(id)) return id;
    }
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var s = scripts[i];
      var src = s.src || '';
      if (src.indexOf('kapitaalbot-analytics') === -1) continue;
      var mid = s.getAttribute && s.getAttribute('data-measurement-id');
      if (mid && /^G-[A-Z0-9]+$/i.test(mid)) return mid;
    }
    return DEFAULT_MEASUREMENT_ID;
  }

  function ensureGtag() {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
    }
  }

  function loadGa4(measurementId) {
    ensureGtag();
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
    });
    var s = document.createElement('script');
    s.async = true;
    s.src =
      'https://www.googletagmanager.com/gtag/js?id=' +
      encodeURIComponent(measurementId);
    document.head.appendChild(s);
    s.onload = function () {
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        anonymize_ip: true,
        send_page_view: true,
      });
    };
  }

  function denyAnalytics() {
    ensureGtag();
    try {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    } catch (_e) {}
  }

  function hideSiteRoot() {
    var root = document.querySelector('[data-kapitaalbot-site-root]');
    if (root) {
      root.setAttribute('hidden', '');
      root.setAttribute('aria-hidden', 'true');
      try {
        root.style.display = 'none';
      } catch (_e) {}
    }
  }

  function showBlockedUI() {
    if (document.getElementById('kapitaalbot-analytics-blocked')) return;
    hideSiteRoot();
    var wrap = document.createElement('div');
    wrap.id = 'kapitaalbot-analytics-blocked';
    wrap.setAttribute('role', 'alert');
    var msg = t();
    wrap.innerHTML =
      '<div class="kapitaalbot-analytics-card"><p id="kapitaalbot-analytics-blocked-msg">' +
      escapeHtml(msg.blocked) +
      '</p></div>';
    wrap.setAttribute('aria-labelledby', 'kapitaalbot-analytics-blocked-msg');
    document.body.appendChild(wrap);
    document.documentElement.style.overflow = 'hidden';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showConsentOverlay() {
    if (document.getElementById('kapitaalbot-analytics-overlay')) return;
    var msg = t();
    var overlay = document.createElement('div');
    overlay.id = 'kapitaalbot-analytics-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'kapitaalbot-analytics-consent-heading');
    overlay.innerHTML =
      '<div class="kapitaalbot-analytics-card">' +
      '<h2 id="kapitaalbot-analytics-consent-heading" class="kapitaalbot-sr-only">' +
      escapeHtml(msg.consentDialogTitle) +
      '</h2>' +
      '<p>' +
      escapeHtml(msg.intro) +
      '</p>' +
      '<div class="kapitaalbot-analytics-actions">' +
      '<button type="button" data-kapitaalbot-analytics-reject>' +
      escapeHtml(msg.reject) +
      '</button>' +
      '<button type="button" class="kapitaalbot-analytics-primary" data-kapitaalbot-analytics-accept>' +
      escapeHtml(msg.accept) +
      '</button>' +
      '</div></div>';
    document.body.appendChild(overlay);
    overlay
      .querySelector('[data-kapitaalbot-analytics-accept]')
      .addEventListener('click', function () {
        try {
          localStorage.setItem(STORAGE_KEY, CHOICE_ACCEPTED);
        } catch (_e) {}
        overlay.setAttribute('hidden', '');
        overlay.remove();
      });
    overlay
      .querySelector('[data-kapitaalbot-analytics-reject]')
      .addEventListener('click', function () {
        try {
          localStorage.setItem(STORAGE_KEY, CHOICE_REJECTED);
        } catch (_e) {}
        denyAnalytics();
        overlay.setAttribute('hidden', '');
        overlay.remove();
        showBlockedUI();
      });
  }

  var choice = null;
  try {
    choice = localStorage.getItem(STORAGE_KEY);
  } catch (_e) {
    choice = null;
  }

  var measurementId = getMeasurementId();

  if (choice === CHOICE_REJECTED) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBlockedUI);
    } else {
      showBlockedUI();
    }
    return;
  }

  loadGa4(measurementId);

  if (choice === CHOICE_ACCEPTED) {
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showConsentOverlay);
  } else {
    showConsentOverlay();
  }
})();
