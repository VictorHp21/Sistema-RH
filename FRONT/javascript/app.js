


/* ==================== APP STATE ==================== */
const App = {

  showLoader(text = "Carregando...") {
    const loader = document.getElementById("global-loader");
    if (!loader) return;

    loader.classList.remove("hidden");
    loader.querySelector(".loader-text").textContent = text;
  },

  hideLoader() {
    const loader = document.getElementById("global-loader");
    if (loader) loader.classList.add("hidden");
  },

  // All data stored per company session
  getData() {
    return JSON.parse(localStorage.getItem('rh_data') || '{"companies":[],"users":[]}');
  },
  saveData(data) {
    localStorage.setItem('rh_data', JSON.stringify(data));
  },

  // Current session (in-memory only, cleared on page close)
  session: {
    companyId: null,
    userId: null,
    company: null,
    user: null,
  },

  // Load session from sessionStorage (tab-scoped)
  loadSession() {

    console.log("LOAD SESSION");

    const s = sessionStorage.getItem("rh_session");

    console.log(s);

    if (!s) {
      console.log("SEM SESSÃO");
      return false;
    }

    this.session = JSON.parse(s);

    console.log(this.session);

    return true;
  },

  saveSession() {
    sessionStorage.setItem(
      "rh_session",
      JSON.stringify(this.session)
    );
  },

  logout() {
    sessionStorage.removeItem('rh_session');
    this.session = { companyId: null, userId: null, company: null, user: null };
    window.location.href = '/paginas/index.html';
  },

  // Company palette & logo (stored per company inside companies array)
  getCompanyTheme() {
    const data = this.getData();
    const c = data.companies.find(c => c.id === this.session.companyId);
    return c ? { palette: c.palette, logo: c.logo } : { palette: null, logo: null };
  },

  getCompanyTheme() {
    return {
      palette: this.session.company?.palette || null,
      logo: this.session.company?.logoUrl || null
    };
  },

  applyCompanyTheme() {
    const { palette, logo } = this.getCompanyTheme();

    // Aplica as cores somente se a empresa possuir uma paleta
    if (palette) {
      document.documentElement.style.setProperty('--primary', palette.primary);
      document.documentElement.style.setProperty('--primary-light', palette.primaryLight);
      document.documentElement.style.setProperty('--primary-dark', palette.primaryDark);
      document.documentElement.style.setProperty('--secondary', palette.secondary);
      document.documentElement.style.setProperty('--shadow-glow', `0 0 40px ${palette.primary}40`);
    }

    // Atualiza nome da empresa
    const logoName = document.querySelectorAll('.company-name-text');
    const companyName = this.session.company?.nome || 'RH System';

    logoName.forEach(el => {
      el.textContent = companyName;
    });

    // Atualiza logo
    const logoEls = document.querySelectorAll('.company-logo-img');

    if (logo) {
      logoEls.forEach(el => {
        el.src = logo;
        el.style.display = 'block';

        const initials = el.closest('.logo-wrap')?.querySelector('.logo-initials');
        if (initials) {
          initials.style.display = 'none';
        }
      });
    }
  },

  // Guard - redirect to login if no session
  requireAuth() {
    if (!this.loadSession()) {
      window.location.href = '/paginas/index.html';
      return false;
    }
    this.applyCompanyTheme();
    return true;
  },

  // Helpers
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  },

  getInitials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  },

  formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  },

  formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  },

  // Get employees for current company
  async getEmployees() {
    const res = await fetch(`http://localhost:8080/empresa/${this.session.companyId}/funcionarios`);
    return await res.json();
  },

  async getDepartments() {
    const res = await fetch(
      `http://localhost:8080/empresa/${this.session.companyId}/departamentos`
    );

    return await res.json();
  },

};

