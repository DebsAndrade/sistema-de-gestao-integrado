// Do teu Ex2-2 (Utilizadores)
interface Utilizador {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
}

class UtilizadorClass implements Utilizador {
  id: number;
  nome: string;
  email: string;
  ativo: boolean = true;

  constructor(id: number, nome: string, email: string) {
    this.id = id;
    this.nome = nome;
    this.email = email;
  }
}

// Do teu Ex2 (Tarefas)
type Categoria = "trabalho" | "pessoal" | "estudos";

interface Tarefa {
  id: number;
  titulo: string;
  concluida: boolean;
  dataConclusao?: Date;
  categoria: Categoria;
  responsavelNome?: string;
}

// ex2
class TarefaClass implements Tarefa {
  id: number;
  titulo: string;
  concluida: boolean;
  dataConclusao?: Date;
  categoria: Categoria;
  responsavelNome?: string;

  constructor(
    id: number,
    titulo: string,
    categoria: Categoria,
    responsavelNome?: string,
    dataConclusao?: Date
  ) {
    this.id = id;
    this.titulo = titulo;
    this.concluida = false;
    this.dataConclusao = dataConclusao;
    this.categoria = categoria;
    this.responsavelNome = responsavelNome;
  }
}

// Listas para guardar os dados
const listaUtilizadores: UtilizadorClass[] = [];
const listaTarefas: TarefaClass[] = [];

// Inputs de Utilizador
const inUserNome = document.getElementById("user_nome") as HTMLInputElement;
const inUserEmail = document.getElementById("user_email") as HTMLInputElement;
const btnAddUser = document.getElementById("user_addBtn") as HTMLButtonElement;
const divUserList = document.getElementById("user_list") as HTMLDivElement;
const inUserSearch = document.getElementById("user_search") as HTMLInputElement;
// NOVO: Botão Sort e Spans de Contagem
const btnSortUser = document.getElementById(
  "user_sortBtn"
) as HTMLButtonElement;
const spanUserActive = document.getElementById(
  "count_active"
) as HTMLSpanElement;
const spanUserInactive = document.getElementById(
  "count_inactive"
) as HTMLSpanElement;

// Inputs de Tarefa
const inTaskInput = document.getElementById("task_input") as HTMLInputElement;
const selTaskCat = document.getElementById(
  "task_categoria"
) as HTMLSelectElement;
const selResponsavel = document.getElementById(
  "task_responsavel"
) as HTMLSelectElement;
const btnAddTask = document.getElementById("task_addBtn") as HTMLButtonElement;
const btnSortTask = document.getElementById(
  "task_sortBtn"
) as HTMLButtonElement;
const ulTaskList = document.getElementById("task_list") as HTMLUListElement;
const inTaskSearch = document.getElementById("task_search") as HTMLInputElement;

// Outputs de Estado
const pMsgErro = document.getElementById("msg_erro") as HTMLParagraphElement;
const spanEstado = document.getElementById("estado_msg") as HTMLSpanElement;
const spanContador = document.getElementById(
  "contador_tarefas"
) as HTMLSpanElement;

// Função do 'Autónomo' para gerir erros
function mostrarErro(mensagem: string): void {
  pMsgErro.textContent = mensagem;
  pMsgErro.style.color = "red";
}

// Atualizar frases de estado
function atualizarEstadoSistema(): void {
  const totalConcluidas = listaTarefas.filter(
    (t) => t.concluida === true
  ).length;
  const totalPendentes = listaTarefas.length - totalConcluidas;

  spanContador.textContent = `Pendentes: ${totalPendentes} | Concluídas: ${totalConcluidas}`;

  if (listaTarefas.length === 0) {
    spanEstado.textContent = "Sem tarefas pendentes 😴";
    spanEstado.style.color = "gray";
  } else if (totalPendentes === 0) {
    spanEstado.textContent = "Tudo feito! Parabéns! 🎉";
    spanEstado.style.color = "var(--success)";
  } else if (totalPendentes < 5) {
    spanEstado.textContent = "Trabalho a decorrer 🔨";
    spanEstado.style.color = "orange";
  } else {
    spanEstado.textContent = "Muitas tarefas pendentes! 🔥";
    spanEstado.style.color = "red";
  }
}

