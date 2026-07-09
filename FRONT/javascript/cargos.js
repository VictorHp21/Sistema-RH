let posEditingId = null;

const LEVELS = [];

const LEVEL_COLORS = {
  'Júnior': { bg: 'rgba(14,165,233,0.12)', text: '#38BDF8' },
  'Pleno': { bg: 'rgba(79,70,229,0.12)', text: '#818CF8' },
  'Sênior': { bg: 'rgba(16,185,129,0.12)', text: '#34D399' },
  'Especialista': { bg: 'rgba(139,92,246,0.12)', text: '#A78BFA' },
  'Coordenador': { bg: 'rgba(245,158,11,0.12)', text: '#FCD34D' },
  'Gerente': { bg: 'rgba(249,115,22,0.12)', text: '#FB923C' },
  'Diretor': { bg: 'rgba(239,68,68,0.12)', text: '#F87171' },
  'C-Level': { bg: 'rgba(236,72,153,0.12)', text: '#F472B6' },
};

// Dados da api
let _cargos = [];
let _departamentos = [];
let _funcionarios = [];

window.addEventListener('DOMContentLoaded', async () => {
  if (!App.requireAuth()) return;
  await carregarDados();
  renderPositionsPage();
});




async function carregarDados() {

  console.log(document.getElementById("global-loader"));

  App.showLoader("Carregando cargos...");


  try {
    [cargos, departamentos, funcionarios] = await Promise.all([
      App.getPositions(),
      App.getDepartments(),
      App.getEmployees()
    ]);

  } catch (error) {
    console.error(error);

    Toast.error("Não foi possível carregar os dados.");

    cargos = [];
    departamentos = [];
    funcionarios = [];

  } finally {
    App.hideLoader();

    _cargos = cargos;
    // filtrar por status
    _departamentos = (departamentos || []).filter(d => d.status !== false);
    _funcionarios = funcionarios;
  }
}

