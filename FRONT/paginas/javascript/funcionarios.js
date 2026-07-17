/* ==================== EMPLOYEES PAGE ==================== */
let currentView = 'cards';
let searchQuery = '';
let filterStatus = '';
let filterDept = '';
let editingId = null;
let photoDataUrl = null;
let firstLoad = true;

window.addEventListener('DOMContentLoaded', () => {
  if (!App.requireAuth()) return;
  renderPage();
});

async function renderPage() {

  App.showLoader("Carregando dados dos funcionários...");

  const employees = await App.getEmployees();

  console.log(employees);

  const departments = await App.getDepartments();
  const positions = await App.getPositions();

  const activeCount = employees.filter(e => e.status === "ativo").length;

  const awayCount = employees.filter(e => e.status === "afastado").length;



  const deptOptions = departments.map(d => `<option value="${d.id}">${d.nome}</option>`).join('');


  const positionOptions = positions.map(c => `
    <option value="${c.id}">${c.nome}</option>
  `).join("");

  const content = `
    <div class="page-header animate-in">
      <div>
        <div class="page-title">Funcionários</div>
       <div class="page-subtitle">
    ${activeCount} ativo${activeCount !== 1 ? "s" : ""}
    ·
    ${awayCount} afastado${awayCount !== 1 ? "s" : ""}
        </div>
      </div>
      <button class="btn btn-primary" onclick="openNewEmployee()">
        + Novo Funcionário
      </button>
    </div>

    <div class="filters-bar animate-in">
      <div class="filter-search">
        <span class="filter-search-icon">🔍</span>
        <input type="text" placeholder="Buscar por nome, cargo..." id="emp-search"
          oninput="searchQuery=this.value; renderEmployeeList()" value="${searchQuery}" />
      </div>
      <select class="filter-select" id="emp-status" onchange="filterStatus=this.value; loadFilteredEmployees()">
        <option value="">Todos os status</option>
        <option value="ativo" ${filterStatus === 'ativo' ? 'selected' : ''}>Ativo</option>
        <option value="afastado" ${filterStatus === 'afastado' ? 'selected' : ''}>Afastado</option>
      </select>
      <select class="filter-select" id="emp-filter-dept" onchange="filterDept=this.value; loadFilteredEmployees()">
        <option value="">Todos os depts.</option>
        ${deptOptions}
      </select>
      
    </div>

    <div id="employee-list-container"></div>

    <!-- MODAL: Novo/Editar Funcionário -->
    <div class="modal-overlay" id="modal-employee">
      <div class="modal" style="max-width:600px">
        <div class="modal-header">
          <span class="modal-title" id="modal-emp-title">Novo Funcionário</span>
          <button class="modal-close" onclick="Modal.close('modal-employee')">✕</button>
        </div>
        <div class="employee-form" id="employee-form">

          <div class="photo-upload">
            <div class="avatar avatar-xl" id="form-avatar" style="background:linear-gradient(135deg,var(--primary),var(--secondary))">
              <img id="form-photo-preview" style="display:none;width:100%;height:100%;object-fit:cover;border-radius:50%" />
              <span id="form-avatar-initials">?</span>
            </div>
            <div>
              <button class="photo-upload-btn" onclick="document.getElementById('emp-photo-input').click()">
                📷 Carregar foto
              </button>
              <input type="file" id="emp-photo-input" accept="image/*" style="display:none" onchange="handleEmpPhotoUpload(event)" />
              <div class="text-sm text-muted mt-2">JPG, PNG · máx 1MB</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nome completo *</label>
              <input type="text" id="emp-name" class="form-input" placeholder="João da Silva"
                oninput="updateAvatarPreview()" />
            </div>
            <div class="form-group">
              <label class="form-label">E-mail *</label>
              <input type="email" id="emp-email" class="form-input" placeholder="joao@empresa.com" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Telefone</label>
              <input type="text" id="emp-phone" class="form-input" placeholder="(34) 99999-9999" />
            </div>
            <div class="form-group">
              <label class="form-label">CPF</label>
              <input type="text" id="emp-cpf" class="form-input" placeholder="000.000.000-00" />
            </div>

          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Cargo</label>
              <select id="emp-position" class="form-select">
                  <option value="">Selecione um cargo</option>
                  ${positionOptions}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Departamento</label>
              <select id="emp-dept-select" class="form-select">
                <option value="">Sem departamento</option>
                ${deptOptions}
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Data de admissão</label>
              <input type="date" id="emp-admission" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Salário (R$)</label>
              <input type="number" id="emp-salary" class="form-input" placeholder="0,00" min="0" step="0.01" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Status</label>
              <select id="emp-status-select" class="form-select">
                <option value="ativo">Ativo</option>
                <option value="afastado">Afastado</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tipo de contrato</label>
              <select id="emp-contract" class="form-select">
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Estágio">Estágio</option>
                <option value="Temporário">Temporário</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Observações</label>
            <textarea id="emp-notes" class="form-input" rows="2" placeholder="Informações adicionais..."></textarea>
          </div>

          <div style="display:flex;gap:10px;margin-top:4px">
            <button class="btn btn-ghost" style="flex:1" onclick="Modal.close('modal-employee')">Cancelar</button>
            <button class="btn btn-primary" style="flex:2" onclick="saveEmployee()">
              <span id="save-emp-text">Salvar Funcionário</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- PROFILE DRAWER -->
    <div class="profile-drawer" id="profile-drawer">
      <div id="profile-drawer-content"></div>
    </div>
    <div class="overlay-bg" id="drawer-overlay" onclick="closeProfileDrawer()"></div>
  `;

  mountAppShell('employees.html', 'Funcionários', 'Gestão de pessoal', content);
  renderEmployeeList();
}

