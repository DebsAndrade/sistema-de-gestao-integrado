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

// Do teu Ex2 (Tarefas - agora com um "responsável")
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
const listaUtilizadores: Utilizador[] = [];
const listaTarefas: Tarefa[] = [];

// Inputs de Utilizador
const inUserNome = document.getElementById("user_nome") as HTMLInputElement;
const inUserEmail = document.getElementById("user_email") as HTMLInputElement;
const btnAddUser = document.getElementById("user_addBtn") as HTMLButtonElement;
const divUserList = document.getElementById("user_list") as HTMLDivElement;

// Inputs de Tarefa
const inTaskInput = document.getElementById("task_input") as HTMLInputElement;
const selTaskCat = document.getElementById("task_categoria") as HTMLSelectElement;
const selResponsavel = document.getElementById("task_responsavel") as HTMLSelectElement;
const btnAddTask = document.getElementById("task_addBtn") as HTMLButtonElement;
const btnSortTask = document.getElementById("task_sortBtn") as HTMLButtonElement;
const ulTaskList = document.getElementById("task_list") as HTMLUListElement;

// Outputs de Estado (Do teu ficheiro 'Autónomo')
const pMsgErro = document.getElementById("msg_erro") as HTMLParagraphElement;
const spanEstado = document.getElementById("estado_msg") as HTMLSpanElement;
const spanContador = document.getElementById(
  "contador_tarefas"
) as HTMLSpanElement;

// Função do 'Autónomo' para gerir erros
function mostrarErro(mensagem: string): void {
  pMsgErro.textContent = mensagem;
  pMsgErro.style.color = "red"; // Como tinhas no código
}

// Função do 'Autónomo' para atualizar frases de estado
function atualizarEstadoSistema(): void {
  const total = listaTarefas.length;
  spanContador.textContent = `Total: ${total}`;

  if (total === 0) {
    spanEstado.textContent = "Sem tarefas pendentes 😴";
    spanEstado.style.color = "gray";
  } else if (total < 5) {
    spanEstado.textContent = "Trabalho a decorrer 🔨";
    spanEstado.style.color = "orange";
  } else {
    spanEstado.textContent = "Muitas tarefas! 🔥";
    spanEstado.style.color = "red";
  }
}

// Função para atualizar o Select de Responsáveis
function atualizarSelectResponsaveis() {
  // Guarda o valor atual para não perder a seleção ao redesenhar
  const valorAtual = selResponsavel.value;

  // Limpa e recria a opção padrão
  selResponsavel.innerHTML = `<option value="">-- Seleciona um Membro --</option>`;

  listaUtilizadores.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.nome; // Usamos o nome como valor
    option.textContent = user.nome;
    selResponsavel.appendChild(option);
  });

  selResponsavel.value = valorAtual;
}

function renderUsers() {
  divUserList.innerHTML = "";
  listaUtilizadores.forEach((user) => {
    const div = document.createElement("div");
    div.className = "user-card";
    div.innerHTML = `
            <strong>${user.nome}</strong>
            <small>${user.email}</small>
        `;
    divUserList.appendChild(div);
  });
  // Sempre que desenhamos a lista, atualizamos o select para as tarefas
  atualizarSelectResponsaveis();
}

function renderTasks() {
  ulTaskList.innerHTML = "";

  listaTarefas.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    // Cores baseadas na categoria (Ex2)
    let corBorda = "#ccc";
    if (task.categoria === "trabalho") corBorda = "#ff7675";
    if (task.categoria === "pessoal") corBorda = "#00b894";
    if (task.categoria === "estudos") corBorda = "#0984e3";
    li.style.borderLeftColor = corBorda;

    li.innerHTML = `
            <div>
                <strong>${task.titulo}</strong>
                <br>
                <small style="color:#666">👤 ${
                  task.responsavelNome
                } | 🏷️ ${task.categoria.toUpperCase()}</small>
            </div>
            <button class="btn-del" style="background:transparent; color:red; width:auto; font-size:1.2rem;">&times;</button>
        `;

    // Botão remover
    const btnDel = li.querySelector(".btn-del") as HTMLButtonElement;
    btnDel.onclick = () => {
      const index = listaTarefas.indexOf(task);
      if (index > -1) {
        listaTarefas.splice(index, 1);
        renderTasks();
        atualizarEstadoSistema(); // Recalcula estado (Autónomo)
      }
    };

    ulTaskList.appendChild(li);
  });
}

// Adicionar Utilizador
btnAddUser.addEventListener("click", () => {
  if (!inUserNome.value || !inUserEmail.value) {
    alert("Preenche os dados do utilizador.");
    return;
  }

  const novoUser = new UtilizadorClass(
    Date.now(),
    inUserNome.value,
    inUserEmail.value
  );
  listaUtilizadores.push(novoUser);

  renderUsers();

  inUserNome.value = "";
  inUserEmail.value = "";
});

// Adicionar Tarefa
btnAddTask.addEventListener("click", () => {
  const texto = inTaskInput.value;
  const responsavel = selResponsavel.value;

  // 1. Validação de Texto Curto (Autónomo)
  if (texto.length < 3) {
    mostrarErro("❌ A tarefa deve ter pelo menos 3 caracteres.");
    return;
  }

  // 2. Validação de Responsável (Lógica nova para integrar Utilizadores)
  if (responsavel === "") {
    mostrarErro("⚠️ Tens de escolher um membro da equipa.");
    return;
  }

  // Se passou, limpa erroClass
  mostrarErro("");

  const novaTarefa = new TarefaClass(
    Date.now(),
    texto,
    selTaskCat.value as Categoria,
    responsavel
  );

  listaTarefas.push(novaTarefa);
  renderTasks();
  atualizarEstadoSistema(); // Atualiza a barra de topo (Autónomo)

  inTaskInput.value = "";
});

// Ordenar Tarefas (Ex2)
btnSortTask.addEventListener("click", () => {
  listaTarefas.sort((a, b) => a.titulo.localeCompare(b.titulo));
  renderTasks();
});

// Inicialização
atualizarEstadoSistema();
