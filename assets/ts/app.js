"use strict";
class UtilizadorClass {
    constructor(id, nome, email) {
        this.ativo = true;
        this.id = id;
        this.nome = nome;
        this.email = email;
    }
}
// ex2
class TarefaClass {
    constructor(id, titulo, categoria, responsavelNome, dataConclusao) {
        this.id = id;
        this.titulo = titulo;
        this.concluida = false;
        this.dataConclusao = dataConclusao;
        this.categoria = categoria;
        this.responsavelNome = responsavelNome;
    }
}
// Listas para guardar os dados
const listaUtilizadores = [];
const listaTarefas = [];
// Inputs de Utilizador
const inUserNome = document.getElementById("user_nome");
const inUserEmail = document.getElementById("user_email");
const btnAddUser = document.getElementById("user_addBtn");
const divUserList = document.getElementById("user_list");
const inUserSearch = document.getElementById("user_search");
// Botão Sort e Spans de Contagem
const btnSortUser = document.getElementById("user_sortBtn");
const spanUserActive = document.getElementById("count_active");
const spanUserInactive = document.getElementById("count_inactive");
// Inputs de Tarefa
const inTaskInput = document.getElementById("task_input");
const selTaskCat = document.getElementById("task_categoria");
const selResponsavel = document.getElementById("task_responsavel");
const btnAddTask = document.getElementById("task_addBtn");
const btnSortTask = document.getElementById("task_sortBtn");
const ulTaskList = document.getElementById("task_list");
const inTaskSearch = document.getElementById("task_search");
// Outputs de Estado
const pMsgErro = document.getElementById("msg_erro");
const spanEstado = document.getElementById("estado_msg");
const spanContador = document.getElementById("contador_tarefas");
// Elementos das Estatísticas (Utilizadores)
const spanTotalUsers = document.getElementById("stat_total_users");
const spanPercentActive = document.getElementById("stat_percent_active");
// Elementos das Estatísticas (Tarefas) - NOVOS
const statTaskPending = document.getElementById("stat_task_pending");
const statTaskCompleted = document.getElementById("stat_task_completed");
// Função do 'Autónomo' para gerir erros
function mostrarErro(mensagem) {
    pMsgErro.textContent = mensagem;
    pMsgErro.style.color = "red";
}
// Atualizar frases de estado
function atualizarEstadoSistema() {
    const totalConcluidas = listaTarefas.filter((t) => t.concluida === true).length;
    const totalPendentes = listaTarefas.length - totalConcluidas;
    // Atualiza as novas caixinhas
    if (statTaskPending)
        statTaskPending.textContent = totalPendentes.toString();
    if (statTaskCompleted)
        statTaskCompleted.textContent = totalConcluidas.toString();
    // Mensagens de texto (opcional manter)
    if (listaTarefas.length === 0) {
        spanEstado.textContent = "Sem tarefas pendentes 😴";
        spanEstado.style.color = "gray";
    }
    else if (totalPendentes === 0) {
        spanEstado.textContent = "Tudo feito! Parabéns! 🎉";
        spanEstado.style.color = "var(--success)";
    }
    else if (totalPendentes < 5) {
        spanEstado.textContent = "Trabalho a decorrer 🔨";
        spanEstado.style.color = "orange";
    }
    else {
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
function atualizarEstatisticas() {
    const total = listaUtilizadores.length;
    // Evitar divisão por zero
    if (total === 0) {
        if (spanTotalUsers)
            spanTotalUsers.textContent = "0";
        if (spanPercentActive)
            spanPercentActive.textContent = "0%";
        return;
    }
    const ativos = listaUtilizadores.filter((utilizador) => utilizador.ativo).length;
    const percentagem = (ativos / total) * 100;
    if (spanTotalUsers) {
        spanTotalUsers.textContent = total.toString();
    }
    if (spanPercentActive) {
        spanPercentActive.textContent = `${percentagem.toFixed(0)}%`;
    }
}
function renderUsers(listaParaMostrar = listaUtilizadores) {
    divUserList.innerHTML = "";
    // Lógica de contagem
    const totalAtivos = listaUtilizadores.filter((u) => u.ativo === true).length;
    const totalInativos = listaUtilizadores.length - totalAtivos;
    if (spanUserActive)
        spanUserActive.textContent = totalAtivos.toString();
    if (spanUserInactive)
        spanUserInactive.textContent = totalInativos.toString();
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
        const btnToggle = div.querySelector(".btn-toggle-user");
        btnToggle.onclick = (e) => {
            e.stopPropagation(); // Impede o clique de afetar o blur
            user.ativo = !user.ativo;
            renderUsers();
        };
        // Botão Excluir
        const btnDel = div.querySelector(".btn-del-user");
        btnDel.onclick = (e) => {
            e.stopPropagation(); // Impede o clique de afetar o blur
            const confirmar = confirm(`Tens a certeza que queres apagar o ${user.nome}?`);
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
    atualizarEstatisticas();
}
// EVENTO: PESQUISA UTILIZADOR
if (inUserSearch) {
    inUserSearch.addEventListener("input", () => {
        const termo = inUserSearch.value.toLowerCase();
        const filtrados = listaUtilizadores.filter((u) => u.nome.toLowerCase().includes(termo));
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
            const filtrados = listaUtilizadores.filter((u) => u.nome.toLowerCase().includes(termo));
            renderUsers(filtrados);
        }
        else {
            renderUsers();
        }
    });
}
function renderTasks(listaParaMostrar = listaTarefas) {
    ulTaskList.innerHTML = "";
    listaParaMostrar.forEach((task) => {
        const li = document.createElement("li");
        li.className = "task-item";
        let corBorda = "#ccc";
        if (task.categoria === "trabalho")
            corBorda = "#ff7675";
        if (task.categoria === "pessoal")
            corBorda = "#00b894";
        if (task.categoria === "estudos")
            corBorda = "#0984e3";
        if (task.concluida)
            corBorda = "#b2bec3";
        li.style.borderLeftColor = corBorda;
        const estiloTitulo = task.concluida
            ? "text-decoration: line-through; color: #b2bec3;"
            : "";
        const dataMsg = task.concluida && task.dataConclusao
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
        const divContent = li.querySelector(".task-content");
        divContent.onclick = () => {
            task.concluida = !task.concluida;
            if (task.concluida) {
                task.dataConclusao = new Date();
            }
            else {
                task.dataConclusao = undefined;
            }
            renderTasks();
            atualizarEstadoSistema();
        };
        const btnEdit = li.querySelector(".btn-edit");
        btnEdit.onclick = (e) => {
            e.stopPropagation();
            const novoTitulo = prompt("Editar título da tarefa:", task.titulo);
            if (novoTitulo !== null && novoTitulo.trim() !== "") {
                task.titulo = novoTitulo;
                renderTasks();
            }
        };
        const btnDel = li.querySelector(".btn-del");
        btnDel.onclick = (e) => {
            e.stopPropagation();
            const confirmar = confirm("Tem a certeza que deseja excluir esta tarefa?");
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
        const tarefasFiltradas = listaTarefas.filter((t) => t.titulo.toLowerCase().includes(termo));
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
    const novoUser = new UtilizadorClass(Date.now(), inUserNome.value, inUserEmail.value);
    listaUtilizadores.push(novoUser);
    if (inUserSearch)
        inUserSearch.value = "";
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
    const novaTarefa = new TarefaClass(Date.now(), texto, selTaskCat.value, responsavel);
    listaTarefas.push(novaTarefa);
    if (inTaskSearch)
        inTaskSearch.value = "";
    renderTasks();
    atualizarEstadoSistema();
    inTaskInput.value = "";
});
// Ordenar Tarefas
btnSortTask.addEventListener("click", () => {
    listaTarefas.sort((a, b) => a.titulo.localeCompare(b.titulo));
    if (inTaskSearch && inTaskSearch.value !== "") {
        const termo = inTaskSearch.value.toLowerCase();
        const filtradas = listaTarefas.filter((tarefa) => tarefa.titulo.toLowerCase().includes(termo));
        renderTasks(filtradas);
    }
    else {
        renderTasks();
    }
});
// Dados Iniciais Falsos (19 - autonomo)
function loadInitialData() {
    const fakeData = [
        {
            id: 1,
            name: "Daniel Moraes",
            email: "daniel.moraesa@gmail.com",
            active: true,
        },
        { id: 2, name: "Tais Dias", email: "tais.diasc@gmail.com", active: false },
        {
            id: 3,
            name: "Aurora Almeida",
            email: "aurora.almeida@gmail.com",
            active: true,
        },
        {
            id: 4,
            name: "Gabriella Ayres",
            email: "gabriella.ayres@gmail.com",
            active: true,
        },
        { id: 5, name: "Débora Andrade", email: "debora@gmail.com", active: true },
    ];
    fakeData.forEach((data) => {
        const newUser = new UtilizadorClass(data.id, data.name, data.email);
        newUser.ativo = data.active;
        listaUtilizadores.push(newUser);
    });
    renderUsers();
}
loadInitialData();
// Inicialização
atualizarEstadoSistema();
