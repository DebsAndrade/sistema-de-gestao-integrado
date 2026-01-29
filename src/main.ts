/// <reference types="vite/client" />
import './style.css';
import { renderUsers, loadInitialData } from './ui/RenderUser';
import { renderTasks } from './ui/RenderTask';

function renderApp() {
    
    loadInitialData();
    renderTasks();
    renderUsers();
    
}

renderApp();
