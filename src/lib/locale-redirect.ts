import { routing } from "@/i18n/routing"

/**
 * Client-side redirect used by the static `404.html` (not-found) and the root
 * `index.html`. GitHub Pages can't do server redirects, so any unknown path
 * (chat-app junk like `/%2C`, typos like `/asd`) lands on `404.html`; this script
 * sends the visitor to the right locale home.
 *
 * Locale priority: a valid locale already in the URL (`/vi/junk` -> `/vi`) ->
 * the saved language (localStorage `locale`) -> the default locale.
 *
 * Emitted as a raw string so it runs during HTML parse, before any JS bundle.
 */
const LOCALES = JSON.stringify(routing.locales)
const DEFAULT = JSON.stringify(routing.defaultLocale)

export const localeRedirectScript =
  `(function(){try{var S=${LOCALES};` +
  `var seg=(location.pathname.split('/')[1]||'').toLowerCase();` +
  `var saved=null;try{saved=localStorage.getItem('locale')}catch(e){}` +
  `var loc=S.indexOf(seg)>=0?seg:(S.indexOf(saved)>=0?saved:${DEFAULT});` +
  `location.replace('/'+loc);}catch(e){location.replace('/'+${DEFAULT});}})();`

/** Default-locale home path, e.g. "/en" — used for the no-JS <noscript> fallback. */
export const defaultLocalePath = `/${routing.defaultLocale}`