function setView(view) {
  currentView = view;
  renderPage();
}

async function loadFilteredEmployees() {

  App.showLoader("Aplicando filtros...");

  await new Promise(resolve => setTimeout(resolve, 300));

  await renderEmployeeList();

}

async function getFilteredEmployees() {
  let list = await App.getEmployees();

  if (searchQuery) {
    const q = searchQuery.toLowerCase();

    list = list.filter(e =>
      e.name?.toLowerCase().includes(q) ||
      e.cargoNome?.toLowerCase().includes(q)
    );
  }

  if (filterStatus === "ativo") {
    list = list.filter(e => e.status === "ativo");
  }

  if (filterStatus === "afastado") {
    list = list.filter(e => e.status === "afastado");
  }

  if (filterDept) {
    const dept = await App.getDepartments();

    const departamento = dept.find(d =>
      String(d.id) === String(filterDept)
    );

    if (departamento) {
      list = list.filter(e =>
        e.departamentoNome === departamento.nome
      );
    }
  }

  return list;
}

async function renderEmployeeList() {

  

  

  const employees = await getFilteredEmployees();

  try {

    const container = document.getElementById('employee-list-container');
    if (!container) return;

    container.innerHTML = `
      <div class="employees-loading">
          <div class="spinner"></div>
          <span>Carregando funcionários...</span>
      </div>
      `;

      await new Promise(resolve => setTimeout(resolve, 200));

    const employees = await getFilteredEmployees();

    // Exibe apenas ativos quando nenhum filtro foi selecionado
    const visibleEmployees =
      filterStatus === "afastado"
        ? employees
        : employees.filter(e => e.status === "ativo");

    const activeCount = employees.filter(e => e.status === "ativo").length;

    const awayCount = employees.filter(e => e.status === "afastado").length;

    const departments = await App.getDepartments();

    if (visibleEmployees.length === 0) {
      container.innerHTML = `
        <div class="empty-state animate-in">
          <div class="empty-state-icon">👤</div>
          <div class="empty-state-title">
            ${searchQuery || filterStatus || filterDept
          ? "Nenhum resultado"
          : "Nenhum funcionário"}
          </div>
          <div class="empty-state-desc">
            ${searchQuery || filterStatus || filterDept
          ? "Tente outros filtros."
          : 'Clique em "+ Novo Funcionário" para cadastrar o primeiro.'}
          </div>
        </div>`;
      return;
    }

    if (currentView === "cards") {

      container.innerHTML = `
<div class="employee-cards stagger">
${visibleEmployees.map((e, i) => `
    <div class="employee-card" style="animation-delay:${i * 0.04}s">

        <div class="employee-card-top">

            <div class="employee-avatar-wrap">
                <div class="avatar avatar-lg" style="background:${avatarColor(e.name)}">
                    ${App.getInitials(e.name)}
                </div>
            </div>

            <div class="employee-card-actions">
                <button onclick="editEmployee('${e.id}')">✏</button>
                <button onclick="deleteEmployee('${e.id}')">🗑</button>
            </div>

        </div>

        <div class="employee-name">${e.name}</div>

        <div class="employee-position">
            ${e.cargoNome || "Sem cargo"}
        </div>

        <div class="employee-card-footer">
            🏢 ${e.departamentoNome || "Sem departamento"}
        </div>

        <span class="badge badge-${statusBadge(e.status)}">
            ${e.status}
        </span>

    </div>
`).join("")}
</div>`;
    }

    else {

      container.innerHTML = `
      <div class="list-view active animate-in">
        <div class="table-wrapper">
          <table class="data-table">

            <thead>
              <tr>
                <th>Funcionário</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>

              ${visibleEmployees.map(e => {

        const status = e.status;

        return `
        <tr>

            <td>${e.name}</td>

            <td>${e.cargoNome || "—"}</td>

            <td>${e.departamentoNome || "—"}</td>

            <td>
                <span class="badge badge-${statusBadge(status)}">
                    ${status}
                </span>
            </td>

            <td>
                <button onclick="editEmployee('${e.id}')">✏</button>
                <button onclick="deleteEmployee('${e.id}')">🗑</button>
            </td>

        </tr>
    `;

      }).join("")}

            </tbody>

          </table>
        </div>
      </div>`;
    }


  } catch (erro) {

    console.error(erro);
    Toast.error("Erro ao carregar funcionários.");

  }
}

