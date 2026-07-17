
/* ==================== COMPANY PAGE ==================== */
let newLogoDataUrl = null;

// Cache
let _empresa = null;

window.addEventListener('DOMContentLoaded', async () => {
  if (!App.requireAuth()) return;
  await carregarEmpresa();
  renderCompanyPage();
});

/* --------------------------------------------------------
   CARREGAMENTO
-------------------------------------------------------- */
async function carregarEmpresa() {

  App.showLoader("Carregando dados da empresa...");
  try {
    _empresa = await App.getCompanySummary(App.session.companyId);
    // Atualiza sessão com dados frescos
    App.session.company = _empresa;
    App.saveSession();
  } catch (err) {
    handleApiError(err, 'Não foi possível carregar os dados da empresa.');
    _empresa = App.session.company; // fallback para dados da sessão
  } finally {
    App.hideLoader();
  }
}



function showLoading(on) {
  let el = document.getElementById('page-loading');
  if (on) {
    if (!el) {
      el = document.createElement('div');
      el.id = 'page-loading';
      el.innerHTML = `<div class="co-spinner"></div><span>Carregando...</span>`;
      el.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;gap:12px;background:rgba(15,15,23,0.7);backdrop-filter:blur(4px);z-index:9999;color:var(--text-2);font-size:0.9rem';
      document.body.appendChild(el);
    }
  } else {
    el?.remove();
  }
}

