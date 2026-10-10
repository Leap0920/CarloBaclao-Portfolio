/**
 * The boot scripts.
 *
 * THE THEME SCRIPT IS GONE. It used to resolve a stored dark/light
 * preference before the first paint and stamp `.dark` or `.light` onto
 * <html>. The page is light-only now, with the palette sitting in
 * `:root`, so there is no preference to read, no class to apply and
 * nothing to flash: the very first paint is already the intended design,
 * with or without JavaScript. What is left is the reveal arming.
 */

/**
 * Arms the scroll-reveal styling before the first paint, so the page
 * never flashes its unwrapped content. If the app has not reported for
 * duty within four seconds (a failed bundle, an offline chunk) the
 * class comes back off and every section is simply visible. See
 * `[data-reveal]` in globals.css.
 */
export const REVEAL_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js-reveal');setTimeout(function(){if(!d.dataset.revealReady)d.classList.remove('js-reveal')},4000)})();`;
