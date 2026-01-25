import { adicionarTarefa, getTarefas } from "@services/TaskService";
import { TarefaClass, Categoria } from "@models/Tarefa";

function mostrarErro(mensagem: string): void {
  const pMsgErro = document.getElementById("msg_erro") as HTMLParagraphElement;
  pMsgErro.textContent = mensagem;
  pMsgErro.style.color = "red";
}

export function atualizarEstadoSistema(): void {
  const spanEstado = document.getElementById("estado_msg") as HTMLSpanElement;
  const statTaskPending = document.getElementById(
    "stat_task_pending",
  ) as HTMLElement;
  const statTaskCompleted = document.getElementById(
    "stat_task_completed",
  ) as HTMLElement;
  const totalConcluidas = getTarefas().filter(
    (tarefa) => tarefa.concluida === true,
  ).length;
  const totalPendentes = getTarefas().length - totalConcluidas;

  // Atualiza as novas caixinhas
  if (statTaskPending) statTaskPending.textContent = totalPendentes.toString();
  if (statTaskCompleted)
    statTaskCompleted.textContent = totalConcluidas.toString();

  // Mensagens de texto (opcional manter)
  if (getTarefas().length === 0) {
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

export function renderTasks(
  listaParaMostrar: TarefaClass[] = getTarefas(),
): void {
  const ulTaskList = document.getElementById("task_list") as HTMLUListElement;
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
        "Tem a certeza que deseja excluir esta tarefa?",
      );
      if (confirmar) {
        const index = getTarefas().indexOf(task);
        if (index > -1) {
          getTarefas().splice(index, 1);
          renderTasks();
          atualizarEstadoSistema();
        }
      }
    };

    ulTaskList.appendChild(li);
  });

  adicionaSearchListener();
  addTarefaEventListener();
  ordernarTarefasPorTitulo();
  atualizarEstadoSistema();
}

function adicionaSearchListener() {
  const inTaskSearch = document.getElementById(
    "task_search",
  ) as HTMLInputElement;
  inTaskSearch.addEventListener("input", () => {
    const termo = inTaskSearch.value.toLowerCase();
    const tarefasFiltradas = getTarefas().filter((tarefa) =>
      tarefa.titulo.toLowerCase().includes(termo),
    );
    renderTasks(tarefasFiltradas);
  });
}

function addTarefaEventListener() {
  const btnAddTask = document.getElementById(
    "task_addBtn",
  ) as HTMLButtonElement;
  const inTaskInput = document.getElementById("task_input") as HTMLInputElement;
  const selTaskCat = document.getElementById(
    "task_categoria",
  ) as HTMLSelectElement;
  const selResponsavel = document.getElementById(
    "task_responsavel",
  ) as HTMLSelectElement;
  const inTaskSearch = document.getElementById(
    "task_search",
  ) as HTMLInputElement;
  btnAddTask.addEventListener("click", () => {
    const texto = inTaskInput.value;
    const responsavel = selResponsavel.value;
    const categoria = selTaskCat.value as Categoria;

    if (texto.length < 3) {
      mostrarErro("❌ A tarefa deve ter pelo menos 3 caracteres.");
      return;
    }

    if (responsavel === "") {
      mostrarErro("⚠️ Tens de escolher um membro da equipa.");
      return;
    }

    mostrarErro("");

    adicionarTarefa(texto, categoria, responsavel);

    if (inTaskSearch) inTaskSearch.value = "";

    renderTasks();
    atualizarEstadoSistema();

    inTaskInput.value = "";
  });
}

function ordernarTarefasPorTitulo() {
  const btnSortTask = document.getElementById(
    "task_sortBtn",
  ) as HTMLButtonElement;
  const inTaskSearch = document.getElementById(
    "task_search",
  ) as HTMLInputElement;
  btnSortTask.addEventListener("click", () => {
    getTarefas().sort((a, b) => a.titulo.localeCompare(b.titulo));

    if (inTaskSearch && inTaskSearch.value !== "") {
      const termo = inTaskSearch.value.toLowerCase();
      const filtradas = getTarefas().filter((tarefa) =>
        tarefa.titulo.toLowerCase().includes(termo),
      );
      renderTasks(filtradas);
    } else {
      renderTasks();
    }
  });
}
