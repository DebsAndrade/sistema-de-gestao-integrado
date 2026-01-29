import { TaskService } from "../services/TaskService";

const taskService = new TaskService();

export function renderTasks(): void {
  const taskList = document.getElementById("task_list") as HTMLUListElement;
  const addBtn = document.getElementById("task_addBtn") as HTMLButtonElement;
  const searchInput = document.getElementById(
    "task_search",
  ) as HTMLInputElement;
  const sortBtn = document.getElementById("task_sortBtn") as HTMLButtonElement;

  if (!taskList || !addBtn) return;

  // Adicionar tarefa
  addBtn.addEventListener("click", () => {
    const input = document.getElementById("task_input") as HTMLInputElement;
    const selectCategoria = document.getElementById(
      "task_categoria",
    ) as HTMLSelectElement;
    const selectResponsavel = document.getElementById(
      "task_responsavel",
    ) as HTMLSelectElement;
    const errorMsg = document.getElementById(
      "msg_erro",
    ) as HTMLParagraphElement;

    const texto = input.value.trim();
    const categoria = selectCategoria.value as
      | "trabalho"
      | "pessoal"
      | "estudos";
    const responsavel = selectResponsavel.value;

    errorMsg.textContent = "";
    errorMsg.style.color = "var(--danger)";

    if (!texto) {
      errorMsg.textContent = "❌ Digite uma tarefa!";
      return;
    }

    if (!responsavel) {
      errorMsg.textContent = "⚠️ Selecione um responsável!";
      return;
    }

    // Criar tarefa genérica por padrão
    // Para demonstrar polimorfismo, pode criar bug ou feature baseado em palavras-chave
    let taskType: "task" | "bug" | "feature" = "task";
    if (
      texto.toLowerCase().includes("bug") ||
      texto.toLowerCase().includes("erro")
    ) {
      taskType = "bug";
    } else if (
      texto.toLowerCase().includes("feature") ||
      texto.toLowerCase().includes("funcionalidade")
    ) {
      taskType = "feature";
    }

    taskService.createTask(texto, categoria, responsavel, taskType);

    input.value = "";
    errorMsg.style.color = "var(--success)";
    errorMsg.textContent = "✅ Tarefa criada!";
    setTimeout(() => (errorMsg.textContent = ""), 2000);

    displayTasks();
    updateTaskStats();
  });

  // Pesquisar tarefas
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value;
      if (query.trim()) {
        const filtered = taskService.searchTasks(query);
        displayTasks(filtered);
      } else {
        displayTasks();
      }
    });
  }

  // Ordenar tarefas
  if (sortBtn) {
    sortBtn.addEventListener("click", () => {
      taskService.sortTasksByTitle();
      displayTasks();
    });
  }

  function displayTasks(tasksToDisplay = taskService.getTasks()): void {
    taskList.innerHTML = "";

    if (tasksToDisplay.length === 0) {
      taskList.innerHTML =
        '<li style="text-align: center; color: #999;">Nenhuma tarefa ainda</li>';
      return;
    }

    tasksToDisplay.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-item";

      // Cor da borda por categoria
      const borderColors = {
        trabalho: "#0984e3",
        pessoal: "#00b894",
        estudos: "#fdcb6e",
      };
      li.style.borderLeftColor = borderColors[task.categoria];

      // Ícone por tipo de tarefa
      const typeIcons = {
        bug: "🐛",
        feature: "✨",
        task: "📋",
      };
      const typeIcon =
        typeIcons[task.getType() as keyof typeof typeIcons] || "📋";

      const completedStyle = task.completed
        ? "text-decoration: line-through; opacity: 0.6;"
        : "";

      const dataConclusao = task.dataConclusao
        ? `<br><small style="color: var(--success)">✅ ${task.dataConclusao.toLocaleString("pt-PT")}</small>`
        : "";

      li.innerHTML = `
                <div style="${completedStyle}">
                    <strong>${typeIcon} ${task.title}</strong>
                    <br>
                    <small>
                        <span style="background: ${borderColors[task.categoria]}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem;">
                            ${task.categoria.toUpperCase()}
                        </span>
                        ${task.responsavelNome ? `| 👤 ${task.responsavelNome}` : ""}
                        | 🔖 ${task.getType().toUpperCase()}
                    </small>
                    ${dataConclusao}
                </div>
                <div style="display: flex; gap: 5px;">
                    <button class="btn-small" data-action="toggle" data-id="${task.id}" 
                            style="background: ${task.completed ? "var(--blue)" : "var(--success)"}">
                        ${task.completed ? "↩️ Reabrir" : "✅ Concluir"}
                    </button>
                    <button class="btn-small" data-action="edit" data-id="${task.id}">
                        ✏️
                    </button>
                    <button class="btn-small" data-action="delete" data-id="${task.id}" 
                            style="background: var(--danger)">
                        🗑️
                    </button>
                </div>
            `;

      // Toggle concluída
      const toggleBtn = li.querySelector(
        '[data-action="toggle"]',
      ) as HTMLButtonElement;
      toggleBtn.addEventListener("click", () => {
        taskService.toggleTaskComplete(task.id);
        displayTasks();
        updateTaskStats();
      });

      // Editar tarefa
      const editBtn = li.querySelector(
        '[data-action="edit"]',
      ) as HTMLButtonElement;
      editBtn.addEventListener("click", () => {
        const newTitle = prompt("Novo título:", task.title);
        if (newTitle?.trim()) {
          taskService.updateTask(task.id, newTitle.trim());
          displayTasks();
        }
      });

      // Remover tarefa
      const deleteBtn = li.querySelector(
        '[data-action="delete"]',
      ) as HTMLButtonElement;
      deleteBtn.addEventListener("click", () => {
        if (confirm(`Remover "${task.title}"?`)) {
          taskService.deleteTask(task.id);
          displayTasks();
          updateTaskStats();
        }
      });

      taskList.appendChild(li);
    });
  }

  function updateTaskStats(): void {
    const stats = taskService.getStats();

    const pendingEl = document.getElementById("stat_task_pending");
    const completedEl = document.getElementById("stat_task_completed");
    const estadoMsg = document.getElementById("estado_msg");

    if (pendingEl) pendingEl.textContent = stats.pending.toString();
    if (completedEl) completedEl.textContent = stats.completed.toString();

    // Mensagem motivacional
    if (estadoMsg) {
      if (stats.total === 0) {
        estadoMsg.textContent = "Sem tarefas pendentes 😴";
        estadoMsg.style.color = "var(--primary)";
      } else if (stats.completed === stats.total) {
        estadoMsg.textContent = "🎉 Tudo Concluído!";
        estadoMsg.style.color = "var(--success)";
      } else if (stats.percentCompleted >= 70) {
        estadoMsg.textContent = "🚀 Quase lá!";
        estadoMsg.style.color = "var(--blue)";
      } else if (stats.percentCompleted >= 30) {
        estadoMsg.textContent = "💪 Bom trabalho!";
        estadoMsg.style.color = "var(--secondary)";
      } else {
        estadoMsg.textContent = "📝 Em andamento";
        estadoMsg.style.color = "var(--primary)";
      }
    }
  }

  // Inicializar
  displayTasks();
  updateTaskStats();
}

export { taskService };
