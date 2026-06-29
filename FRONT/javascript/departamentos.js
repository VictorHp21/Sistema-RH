cat > /home/claude/rh-system/js/departments.js << 'ENDOFFILE'
/* ==================== DEPARTMENTS PAGE ==================== */
let deptEditingId = null;

const DEPT_ICONS = ['🏢','💻','📊','🎨','⚙','📦','💰','🌐','🔬','📣','🏥','🎓','🛡','🚀'];
const DEPT_COLORS = ['#4F46E5','#059669','#D97706','#7C3AED','#DC2626','#0891B2','#BE185D','#2563EB'];

// Cache em memória (evita re-fetch desnecessário)
let _departamentos = [];
let _funcionarios  = [];

window.addEventListener('DOMContentLoaded', async () => {
  if (!App.requireAuth()) return;
  await carregarDados();
  renderDeptPage();
});

/* --------------------------------------------------------
   CARREGAMENTO INICIAL
-------------------------------------------------------- */
async function carregarDados() {
  const empresaId = App.session.companyId;
  showPageLoading(true);
  try {
    const [depts, funcs] = await Promise.all([
      Api.departamentos.listarPorEmpresa(empresaId),
      Api.funcionarios.listarPorEmpresa(empresaId),
    ]);
    _departamentos = depts  || [];
    _funcionarios  = funcs  || [];
  } catch (err) {
    handleApiError(err, 'Não foi possível carregar os departamentos.');
    _departamentos = [];
    _funcionarios  = [];
  } finally {
    showPageLoading(false);
  }
}

function showPageLoading(on) {
  let el = document.getElementById('page-loading');
  if (on) {
    if (!el) {
      el = document.createElement('div');
      el.id = 'page-loading';
      el.innerHTML = `<div class="loading-spinner"></div><span>Carregando...</span>`;
      el.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;gap:12px;background:rgba(15,15,23,0.7);backdrop-filter:blur(4px);z-index:9999;color:var(--text-2);font-size:0.9rem';
      document.body.appendChild(el);
    }
  } else {
    el?.remove();
  }
}

