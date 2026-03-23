/* ── Load Navbar Component ────────────────────────────────── */
async function loadNavbar() {
  try {
    const response = await fetch('navbar.html');
    const navbarHTML = await response.text();
    
    // Insert navbar at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    
    // Set active page based on current URL
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const navLinks = document.querySelectorAll('[data-page]');
    
    navLinks.forEach(link => {
      if (link.getAttribute('data-page') === currentPage) {
        link.classList.add('active');
      }
    });
    
    // Initialize navbar functionality
    initNavbar();
    
  } catch (error) {
    console.error('Error loading navbar:', error);
  }
}

/* ── Initialize Navbar Functionality ──────────────────────── */
function initNavbar() {
  // Theme Toggle
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    
    /* Spin the button on each click */
    themeToggle.classList.remove('spinning');
    void themeToggle.offsetWidth; /* force reflow */
    themeToggle.classList.add('spinning');
    themeToggle.addEventListener('animationend', () => {
      themeToggle.classList.remove('spinning');
    }, { once: true });
  });
  
  // Hamburger Menu
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  
  // Navbar border on scroll
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) {
      nav.style.borderBottomColor = window.scrollY > 20
        ? 'var(--border2)'
        : 'var(--border)';
    }
  });
}

// Load navbar when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
  loadNavbar();
}