// Atualizar Select de Responsáveis
function atualizarSelectResponsaveis() {
  const valorAtual = selResponsavel.value;
  selResponsavel.innerHTML = `<option value="">-- Seleciona um Membro --</option>`;

  listaUtilizadores.forEach((user) => {
    if (user.ativo === true) {
      const option = document.createElement("option");
      option.value = user.nome;
      option.textContent = user.nome;
      selResponsavel.appendChild(option);
    }
  });

  selResponsavel.value = valorAtual;
}

function renderUsers(listaParaMostrar: UtilizadorClass[] = listaUtilizadores) {
  divUserList.innerHTML = "";

  // Conta sempre com base na lista TOTAL (listaUtilizadores), e não na filtrada
  const totalAtivos = listaUtilizadores.filter((u) => u.ativo === true).length;
  const totalInativos = listaUtilizadores.length - totalAtivos;

  if (spanUserActive) spanUserActive.textContent = totalAtivos.toString();
  if (spanUserInactive) spanUserInactive.textContent = totalInativos.toString();

  // 2. DESENHAR A LISTA
  listaParaMostrar.forEach((user) => {
    const div = document.createElement("div");
    div.className = "user-card";

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

    const btnToggle = div.querySelector(
      ".btn-toggle-user"
    ) as HTMLButtonElement;
    btnToggle.onclick = () => {
      user.ativo = !user.ativo;
      renderUsers();
    };

    const btnDel = div.querySelector(".btn-del-user") as HTMLButtonElement;
    btnDel.onclick = () => {
      const confirmar = confirm(
        `Tens a certeza que queres apagar o ${user.nome}?`
      );
      if (confirmar) {
        const index = listaUtilizadores.indexOf(user);
        if (index > -1) {
          listaUtilizadores.splice(index, 1);
          renderUsers();
        }
      }
    };

    divUserList.appendChild(div);
  });

  atualizarSelectResponsaveis();
}

// EVENTO: PESQUISA UTILIZADOR
if (inUserSearch) {
  inUserSearch.addEventListener("input", () => {
    const termo = inUserSearch.value.toLowerCase();
    const filtrados = listaUtilizadores.filter((u) =>
      u.nome.toLowerCase().includes(termo)
    );
    renderUsers(filtrados);
  });
}

// EVENTO: ORDENAR UTILIZADORES
if (btnSortUser) {
  btnSortUser.addEventListener("click", () => {
    // Ordena a lista original alfabeticamente
    listaUtilizadores.sort((a, b) => a.nome.localeCompare(b.nome));

    // Se houver pesquisa ativa, mantém o filtro visualmente
    if (inUserSearch && inUserSearch.value !== "") {
      const termo = inUserSearch.value.toLowerCase();
      const filtrados = listaUtilizadores.filter((u) =>
        u.nome.toLowerCase().includes(termo)
      );
      renderUsers(filtrados);
    } else {
      renderUsers();
    }
  });
}

function renderTasks(listaParaMostrar: TarefaClass[] = listaTarefas) {
  ulTaskList.innerHTML = "";

  listaParaMostrar.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    let corBorda = "#ccc";
    if (task.categoria === "trabalho") corBorda = "#ff7675";
    if (task.categoria === "pessoal") corBorda = "#00b894";
    if (task.categoria === "estudos") corBorda = "#0984e3";

    if (task.concluida) corBorda = "#b2bec3";

    li.style.borderLeftColor = corBorda;

    const estiloTitulo = task.concluida
      ? "text-decoration: line-through; color: #b2bec3;"
      : "";

    const dataMsg =
      task.concluida && task.dataConclusao
        ? `<span style="color:green; font-size:0.8rem; margin-left:5px;">(Concluída em: ${task.dataConclusao.toLocaleString()})</span>`
        : "";

    li.innerHTML = `
        <div class="task-content" style="flex: 1; cursor: pointer;">
            <strong style="${estiloTitulo}">${task.titulo}</strong>
            ${dataMsg}
            <br>
            <small style="color:#666">👤 ${task.responsavelNome} | 🏷️ ${task.categoria.toUpperCase()}</small>
        </div>

        <div style="display:flex; gap: 3px;">
            <button class="btn-edit" style="background:transparent; color:red; width:auto; font-size:1.2rem;">✏️</button>
            <button class="btn-del" style="background:transparent; color:red; width:auto; font-size:1.2rem;">❌</button>
        </div>
    `;

    const divContent = li.querySelector(".task-content") as HTMLDivElement;
    divContent.onclick = () => {
      task.concluida = !task.concluida;

      if (task.concluida) {
        task.dataConclusao = new Date();
      } else {
        task.dataConclusao = undefined;
      }
      renderTasks();
      atualizarEstadoSistema();
    };

    const btnEdit = li.querySelector(".btn-edit") as HTMLButtonElement;
    btnEdit.onclick = (e) => {
      e.stopPropagation();
      const novoTitulo = prompt("Editar título da tarefa:", task.titulo);
      if (novoTitulo !== null && novoTitulo.trim() !== "") {
        task.titulo = novoTitulo;
        renderTasks();
      }
    };

    const btnDel = li.querySelector(".btn-del") as HTMLButtonElement;
    btnDel.onclick = (e) => {
      e.stopPropagation();
      const confirmar = confirm(
        "Tem a certeza que deseja excluir esta tarefa?"
      );
      if (confirmar) {
        const index = listaTarefas.indexOf(task);
        if (index > -1) {
          listaTarefas.splice(index, 1);
          renderTasks();
          atualizarEstadoSistema();
        }
      }
    };

    ulTaskList.appendChild(li);
  });
}

