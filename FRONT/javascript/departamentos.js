/* ==================== DEPARTMENTS PAGE ==================== */
let deptEditingId = null;

const DEPT_ICONS = ['🏢','💻','📊','🎨','⚙','📦','💰','🌐','🔬','📣','🏥','🎓','🛡','🚀'];
const DEPT_COLORS = ['#4F46E5','#059669','#D97706','#7C3AED','#DC2626','#0891B2','#BE185D','#2563EB'];

window.addEventListener('DOMContentLoaded', () => {
  if (!App.requireAuth()) return;
  renderDeptPage();
});

function renderDeptPage() {
  const departments = App.getDepartments();
  const employees = App.getEmployees();

  const content = `
    <div class="page-header animate-in">
      <div>
        <div class="page-title">Departamentos</div>
        <div class="page-subtitle">${departments.length} departamento${departments.length !== 1 ? 's' : ''}</div>
      </div>
      <button class="btn btn-primary" onclick="openNewDept()">+ Novo Departamento</button>
    </div>

    <div id="dept-grid" class="dept-grid stagger"></div>

    <!-- MODAL -->
    <div class="modal-overlay" id="modal-dept">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title" id="modal-dept-title">Novo Departamento</span>
          <button class="modal-close" onclick="Modal.close('modal-dept')">✕</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="form-group">
            <label class="form-label">Nome do Departamento *</label>
            <input type="text" id="dept-name" class="form-input" placeholder="Ex: Tecnologia da Informação" />
          </div>
          <div class="form-group">
            <label class="form-label">Descrição</label>
            <textarea id="dept-desc" class="form-input" rows="2" placeholder="Sobre este departamento..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Gerente / Responsável</label>
            <input type="text" id="dept-manager" class="form-input" placeholder="Nome do responsável" />
          </div>
          <div class="form-group">
            <label class="form-label">Ícone</label>
            <div class="icon-picker" id="icon-picker">
              ${DEPT_ICONS.map(icon => `
                <button class="icon-option" onclick="selectIcon('${icon}')">${icon}</button>
              `).join('')}
            </div>
            <input type="hidden" id="dept-icon" value="${DEPT_ICONS[0]}" />
          </div>
          <div class="form-group">
            <label class="form-label">Cor</label>
            <div class="color-picker-row" id="color-picker">
              ${DEPT_COLORS.map(c => `
                <button class="color-option" style="background:${c}" onclick="selectColor('${c}')" data-color="${c}"></button>
              `).join('')}
            </div>
            <input type="hidden" id="dept-color" value="${DEPT_COLORS[0]}" />
          </div>
          <div style="display:flex;gap:10px;margin-top:4px">
            <button class="btn btn-ghost" style="flex:1" onclick="Modal.close('modal-dept')">Cancelar</button>
            <button class="btn btn-primary" style="flex:2" onclick="saveDept()">Salvar Departamento</button>
          </div>
        </div>
      </div>
    </div>
  `;

  mountAppShell('departments.html', 'Departamentos', 'Estrutura organizacional', content);
  renderDeptGrid();

  // Inject dept styles
  const style = document.createElement('style');
  style.textContent = `
    .dept-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .dept-card {
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      transition: var(--transition);
      position: relative;
      overflow: hidden;
      animation: slideUp 0.3s ease both;
    }
    .dept-card:hover { border-color: var(--border-hover); transform: translateY(-2px); box-shadow: var(--shadow); }
    .dept-card-accent {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
    }
    .dept-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .dept-icon-wrap {
      width: 44px; height: 44px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem;
    }
    .dept-name { font-family: var(--font-display); font-size: 1rem; font-weight: 700; }
    .dept-manager-row { font-size: 0.8rem; color: var(--text-3); margin-bottom: 12px; }
    .dept-desc { font-size: 0.8125rem; color: var(--text-2); margin-bottom: 14px; min-height: 36px; }
    .dept-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border); }
    .dept-emp-count { font-size: 0.8rem; color: var(--text-3); }
    .dept-actions { display: flex; gap: 4px; opacity: 0; transition: var(--transition-fast); }
    .dept-card:hover .dept-actions { opacity: 1; }
    .icon-picker { display: flex; flex-wrap: wrap; gap: 8px; }
    .icon-option {
      background: var(--bg-3); border: 2px solid transparent;
      border-radius: 8px; padding: 6px 10px; cursor: pointer; font-size: 1.1rem;
      transition: var(--transition-fast);
    }
    .icon-option:hover { background: var(--bg-4); }
    .icon-option.selected { border-color: var(--primary); background: rgba(79,70,229,0.1); }
    .color-picker-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .color-option {
      width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
      border: 2px solid transparent; transition: var(--transition-fast);
    }
    .color-option:hover { transform: scale(1.15); }
    .color-option.selected { border-color: white; box-shadow: 0 0 0 3px rgba(255,255,255,0.3); }
  `;
  document.head.appendChild(style);
}