function showLoading(on) {
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
function renderPositionsPage() {

  const deptOptions = departamentos.map(d =>
    `<option value="${d.id}">${d.nome}</option>`
  ).join('');

  const totalOcupados = countOcupados();

  const content = `
    <div class="page-header animate-in">
      <div>
        <div class="page-title">Cargos</div>
        <div class="page-subtitle" id="pos-subtitle">
          ${cargos.length} cargo${cargos.length !== 1 ? 's' : ''} cadastrado${cargos.length !== 1 ? 's' : ''}
        </div>
      </div>

      <button class="btn btn-primary" onclick="openNewPosition()">
        + Novo Cargo
      </button>
    </div>

    <!-- STATS -->
    <div class="stats-grid stagger" style="margin-bottom:24px">
      <div class="stat-card">
        <div class="stat-icon primary">💼</div>
        <div class="stat-value" id="stat-total">${cargos.length}</div>
        <div class="stat-label">Total de cargos</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">🏢</div>
          <div class="stat-value">${departamentos.filter(d => d.status !== false).length}</div>
        <div class="stat-label">Departamentos</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">👥</div>
        <div class="stat-value" id="stat-ocupados">${totalOcupados}</div>
        <div class="stat-label">Cargos ocupados</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon secondary">📋</div>
        <div class="stat-value" id="stat-vagas">${cargos.length - totalOcupados}</div>
        <div class="stat-label">Vagas em aberto</div>
      </div>
    </div>

    <!-- FILTROS -->
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap" class="animate-in">

      <div style="position:relative;flex:1;min-width:200px">
        <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-3)">🔍</span>

        <input
          type="text"
          id="pos-search"
          class="form-input"
          style="padding-left:36px"
          placeholder="Buscar cargo..."
          oninput="renderPositionsList()"
        />
      </div>

      

    </div>

    <!-- LISTA -->
    <div id="positions-container"></div>

    <!-- MODAL -->
    <div class="modal-overlay" id="modal-position">
      <div class="modal" style="max-width:580px">

        <div class="modal-header">
          <span class="modal-title" id="modal-pos-title">Novo Cargo</span>
          <button class="modal-close" onclick="Modal.close('modal-position')">✕</button>
        </div>

        <div style="display:flex;flex-direction:column;gap:14px">

          <div class="form-group">
            <label class="form-label">Departamento</label>

            ${departamentos.length === 0

      ? `
                  <div class="dept-empty-notice">
                    <span>⚠ Nenhum departamento cadastrado.</span>
                    <a href="departments.html" class="btn btn-ghost btn-sm">
                      Criar departamento
                    </a>
                  </div>
                `

      : `
                  <select id="pos-dept" class="form-select">
                    <option value="">Sem departamento</option>
                    ${deptOptions}
                  </select>
                `
    }

          </div>

          <div class="form-row">

            <div class="form-group">
              <label class="form-label">Nome do Cargo *</label>
              <input type="text" id="pos-name" class="form-input">
            </div>

            

          </div>

          <div class="form-row">

            <div class="form-group">
              <label class="form-label">Salário mínimo</label>
              <input type="number" id="pos-salary-min" class="form-input">
            </div>

            <div class="form-group">
              <label class="form-label">Salário máximo</label>
              <input type="number" id="pos-salary-max" class="form-input">
            </div>

          </div>

          <div class="form-group">
            <label class="form-label">Descrição</label>

            <textarea
              id="pos-description"
              class="form-input"
              rows="3">
            </textarea>
          </div>

          <div class="form-row">

            <div class="form-group">
              <label class="form-label">Vagas</label>
              <input type="number" id="pos-vacancies" class="form-input" value="1">
            </div>

            <div class="form-group">
              <label class="form-label">Contrato</label>

              <select id="pos-contract" class="form-select">
                <option>CLT</option>
                <option>PJ</option>
                <option>Estágio</option>
                <option>Temporário</option>
              </select>

            </div>

          </div>

          <div class="form-group">

            <label class="form-label">Status</label>

            <div style="display:flex;gap:16px">

              <label>
                <input type="radio" name="pos-status" value="true" checked>
                Ativo
              </label>

              <label>
                <input type="radio" name="pos-status" value="false">
                Inativo
              </label>

              

            </div>

          </div>

          <div style="display:flex;gap:10px">

            <button class="btn btn-ghost" onclick="Modal.close('modal-position')" style="flex:1">
              Cancelar
            </button>

            <button class="btn btn-primary" id="btn-save-pos" onclick="savePosition()" style="flex:2">
              Salvar Cargo
            </button>

          </div>

        </div>

      </div>
    </div>

    <div class="modal-overlay" id="modal-pos-detail">
      <div class="modal" style="max-width:520px">
        <div id="pos-detail-content"></div>
      </div>
    </div>
  `;

  mountAppShell(
    'positions.html',
    'Cargos',
    'Estrutura de cargos e vagas',
    content
  );

  injectPositionStyles();
  renderPositionsList();
}

/* --------------------------------------------------------
   HELPERS
-------------------------------------------------------- */

function getNome(obj) {
  return obj?.nome || '';
}

function getDeptNome(id) {
  const dept = _departamentos.find(d => d.id == id);
  return dept ? dept.nome : 'Sem departamento';
}

function countOcupados() {
  return _cargos.filter(cargo =>
    _funcionarios.some(func => func.cargo?.id === cargo.id)
  ).length;
}

function getFuncionariosNoCargo(cargoId) {
  return _funcionarios.filter(func =>
    func.cargo?.id === cargoId
  );
}

function updateStats() {
  const ocupados = countOcupados();
  const total = _cargos.length;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-ocupados").textContent = ocupados;
  document.getElementById("stat-vagas").textContent = total - ocupados;

  const sub = document.getElementById("pos-subtitle");
  sub.textContent = `${total} cargo${total !== 1 ? "s" : ""} cadastrado${total !== 1 ? "s" : ""}`;
}

function getLevels() {
  return [...new Set(
    cargos
      .map(c => c.nivel || c.level)
      .filter(Boolean)
  )].sort();
}

/* --------------------------------------------------------
   LISTA DE CARGOS
-------------------------------------------------------- */

function renderPositionsList() {

  const container = document.getElementById("positions-container");

  const search =
    document.getElementById("pos-search")?.value.toLowerCase() || "";

  const levelFilter =
    document.getElementById("pos-filter-level")?.value || "";

  const deptFilter =
    document.getElementById("pos-filter-dept")?.value || "";

  let cargos = [..._cargos];

  // 🔎 filtro por nome
  if (search) {
    cargos = cargos.filter(c =>
      c.nome.toLowerCase().includes(search)
    );
  }


  // 🏢 filtro por departamento
  if (deptFilter) {
    cargos = cargos.filter(c =>
      String(c.departamento?.id) === deptFilter
    );
  }

  // ❌ vazio
  if (cargos.length === 0) {
    container.innerHTML = `
            <div class="empty-state animate-in">
                <div class="empty-state-icon">💼</div>

                <div class="empty-state-title">
                    ${search || levelFilter || deptFilter
        ? "Nenhum resultado encontrado"
        : "Nenhum cargo cadastrado"}
                </div>

                <div class="empty-state-desc">
                    ${search || levelFilter || deptFilter
        ? "Tente alterar os filtros."
        : "Cadastre o primeiro cargo da empresa."}
                </div>

                ${!search && !levelFilter && !deptFilter
        ? `<button class="btn btn-primary" onclick="openNewPosition()">
                         + Criar Cargo
                       </button>`
        : ""
      }
            </div>
        `;
    return;
  }

  // 🚀 RENDER SIMPLES (SEM AGRUPAMENTO)
  container.innerHTML = cargos
    .map((cargo, i) => renderCargoCard(cargo, i))
    .join("");
}
/* --------------------------------------------------------
   CARD DE CARGO
-------------------------------------------------------- */

function renderCargoCard(cargo, index) {

  const nivel = cargo.nivel || "Pleno";
  const nome = cargo.nome;

  const deptNome = cargo.departamento
    ? cargo.departamento.nome
    : "Sem departamento";

  const vagas = cargo.vagas || 0;

  const funcionarios = getFuncionariosNoCargo(cargo.id);

  const preenchidas = funcionarios.length;

  const emAberto = Math.max(0, vagas - preenchidas);

  const fillPct =
    vagas > 0
      ? Math.min(100, Math.round((preenchidas / vagas) * 100))
      : 0;

  const lc = LEVEL_COLORS[nivel] || {
    bg: "rgba(255,255,255,.05)",
    text: "var(--text-2)"
  };

  const status = cargo.status
    ? {
      badge: "badge-success",
      label: "Ativo"
    }
    : {
      badge: "badge-danger",
      label: "Inativo"
    };


  //const status = statusMap[cargo.status] || statusMap.ATIVO;

  return `
    <div class="pos-card"
         style="animation-delay:${index * 0.04}s"
         onclick="openPositionDetail(${cargo.id})">

      <div class="pos-card-top">

        <div style="flex:1">

          <div class="pos-name">
            ${nome}
          </div>

          <div class="pos-dept">
            🏢 ${deptNome}
          </div>

        </div>

        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">

          <span class="badge ${status.badge}">
            ${status.label}
          </span>

          

        </div>

      </div>

      ${(cargo.salarioMin || cargo.salarioMax) ? `
        <div class="pos-salary-range">
          💰
          ${cargo.salarioMin ? App.formatCurrency(cargo.salarioMin) : "?"}
          —
          ${cargo.salarioMax ? App.formatCurrency(cargo.salarioMax) : "?"}
        </div>
      ` : ""}

      <div>

        <div style="display:flex;justify-content:space-between;margin-bottom:6px">

          <span style="font-size:.75rem;color:var(--text-3)">
            Preenchimento
          </span>

          <span style="font-size:.75rem;color:var(--text-2)">
            ${preenchidas}/${vagas} vaga${vagas !== 1 ? "s" : ""}
          </span>

        </div>

        <div class="pos-vacancy-track">

          <div class="pos-vacancy-fill ${preenchidas >= vagas && vagas > 0 ? "full" : ""}"
               style="width:${fillPct}%">
          </div>

        </div>

        ${emAberto > 0
      ? `<div style="font-size:.73rem;color:var(--success);margin-top:5px">
                 ✦ ${emAberto} vaga${emAberto !== 1 ? "s" : ""} em aberto
               </div>`
      : ""
    }

        ${preenchidas >= vagas && vagas > 0
      ? `<div style="font-size:.73rem;color:var(--accent);margin-top:5px">
                 ⬛ Cargo completo
               </div>`
      : ""
    }

      </div>

      <div class="pos-card-footer">

        <span style="font-size:.78rem;color:var(--text-3)">
          ${cargo.tipoDeContrato || "CLT"}
        </span>

        <div class="pos-card-actions"
             onclick="event.stopPropagation()">

          <button
              class="btn btn-ghost btn-sm btn-icon"
              onclick="editPosition(${cargo.id})"
              title="Editar">
            ✏
          </button>

          <button
              class="btn btn-ghost btn-sm btn-icon"
              onclick="deletePosition(${cargo.id}, '${cargo.nome}')"
              title="Excluir"
              style="color:var(--danger)">
            🗑
          </button>

        </div>

      </div>

    </div>
  `;
}

/* --------------------------------------------------------
   MODAL DETALHE
-------------------------------------------------------- */
function openPositionDetail(id) {
  const cargo = _cargos.find(c => String(c.id) === String(id));
  if (!cargo) return;

  const departamento = cargo.departamento
    ? cargo.departamento.nome
    : "Sem departamento";

  const funcionarios = getFuncionariosNoCargo(cargo.id);

  const vagas = cargo.vagas || 0;
  const preenchidas = funcionarios.length;

  const salarioMin = cargo.salarioMin;
  const salarioMax = cargo.salarioMax;

  const statusMap = {
    ATIVO: { badge: "badge-success", label: "Ativo" },
    INATIVO: { badge: "badge-secondary", label: "Inativo" },
    CONGELADO: { badge: "badge-warning", label: "Congelado" }
  };

  const status = statusMap[cargo.status] || statusMap.ATIVO;

  document.getElementById("pos-detail-content").innerHTML = `
    <div class="modal-header">
      <span class="modal-title">${cargo.nome}</span>
      <button class="modal-close"
        onclick="Modal.close('modal-pos-detail')">✕</button>
    </div>

    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px">

      <span class="badge ${status.badge}">
        ${status.label}
      </span>

      <span class="badge badge-secondary">
        🏢 ${departamento}
      </span>

      <span class="badge badge-secondary">
        ${cargo.tipoDeContrato || "CLT"}
      </span>

    </div>

    ${cargo.descricao ? `
      <div style="
        font-size:.9rem;
        color:var(--text-2);
        line-height:1.6;
        margin-bottom:18px;
        padding:14px;
        background:var(--bg-3);
        border-radius:var(--radius-sm)">
        ${cargo.descricao}
      </div>
    ` : ""}

    <div style="
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:12px;
      margin-bottom:18px">

      ${detailBox("Salário mínimo", salarioMin ? App.formatCurrency(salarioMin) : "—")}
      ${detailBox("Salário máximo", salarioMax ? App.formatCurrency(salarioMax) : "—")}
      ${detailBox("Vagas", vagas)}
      ${detailBox("Preenchidas", preenchidas)}

    </div>

    <div style="margin-bottom:18px">

      <div style="
        font-size:.78rem;
        font-weight:700;
        text-transform:uppercase;
        letter-spacing:.06em;
        color:var(--text-3);
        margin-bottom:10px">

        Funcionários neste cargo (${funcionarios.length})

      </div>

      ${funcionarios.length === 0 ? `
        <div style="
          text-align:center;
          color:var(--text-3);
          padding:18px">
          Nenhum funcionário associado.
        </div>
      ` : `
        <div style="display:flex;flex-direction:column;gap:8px">

          ${funcionarios.map(f => `
            <div style="
              display:flex;
              align-items:center;
              gap:10px;
              padding:10px;
              background:var(--bg-3);
              border-radius:var(--radius-sm)">

              <div class="avatar avatar-sm"
                style="background:linear-gradient(135deg,var(--primary),var(--secondary))">
                ${App.getInitials(f.nome)}
              </div>

              <div>
                <div style="font-weight:600">${f.nome}</div>

                <div style="font-size:.75rem;color:var(--text-3)">
                  ${f.departamento?.nome || "Sem departamento"}
                </div>
              </div>

              <span class="badge ${f.statusEmpregado ? "badge-success" : "badge-secondary"}"
                style="margin-left:auto">

                ${f.statusEmpregado ? "Ativo" : "Afastado"}

              </span>

            </div>
          `).join("")}

        </div>
      `}
    </div>

    <div style="display:flex;gap:8px">

      <button class="btn btn-ghost"
        style="flex:1"
        onclick="Modal.close('modal-pos-detail')">
        Fechar
      </button>

      <button class="btn btn-primary"
        style="flex:2"
        onclick="Modal.close('modal-pos-detail');editPosition('${cargo.id}')">

        ✏ Editar Cargo
      </button>

    </div>
  `;

  Modal.open("modal-pos-detail");
}

function detailBox(label, value) {
  return `
    <div style="
      background:var(--bg-3);
      border-radius:var(--radius-sm);
      padding:12px">

      <div style="
        font-size:.72rem;
        font-weight:700;
        text-transform:uppercase;
        letter-spacing:.06em;
        color:var(--text-3);
        margin-bottom:4px">

        ${label}

      </div>

      <div style="font-size:1rem;font-weight:600">
        ${value}
      </div>

    </div>
  `;
}

/* --------------------------------------------------------
   ABRIR MODAL NOVO
-------------------------------------------------------- */
function openNewPosition() {

  posEditingId = null;

  document.getElementById('modal-pos-title').textContent = 'Novo Cargo';
  document.getElementById('btn-save-pos').textContent = 'Salvar Cargo';

  const fieldsToClear = [
    'pos-name',
    'pos-salary-min',
    'pos-salary-max',
    'pos-description'
  ];

  fieldsToClear.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  document.getElementById('pos-vacancies').value = '1';
  document.getElementById('pos-dept').value = '';
  document.getElementById('pos-contract').value = 'CLT';

  const radio = document.querySelector(
    'input[name="pos-status"][value="ATIVO"]'
  );

  if (radio) radio.checked = true;

  Modal.open('modal-position');
}

/* --------------------------------------------------------
   ABRIR MODAL EDITAR
-------------------------------------------------------- */
async function editPosition(id) {

  const cargo = _cargos.find(c => String(c.id) === String(id));
  if (!cargo) return;

  posEditingId = id;

  document.getElementById("modal-pos-title").textContent = "Editar Cargo";
  document.getElementById("btn-save-pos").textContent = "Salvar Alterações";

  document.getElementById("pos-name").value = cargo.nome;
  document.getElementById("pos-salary-min").value = cargo.salarioMin ?? "";
  document.getElementById("pos-salary-max").value = cargo.salarioMax ?? "";
  document.getElementById("pos-description").value = cargo.descricao ?? "";
  document.getElementById("pos-vacancies").value = cargo.vagas ?? 1;
  document.getElementById("pos-contract").value = cargo.tipoDeContrato ?? "CLT";

  const dept = document.getElementById("pos-dept");
  if (dept) {
    dept.value = cargo.departamento?.id ?? "";
  }

  const radio = document.querySelector(
    `input[name="pos-status"][value="${cargo.status}"]`
  );

  if (radio) radio.checked = true;

  Modal.open("modal-position");
}

/* --------------------------------------------------------
   SALVAR (POST / PUT)
-------------------------------------------------------- */
async function savePosition() {

  const nome = document.getElementById("pos-name").value.trim();

  if (!nome) {
    Toast.error("Informe o nome do cargo.");
    return;
  }

  const btn = document.getElementById("btn-save-pos");

  btn.disabled = true;
  btn.textContent = "Salvando...";

  const payload = {
     nome,
  descricao: document.getElementById("pos-description").value,
  salarioMin: Number(document.getElementById("pos-salary-min").value),
  salarioMax: Number(document.getElementById("pos-salary-max").value),
  vagas: Number(document.getElementById("pos-vacancies").value) || 1,
  tipoDeContrato: document.getElementById("pos-contract").value,
  status: document.querySelector("input[name='pos-status']:checked").value === "true"
  };

  try {

    let resultado;

    if (posEditingId) {

      resultado = await App.updatePosition(posEditingId, payload);

      const index = _cargos.findIndex(c => c.id == posEditingId);

      if (index !== -1) {
        _cargos[index] = resultado;
      }

      Toast.success("Cargo atualizado!");

    } else {

      resultado = await App.createPosition(payload);

      _cargos.push(resultado);

      Toast.success("Cargo criado!");
    }

    Modal.close("modal-position");

    updateStats();
    renderPositionsList();

  } catch (err) {

    console.error(err);
    handleApiError(err, "Erro ao salvar cargo.");

  } finally {

    btn.disabled = false;
    btn.textContent = posEditingId
      ? "Salvar Alterações"
      : "Salvar Cargo";
  }


}

function handleApiError(err, fallbackMsg = "Erro inesperado") {
  console.error(err);

  const msg =
    err?.response?.data?.message ||
    err?.message ||
    fallbackMsg;

  Toast.error(msg);
}

/* --------------------------------------------------------
   DELETAR
-------------------------------------------------------- */
async function deletePosition(id, nome) {

  if (!confirm(`Deseja remover o cargo "${nome}"?`))
    return;

  try {

    await App.deletePosition(id);

    _cargos = _cargos.filter(c => c.id != id);

    Toast.success("Cargo removido!");

    updateStats();

    renderPositionsList();

  } catch (err) {

    handleApiError(err, "Não foi possível remover o cargo.");

  }

}
/* --------------------------------------------------------
   ESTILOS
-------------------------------------------------------- */
function injectPositionStyles() {
  if (document.getElementById('pos-styles')) return;
  const style = document.createElement('style');
  style.id = 'pos-styles';
  style.textContent = `
    .pos-level-group { margin-bottom: 28px; }
    .pos-level-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .pos-level-badge { display: inline-flex; align-items: center; padding: 4px 14px; border-radius: 99px; font-size: 0.8rem; font-weight: 700; }
    .pos-level-count { font-size: 0.78rem; color: var(--text-3); }

    .pos-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }

    .pos-card {
      background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 18px; cursor: pointer; transition: var(--transition);
      display: flex; flex-direction: column; gap: 12px; animation: slideUp 0.3s ease both;
    }
    .pos-card:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow), 0 0 20px rgba(79,70,229,0.08); }
    .pos-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
    .pos-name { font-family: var(--font-display); font-size: 0.9375rem; font-weight: 700; color: var(--text-1); margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pos-dept { font-size: 0.78rem; color: var(--text-2); }
    .pos-salary-range { font-size: 0.8125rem; color: var(--text-2); background: var(--bg-3); border-radius: 6px; padding: 6px 10px; }
    .pos-vacancy-track { height: 5px; background: var(--bg-4); border-radius: 99px; overflow: hidden; }
    .pos-vacancy-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--primary), var(--secondary)); transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
    .pos-vacancy-fill.full { background: linear-gradient(90deg, var(--accent), var(--danger)); }
    .pos-card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--border); }
    .pos-card-actions { display: flex; gap: 4px; opacity: 0; transition: var(--transition-fast); }
    .pos-card:hover .pos-card-actions { opacity: 1; }

    .dept-empty-notice {
      display: flex; align-items: center; justify-content: space-between;
      background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25);
      border-radius: var(--radius-sm); padding: 10px 14px;
      font-size: 0.875rem; color: #FCD34D;
    }

    .loading-spinner {
      width: 20px; height: 20px; border-radius: 50%;
      border: 2px solid var(--border); border-top-color: var(--primary);
      animation: spin 0.7s linear infinite;
    }
  `;
  document.head.appendChild(style);
}
