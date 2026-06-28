/* ==================== SIDEBAR RENDERER ==================== */
function renderSidebar(activePage) {
  const user = App.session.user;
  const company = App.session.company;
  const initials = company ? App.getInitials(company.nome) : 'RH';
  const userInitials = user ? App.getInitials(user.nome) : 'U';

  const nav = [
    { section: 'Principal', links: [
      { href: 'dashboard.html', icon: '▦', label: 'Dashboard' },
    ]},
    { section: 'Pessoas', links: [
      { href: 'employees.html', icon: '👥', label: 'Funcionários' },
      { href: 'departments.html', icon: '🏢', label: 'Departamentos' },
      { href: 'positions.html', icon: '💼', label: 'Cargos' },
    ]},
    { section: 'Empresa', links: [
      { href: 'company.html', icon: '🏛', label: 'Minha Empresa' },
    ]},
  ];

  const navHtml = nav.map(section => `
    <div class="nav-section-label">${section.section}</div>
    ${section.links.map(link => `
      <a class="nav-link ${link.href === activePage ? 'active' : ''}" href="${link.href}">
        <span class="nav-icon">${link.icon}</span>
        ${link.label}
      </a>
    `).join('')}
  `).join('');

  return `
    <div class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-wrap">
          <img class="company-logo-img" src="" alt="" />
          <div class="logo-initials">${initials}</div>
          <div class="logo-text">
            <span class="company-name-text">${company?.nome || 'RH System'}</span>
            <span class="logo-sub">Sistema de RH</span>
          </div>
        </div>
      </div>
      <nav class="sidebar-nav">${navHtml}</nav>
      <div class="sidebar-footer">
        <button class="user-info-btn" onclick="alert('Perfil em breve!')">
          <div class="avatar avatar-sm" style="background:linear-gradient(135deg,var(--primary),var(--secondary))">${userInitials}</div>
          <div class="user-info-text">
            <div class="user-name">${user?.nome || 'Usuário'}</div>
            <div class="user-role">${user?.role || 'Admin'}</div>
          </div>
        </button>
        <a class="nav-link" onclick="App.logout()" style="cursor:pointer">
          <span class="nav-icon">⎋</span>
          Sair
        </a>
      </div>
    </div>
  `;
}

function renderTopbar(title, subtitle) {
  return `
    <div class="topbar">
      <div class="topbar-left">
        <div>
          <div class="topbar-title">${title}</div>
          ${subtitle ? `<div class="topbar-breadcrumb">${subtitle}</div>` : ''}
        </div>
      </div>
      <div class="topbar-right">
        <button class="icon-btn" onclick="togglePaletteSidebar()" data-tooltip="Personalizar cores" title="Paleta de cores">
          🎨
        </button>
        <div class="avatar avatar-sm" style="background:linear-gradient(135deg,var(--primary),var(--secondary))">
          ${App.session.user ? App.getInitials(App.session.user.nome) : 'U'}
        </div>
      </div>
    </div>
  `;
}

function renderPaletteSidebar() {
  return `
    <div class="palette-sidebar" id="palette-sidebar">
      <div class="palette-sidebar-header">
        <div class="palette-sidebar-title">🎨 Cores da Empresa</div>
        <button class="icon-btn" onclick="togglePaletteSidebar()">✕</button>
      </div>
      <p class="text-sm text-muted mb-4">As cores selecionadas serão salvas para esta empresa.</p>
      <div id="palette-picker-panel"></div>
    </div>
    <div class="overlay-bg" onclick="togglePaletteSidebar()"></div>
  `;
}

function mountAppShell(activePage, title, subtitle, contentHtml) {
  document.body.innerHTML = `
    <div class="app-shell">
      ${renderSidebar(activePage)}
      <div class="main-content">
        ${renderTopbar(title, subtitle)}
        <div class="page-content">
          ${contentHtml}
        </div>
      </div>
    </div>
    ${renderPaletteSidebar()}
    <div class="toast-container"></div>
  `;
  Toast.init();
  App.applyCompanyTheme();
  setActiveNav();
}