function renderDeptGrid() {
  const container = document.getElementById('dept-grid');
  if (!container) return;
  const departments = App.getDepartments();
  const employees = App.getEmployees();

  if (departments.length === 0) {
    container.innerHTML = `<div class="empty-state animate-in" style="grid-column:1/-1">
      <div class="empty-state-icon">🏢</div>
      <div class="empty-state-title">Nenhum departamento</div>
      <div class="empty-state-desc">Organize sua empresa criando departamentos.</div>
      <button class="btn btn-primary" onclick="openNewDept()">+ Criar Departamento</button>
    </div>`;
    return;
  }

  container.innerHTML = departments.map((d, i) => {
    const empCount = employees.filter(e => e.departmentId === d.id).length;
    const color = d.color || DEPT_COLORS[0];
    const icon = d.icon || '🏢';
    return `
      <div class="dept-card" style="animation-delay:${i*0.05}s">
        <div class="dept-card-accent" style="background:${color}"></div>
        <div class="dept-card-header">
          <div class="dept-icon-wrap" style="background:${color}22">${icon}</div>
          <div>
            <div class="dept-name">${d.name}</div>
            ${d.manager ? `<div style="font-size:0.75rem;color:var(--text-3)">Resp: ${d.manager}</div>` : ''}
          </div>
        </div>
        <div class="dept-desc">${d.description || 'Sem descrição.'}</div>
        <div class="dept-footer">
          <span class="dept-emp-count">👥 ${empCount} funcionário${empCount !== 1 ? 's' : ''}</span>
          <div class="dept-actions">
            <button class="btn btn-ghost btn-sm btn-icon" onclick="editDept('${d.id}')" title="Editar">✏</button>
            <button class="btn btn-ghost btn-sm btn-icon" onclick="deleteDept('${d.id}')" title="Remover" style="color:var(--danger)">🗑</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function openNewDept() {
  deptEditingId = null;
  document.getElementById('modal-dept-title').textContent = 'Novo Departamento';
  ['dept-name','dept-desc','dept-manager'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('dept-icon').value = DEPT_ICONS[0];
  document.getElementById('dept-color').value = DEPT_COLORS[0];
  document.querySelectorAll('.icon-option').forEach((el, i) => {
    el.classList.toggle('selected', i === 0);
  });
  document.querySelectorAll('.color-option').forEach((el, i) => {
    el.classList.toggle('selected', i === 0);
  });
  Modal.open('modal-dept');
}

function selectIcon(icon) {
  document.getElementById('dept-icon').value = icon;
  document.querySelectorAll('.icon-option').forEach(el => {
    el.classList.toggle('selected', el.textContent === icon);
  });
}

function selectColor(color) {
  document.getElementById('dept-color').value = color;
  document.querySelectorAll('.color-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.color === color);
  });
}

function saveDept() {
  const name = document.getElementById('dept-name')?.value.trim();
  if (!name) { Toast.error('Nome é obrigatório'); return; }

  const data = App.getData();
  if (!data.departments) data.departments = [];

  const dept = {
    id: deptEditingId || App.generateId(),
    name,
    description: document.getElementById('dept-desc')?.value.trim(),
    manager: document.getElementById('dept-manager')?.value.trim(),
    icon: document.getElementById('dept-icon')?.value || DEPT_ICONS[0],
    color: document.getElementById('dept-color')?.value || DEPT_COLORS[0],
    companyId: App.session.companyId,
    createdAt: deptEditingId ? (data.departments.find(d=>d.id===deptEditingId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
  };

  if (deptEditingId) {
    const idx = data.departments.findIndex(d => d.id === deptEditingId);
    if (idx > -1) data.departments[idx] = dept;
    Toast.success('Departamento atualizado!');
  } else {
    data.departments.push(dept);
    Toast.success('Departamento criado!', dept.name);
  }

  App.saveData(data);
  Modal.close('modal-dept');
  renderDeptGrid();
}

function editDept(id) {
  deptEditingId = id;
  const dept = App.getDepartments().find(d => d.id === id);
  if (!dept) return;

  document.getElementById('modal-dept-title').textContent = 'Editar Departamento';
  document.getElementById('dept-name').value = dept.name || '';
  document.getElementById('dept-desc').value = dept.description || '';
  document.getElementById('dept-manager').value = dept.manager || '';
  document.getElementById('dept-icon').value = dept.icon || DEPT_ICONS[0];
  document.getElementById('dept-color').value = dept.color || DEPT_COLORS[0];

  document.querySelectorAll('.icon-option').forEach(el => {
    el.classList.toggle('selected', el.textContent === dept.icon);
  });
  document.querySelectorAll('.color-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.color === dept.color);
  });

  Modal.open('modal-dept');
}

function deleteDept(id) {
  if (!confirm('Remover este departamento? Os funcionários perderão o vínculo.')) return;
  const data = App.getData();
  data.departments = (data.departments || []).filter(d => d.id !== id);
  // Unlink employees
  if (data.employees) {
    data.employees.forEach(e => { if (e.departmentId === id) e.departmentId = null; });
  }
  App.saveData(data);
  Toast.success('Departamento removido');
  renderDeptGrid();
}