// EVENTO PESQUISA TAREFA
if (inTaskSearch) {
  inTaskSearch.addEventListener("input", () => {
    const termo = inTaskSearch.value.toLowerCase();
    const tarefasFiltradas = listaTarefas.filter((t) =>
      t.titulo.toLowerCase().includes(termo)
    );
    renderTasks(tarefasFiltradas);
  });
}

// Adicionar Utilizador
btnAddUser.addEventListener("click", () => {
  if (!inUserNome.value || !inUserEmail.value) {
    alert("Preenche os dados do utilizador.");
    return;
  }

  if (!inUserEmail.value.includes("@") || !inUserEmail.value.includes(".")) {
    alert("Email inválido. Precisa ter '@' e '.'");
    return;
  }

  const novoUser = new UtilizadorClass(
    Date.now(),
    inUserNome.value,
    inUserEmail.value
  );
  listaUtilizadores.push(novoUser);

  if (inUserSearch) inUserSearch.value = "";

  renderUsers();

  inUserNome.value = "";
  inUserEmail.value = "";
});

// Adicionar Tarefa
btnAddTask.addEventListener("click", () => {
  const texto = inTaskInput.value;
  const responsavel = selResponsavel.value;

  if (texto.length < 3) {
    mostrarErro("❌ A tarefa deve ter pelo menos 3 caracteres.");
    return;
  }

  if (responsavel === "") {
    mostrarErro("⚠️ Tens de escolher um membro da equipa.");
    return;
  }

  mostrarErro("");

  const novaTarefa = new TarefaClass(
    Date.now(),
    texto,
    selTaskCat.value as Categoria,
    responsavel
  );

  listaTarefas.push(novaTarefa);

  if (inTaskSearch) inTaskSearch.value = "";

  renderTasks();
  atualizarEstadoSistema();

  inTaskInput.value = "";
});

// Ordenar Tarefas
btnSortTask.addEventListener("click", () => {
  listaTarefas.sort((a, b) => a.titulo.localeCompare(b.titulo));

  if (inTaskSearch && inTaskSearch.value !== "") {
    const termo = inTaskSearch.value.toLowerCase();
    const filtradas = listaTarefas.filter((tarefa) =>
      tarefa.titulo.toLowerCase().includes(termo)
    );
    renderTasks(filtradas);
  } else {
    renderTasks();
  }
});

// Dados Iniciais Falsos (19 - autonomo)
function loadInitialData(): void {

    const fakeData = [
        { id: 1, name: "Daniel Moraes", email: "daniel.moraesa@gmail.com", active: true },
        { id: 2, name: "Tais Dias", email: "tais.diasc@gmail.com", active: false },
        { id: 3, name: "Aurora Almeida", email: "aurora.almeida@gmail.com", active: true },
        { id: 4, name: "Gabriella Ayres", email: "gabriella.ayres@gmail.com", active: true },
        { id: 5, name: "Débora Andrade", email: "debora@gmail.com", active: true }
    ];

    fakeData.forEach(data => {
        const newUser = new UtilizadorClass(data.id, data.name, data.email);
        newUser.ativo = data.active;
        listaUtilizadores.push(newUser);
    });

    renderUsers();
}

loadInitialData();

// Inicialização
atualizarEstadoSistema();