/* --------------------------------------------------------
   RENDER
-------------------------------------------------------- */
async function renderCompanyPage() {

  await carregarEmpresa();

  const co = _empresa || App.session.company || {};
  const nome = co.nome || co.name || 'Empresa';
  const initials = App.getInitials(nome);





  const content = `
    <div class="page-header animate-in">
      <div>
        <div class="page-title">Minha Empresa</div>
        <div class="page-subtitle">Configurações e informações gerais</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start">

      <!-- COLUNA ESQUERDA: formulário -->
      <div style="display:flex;flex-direction:column;gap:20px">

        <!-- INFO CARD -->
        <div class="card animate-in">
          <div class="card-header">
            <span class="card-title">Informações da Empresa</span>
            <button class="btn btn-primary btn-sm" id="btn-save-co" onclick="saveCompanyInfo()">Salvar</button>
          </div>

          <!-- Logo preview + troca -->
          <div style="display:flex;align-items:center;gap:20px;margin-bottom:24px;padding:18px;background:var(--bg-3);border-radius:var(--radius)">
            <div class="co-logo-big" id="co-logo-display">
              ${co.logo || co.logoUrl
      ? `<img src="${co.logo || co.logoUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:16px" />`
      : `<span style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;color:white">${initials}</span>`}
            </div>
            <div>
              <div style="font-weight:700;font-size:1rem;margin-bottom:2px">${nome}</div>
              <div style="font-size:0.8125rem;color:var(--text-3);margin-bottom:12px">
                ${co.segmento || co.segment || 'Sem segmento definido'}
              </div>
              <button class="btn btn-ghost btn-sm" onclick="document.getElementById('co-logo-input').click()">
                🖼 Trocar logo
              </button>
              <input type="file" id="co-logo-input" accept="image/*" style="display:none" onchange="handleNewLogo(event)" />
              ${(co.logo || co.logoUrl || newLogoDataUrl)
      ? `<button class="btn btn-ghost btn-sm" style="margin-left:6px;color:var(--danger)"
                    onclick="removeLogo()">✕ Remover logo</button>` : ''}
            </div>
          </div>

          <!-- Campos -->
          <div style="display:flex;flex-direction:column;gap:14px">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nome da Empresa *</label>
                <input type="text" id="co-edit-name" class="form-input" value="${co.nome || co.name || ''}" />
              </div>
              <div class="form-group">
                <label class="form-label">CNPJ</label>
                <input type="text" id="co-edit-cnpj" class="form-input"
                  value="${co.cnpj || ''}" placeholder="00.000.000/0001-00" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Segmento</label>
                <input type="text" id="co-edit-segment" class="form-input"
                  value="${co.segmento || co.segment || ''}" placeholder="Ex: Tecnologia" />
              </div>
              <div class="form-group">
                <label class="form-label">Telefone</label>
                <input type="text" id="co-edit-phone" class="form-input"
                  value="${co.telefone || co.phone || ''}" placeholder="(34) 3333-3333" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">E-mail da empresa</label>
              <input type="email" id="co-edit-email" class="form-input"
                value="${co.email || ''}" placeholder="contato@empresa.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Endereço</label>
              <input type="text" id="co-edit-address" class="form-input"
                value="${co.endereco || co.address || ''}" placeholder="Rua, número, cidade — UF" />
            </div>
            <div class="form-group">
              <label class="form-label">Site</label>
              <input type="text" id="co-edit-website" class="form-input"
                value="${co.site || co.website || ''}" placeholder="https://www.empresa.com" />
            </div>
          </div>
        </div>

        <!-- ZONA DE RISCO -->
        <div class="card animate-in" style="border-color:rgba(239,68,68,0.2)">
          <div class="card-header">
            <span class="card-title" style="color:var(--danger)">⚠ Zona de Risco</span>
          </div>
          <p class="text-sm text-muted" style="margin-bottom:16px">
            Ações irreversíveis. Esses dados serão apagados permanentemente no servidor.
          </p>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-danger btn-sm" onclick="confirmClearData()">
              🗑 Limpar todos os dados da empresa
            </button>
            <button class="btn btn-ghost btn-sm" onclick="App.logout()">
              ⎋ Encerrar sessão
            </button>
          </div>
        </div>
      </div>

      <!-- COLUNA DIREITA: resumo + usuário + paleta -->
      <div style="display:flex;flex-direction:column;gap:20px">

        <!-- RESUMO -->
        <div class="card animate-in">
          <div class="card-header">
            <span class="card-title">Resumo</span>
            <button class="btn btn-ghost btn-sm" onclick="recarregarStats()">↺ Atualizar</button>
          </div>
          <div id="co-stats-list">
           ${coInfoRow('👥 Funcionários', co.quantidadeFuncionarios)}
            ${coInfoRow('🏢 Departamentos', co.quantidadeDepartamentos)}
            ${coInfoRow('💼 Cargos', co.quantidadeCargos)}
            ${coInfoRow('📄 CNPJ', co.cnpj)}
            ${coInfoRow('📍 Endereço', co.endereco)}
          </div>
        </div>

        <!-- USUÁRIO ATUAL -->
        <div class="card animate-in">
          <div class="card-header">
            <span class="card-title">Usuário Atual</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-3);border-radius:var(--radius-sm)">
            <div class="avatar" style="background:linear-gradient(135deg,var(--primary),var(--secondary))">
              ${App.getInitials(App.session.user?.name || App.session.user?.nome || 'U')}
            </div>
            <div>
              <div style="font-weight:600;font-size:0.9375rem">${App.session.user?.name || App.session.user?.nome || '—'}</div>
              <div style="font-size:0.78rem;color:var(--text-3)">${App.session.user?.email || '—'}</div>
              <div style="font-size:0.75rem;color:var(--primary-light);margin-top:2px">
                ${App.session.user?.role || App.session.user?.cargo || 'Administrador'}
              </div>
            </div>
          </div>
        </div>

        <!-- IDENTIDADE VISUAL (paleta — salva só no localStorage, é visual) -->
        <div class="card animate-in">
          <div class="card-header">
            <span class="card-title">🎨 Identidade Visual</span>
            <button class="btn btn-ghost btn-sm" onclick="togglePaletteSidebar()">Editar</button>
          </div>
          <div style="display:flex;gap:8px;margin-bottom:12px" id="co-palette-dots"></div>
          <p class="text-sm text-muted">
            Escolha as cores da identidade visual da empresa. As alterações são salvas no banco de dados e aplicadas para todos os usuários da empresa.
          </p>
        </div>

      </div>
    </div>
  `;

  mountAppShell('company.html', 'Minha Empresa', 'Configurações', content);
  injectCompanyStyles();
  renderPaletteDots();
}

/* --------------------------------------------------------
   HANDLERS DE LOGO
-------------------------------------------------------- */
function handleNewLogo(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { Toast.error('Arquivo muito grande', 'Máximo 2MB.'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    newLogoDataUrl = e.target.result;
    const display = document.getElementById('co-logo-display');
    if (display) display.innerHTML = `<img src="${newLogoDataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:16px" />`;
    Toast.info('Logo carregada', 'Clique em "Salvar" para confirmar.');
  };
  reader.readAsDataURL(file);
}

function removeLogo() {
  if (!confirm('Remover a logo da empresa?')) return;
  newLogoDataUrl = '';           // string vazia = sinaliza remoção
  const display = document.getElementById('co-logo-display');
  const nome = _empresa?.nome || _empresa?.name || 'E';
  if (display) display.innerHTML = `<span style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;color:white">${App.getInitials(nome)}</span>`;
  Toast.info('Logo removida', 'Clique em "Salvar" para confirmar.');
}

