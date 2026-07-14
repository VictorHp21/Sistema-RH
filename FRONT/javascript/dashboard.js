/* ==================== DASHBOARD ==================== */

App.loadSession();

let activeDepartments = [];

window.addEventListener("DOMContentLoaded", () => {
  if (!App.requireAuth()) return;

  const companyEl = document.getElementById("company-nome");
  const userEl = document.getElementById("user-name");

  if (companyEl) {
    companyEl.textContent = App.session.company.nome;
  }

  if (userEl) {
    userEl.textContent = App.session.user.nome;
  }

  renderDashboard();
});




async function renderDashboard() {

  App.showLoader("Carregando dashboard...");

  let employees = [];
  let departments = [];
  let active = 0;
  let onLeave = 0;
  let company = App.session.company;
  let deptStats = [];
  let maxDept = 1;

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Bom dia" :
      now.getHours() < 18 ? "Boa tarde" : "Boa noite";

  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  try {
    employees = await App.getEmployees();
    departments = await App.getDepartments();



    activeDepartments = departments.filter(
      d => d.status === true || d.status == null
    );

    active = employees.filter(e => e.status === "ativo").length;

    onLeave = employees.filter(e => e.status === "afastado").length;

    deptStats = activeDepartments.map(d => {

      const count = employees.filter(
        e => e.departamentoNome === d.nome
      ).length;

      return {
        name: d.nome,
        count
      };
    });

    maxDept = Math.max(...deptStats.map(d => d.count), 1);

  } catch (error) {
    console.error(error);
  } finally {
    App.hideLoader();
  }



  const content = `
    <div class="welcome-banner animate-in">
      <div class="welcome-content">
        <div class="welcome-greeting">${greeting}, 👋</div>
        <div class="welcome-name">${App.session.user?.nome?.split(' ')[0] || 'Usuário'}</div>
        <div class="welcome-date">${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}</div>
      </div>
    </div>

    <div class="stats-grid stagger">
      <div class="stat-card">
        <div class="stat-icon primary">👥</div>
        <div class="stat-value">${employees.length}</div>
        <div class="stat-label">Total de funcionários</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success">✓</div>
        <div class="stat-value">${active}</div>
        <div class="stat-label">Ativos</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning">⏸</div>
        <div class="stat-value">${onLeave}</div>
        <div class="stat-label">Afastados</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon secondary">🏢</div>
        <div class="stat-value">${activeDepartments.length}</div>
        <div class="stat-label">Departamentos</div>
      </div>
    </div>

    <div class="quick-actions stagger">
      <a href="funcionarios.html" class="quick-action" style="animation-delay:0.05s">
        <span class="quick-action-icon">👤</span>
        <div class="quick-action-label">Novo Funcionário</div>
      </a>
      <a href="departamentos.html" class="quick-action" style="animation-delay:0.1s">
        <span class="quick-action-icon">🏢</span>
        <div class="quick-action-label">Departamentos</div>
      </a>
      <a href="cargos.html" class="quick-action" style="animation-delay:0.15s">
        <span class="quick-action-icon">💼</span>
        <div class="quick-action-label">Cargos</div>
      </a>
      <a href="empresa.html" class="quick-action" style="animation-delay:0.2s">
        <span class="quick-action-icon">⚙</span>
        <div class="quick-action-label">Empresa</div>
      </a>
    </div>

    <div class="dashboard-grid">
      <div class="card animate-in">
        <div class="card-header">
          <span class="card-title">Funcionários por Departamento</span>
          <a href="departamentos.html" class="btn btn-ghost btn-sm">Ver todos</a>
        </div>
        ${deptStats.length === 0
      ? `<div class="empty-state">
              <div class="empty-state-icon">🏢</div>
              <div class="empty-state-title">Nenhum departamento</div>
              <div class="empty-state-desc">Crie departamentos para organizar sua equipe.</div>
              <a href="departamentos.html" class="btn btn-primary btn-sm">Criar departamento</a>
            </div>`
      : `<div class="dept-bars">
              ${deptStats.map(d => `
                <div class="dept-bar-item">
                  <div class="dept-bar-header">
                    <span class="dept-bar-name">${d.name}</span>
                    <span class="dept-bar-count">${d.count} funcionário${d.count !== 1 ? 's' : ''}</span>
                  </div>
                  <div class="dept-bar-track">
                    <div class="dept-bar-fill" style="width:${(d.count / maxDept * 100).toFixed(0)}%"></div>
                  </div>
                </div>
              `).join('')}
            </div>`
    }
      </div>

      <div style="display:flex;flex-direction:column;gap:20px">
        <div class="card animate-in" style="animation-delay:0.1s">
          <div class="card-header">
            <span class="card-title">Calendário</span>
          </div>
          <div id="mini-calendar"></div>
        </div>

        <div class="card animate-in" style="animation-delay:0.15s">
          <div class="card-header">
            <span class="card-title">Atividade Recente</span>
          </div>
          ${renderActivity(employees)}
        </div>
      </div>
    </div>
  `;

  mountAppShell('dashboard.html', 'Dashboard', company?.nome, content);
  renderMiniCalendar();
}

function renderActivity(employees) {
  if (employees.length === 0) {
    return `<div class="empty-state">
      <div class="empty-state-icon">📋</div>
      <div class="empty-state-title">Sem atividade ainda</div>
      <div class="empty-state-desc">Cadastre funcionários para ver atividade aqui.</div>
    </div>`;
  }
  const recent = [...employees].sort((a, b) => new Date(b.admission) - new Date(a.admission)).slice(0, 5);
  return `<div class="activity-list">
    ${recent.map(e => `
      <div class="activity-item">
        <div class="activity-dot-wrap">
          <div class="activity-dot ${e.status === 'ativo' ? 'success' : e.status === 'afastado' ? 'warning' : ''}"></div>
        </div>
        <div class="activity-content">
          <div class="activity-title">
              ${e.status === "afastado"
      ? `${e.name} foi afastado(a)`
      : `${e.name} foi admitido(a)`
    }
          </div>
          <div class="activity-time">
            ${App.formatDate(e.admission)} · ${e.cargoNome || "Sem cargo"}
        </div>
        </div>
      </div>
    `).join('')}
  </div>`;
}

function renderMiniCalendar() {
  const container = document.getElementById('mini-calendar');
  if (!container) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  let days = '';
  for (let i = 0; i < firstDay; i++) days += `<div class="cal-day other-month"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === now.getDate();
    days += `<div class="cal-day ${isToday ? 'today' : ''}">${d}</div>`;
  }

  container.innerHTML = `
    <div class="mini-calendar">
      <div class="mini-cal-header">
        <div class="mini-cal-title">${monthName.charAt(0).toUpperCase() + monthName.slice(1)}</div>
      </div>
      <div class="mini-cal-grid">
        ${dayLabels.map(l => `<div class="cal-day-label">${l}</div>`).join('')}
        ${days}
      </div>
    </div>
  `;
}