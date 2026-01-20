# 🚀 Sistema de Gestão Integrado

Um sistema de gestão de **Utilizadores e Tarefas** desenvolvido em **TypeScript**. Este projeto funciona como uma _Single Page Application_ (SPA) para gerir equipas e os seus afazeres diários, focando-se na manipulação do DOM e na Tipagem Forte.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido com o objetivo de consolidar conceitos de TypeScript e manipulação dinâmica de interfaces. Permite criar uma base de dados local (em memória) de membros de uma equipa, atribuir-lhes tarefas categorizadas e acompanhar o estado do projeto em tempo real.

🔗 **Acesse o projeto online:** [Sistema de Gestão Integrado](https://debsandrade.github.io/Endure-And-Survive/)


## ✨ Funcionalidades

### 👤 Gestão de Utilizadores

- **Adicionar Membros:** Validação de nome e email (incluindo formato correto).
- **Estado (Ativo/Inativo):** Possibilidade de ativar ou desativar utilizadores.
  - _Nota:_ Apenas utilizadores **ativos** aparecem na lista para receber tarefas.
- **Listagem Visual:** Cartões com indicadores de estado (🟢/🔴).
- **Contadores:** Visualização em tempo real de total de ativos vs. inativos.
- **Pesquisa:** Filtragem de utilizadores por nome em tempo real.
- **Ordenação:** Organização alfabética (A-Z).
- **Remover:** Exclusão de utilizadores com confirmação de segurança.

### 📝 Gestão de Tarefas

- **Criar Tarefas:** Atribuição de título, categoria (Trabalho, Pessoal, Estudos) e um responsável.
- **Categorias Visuais:** Código de cores na borda lateral para identificar a categoria.
- **Conclusão de Tarefas:**
  - Clique para concluir/reabrir.
  - Registo automático da **Data e Hora** da conclusão.
  - Estilo visual "rasurado" quando concluída.
- **Edição:** Possibilidade de renomear tarefas existentes.
- **Estatísticas:** Painel de topo com contagem de Pendentes vs. Concluídas e mensagens motivacionais dinâmicas.
- **Pesquisa e Filtros:** Barra de pesquisa para encontrar tarefas rapidamente.

## 🛠️ Tecnologias Utilizadas

- **TypeScript:** Para lógica robusta, Interfaces e Classes.
- **HTML5:** Estrutura semântica.
- **CSS3:** Estilização moderna (Flexbox, CSS Variables) e responsiva.
- **DOM API:** Manipulação de eventos e elementos HTML.

## 🚀 Como Executar o Projeto

1.  **Pré-requisitos:**
    Certifica-te de que tens o [Node.js](https://nodejs.org/) instalado para usar o compilador de TypeScript.

2.  **Instalar o TypeScript (caso não tenhas):**

    ```bash
    npm install -g typescript
    ```

3.  **Compilar o Código:**
    No terminal, dentro da pasta do projeto, executa:

    ```bash
    tsc main.ts
    # Ou apenas 'tsc' se tiveres o ficheiro tsconfig.json configurado
    ```

    Isto irá gerar o ficheiro `main.js`.

4.  **Abrir o Projeto:**
    Abre o ficheiro `index.html` no teu navegador preferido.

## 🧠 Conceitos de Programação Aplicados

- **POO (Programação Orientada a Objetos):** Uso de `Classes` e `Interfaces` para modelar Dados.
- **Array Methods:** Uso extensivo de `.filter()`, `.map()`, `.sort()`, `.splice()` e `.forEach()`.
- **Type Casting:** Manipulação segura de elementos HTML (`as HTMLInputElement`).
- **Event Handling:** Escuta de eventos de clique e input.

## 📄 Licença

Este projeto foi desenvolvido por Débora Andrade para fins educativos. Sente-te à vontade para usar e modificar.

---

Desenvolvido com 💙 e TypeScript.