/* --------------------------------------------------------
   SALVAR EMPRESA (PUT /empresas/{id})
-------------------------------------------------------- */
async function saveCompanyInfo() {
  const nome = document.getElementById('co-edit-name')?.value.trim();
  if (!nome) { Toast.error('Nome da empresa é obrigatório'); return; }

  const btn = document.getElementById('btn-save-co');
  btn.disabled = true;
  btn.textContent = 'Salvando...';

  const palette = PalettePicker.getCustomValues();

  const payload = {
    nome,
    cnpj: document.getElementById('co-edit-cnpj')?.value.trim() || null,
    segmento: document.getElementById('co-edit-segment')?.value.trim() || null,
    telefone: document.getElementById('co-edit-phone')?.value.trim() || null,
    email: document.getElementById('co-edit-email')?.value.trim() || null,
    endereco: document.getElementById('co-edit-address')?.value.trim() || null,
    site: document.getElementById('co-edit-website')?.value.trim() || null,
    // Logo: null = não alterar | '' = remover | 'data:...' = trocar
    ...(newLogoDataUrl !== null ? { logo: newLogoDataUrl || null } : {}),


    // paleta
    ...palette

  };

  try {
    const atualizada = await App.updateCompany(App.session.companyId, payload);
    _empresa = atualizada;
    App.session.company = atualizada;
    App.saveSession();
    App.applyCompanyTheme();
    newLogoDataUrl = null;
    Toast.success('Empresa atualizada!', nome);
    // Re-render para refletir logo nova e nome na sidebar
    await renderCompanyPage();
  } catch (err) {
    handleApiError(err, 'Não foi possível salvar as informações.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Salvar';
  }
}

/* --------------------------------------------------------
   RECARREGAR STATS
-------------------------------------------------------- */
async function recarregarStats() {
  const list = document.getElementById('co-stats-list');

  if (list) {
    list.innerHTML = `
            <div style="text-align:center;padding:20px;color:var(--text-3)">
                <div class="co-spinner" style="margin:0 auto 8px"></div>
                Atualizando...
            </div>`;
  }


  await carregarEmpresa();

  const co = _empresa || {};

  const stats = {
    totalFuncionarios: co.quantidadeFuncionarios,
    totalCargos: co.quantidadeCargos,
    totalDepts: co.quantidadeDepartamentos
  };

  if (list) {
    list.innerHTML =
      coInfoRow('👥 Funcionários', stats.totalFuncionarios) +
      coInfoRow('🏢 Departamentos', stats.totalDepts) +
      coInfoRow('💼 Cargos', stats.totalCargos) +
      coInfoRow('📄 CNPJ', co.cnpj) +
      coInfoRow('📍 Endereço', co.endereco);
  }
}

/* --------------------------------------------------------
   LIMPAR DADOS (chamar endpoints de delete em lote)
   ⚠ Implementação depende de endpoint na API.
   Aqui chamamos DELETE /empresas/{id}/dados ou similar.
   Ajuste conforme seu backend.
-------------------------------------------------------- */
async function confirmClearData() {
  if (!confirm('ATENÇÃO: Isso remove TODOS os funcionários, departamentos e cargos desta empresa do servidor.\n\nEsta ação NÃO pode ser desfeita. Continuar?')) return;
  const segundaConfirmacao = prompt('Digite "CONFIRMAR" para prosseguir:');
  if (segundaConfirmacao !== 'CONFIRMAR') { Toast.info('Operação cancelada'); return; }

  showLoading(true);
  try {
    // Endpoint sugerido: DELETE /empresas/{id}/dados
    // Ajuste para o que seu backend expõe
    await App.delete(`/empresas/${App.session.companyId}/dados`);
    Toast.warning('Dados removidos', 'Todos os registros foram apagados do servidor.');
    await recarregarStats();
  } catch (err) {
    handleApiError(err, 'Não foi possível limpar os dados. Verifique se o endpoint existe na API.');
  } finally {
    showLoading(false);
  }
}

/* --------------------------------------------------------
   HELPERS DE RENDER
-------------------------------------------------------- */
function coInfoRow(label, value) {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:0.875rem;color:var(--text-2)">${label}</span>
      <span style="font-size:0.875rem;font-weight:600">${value ?? '—'}</span>
    </div>`;
}

function renderPaletteDots() {
  const container = document.getElementById("co-palette-dots");
  if (!container) return;

  const company = App.session.company;

  container.innerHTML = "";

  const cores = [
    company?.corPrincipal || "#4F46E5",
    company?.corPrincipalClara || "#818CF8",
    company?.corPrincipalEscura || "#3730A3",
    company?.corSecundaria || "#0EA5E9"
  ];

  cores.forEach(cor => {
    const dot = document.createElement("div");
    dot.style.cssText = `
      width:28px;
      height:28px;
      border-radius:50%;
      background:${cor};
      border:2px solid rgba(255,255,255,.15);
    `;
    container.appendChild(dot);
  });
}

/* --------------------------------------------------------
   ESTILOS
-------------------------------------------------------- */
function injectCompanyStyles() {
  if (document.getElementById('co-styles')) return;
  const style = document.createElement('style');
  style.id = 'co-styles';
  style.textContent = `
    .co-logo-big {
      width: 72px; height: 72px; border-radius: 16px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .co-spinner {
      width: 20px; height: 20px; border-radius: 50%;
      border: 2px solid var(--border); border-top-color: var(--primary);
      animation: spin 0.7s linear infinite;
    }
  `;
  document.head.appendChild(style);
}

function contarCargosAtivos() {

  if (!_empresa?.cargos) return 0;

  return _empresa.cargos.filter(cargo =>
    cargo.status === true
  ).length;

}
