import { getUtilizadores, adicionarUtilizador } from "@services/UserService";
import { UtilizadorClass } from "@models/Utilizador";

export function atualizarSelectResponsaveis() {
  const selResponsavel = document.getElementById(
    "task_responsavel",
  ) as HTMLSelectElement;
  const valorAtual = selResponsavel.value;
  selResponsavel.innerHTML = `<option value="">-- Seleciona um Membro --</option>`;

  getUtilizadores().forEach((user) => {
    if (user.ativo === true) {
      const option = document.createElement("option");
      option.value = user.nome;
      option.textContent = user.nome;
      selResponsavel.appendChild(option);
    }
  });

  selResponsavel.value = valorAtual;
}

export function atualizarEstatisticas(): void {
  const spanTotalUsers = document.getElementById(
    "stat_total_users",
  ) as HTMLElement;
  const spanPercentActive = document.getElementById(
    "stat_percent_active",
  ) as HTMLElement;
  const total = getUtilizadores().length;

  // Evitar divisão por zero
  if (total === 0) {
    if (spanTotalUsers) spanTotalUsers.textContent = "0";
    if (spanPercentActive) spanPercentActive.textContent = "0%";
    return;
  }

  const ativos = getUtilizadores().filter(
    (utilizador) => utilizador.ativo,
  ).length;
  const percentagem = (ativos / total) * 100;

  if (spanTotalUsers) {
    spanTotalUsers.textContent = total.toString();
  }

  if (spanPercentActive) {
    spanPercentActive.textContent = `${percentagem.toFixed(0)}%`;
  }
}

export function renderUsers(
  listaParaMostrar: UtilizadorClass[] = getUtilizadores(),
): void {
  const divUserList = document.getElementById("user_list") as HTMLDivElement;

  const spanUserActive = document.getElementById(
    "count_active",
  ) as HTMLSpanElement;
  const spanUserInactive = document.getElementById(
    "count_inactive",
  ) as HTMLSpanElement;
  divUserList.innerHTML = "";

  // Lógica de contagem
  const totalAtivos = getUtilizadores().filter((u) => u.ativo === true).length;
  const totalInativos = getUtilizadores().length - totalAtivos;

  if (spanUserActive) spanUserActive.textContent = totalAtivos.toString();
  if (spanUserInactive) spanUserInactive.textContent = totalInativos.toString();

  listaParaMostrar.forEach((user) => {
    const div = document.createElement("div");

    // Define a classe inicial (com blur) e cursor
    div.className = "user-card is-blurred";
    div.style.cursor = "pointer";

    // Estilos do layout
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.gap = "10px";

    const btnTexto = user.ativo ? "Desativar" : "Ativar";
    const btnCor = user.ativo ? "#b2bec3" : "#00b894";

    div.innerHTML = `
            <div style="flex: 1">
                <strong>${user.nome}</strong> <small>(ID: ${user.id})</small>
                <br>
                <small>${user.email}</small>
                <br>
                <small style="font-weight:bold; color: ${user.ativo ? "green" : "red"}">
                    ${user.ativo ? "🟢 Ativo" : "🔴 Inativo"}
                </small>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:5px;">
                <button class="btn-toggle-user" style="background:${btnCor}; color:white; border:none; width:80px; padding:5px 0; border-radius:4px; cursor:pointer; text-align:center;">
                    ${btnTexto}
                </button>

                <button class="btn-del-user" style="background:#ff7675; color:white; border:none; width:80px; padding:5px 0; border-radius:4px; cursor:pointer; text-align:center;">
                    Excluir
                </button>
            </div>
        `;

    // --- LÓGICA DO CLIQUE (Alternar Blur) ---
    div.onclick = () => {
      // O toggle adiciona a classe se não tiver, e remove se tiver
      div.classList.toggle("is-blurred");
    };

    // Botões de Ação (Ativar/Desativar)
    const btnToggle = div.querySelector(
      ".btn-toggle-user",
    ) as HTMLButtonElement;
    btnToggle.onclick = (e) => {
      e.stopPropagation();
      user.ativo = !user.ativo;
      renderUsers();
    };

    // Botão Excluir
    const btnDel = div.querySelector(".btn-del-user") as HTMLButtonElement;
    btnDel.onclick = (e) => {
      e.stopPropagation();
      const confirmar = confirm(
        `Tens a certeza que queres apagar o ${user.nome}?`,
      );
      if (confirmar) {
        const index = getUtilizadores().indexOf(user);
        if (index > -1) {
          getUtilizadores().splice(index, 1);
          renderUsers();
        }
      }
    };

    divUserList.appendChild(div);
  });

  atualizarSelectResponsaveis();
  atualizarEstatisticas();
  adcionaSearchListener();
  ordernarUtilizadoresPorNome();
  addUtilizadorEventListener();
}

function adcionaSearchListener() {
  const inUserSearch = document.getElementById(
    "user_search",
  ) as HTMLInputElement;
  inUserSearch.addEventListener("input", () => {
    const termo = inUserSearch.value.toLowerCase();
    const filtrados = getUtilizadores().filter((utilizador) =>
      utilizador.nome.toLowerCase().includes(termo),
    );
    renderUsers(filtrados);
  });
}

function ordernarUtilizadoresPorNome() {
  const btnSortUser = document.getElementById(
    "user_sortBtn",
  ) as HTMLButtonElement;
  const inUserSearch = document.getElementById(
    "user_search",
  ) as HTMLInputElement;
  btnSortUser.addEventListener("click", () => {
    // Ordena a lista original alfabeticamente
    getUtilizadores().sort((a, b) => a.nome.localeCompare(b.nome));

    // Se houver pesquisa ativa, mantém o filtro visualmente
    if (inUserSearch && inUserSearch.value !== "") {
      const termo = inUserSearch.value.toLowerCase();
      const filtrados = getUtilizadores().filter((u) =>
        u.nome.toLowerCase().includes(termo),
      );
      renderUsers(filtrados);
    } else {
      renderUsers();
    }
  });
}

function addUtilizadorEventListener() {
  const inUserNome = document.getElementById("user_nome") as HTMLInputElement;
  const inUserEmail = document.getElementById("user_email") as HTMLInputElement;
  const btnAddUser = document.getElementById(
    "user_addBtn",
  ) as HTMLButtonElement;
  const inUserSearch = document.getElementById(
    "user_search",
  ) as HTMLInputElement;
  btnAddUser.addEventListener("click", () => {
    if (!inUserNome.value || !inUserEmail.value) {
      alert("Preenche os dados do utilizador.");
      return;
    }

    if (!inUserEmail.value.includes("@") || !inUserEmail.value.includes(".")) {
      alert("Email inválido. Precisa ter '@' e '.'");
      return;
    }

    adicionarUtilizador(inUserNome.value, inUserEmail.value);

    if (inUserSearch) inUserSearch.value = "";

    renderUsers();

    inUserNome.value = "";
    inUserEmail.value = "";
  });
}

export function loadInitialData(): void {
  const fakeData = [
    {
      name: "Daniel Moraes",
      email: "daniel.moraesa@gmail.com",
    },
    { name: "Tais Dias", email: "tais.diasc@gmail.com" },
    {
      name: "Aurora Almeida",
      email: "aurora.almeida@gmail.com"
    },
    {
      name: "Gabriella Ayres",
      email: "gabriella.ayres@gmail.com"
    },
    { name: "Débora Andrade", email: "debora@gmail.com" },
  ];

  fakeData.forEach((data) => {
    adicionarUtilizador(data.name, data.email);
  });
}