function avatarColor(name) {
  const colors = [
    'linear-gradient(135deg,#4F46E5,#7C3AED)',
    'linear-gradient(135deg,#059669,#0891B2)',
    'linear-gradient(135deg,#D97706,#DC2626)',
    'linear-gradient(135deg,#7C3AED,#DB2777)',
    'linear-gradient(135deg,#0891B2,#059669)',
  ];
  const idx = (name?.charCodeAt(0) || 0) % colors.length;
  return colors[idx];
}

function statusBadge(status) {
  const map = { ativo: 'success', afastado: 'warning' };
  return map[status] || 'secondary';
}

function openNewEmployee() {
  editingId = null;
  photoDataUrl = null;
  document.getElementById('modal-emp-title').textContent = 'Novo Funcionário';
  document.getElementById('save-emp-text').textContent = 'Salvar Funcionário';
  resetForm();
  Modal.open('modal-employee');
}

function resetForm() {
  ['emp-name', 'emp-email', 'emp-phone', 'emp-cpf', 'emp-position', 'emp-salary', 'emp-notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const statusEl = document.getElementById('emp-status-select');
  if (statusEl) statusEl.value = 'ativo';
  const deptEl = document.getElementById('emp-dept-select');
  if (deptEl) deptEl.value = '';
  const contractEl = document.getElementById('emp-contract');
  if (contractEl) contractEl.value = 'CLT';
  const admissionEl = document.getElementById('emp-admission');
  if (admissionEl) admissionEl.value = '';
  const preview = document.getElementById('form-photo-preview');
  if (preview) preview.style.display = 'none';
  const initials = document.getElementById('form-avatar-initials');
  if (initials) { initials.style.display = 'flex'; initials.textContent = '?'; }
}

function updateAvatarPreview() {
  const name = document.getElementById('emp-name')?.value || '';
  const initials = document.getElementById('form-avatar-initials');
  if (initials && name) initials.textContent = App.getInitials(name);
}

function handleEmpPhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 1024 * 1024) { Toast.error('Foto muito grande', 'Máximo 1MB.'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    photoDataUrl = e.target.result;
    const preview = document.getElementById('form-photo-preview');
    const initials = document.getElementById('form-avatar-initials');
    if (preview) { preview.src = photoDataUrl; preview.style.display = 'block'; }
    if (initials) initials.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

async function saveEmployee() {
  const name = document.getElementById('emp-name')?.value.trim();
  const email = document.getElementById('emp-email')?.value.trim();
  if (!name) { Toast.error('Nome é obrigatório'); return; }


  const payload = {
    nome: document.getElementById("emp-name").value,
    cpf: document.getElementById("emp-cpf").value,
    salario: Number(document.getElementById("emp-salary").value),
    dataDeContratacao: document.getElementById("emp-admission").value,
    statusEmpregado: document.getElementById("emp-status-select").value === "ativo",
    tipoDeContrato: document.getElementById("emp-contract").value,
    observacoes: document.getElementById("emp-notes").value,
    email: document.getElementById("emp-email").value,
    telefone: document.getElementById("emp-phone").value,
    cargoId: Number(document.getElementById("emp-position").value),
    departamentoId: Number(document.getElementById("emp-dept-select").value),
    empresaId: App.session.companyId
  };

  if (editingId) {
    await App.updateEmployee(editingId, payload);
    Toast.success("Funcionário atualizado!");
  } else {
    await App.createEmployee(payload);
    Toast.success("Funcionário cadastrado!");
  }


  Modal.close('modal-employee');
  renderEmployeeList();
  // Update subtitle
  const subtitle = document.querySelector('.page-subtitle');

  if (subtitle) {

    const employees = await App.getEmployees();

    const activeCount = employees.filter(e => e.status === "ativo").length;

    const awayCount = employees.filter(e => e.status === "afastado").length;

    subtitle.textContent =
      `${activeCount} ativo${activeCount !== 1 ? 's' : ''} · ${awayCount} afastado${awayCount !== 1 ? 's' : ''}`;
  }

}

async function editEmployee(id) {
  editingId = id;
  photoDataUrl = null;
  const employees = await App.getEmployees();
  const e = employees.find(emp => emp.id == id);
  if (!e) return;

  document.getElementById('modal-emp-title').textContent = 'Editar Funcionário';
  document.getElementById('save-emp-text').textContent = 'Salvar Alterações';

  const fields = {
    'emp-name': e.name, 'emp-email': e.email, 'emp-phone': e.telefone,
    'emp-cpf': e.cpf, 'emp-position': e.position, 'emp-salary': e.salary,
    'emp-notes': e.notes, 'emp-admission': e.admission,
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  });
  const deptEl = document.getElementById('emp-dept-select');
  if (deptEl) deptEl.value = e.departamentoId || '';
  const statusEl = document.getElementById('emp-status-select');
  if (statusEl) statusEl.value = e.status || 'ativo';
  const contractEl = document.getElementById('emp-contract');
  if (contractEl) contractEl.value = e.contract || 'CLT';

  const initials = document.getElementById('form-avatar-initials');
  if (initials) initials.textContent = App.getInitials(e.name);

  if (e.photo) {
    const preview = document.getElementById('form-photo-preview');
    if (preview) { preview.src = e.photo; preview.style.display = 'block'; }
    if (initials) initials.style.display = 'none';
  }

  Modal.open('modal-employee');
}

async function deleteEmployee(id) {

  if (!confirm("Deseja afastar este funcionário?")) return;

  try {

    App.showLoader("Afastando funcionário...");

    await App.deleteEmployee(id);

    Toast.success("Funcionário afastado!");

    await renderEmployeeList();

  } catch (e) {

    console.error(e);
    Toast.error("Não foi possível afastar o funcionário.");

  } finally {

    App.hideLoader();

  }
}

function openProfile(id) {
  const employees = App.getEmployees();
  const departments = App.getDepartments();
  const e = employees.find(emp => emp.id === id);
  if (!e) return;
  const dept = departments.find(d =>
    d.id === e.departamentoId || d.id === e.departamentoId
  );

  const drawer = document.getElementById('profile-drawer');
  const content = document.getElementById('profile-drawer-content');
  const overlay = document.getElementById('drawer-overlay');

  content.innerHTML = `
    <div class="profile-drawer-header">
      <div class="avatar avatar-xl" style="background:${avatarColor(e.name)}">
        ${e.photo ? `<img src="${e.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : App.getInitials(e.name)}
      </div>
      <div>
        <div class="profile-drawer-name">${e.name}</div>
        <div class="profile-drawer-role">${e.position || 'Sem cargo'}</div>
      </div>
      <button class="profile-drawer-close" onclick="closeProfileDrawer()">✕</button>
    </div>
    <div class="profile-drawer-body">
      <div class="flex gap-2 mb-4">
        <span class="badge badge-${statusBadge(e.status)}">${e.status || 'ativo'}</span>
        <span class="badge badge-secondary">${e.contract || 'CLT'}</span>
      </div>
      ${profileField('E-mail', e.email)}
      ${profileField('Telefone', e.phone)}
      ${profileField('CPF', e.cpf)}
      ${profileField('Departamento', dept?.nome)}
      ${profileField('Cargo', e.position)}
      ${profileField('Admissão', App.formatDate(e.admission))}
      ${profileField('Salário', e.salary ? App.formatCurrency(e.salary) : null)}
      ${profileField('Observações', e.notes)}
      <div style="display:flex;gap:8px;margin-top:20px">
        <button class="btn btn-primary" style="flex:1" onclick="closeProfileDrawer();editEmployee('${e.id}')">Editar</button>
        <button class="btn btn-danger" style="flex:1" onclick="closeProfileDrawer();deleteEmployee('${e.id}')">Remover</button>
      </div>
    </div>
  `;

  drawer.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function profileField(label, value) {
  if (!value) return '';
  return `<div class="profile-field">
    <span class="profile-field-label">${label}</span>
    <span class="profile-field-value">${value}</span>
  </div>`;
}

function closeProfileDrawer() {
  const drawer = document.getElementById('profile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}