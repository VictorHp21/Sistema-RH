/* ==================== LOGIN PAGE LOGIC ==================== */

let currentUser = null;
let logoDataUrl = null;
let currentCompanies = [];

window.selectCompany = function selectCompany(companyId) {
  const company = currentCompanies.find(c => c.id === companyId);

  if (!company) return;

  App.session.companyId = company.id;
  App.session.userId = currentUser.id;
  App.session.company = company;
  App.session.user = currentUser;

  App.saveSession();

  Modal.closeAll();

  Toast.success('Login realizado!', `Bem-vindo à ${company.nome}`);

  

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 800);
}

// On load: render company chips and handle indicator
window.addEventListener('DOMContentLoaded', () => {

  updateTabIndicator('login');

  carregarEmpresasPreview();

  // If already logged in, redirect
  if (App.loadSession()) {

    console.log("Sessão antes de salvar:", App.session);

    App.saveSession();

    console.log("Sessão salva:", App.loadSession());

    window.location.href = 'dashboard.html';
  }
});

async function carregarEmpresasPreview() {
  const container = document.getElementById("preview-companies-list");

  container.innerHTML = `
    <div class="preview-loading">
      <span class="spinner">⏳</span>
      <span>Carregando empresas...</span>
    </div>
  `;

  try {
    const response = await fetch("http://localhost:8080/empresa");


    if (!response.ok) {
      console.warn("Endpoint /empresa indisponível:", response.status);
      container.innerHTML = "<p>Empresas indisponíveis no momento</p>";
      return;
    }

    const empresas = await response.json();

    if (!Array.isArray(empresas)) {
      console.warn("Resposta inválida da API");
      container.innerHTML = "<p>Erro ao carregar empresas</p>";
      return;
    }

    container.innerHTML = "";

    empresas.forEach(empresa => {
      const chip = document.createElement("div");
      chip.classList.add("preview-company-chip");

      chip.innerHTML = empresa.logoUrl
        ? `<img src="${empresa.logoUrl}" class="preview-company-logo"><span>${empresa.nome}</span>`
        : `<span>🏢</span><br><span>${empresa.nome}</span>`;

      container.appendChild(chip);
    });

  } catch (error) {
    console.error("Erro de conexão com backend:", error);

    container.innerHTML = "<p>Servidor offline</p>";
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
async function handleLogin() {
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

  try {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        senha: pass
      })
    });



    if (!response.ok) {
      const erro = await response.text();
      Toast.error(erro);
      return;
    }

    const user = await response.json();

    currentUser = user;

    console.log(currentUser);

    // =========================
    // PEGAR EMPRESAS DO USUÁRIO
    // =========================
    const companyRes = await fetch(
      `http://localhost:8080/empresa/user/${encodeURIComponent(email)}`
    );

    const company = await companyRes.json();
    console.log("EMPRESA:", company);

    currentCompanies = [company];




    btnText.textContent = 'Entrar na conta';
    spinner.style.display = 'none';

    if (!company || !company.id) {
      openCreateCompany();
    } else {
      openChooseCompany(currentCompanies); // mantém compatível com função antiga (array)
    }

  } catch (error) {
    console.error(error);
    Toast.error('Erro ao conectar com o servidor');
  } finally {
    btnText.textContent = 'Entrar na conta';
    spinner.style.display = 'none';
  }
}



function openChooseCompany(companies) {
  const list = document.getElementById('company-list-modal');

  list.innerHTML = companies.map(c => `
    <div class="company-item" onclick="selectCompany(${c.id})">
      <div class="company-item-logo">
        ${c.logoUrl
      ? `<img src="${c.logoUrl}" alt="${c.nome}">`
      : (c.nome ? c.nome[0].toUpperCase() : '🏢')}
      </div>

      <div class="company-item-info">
        <div class="company-item-name">${c.nome}</div>
        <div class="company-item-meta">${c.cnpj || 'Sem CNPJ'}</div>
      </div>

      <span class="company-item-arrow">→</span>
    </div>
  `).join('');

  Modal.open('modal-choose-company');
}

/* ==================== REGISTER ==================== */
async function handleRegister() {

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-pass').value;
  const role = document.getElementById('reg-role').value.trim();


  if (!name || !email || !pass) {
    Toast.error('Preencha todos os campos obrigatórios');
    return;
  }


  if (pass.length < 6) {
    Toast.error('Senha muito curta');
    return;
  }


  try {

    const response = await fetch(
      "http://localhost:8080/auth/register",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({

          nome:name,
          email:email,
          senha:pass,
          role:role || "Administrador"

        })
      }
    );


    if(!response.ok){

      const erro = await response.text();
      Toast.error(erro);
      return;

    }


    const user = await response.json();


    currentUser = user;


    Toast.success(
      "Conta criada!",
      "Agora cadastre sua empresa."
    );


    setTimeout(()=>{
      openCreateCompany();
    },600);



  } catch(error){

    console.error(error);
    Toast.error("Erro ao criar usuário");

  }

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
    const response = await fetch("http://localhost:8080/empresa", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Erro ao criar empresa");
    }

    const company = await response.json();

    console.log("EMPRESA CRIADA:", company);

    App.session.companyId = company.id || company.Id;
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
      window.location.href = 'dashboard.html';
    }, 800);

  } catch (error) {
    console.error(error);
    Toast.error("Erro ao criar empresa");
  }
}

// onde a empresa é criada (envio do form)