/* ==================== TOAST ==================== */
const Toast = {
  container: null,

  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(title, message = '', type = 'info', duration = 4000) {
    if (!this.container) this.init();
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <div class="toast-text">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-msg">${message}</div>` : ''}
      </div>
    `;
    this.container.appendChild(toast);
    requestAnimationFrame(() => { requestAnimationFrame(() => toast.classList.add('show')); });
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  },

  success(title, msg) { this.show(title, msg, 'success'); },
  error(title, msg) { this.show(title, msg, 'error'); },
  warning(title, msg) { this.show(title, msg, 'warning'); },
  info(title, msg) { this.show(title, msg, 'info'); },
};



/* ==================== MODAL ==================== */
const Modal = {
  open(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.add('active'); document.body.style.overflow = 'hidden'; }
  },
  close(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('active'); document.body.style.overflow = ''; }
  },
  closeAll() {
    document.querySelectorAll('.modal-overlay.active').forEach(el => {
      el.classList.remove('active');
    });
    document.body.style.overflow = '';
  },
};

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) Modal.closeAll();
});

// Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') Modal.closeAll();
});

/* ==================== PALETTE PICKER ==================== */
const PalettePicker = {
  defaultPresets: [
    { name: 'Índigo (padrão)', primary: '#4F46E5', primaryLight: '#818CF8', primaryDark: '#3730A3', secondary: '#0EA5E9' },
    { name: 'Esmeralda', primary: '#059669', primaryLight: '#34D399', primaryDark: '#047857', secondary: '#0891B2' },
    { name: 'Violeta', primary: '#7C3AED', primaryLight: '#A78BFA', primaryDark: '#5B21B6', secondary: '#DB2777' },
    { name: 'Âmbar', primary: '#D97706', primaryLight: '#FCD34D', primaryDark: '#B45309', secondary: '#DC2626' },
    { name: 'Rosa', primary: '#BE185D', primaryLight: '#F472B6', primaryDark: '#9D174D', secondary: '#7C3AED' },
    { name: 'Ciano', primary: '#0891B2', primaryLight: '#67E8F9', primaryDark: '#0E7490', secondary: '#059669' },
  ],

  render() {
    const container = document.getElementById('palette-picker-panel');
    if (!container) return;
    const data = App.getData();
    const company = data.companies.find(c => c.id === App.session.companyId);
    const current = company?.palette;

    container.innerHTML = `
      <div class="palette-header">
        <span class="text-sm font-semibold" style="color:var(--text-2)">Paleta de Cores</span>
      </div>
      <div class="palette-presets">
        ${this.defaultPresets.map((p, i) => `
          <button class="palette-preset ${current?.primary === p.primary ? 'active' : ''}"
            onclick="PalettePicker.apply(${i})"
            data-tooltip="${p.name}"
            style="background: linear-gradient(135deg, ${p.primary}, ${p.secondary})">
          </button>
        `).join('')}
      </div>
      <div class="palette-divider"></div>
      <div class="palette-custom-label text-sm text-muted mb-2">Personalizar</div>
      <div class="palette-custom-grid">
        <div>
          <label class="form-label" style="font-size:0.7rem">Principal</label>
          <input type="color" class="color-input" id="cp-primary" value="${current?.primary || '#4F46E5'}" onchange="PalettePicker.previewCustom()">
        </div>
        <div>
          <label class="form-label" style="font-size:0.7rem">Clara</label>
          <input type="color" class="color-input" id="cp-light" value="${current?.primaryLight || '#818CF8'}" onchange="PalettePicker.previewCustom()">
        </div>
        <div>
          <label class="form-label" style="font-size:0.7rem">Escura</label>
          <input type="color" class="color-input" id="cp-dark" value="${current?.primaryDark || '#3730A3'}" onchange="PalettePicker.previewCustom()">
        </div>
        <div>
          <label class="form-label" style="font-size:0.7rem">Secundária</label>
          <input type="color" class="color-input" id="cp-secondary" value="${current?.secondary || '#0EA5E9'}" onchange="PalettePicker.previewCustom()">
        </div>
      </div>
      <button class="btn btn-primary btn-full btn-sm mt-2" onclick="PalettePicker.applyCustom()">Aplicar</button>
      <button class="btn btn-ghost btn-full btn-sm mt-2" onclick="PalettePicker.reset()">Restaurar padrão</button>
    `;
  },

  apply(index) {
    const p = this.defaultPresets[index];
    this.savePalette(p);
    this.applyToDOM(p);
    Toast.success('Paleta aplicada!', p.name);
    this.render();
  },

  previewCustom() {
    const p = this.getCustomValues();
    this.applyToDOM(p);
  },

  applyCustom() {
    const p = this.getCustomValues();
    this.savePalette(p);
    Toast.success('Cores personalizadas salvas!');
    this.render();
  },

  getCustomValues() {
    return {
      primary: document.getElementById('cp-primary')?.value || '#4F46E5',
      primaryLight: document.getElementById('cp-light')?.value || '#818CF8',
      primaryDark: document.getElementById('cp-dark')?.value || '#3730A3',
      secondary: document.getElementById('cp-secondary')?.value || '#0EA5E9',
    };
  },

  savePalette(palette) {
    const data = App.getData();
    const idx = data.companies.findIndex(c => c.id === App.session.companyId);
    if (idx > -1) { data.companies[idx].palette = palette; App.saveData(data); }
    if (App.session.company) App.session.company.palette = palette;
  },

  applyToDOM(p) {
    document.documentElement.style.setProperty('--primary', p.primary);
    document.documentElement.style.setProperty('--primary-light', p.primaryLight);
    document.documentElement.style.setProperty('--primary-dark', p.primaryDark);
    document.documentElement.style.setProperty('--secondary', p.secondary);
    document.documentElement.style.setProperty('--shadow-glow', `0 0 40px ${p.primary}40`);
  },

  reset() {
    const p = this.defaultPresets[0];
    this.savePalette(p);
    this.applyToDOM(p);
    Toast.info('Paleta restaurada para o padrão.');
    this.render();
  },
}




/* ==================== SIDEBAR TOGGLE ==================== */
function togglePaletteSidebar() {
  const panel = document.getElementById('palette-sidebar');
  if (panel) {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) PalettePicker.render();
  }
}

/* ==================== SIDEBAR ACTIVE LINK ==================== */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page) link.classList.add('active');
  });
}

window.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  setActiveNav();
});