/* --------------------------------------------------------
   RENDER DA PÁGINA
-------------------------------------------------------- */
function renderDeptPage() {
  const content = `
    <div class="page-header animate-in">
      <div>
        <div class="page-title">Departamentos</div>
        <div class="page-subtitle" id="dept-subtitle">${_departamentos.length} departamento${_departamentos.length !== 1 ? 's' : ''}</div>
      </div>
      <button class="btn btn-primary" onclick="openNewDept()">+ Novo Departamento</button>
    </div>

    <!-- FILTRO -->
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px" class="animate-in">
      <div style="position:relative;flex:1;max-width:360px">
        <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-3)">🔍</span>
        <input type="text" id="dept-search" class="form-input" style="padding-left:36px"
          placeholder="Buscar departamento..." oninput="renderDeptGrid()" />
      </div>
    </div>

    <div id="dept-grid" class="dept-grid stagger"></div>

    <!-- MODAL FORM -->
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
            <label class="form-label">Cor de destaque</label>
            <div class="color-picker-row" id="color-picker">
              ${DEPT_COLORS.map(c => `
                <button class="color-option" style="background:${c}"
                  onclick="selectColor('${c}')" data-color="${c}"></button>
              `).join('')}
            </div>
            <input type="hidden" id="dept-color" value="${DEPT_COLORS[0]}" />
          </div>

          <div style="display:flex;gap:10px;margin-top:4px">
            <button class="btn btn-ghost" style="flex:1" onclick="Modal.close('modal-dept')">Cancelar</button>
            <button class="btn btn-primary" style="flex:2" id="btn-save-dept" onclick="saveDept()">
              Salvar Departamento
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  mountAppShell('departments.html', 'Departamentos', 'Estrutura organizacional', content);
  injectDeptStyles();
  renderDeptGrid();
}

/* --------------------------------------------------------
   GRID DE CARDS
-------------------------------------------------------- */
function renderDeptGrid() {
  const container = document.getElementById('dept-grid');
  if (!container) return;

  const search = document.getElementById('dept-search')?.value.toLowerCase() || '';
  const lista = search
    ? _departamentos.filter(d => d.nome?.toLowerCase().includes(search) || d.name?.toLowerCase().includes(search))
    : _departamentos;

  if (lista.length === 0) {
    container.innerHTML = `
      <div class="empty-state animate-in" style="grid-column:1/-1">
        <div class="empty-state-icon">🏢</div>
        <div class="empty-state-title">${search ? 'Nenhum resultado' : 'Nenhum departamento cadastrado'}</div>
        <div class="empty-state-desc">
          ${search
            ? 'Tente outro termo de busca.'
            : 'Organize sua empresa criando o primeiro departamento.'}
        </div>
        ${!search ? `<button class="btn btn-primary" onclick="openNewDept()">+ Criar Primeiro Departamento</button>` : ''}
      </div>`;
    return;
  }

  container.innerHTML = lista.map((d, i) => {
    const nome      = d.nome || d.name || 'Sem nome';
    const descricao = d.descricao || d.description || '';
    const gerente   = d.gerente || d.manager || '';
    const icon      = d.icone || d.icon || '🏢';
    const color     = d.cor || d.color || DEPT_COLORS[0];
    const empCount  = _funcionarios.filter(f =>
      (f.departamentoId || f.departmentId) === d.id
    ).length;

    return `
      <div class="dept-card" style="animation-delay:${i * 0.05}s">
        <div class="dept-card-accent" style="background:${color}"></div>
        <div class="dept-card-header">
          <div class="dept-icon-wrap" style="background:${color}22">${icon}</div>
          <div>
            <div class="dept-name">${nome}</div>
            ${gerente ? `<div style="font-size:0.75rem;color:var(--text-3)">Resp: ${gerente}</div>` : ''}
          </div>
        </div>
        <div class="dept-desc">${descricao || 'Sem descrição.'}</div>
        <div class="dept-footer">
          <span class="dept-emp-count">👥 ${empCount} funcionário${empCount !== 1 ? 's' : ''}</span>
          <div class="dept-actions">
            <button class="btn btn-ghost btn-sm btn-icon" onclick="editDept('${d.id}')" title="Editar">✏</button>
            <button class="btn btn-ghost btn-sm btn-icon" onclick="deleteDept('${d.id}', '${nome.replace(/'/g,"\\'")})"
              title="Remover" style="color:var(--danger)">🗑</button>
          </div>
        </div>
      </div>`;
  }).join('');

  // Atualiza subtítulo
  const sub = document.getElementById('dept-subtitle');
  if (sub) sub.textContent = `${_departamentos.length} departamento${_departamentos.length !== 1 ? 's' : ''}`;
}

/* --------------------------------------------------------
   MODAL — NOVO
-------------------------------------------------------- */
function openNewDept() {
  deptEditingId = null;
  document.getElementById('modal-dept-title').textContent = 'Novo Departamento';
  document.getElementById('btn-save-dept').textContent = 'Salvar Departamento';
  ['dept-name', 'dept-desc', 'dept-manager'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  setIconSelected(DEPT_ICONS[0]);
  setColorSelected(DEPT_COLORS[0]);
  Modal.open('modal-dept');
}

/* --------------------------------------------------------
   MODAL — EDITAR
-------------------------------------------------------- */
function editDept(id) {
  const d = _departamentos.find(dep => String(dep.id) === String(id));
  if (!d) return;

  deptEditingId = id;
  document.getElementById('modal-dept-title').textContent = 'Editar Departamento';
  document.getElementById('btn-save-dept').textContent = 'Salvar Alterações';
  document.getElementById('dept-name').value    = d.nome || d.name || '';
  document.getElementById('dept-desc').value    = d.descricao || d.description || '';
  document.getElementById('dept-manager').value = d.gerente || d.manager || '';

  const icon  = d.icone || d.icon || DEPT_ICONS[0];
  const color = d.cor   || d.color || DEPT_COLORS[0];
  setIconSelected(icon);
  setColorSelected(color);
  Modal.open('modal-dept');
}

/* --------------------------------------------------------
   SALVAR (POST / PUT)
-------------------------------------------------------- */
async function saveDept() {
  const nome = document.getElementById('dept-name')?.value.trim();
  if (!nome) { Toast.error('Nome é obrigatório'); return; }

  const btn = document.getElementById('btn-save-dept');
  btn.disabled = true;
  btn.textContent = 'Salvando...';

  const payload = {
    nome,
    descricao: document.getElementById('dept-desc')?.value.trim() || null,
    gerente:   document.getElementById('dept-manager')?.value.trim() || null,
    icone:     document.getElementById('dept-icon')?.value || DEPT_ICONS[0],
    cor:       document.getElementById('dept-color')?.value || DEPT_COLORS[0],
    empresaId: App.session.companyId,
  };

  try {
    if (deptEditingId) {
      const atualizado = await Api.departamentos.atualizar(deptEditingId, payload);
      const idx = _departamentos.findIndex(d => String(d.id) === String(deptEditingId));
      if (idx > -1) _departamentos[idx] = atualizado;
      Toast.success('Departamento atualizado!', nome);
    } else {
      const criado = await Api.departamentos.criar(payload);
      _departamentos.push(criado);
      Toast.success('Departamento criado!', nome);
    }
    Modal.close('modal-dept');
    renderDeptGrid();
  } catch (err) {
    handleApiError(err, 'Não foi possível salvar o departamento.');
  } finally {
    btn.disabled = false;
    btn.textContent = deptEditingId ? 'Salvar Alterações' : 'Salvar Departamento';
  }
}

/* --------------------------------------------------------
   DELETAR
-------------------------------------------------------- */
async function deleteDept(id, nome) {
  if (!confirm(`Remover o departamento "${nome}"?\nOs funcionários perderão o vínculo.`)) return;

  try {
    await Api.departamentos.remover(id);
    _departamentos = _departamentos.filter(d => String(d.id) !== String(id));
    // Desvincula funcionários do cache local
    _funcionarios.forEach(f => {
      if (String(f.departamentoId || f.departmentId) === String(id)) {
        f.departamentoId = null;
        f.departmentId   = null;
      }
    });
    Toast.success('Departamento removido');
    renderDeptGrid();
  } catch (err) {
    handleApiError(err, 'Não foi possível remover o departamento.');
  }
}

/* --------------------------------------------------------
   HELPERS DE SELEÇÃO
-------------------------------------------------------- */
function selectIcon(icon) {
  document.getElementById('dept-icon').value = icon;
  setIconSelected(icon);
}
function setIconSelected(icon) {
  document.querySelectorAll('.icon-option').forEach(el => {
    el.classList.toggle('selected', el.textContent.trim() === icon);
  });
  const input = document.getElementById('dept-icon');
  if (input) input.value = icon;
}

function selectColor(color) {
  document.getElementById('dept-color').value = color;
  setColorSelected(color);
}
function setColorSelected(color) {
  document.querySelectorAll('.color-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.color === color);
  });
  const input = document.getElementById('dept-color');
  if (input) input.value = color;
}

/* --------------------------------------------------------
   ESTILOS INJETADOS
-------------------------------------------------------- */
function injectDeptStyles() {
  if (document.getElementById('dept-styles')) return;
  const style = document.createElement('style');
  style.id = 'dept-styles';
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
    .dept-card-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
    .dept-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .dept-icon-wrap {
      width: 44px; height: 44px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
    }
    .dept-name { font-family: var(--font-display); font-size: 1rem; font-weight: 700; }
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

    .loading-spinner {
      width: 20px; height: 20px; border-radius: 50%;
      border: 2px solid var(--border);
      border-top-color: var(--primary);
      animation: spin 0.7s linear infinite;
    }
  `;
  document.head.appendChild(style);
}