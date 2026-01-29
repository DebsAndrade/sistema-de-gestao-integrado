/// <reference types="vite/client" />
import './style.css';
import { renderUsers, loadInitialData } from './ui/RenderUser';
import { renderTasks } from './ui/RenderTask';

function renderApp() {
    console.log('🚀 Sistema de Gestão OOP Iniciado');
    console.log('📚 Carregando dados iniciais...');
    
    loadInitialData();
    renderTasks();
    renderUsers();
    
    console.log('✅ Sistema pronto!');
    console.log('\n💡 Dica: As tarefas que contêm "bug" ou "erro" são criadas como BugTask');
    console.log('💡 Dica: As tarefas que contêm "feature" ou "funcionalidade" são criadas como FeatureTask');
    console.log('💡 Dica: Abra o console para ver o polimorfismo em ação!\n');
}

renderApp();
