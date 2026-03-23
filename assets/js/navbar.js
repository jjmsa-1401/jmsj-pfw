/* ═══════════════════════════════════════════════════════════
   Navbar Manager — Handle navbar interactions
   ═══════════════════════════════════════════════════════════ */

const NavbarManager = (() => {
  // Initialize hamburger menu
  function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    // Close menu when a link is clicked
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // Close mobile nav
  function closeMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    if (hamburger) hamburger.classList.remove('open');
    if (mobileNav) mobileNav.classList.remove('open');
  }

  // Update active nav link based on current page
  function setActivePage() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const navLinks = document.querySelectorAll('.nav-center a, .mobile-nav a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('.html', '').replace('./', '');
      if (href === currentPage || (currentPage === '' && href === 'index')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Handle scroll effect for navbar border
  function initScrollBorder() {
    window.addEventListener('scroll', () => {
      const nav = document.querySelector('.navbar');
      if (!nav) return;
      
      nav.style.borderBottomColor = window.scrollY > 20
        ? 'var(--border2)'
        : 'var(--border)';
    });
  }

  // Initialize all navbar functionality
  function init() {
    setActivePage();
    initHamburger();
    initScrollBorder();
  }

  return {
    init,
    closeMobileNav,
    setActivePage
  };
})();

// Initialize navbar on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', NavbarManager.init);
} else {
  NavbarManager.init();
}
