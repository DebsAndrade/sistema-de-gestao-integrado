import { renderUsers, loadInitialData } from "@ui/RenderUser";
import { renderTasks } from "@ui/RenderTask";

function renderApp() {
  loadInitialData();
  renderTasks();
  renderUsers();
}

renderApp();