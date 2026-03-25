import { UserService } from "../services/UserService";
import { UserRoles } from "../security/UserRoles";

const userService = new UserService();

export function loadInitialData(): void {
  // Dados iniciais de exemplo
  try {
    userService.addUser("Ana Silva", "ana@empresa.pt", UserRoles.ADMIN);
    userService.addUser("João Costa", "joao@empresa.pt", UserRoles.GUEST);
    userService.addUser("Maria Santos", "maria@empresa.pt", UserRoles.MEMBER);
    console.log("✅ Dados iniciais carregados");
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
}

export function renderUsers(): void {
  const userList = document.getElementById("user_list") as HTMLDivElement;
  const addBtn = document.getElementById("user_addBtn") as HTMLButtonElement;
  const searchInput = document.getElementById(
    "user_search",
  ) as HTMLInputElement;
  const sortBtn = document.getElementById("user_sortBtn") as HTMLButtonElement;
  const selectResponsavel = document.getElementById(
    "task_responsavel",
  ) as HTMLSelectElement;

  if (!userList || !addBtn) return;

  // Adicionar utilizador
  addBtn.addEventListener("click", () => {
    const nomeInput = document.getElementById("user_nome") as HTMLInputElement;
    const emailInput = document.getElementById(
      "user_email",
    ) as HTMLInputElement;
    const errorMsg = document.getElementById(
      "msg_erro_user",
    ) as HTMLParagraphElement;

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();

    errorMsg.textContent = "";
    errorMsg.style.color = "var(--danger)";

    if (!nome || !email) {
      errorMsg.textContent = "❌ Preencha todos os campos!";
      return;
    }

    try {
      userService.addUser(nome, email, UserRoles.MEMBER);
      nomeInput.value = "";
      emailInput.value = "";
      errorMsg.style.color = "var(--success)";
      errorMsg.textContent = "✅ Membro adicionado!";
      setTimeout(() => (errorMsg.textContent = ""), 2000);
      displayUsers();
      updateUserStats();
      updateResponsavelSelect();
    } catch (error) {
      errorMsg.textContent = `❌ ${(error as Error).message}`;
    }
  });

  // Pesquisar utilizadores
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value;
      if (query.trim()) {
        const filtered = userService.searchUsers(query);
        displayUsers(filtered);
      } else {
        displayUsers();
      }
    });
  }

  // Ordenar utilizadores
  if (sortBtn) {
    sortBtn.addEventListener("click", () => {
      userService.sortUsersByName();
      displayUsers();
    });
  }

  function displayUsers(usersToDisplay = userService.getUsers()): void {
    userList.innerHTML = "";

    usersToDisplay.forEach((user) => {
      const card = document.createElement("div");
      card.className = "user-card";

      const statusIcon = user.isActive() ? "🟢" : "🔴";

      card.innerHTML = `
                <div>
                    <strong>${statusIcon} ${user.nome}</strong><br>
                    <small>${user.email}</small><br>
                    <small style="color: var(--primary)">${user.role}</small>
                </div>
                <div style="display: flex; gap: 5px; flex-direction: column;">
                    <button class="btn-small" data-action="toggle" data-id="${user.getId()}">
                        ${user.isActive() ? "Desativar" : "Ativar"}
                    </button>
                    <button class="btn-small" data-action="remove" data-id="${user.getId()}" 
                            style="background: var(--danger)">
                        Remover
                    </button>
                </div>
            `;

      // Toggle status
      const toggleBtn = card.querySelector(
        '[data-action="toggle"]',
      ) as HTMLButtonElement;
      toggleBtn.addEventListener("click", () => {
        userService.toggleUserStatus(user.getId());
        displayUsers();
        updateUserStats();
        updateResponsavelSelect();
      });

      // Remover utilizador
      const removeBtn = card.querySelector(
        '[data-action="remove"]',
      ) as HTMLButtonElement;
      removeBtn.addEventListener("click", () => {
        if (confirm(`Remover ${user.nome}?`)) {
          userService.removeUser(user.getId());
          displayUsers();
          updateUserStats();
          updateResponsavelSelect();
        }
      });

      userList.appendChild(card);
    });
  }

  function updateUserStats(): void {
    const stats = userService.getStats();

    const totalEl = document.getElementById("stat_total_users");
    const percentEl = document.getElementById("stat_percent_active");
    const activeCountEl = document.getElementById("count_active");
    const inactiveCountEl = document.getElementById("count_inactive");

    if (totalEl) totalEl.textContent = stats.total.toString();
    if (percentEl) percentEl.textContent = `${stats.percentActive}%`;
    if (activeCountEl) activeCountEl.textContent = stats.active.toString();
    if (inactiveCountEl)
      inactiveCountEl.textContent = stats.inactive.toString();
  }

  function updateResponsavelSelect(): void {
    if (!selectResponsavel) return;

    const activeUsers = userService.getActiveUsers();
    selectResponsavel.innerHTML =
      '<option value="">-- Seleciona um Membro --</option>';

    activeUsers.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.nome;
      option.textContent = `${user.nome} (${user.role})`;
      selectResponsavel.appendChild(option);
    });
  }

  // Inicializar
  displayUsers();
  updateUserStats();
  updateResponsavelSelect();
}

export { userService };
