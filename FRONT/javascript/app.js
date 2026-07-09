


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

  async getCompanySummary() {

    const res = await fetch(
      `http://localhost:8080/empresa/${this.session.companyId}/resumo`
    );

    if (!res.ok)
      throw new Error("Erro ao carregar empresa");

    return await res.json();
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
    const company = this.session.company;

    if (!company) return;

    // Aplica as cores da empresa
    if (company.corPrincipal) {
      document.documentElement.style.setProperty('--primary', company.corPrincipal);
      document.documentElement.style.setProperty('--primary-light', company.corPrincipalClara);
      document.documentElement.style.setProperty('--primary-dark', company.corPrincipalEscura);
      document.documentElement.style.setProperty('--secondary', company.corSecundaria);
      document.documentElement.style.setProperty(
        '--shadow-glow',
        `0 0 40px ${company.corPrincipal}40`
      );
    }

    // Atualiza nome da empresa
    const companyName = company.nome || 'RH System';

    document.querySelectorAll('.company-name-text').forEach(el => {
      el.textContent = companyName;
    });


    // Atualiza logo
    const logo = company.logo;

    document.querySelectorAll('.company-logo-img').forEach(el => {
      if (logo) {
        el.src = logo;
        el.style.display = 'block';

        const initials = el.closest('.logo-wrap')?.querySelector('.logo-initials');
        if (initials) initials.style.display = 'none';
      }
    });
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
    if (!name || typeof name !== 'string') return "??";

    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  },
  formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  },

  formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  },

  // empresa

  async updateCompany(id, payload) {
    const res = await fetch(`http://localhost:8080/empresa/${this.session.companyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Erro ao atualizar empresa");
    }

    return await res.json();
  },


  // funcionarios e departamentos

  getFilteredEmployees: async function () {
    let list = await this.getEmployees();

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e =>
        e.name?.toLowerCase().includes(q) ||
        e.position?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q)
      );
    }

    if (filterStatus) list = list.filter(e => e.status === filterStatus);
    if (filterDept) list = list.filter(e => e.departmentId === filterDept);

    return list;
  },

  normalizeEmployee(e) {
    return {
      id: e.id,
      nome: e.nome || e.name,
      cargo: e.cargo || e.position,
      departmentId: e.departmentId || e.departamentoId
    };
  },

  async getEmployees() {
    const res = await fetch(`http://localhost:8080/empresa/${this.session.companyId}/funcionarios`);
    const data = await res.json();

    const list = Array.isArray(data)
      ? data
      : (data.funcionarios || data.data || data.content || []);

    return list.map(e => ({
      id: e.id,
      name: e.nome,
      email: e.email || '',
      phone: e.telefone || '',
      cpf: e.cpf || '',


      cargoNome: e.cargoNome || '—',
      departamentoNome: e.departamentoNome || '—',

      admission: e.dataDeContratacao,
      salary: e.salario,
      status: e.statusEmpregado ? 'ativo' : 'inativo',
    }));
  },

  async getDepartments() {
    const res = await fetch(
      `http://localhost:8080/empresa/${this.session.companyId}/departamentos`
    );

    return await res.json();
  },

  async getPositions() {
    const res = await fetch(
      `http://localhost:8080/empresa/${this.session.companyId}/cargos`
    );

    if (!res.ok) {
      throw new Error("Erro ao carregar cargos");
    }

    return await res.json();
  },

  /* Função para criar cargo*/

  async createPosition(payload) {

    const departamentoId = document.getElementById("pos-dept").value;

    const res = await fetch(`http://localhost:8080/cargos/${this.session.companyId}/${departamentoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Erro ao criar cargo");

    return await res.json();
  },

  async updatePosition(id, payload) {

    const departamentoId = document.getElementById("pos-dept").value;

    const res = await fetch(`http://localhost:8080/cargos/${id}/${departamentoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Erro ao atualizar cargo");

    return await res.json();
  },

  async deletePosition(id) {
    const res = await fetch(`http://localhost:8080/cargos/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Erro ao deletar cargo");
  },

  /*funções para funcionários */

  async createEmployee(payload) {
    const res = await fetch("http://localhost:8080/funcionarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Erro ao cadastrar funcionário");
    }

    return await res.json();
  },

  async updateEmployee(id, payload) {
    const res = await fetch(`http://localhost:8080/funcionarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Erro ao atualizar funcionário");
    }

    return await res.json();
  },

  async deleteEmployee(id) {
    const res = await fetch(`http://localhost:8080/funcionarios/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Erro ao excluir funcionário");
    }

    return await res.text();
  },

  async getEmployee(id) {
    const res = await fetch(`http://localhost:8080/funcionarios/${id}`);

    if (!res.ok) {
      throw new Error("Funcionário não encontrado");
    }

    return await res.json();
  },

  // funções para departamentos


  async createDepartament(payload) {
    const res = await fetch(`http://localhost:8080/departamentos/${this.session.companyId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Erro ao criar cargo");

    return await res.json();
  },

  async updateDepartament(id, payload) {
    const res = await fetch(`http://localhost:8080/departamentos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Erro ao atualizar departamento");

    return await res.json();
  },

  async deleteDepartament(id) {
    const res = await fetch(`http://localhost:8080/departamentos/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Erro ao deletar cargo");
  }

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
    const company = App.session.company;
    const current = {
      primary: company?.corPrincipal,
      primaryLight: company?.corPrincipalClara,
      primaryDark: company?.corPrincipalEscura,
      secondary: company?.corSecundaria
    };

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

  async apply(index) {

    const p = this.defaultPresets[index];

    await this.savePalette(p);

    this.applyToDOM(p);

    Toast.success("Paleta aplicada!", p.name);

    this.render();
  },

  previewCustom() {
    const p = this.getCustomValues();
    this.applyToDOM(p);
  },

  async applyCustom() {

    const p = this.getCustomValues();

    await this.savePalette(p);

    this.applyToDOM(p);

    Toast.success("Cores personalizadas salvas!");

    this.render();
  },

  getCustomValues() {
    return {
      corPrincipal:
        document.getElementById("cp-primary")?.value ??
        App.session.company?.corPrincipal,

      corPrincipalClara:
        document.getElementById("cp-light")?.value ??
        App.session.company?.corPrincipalClara,

      corPrincipalEscura:
        document.getElementById("cp-dark")?.value ??
        App.session.company?.corPrincipalEscura,

      corSecundaria:
        document.getElementById("cp-secondary")?.value ??
        App.session.company?.corSecundaria
    };
  },

  async savePalette(palette) {

    const payload = {
      corPrincipal: palette.corPrincipal,
      corPrincipalClara: palette.corPrincipalClara,
      corPrincipalEscura: palette.corPrincipalEscura,
      corSecundaria: palette.corSecundaria
    };

    const empresa = await App.updateCompany(
      App.session.companyId,
      payload
    );

    App.session.company = empresa;
    App.saveSession();

    App.applyCompanyTheme();
    renderPaletteDots();
    window.location.reload();
  },

  applyToDOM(p) {
    document.documentElement.style.setProperty('--primary', p.primary);
    document.documentElement.style.setProperty('--primary-light', p.primaryLight);
    document.documentElement.style.setProperty('--primary-dark', p.primaryDark);
    document.documentElement.style.setProperty('--secondary', p.secondary);
    document.documentElement.style.setProperty('--shadow-glow', `0 0 40px ${p.primary}40`);
  },

  async reset() {

    const p = this.defaultPresets[0];

    await this.savePalette(p);

    this.applyToDOM(p);

    Toast.info("Paleta restaurada.");

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

