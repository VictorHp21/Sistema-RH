/* ==================== LOGIN PAGE LOGIC ==================== */

let currentUser = null;
let logoDataUrl = null;

// On load: render company chips and handle indicator
window.addEventListener('DOMContentLoaded', () => {
  
  updateTabIndicator('login');

  carregarEmpresasPreview();

  // If already logged in, redirect
  if (App.loadSession()) {
    window.location.href = 'pages/dashboard.html';
  }
});

async function carregarEmpresasPreview() {
     try {
        const response = await fetch("http://localhost:8080/empresas");

        if (!response.ok) {
            throw new Error("Erro ao buscar empresas");
        }

        const empresas = await response.json();

        const container = document.getElementById("preview-companies-list");

        container.innerHTML = "";

        empresas.forEach(empresa => {

            const chip = document.createElement("div");
            chip.classList.add("preview-company-chip");

            if (empresa.logoUrl) {
                chip.innerHTML = `
                    <img
                        src="${empresa.logoUrl}"
                        alt="${empresa.nome}"
                        class="preview-company-logo"
                    >
                    <span>${empresa.nome}</span>
                `;
            } else {
                chip.innerHTML = `
                    <span class="preview-chip-dot">🏢</span>
                    <span>${empresa.nome}</span>
                `;
            }

            container.appendChild(chip);
        });

    } catch (error) {
        console.error(error);
    }
}



function switchTab(tab) {
  const loginForm = document.getElementById('form-login');
  const registerForm = document.getElementById('form-register');
  const loginTab = document.getElementById('tab-login');
  const registerTab = document.getElementById('tab-register');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
  }
  updateTabIndicator(tab);
}

function updateTabIndicator(tab) {
  const indicator = document.getElementById('tab-indicator');
  if (!indicator) return;
  if (tab === 'register') {
    indicator.classList.add('right');
  } else {
    indicator.classList.remove('right');
  }
}

function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

/* ==================== LOGIN ==================== */
function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pass').value;

  if (!email || !pass) {
    Toast.error('Preencha todos os campos');
    return;
  }

  const btnText = document.getElementById('login-btn-text');
  const spinner = document.getElementById('login-spinner');
  btnText.textContent = 'Verificando...';
  spinner.style.display = 'inline-block';

  setTimeout(() => {
    const data = App.getData();
    const user = data.users?.find(u => u.email === email && u.password === pass);

    if (!user) {
      Toast.error('Credenciais inválidas', 'Verifique seu e-mail e senha.');
      btnText.textContent = 'Entrar na conta';
      spinner.style.display = 'none';
      return;
    }

    currentUser = user;
    btnText.textContent = 'Entrar na conta';
    spinner.style.display = 'none';

    // Show company selection
    const userCompanies = data.companies.filter(c => c.members?.includes(user.id));
    if (userCompanies.length === 0) {
      // No companies yet → create one
      openCreateCompany();
    } else {
      openChooseCompany(userCompanies);
    }
  }, 800);
}

function openChooseCompany(companies) {
  const list = document.getElementById('company-list-modal');
  list.innerHTML = companies.map(c => `
    <div class="company-item" onclick="selectCompany('${c.id}')">
      <div class="company-item-logo">
        ${c.logo ? `<img src="${c.logo}" alt="${c.name}">` : c.name[0].toUpperCase()}
      </div>
      <div class="company-item-info">
        <div class="company-item-name">${c.name}</div>
        <div class="company-item-meta">${c.segment || 'Sem segmento'} · ${c.cnpj || 'Sem CNPJ'}</div>
      </div>
      <span class="company-item-arrow">→</span>
    </div>
  `).join('');
  Modal.open('modal-choose-company');
}

function selectCompany(companyId) {
  const data = App.getData();
  const company = data.companies.find(c => c.id === companyId);
  if (!company) return;

  App.session.companyId = companyId;
  App.session.userId = currentUser.id;
  App.session.company = company;
  App.session.user = currentUser;
  App.saveSession();

  Modal.closeAll();
  Toast.success('Login realizado!', `Bem-vindo à ${company.name}`);
  setTimeout(() => { window.location.href = 'pages/dashboard.html'; }, 800);
}

/* ==================== REGISTER ==================== */
function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-pass').value;
  const role = document.getElementById('reg-role').value.trim();

  if (!name || !email || !pass) {
    Toast.error('Preencha todos os campos obrigatórios');
    return;
  }
  if (pass.length < 6) {
    Toast.error('Senha muito curta', 'Mínimo de 6 caracteres.');
    return;
  }

  const data = App.getData();
  if (data.users?.find(u => u.email === email)) {
    Toast.error('E-mail já cadastrado', 'Tente fazer login.');
    return;
  }

  const user = {
    id: App.generateId(),
    name,
    email,
    password: pass,
    role: role || 'Administrador',
    createdAt: new Date().toISOString(),
  };

  if (!data.users) data.users = [];
  data.users.push(user);
  App.saveData(data);

  currentUser = user;
  Toast.success('Conta criada!', 'Agora cadastre sua empresa.');
  setTimeout(() => openCreateCompany(), 600);
}

/* ==================== CREATE COMPANY ==================== */
function openCreateCompany() {
  Modal.close('modal-choose-company');
  Modal.open('modal-create-company');
}

async function handleCreateCompany() {
  const name = document.getElementById('co-name').value.trim();
  const cnpj = document.getElementById('co-cnpj').value.trim();
  const segment = document.getElementById('co-segment').value.trim();

  if (!name) {
    Toast.error('Informe o nome da empresa');
    return;
  }

  const formData = new FormData();
  formData.append("nome", name);
  formData.append("cnpj", cnpj);
  formData.append("status", true);

  const file = document.getElementById("logo-input").files[0];
  if (file) {
    formData.append("logo", file);
  }

  try {
    const response = await fetch("http://localhost:8080/empresas", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Erro ao criar empresa");
    }

    const company = await response.json();

    App.session.companyId = company.id;
    App.session.userId = currentUser.id;
    App.session.company = company;
    App.session.user = currentUser;
    App.saveSession();

    Modal.closeAll();

    Toast.success(
      'Empresa criada!',
      `Bem-vindo à ${company.nome || company.name}`
    );

    setTimeout(() => {
      window.location.href = 'pages/dashboard.html';
    }, 800);

  } catch (error) {
    console.error(error);
    Toast.error("Erro ao criar empresa");
  }
}

// onde a empresa é criada (envio do form)

async function handleCreateCompany() {
   const name = document.getElementById('co-name').value.trim();
  const cnpj = document.getElementById('co-cnpj').value.trim();
  const segment = document.getElementById('co-segment').value.trim();

  if (!name) {
    Toast.error('Informe o nome da empresa');
    return;
  }

  const formData = new FormData();
  formData.append("nome", name);
  formData.append("cnpj", cnpj);
  formData.append("status", true);
  formData.append("logo", document.getElementById("logo-input").files[0]);

  try {
    const response = await fetch("http://localhost:8080/empresas", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Erro ao criar empresa");
    }

    const company = await response.json();

    App.session.companyId = company.id;
    App.session.userId = currentUser.id;
    App.session.company = company;
    App.session.user = currentUser;
    App.saveSession();

    Modal.closeAll();
    Toast.success('Empresa criada!', `Bem-vindo à ${company.nome}`);

    setTimeout(() => {
      window.location.href = 'pages/dashboard.html';
    }, 800);

  } catch (error) {
    console.error(error);
    Toast.error("Erro ao criar empresa");
  }
}