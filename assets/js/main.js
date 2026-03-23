/* ═══════════════════════════════════════════════════════════
   Main Application Script — Core functionality
   ═══════════════════════════════════════════════════════════ */

/* ── Skill Bar Animation ──────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (fills.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animate');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
})();

/* ── Contact Form ─────────────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  if (!btn) return;

  const originalText = btn.textContent;
  const originalBg = btn.style.background;
  const originalColor = btn.style.color;

  btn.textContent = 'Message Sent!';
  btn.style.background = '#3a2e10';
  btn.style.color = 'var(--gold)';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = originalBg;
    btn.style.color = originalColor;
    btn.disabled = false;
    e.target.reset();
  }, 3000);
}

/* ── Project Modal ────────────────────────────────────────── */
(function initProjectModal() {
  const projects = [
    {
      tag:   'Web Design',
      title: 'Luxe Brand Identity',
      desc:  'Full visual identity and website redesign for a luxury fashion label. Focused on editorial typography, refined motion, and a timeless monochrome palette with gold accents.',
      svgId: 0
    },
    {
      tag:   'App UI',
      title: 'Finance Dashboard',
      desc:  'Data-dense analytics dashboard designed for speed and clarity. Built with React and a custom charting system. The layout prioritises the most critical KPIs at a glance.',
      svgId: 1
    },
    {
      tag:   'Motion',
      title: 'Onboarding Flow',
      desc:  'Animated onboarding sequence that increased user activation by 38%. Each micro-interaction was prototyped in Framer and refined through three rounds of usability testing.',
      svgId: 2
    }
  ];

  const backdrop = document.getElementById('projectModal');
  if (!backdrop) return;

  const modalPreview = document.getElementById('modalPreview');
  const modalTag     = document.getElementById('modalTag');
  const modalTitle   = document.getElementById('modalTitle');
  const modalDesc    = document.getElementById('modalDesc');
  const modalClose   = document.getElementById('modalClose');

  if (!modalPreview || !modalTag || !modalTitle || !modalDesc || !modalClose) return;

  // Clone the card SVG into the modal preview
  function openModal(idx) {
    const p = projects[idx];
    modalTag.textContent   = p.tag;
    modalTitle.textContent = p.title;
    modalDesc.textContent  = p.desc;

    // Grab the SVG from the corresponding card thumb
    const cards = document.querySelectorAll('.project-thumb svg');
    const clonedSvg = cards[idx] ? cards[idx].cloneNode(true) : null;

    // Clear previous SVG (keep header button)
    const header = modalPreview.querySelector('.project-modal-header');
    Array.from(modalPreview.children).forEach(c => {
      if (c !== header) c.remove();
    });

    if (clonedSvg) {
      clonedSvg.style.width  = '100%';
      clonedSvg.style.height = '100%';
      modalPreview.insertBefore(clonedSvg, header);
    }

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-thumb-overlay').forEach(el => {
    el.addEventListener('click', () => openModal(+el.dataset.project));
  });

  modalClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* ── Lightning Canvas Animation ───────────────────────────── */
(function initLightningCanvas() {
  const canvas = document.getElementById('lightning-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const gold   = { r: 201, g: 168, b: 76 };
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function makeBolt(x1, y1, x2, y2, roughness, depth) {
    if (depth === 0) return [[x1, y1, x2, y2]];
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness;
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness;
    return [
      ...makeBolt(x1, y1, mx, my, roughness * 0.55, depth - 1),
      ...makeBolt(mx, my, x2, y2, roughness * 0.55, depth - 1)
    ];
  }

  class Arc {
    constructor() { this.reset(); }
    reset() {
      const edge = Math.floor(Math.random() * 4);
      if      (edge === 0) { this.x1 = Math.random() * W; this.y1 = 0; }
      else if (edge === 1) { this.x1 = W;                 this.y1 = Math.random() * H; }
      else if (edge === 2) { this.x1 = Math.random() * W; this.y1 = H; }
      else                 { this.x1 = 0;                 this.y1 = Math.random() * H; }
      const angle  = Math.random() * Math.PI * 2;
      const len    = 100 + Math.random() * 320;
      this.x2      = this.x1 + Math.cos(angle) * len;
      this.y2      = this.y1 + Math.sin(angle) * len;
      this.life    = 0;
      this.maxLife = 20 + Math.random() * 25;
      this.segments = makeBolt(this.x1, this.y1, this.x2, this.y2, 70 + Math.random() * 50, 5);
      this.branches = [];
      if (Math.random() < 0.45 && this.segments.length > 4) {
        const si = Math.floor(this.segments.length / 2);
        const bx = this.segments[si][0], by = this.segments[si][1];
        const ba = Math.random() * Math.PI * 2, bl = 40 + Math.random() * 100;
        this.branches.push(makeBolt(bx, by, bx + Math.cos(ba) * bl, by + Math.sin(ba) * bl, 35, 3));
      }
    }
  }

  const arcs  = Array.from({ length: 7 }, () => { const a = new Arc(); a.life = Math.random() * a.maxLife; return a; });
  const nodes = Array.from({ length: 14 }, () => ({
    px: Math.random(), py: Math.random(),
    r: 50 + Math.random() * 100,
    a: Math.random() * Math.PI * 2,
    spd: 0.00015 + Math.random() * 0.0003,
    op: 0.018 + Math.random() * 0.032
  }));

  function drawSegs(segs, alpha, width) {
    segs.forEach(([x1, y1, x2, y2]) => {
      ctx.strokeStyle = `rgba(${gold.r},${gold.g},${gold.b},${alpha * 0.07})`; 
      ctx.lineWidth = width * 12;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      
      ctx.strokeStyle = `rgba(${gold.r},${gold.g},${gold.b},${alpha * 0.3})`;  
      ctx.lineWidth = width * 3;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      
      ctx.strokeStyle = `rgba(255,245,190,${alpha * 0.85})`;                   
      ctx.lineWidth = width * 0.6;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });
  }

  let last = 0;
  function frame(ts) {
    const dt = Math.min(ts - last, 50); 
    last = ts;
    
    ctx.clearRect(0, 0, W, H);
    
    nodes.forEach(n => {
      n.a += n.spd * dt;
      const nx = (n.px + Math.sin(n.a) * 0.08) * W;
      const ny = (n.py + Math.cos(n.a * 0.7) * 0.08) * H;
      const g  = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
      g.addColorStop(0, `rgba(${gold.r},${gold.g},${gold.b},${n.op})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(nx, ny, n.r, 0, Math.PI * 2); ctx.fill();
    });
    
    arcs.forEach(arc => {
      arc.life += 0.55 * (dt / 16);
      if (arc.life > arc.maxLife) { arc.reset(); return; }
      const t     = arc.life / arc.maxLife;
      const alpha = Math.min(t * 10, 1) * (t > 0.5 ? Math.max(1 - (t - 0.5) * 3.5, 0) : 1);
      drawSegs(arc.segments, alpha, 1.3);
      arc.branches.forEach(b => drawSegs(b, alpha * 0.45, 0.75));
      
      if (t < 0.12) {
        const fa = (1 - t / 0.12) * 0.55;
        ctx.fillStyle = `rgba(255,245,190,${fa})`;
        ctx.beginPath(); ctx.arc(arc.x1, arc.y1, 4, 0, Math.PI * 2); ctx.fill();
        const fg = ctx.createRadialGradient(arc.x1, arc.y1, 0, arc.x1, arc.y1, 32);
        fg.addColorStop(0, `rgba(${gold.r},${gold.g},${gold.b},${fa * 0.5})`);
        fg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fg;
        ctx.beginPath(); ctx.arc(arc.x1, arc.y1, 32, 0, Math.PI * 2); ctx.fill();
      }
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
