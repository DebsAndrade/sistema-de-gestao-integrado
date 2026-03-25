import { ITask } from './ITask';

// Exercício 7: Polimorfismo funcional
// Uma função genérica que muda comportamento conforme o tipo da tarefa

export function processTask(task: ITask): void {
    const type = task.getType();
    
    console.log(`\n🔄 Processando ${type.toUpperCase()}: "${task.title}"`);
    
    switch (type) {
        case 'bug':
            // Bugs: regras mais rígidas, mais validações, logs automáticos
            console.log('🐛 Processamento de BUG:');
            console.log('  - Validação de severidade');
            console.log('  - Notificação automática para equipa');
            console.log('  - Registro em sistema de tracking');
            console.log('  - Verificação de testes automatizados');
            if (task.completed) {
                console.log('  ✅ Bug corrigido e testado');
            } else {
                console.log('  ⚠️ Bug ainda requer atenção');
            }
            break;
            
        case 'feature':
            // Features: regras mais flexíveis, menos validações
            console.log('✨ Processamento de FEATURE:');
            console.log('  - Validação de requisitos');
            console.log('  - Estimativa de tempo');
            console.log('  - Revisão de código opcional');
            if (task.completed) {
                console.log('  ✅ Feature implementada com sucesso');
            } else {
                console.log('  🚧 Feature em desenvolvimento');
            }
            break;
            
        case 'task':
            // Tarefas genéricas: comportamento padrão
            console.log('📋 Processamento de TAREFA:');
            console.log('  - Validação básica');
            console.log('  - Atualização de status');
            if (task.completed) {
                console.log('  ✅ Tarefa concluída');
            } else {
                console.log('  📝 Tarefa pendente');
            }
            break;
            
        default:
            console.log('❓ Tipo de tarefa desconhecido');
    }
    
    console.log(`  Status atual: ${task.status}`);
    console.log(`  Categoria: ${task.categoria}`);
    if (task.responsavelNome) {
        console.log(`  Responsável: ${task.responsavelNome}`);
    }
}

export function validateTaskTransition(task: ITask, newStatus: string): boolean {
    const type = task.getType();
    const currentStatus = task.status;
    
    // Diferentes tipos têm diferentes regras de validação
    switch (type) {
        case 'bug': {
            // Bugs requerem validação mais rigorosa
            console.log('🔒 Validação rigorosa para BUG');
            // Bugs devem seguir fluxo: pendente -> em progresso -> em teste -> concluído
            const validBugTransitions: { [key: string]: string[] } = {
                'pendente': ['em progresso'],
                'em progresso': ['em teste', 'pendente'],
                'em teste': ['concluído', 'em progresso'],
                'concluído': []
            };
            return validBugTransitions[currentStatus]?.includes(newStatus) ?? false;
        }
            
        case 'feature': {
            // Features têm validação mais flexível
            console.log('🔓 Validação flexível para FEATURE');
            // Features podem pular etapas
            const validFeatureTransitions: { [key: string]: string[] } = {
                'pendente': ['em progresso', 'concluído'],
                'em progresso': ['concluído', 'pendente'],
                'concluído': ['em progresso']
            };
            return validFeatureTransitions[currentStatus]?.includes(newStatus) ?? true;
        }
            
        default:
            // Tarefas genéricas têm validação padrão
            console.log('✓ Validação padrão');
            // Permite qualquer transição exceto de concluído para pendente
            return true;
    }
}

export function notifyTaskChange(task: ITask, change: string): void {
    const type = task.getType();
    
    // Diferentes tipos geram diferentes notificações
    switch (type) {
        case 'bug':
            console.log(`🚨 NOTIFICAÇÃO URGENTE: Bug "${task.title}" - ${change}`);
            console.log('   → Notificando: Tech Lead, QA Team, Developer');
            break;
            
        case 'feature':
            console.log(`📢 NOTIFICAÇÃO: Feature "${task.title}" - ${change}`);
            console.log('   → Notificando: Product Owner, Developer');
            break;
            
        default:
            console.log(`📬 Atualização: "${task.title}" - ${change}`);
            console.log('   → Notificando: Responsável');
    }
}
