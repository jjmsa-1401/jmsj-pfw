/* ═══════════════════════════════════════════════════════════
   Theme Manager — Centralized theme toggle logic
   ═══════════════════════════════════════════════════════════ */

const ThemeManager = (() => {
  const THEME_KEY = 'theme';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';
  const DEFAULT_THEME = DARK_THEME;

  // Initialize theme on page load
  function init() {
    const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    applyTheme(savedTheme);
  }

  // Apply theme to document
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Get current theme
  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
  }

  // Toggle between dark and light
  function toggle() {
    const current = getCurrentTheme();
    const next = current === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(next);
    return next;
  }

  // Attach toggle button handler
  function attachToggleButton() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
      toggle();
      // Spin animation
      themeToggle.classList.remove('spinning');
      void themeToggle.offsetWidth; // force reflow
      themeToggle.classList.add('spinning');
      themeToggle.addEventListener('animationend', () => {
        themeToggle.classList.remove('spinning');
      }, { once: true });
    });
  }

  return {
    init,
    applyTheme,
    getCurrentTheme,
    toggle,
    attachToggleButton
  };
})();

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    ThemeManager.attachToggleButton();
  });
} else {
  ThemeManager.init();
  ThemeManager.attachToggleButton();
}
