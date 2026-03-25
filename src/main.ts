/// <reference types="vite/client" />
import './style.css';
import { renderUsers, loadInitialData } from './ui/RenderUser';
import { renderTasks } from './ui/RenderTask';
import { SystemConfig } from './services';
import { mainTest } from './test';

function renderApp() {
    
    loadInitialData();
    renderTasks();
    renderUsers();

console.log("System Config AppName, Version e Environment:", SystemConfig.getInfo());

console.log("Running mainTest...");

mainTest();
    
}

renderApp();
