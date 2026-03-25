import { ITask } from '../tasks/ITask';
import { UserClass } from '../models/UserClass';
import { TaskStatus } from '../tasks/TaskStatus';
import { HistoryLog } from '../logs/HistoryLog';
import { NotificationService } from '../notifications/NotificationService';

export interface AutomationRule {
    id: string;
    name: string;
    enabled: boolean;
    condition: (data: any) => boolean;
    action: (data: any) => void;
}

export class AutomationRulesService {
    private readonly rules: Map<string, AutomationRule> = new Map();
    private readonly historyLog: HistoryLog;
    private readonly notificationService: NotificationService;

    constructor() {
        this.historyLog = new HistoryLog();
        this.notificationService = new NotificationService();
        this.initializeDefaultRules();
    }

    /**
     * Inicializa regras padrão do sistema
     */
    private initializeDefaultRules(): void {
        // Regra 1: Log automático quando tarefa é concluída
        this.addRule({
            id: 'auto-log-completed',
            name: 'Log Automático - Tarefa Concluída',
            enabled: true,
            condition: (task: ITask) => task.completed && task.status === TaskStatus.COMPLETED,
            action: (task: ITask) => {
                this.historyLog.addLog(
                    `[AUTO] Tarefa "${task.title}" concluída por ${task.responsavelNome || 'desconhecido'}`
                );
            }
        });

        // Regra 2: Notificar quando tarefa é bloqueada
        this.addRule({
            id: 'notify-blocked',
            name: 'Notificar - Tarefa Bloqueada',
            enabled: true,
            condition: (task: ITask) => task.status === TaskStatus.BLOCKED,
            action: (task: ITask) => {
                console.log(`⚠️ [AUTO] Tarefa "${task.title}" está BLOQUEADA`);
                this.notificationService.notifyUrgent(
                    `Tarefa "${task.title}" está bloqueada e requer atenção`
                );
            }
        });

        // Regra 3: Remover atribuições quando utilizador fica inativo
        this.addRule({
            id: 'remove-assignments-inactive',
            name: 'Remover Atribuições - Utilizador Inativo',
            enabled: true,
            condition: (user: UserClass) => !user.isActive(),
            action: (user: UserClass) => {
                console.log(`🔄 [AUTO] Removendo atribuições do utilizador inativo: ${user.nome}`);
                this.historyLog.addLog(
                    `[AUTO] Utilizador ${user.nome} desativado - atribuições devem ser removidas`
                );
            }
        });

        // Regra 4: Arquivar tarefas concluídas há mais de 30 dias
        this.addRule({
            id: 'archive-old-completed',
            name: 'Arquivar - Tarefas Antigas Concluídas',
            enabled: true,
            condition: (task: ITask) => {
                if (!task.completed || !task.dataConclusao) return false;
                
                const daysSinceCompletion = Math.floor(
                    (Date.now() - task.dataConclusao.getTime()) / (1000 * 60 * 60 * 24)
                );
                
                return daysSinceCompletion > 30 && task.status !== TaskStatus.ARCHIVED;
            },
            action: (task: ITask) => {
                task.moveTo(TaskStatus.ARCHIVED);
                console.log(`📦 [AUTO] Tarefa "${task.title}" arquivada automaticamente`);
                this.historyLog.addLog(`[AUTO] Tarefa "${task.title}" arquivada (30+ dias concluída)`);
            }
        });

        // Regra 5: Alertar sobre tarefas críticas em progresso
        this.addRule({
            id: 'alert-critical-in-progress',
            name: 'Alertar - Tarefas Críticas em Progresso',
            enabled: true,
            condition: (data: { task: ITask; priority?: string }) => {
                return data.priority === 'CRITICAL' && 
                       data.task.status === TaskStatus.IN_PROGRESS;
            },
            action: (data: { task: ITask; priority?: string }) => {
                console.log(`🚨 [AUTO] Tarefa CRÍTICA em progresso: "${data.task.title}"`);
                this.notificationService.notifyUrgent(
                    `Tarefa crítica "${data.task.title}" está em progresso`
                );
            }
        });

        console.log('✅ Regras de automação padrão inicializadas');
    }

    /**
     * Adiciona uma nova regra
     */
    addRule(rule: AutomationRule): void {
        this.rules.set(rule.id, rule);
        this.historyLog.addLog(`Regra de automação adicionada: ${rule.name}`);
        console.log(`➕ Regra adicionada: ${rule.name}`);
    }

    /**
     * Remove uma regra
     */
    removeRule(ruleId: string): boolean {
        if (this.rules.has(ruleId)) {
            const rule = this.rules.get(ruleId);
            this.rules.delete(ruleId);
            this.historyLog.addLog(`Regra de automação removida: ${rule?.name}`);
            console.log(`➖ Regra removida: ${rule?.name}`);
            return true;
        }
        return false;
    }

    /**
     * Ativa uma regra
     */
    enableRule(ruleId: string): void {
        const rule = this.rules.get(ruleId);
        if (rule) {
            rule.enabled = true;
            console.log(`✅ Regra ativada: ${rule.name}`);
        }
    }

    /**
     * Desativa uma regra
     */
    disableRule(ruleId: string): void {
        const rule = this.rules.get(ruleId);
        if (rule) {
            rule.enabled = false;
            console.log(`⏸️ Regra desativada: ${rule.name}`);
        }
    }

    /**
     * Aplica regras a uma tarefa
     */
    applyRules(task: ITask, additionalData?: any): void {
        const data = additionalData ? { task, ...additionalData } : task;
        
        this.rules.forEach(rule => {
            if (!rule.enabled) return;

            try {
                if (rule.condition(data)) {
                    rule.action(data);
                }
            } catch (error) {
                console.error(`❌ Erro ao aplicar regra "${rule.name}":`, error);
            }
        });
    }

    /**
     * Aplica regras a um utilizador
     */
    applyUserRules(user: UserClass, additionalData?: any): void {
        const data = additionalData ? { user, ...additionalData } : user;
        
        this.rules.forEach(rule => {
            if (!rule.enabled) return;

            try {
                if (rule.condition(data)) {
                    rule.action(data);
                }
            } catch (error) {
                console.error(`❌ Erro ao aplicar regra "${rule.name}":`, error);
            }
        });
    }

    /**
     * Aplica regras a múltiplas tarefas
     */
    applyRulesToTasks(tasks: ITask[], additionalData?: any): void {
        tasks.forEach(task => {
            this.applyRules(task, additionalData);
        });
    }

    /**
     * Aplica regras a múltiplos utilizadores
     */
    applyRulesToUsers(users: UserClass[], additionalData?: any): void {
        users.forEach(user => {
            this.applyUserRules(user, additionalData);
        });
    }

    /**
     * Verifica deadline expirado e move para bloqueada
     */
    checkExpiredDeadlines(tasks: ITask[], deadlines: Map<number, Date>): void {
        const now = Date.now();

        tasks.forEach(task => {
            const deadline = deadlines.get(task.id);
            
            if (deadline && deadline.getTime() < now && !task.completed) {
                if (task.status !== TaskStatus.BLOCKED) {
                    task.moveTo(TaskStatus.BLOCKED);
                    console.log(`⏰ [AUTO] Tarefa "${task.title}" bloqueada (deadline expirado)`);
                    this.historyLog.addLog(
                        `[AUTO] Tarefa "${task.title}" bloqueada automaticamente (deadline expirado)`
                    );
                    
                    this.notificationService.notifyUrgent(
                        `Tarefa "${task.title}" ultrapassou o prazo e foi bloqueada`
                    );
                }
            }
        });
    }

    /**
     * Auto-atribuir tarefas não atribuídas a utilizadores disponíveis
     */
    autoAssignUnassignedTasks(
        tasks: ITask[],
        users: UserClass[],
        assignmentService: any
    ): void {
        const unassignedTasks = tasks.filter(
            task => !task.completed && !task.responsavelNome
        );

        const activeUsers = users.filter(u => u.isActive());

        if (activeUsers.length === 0) return;

        unassignedTasks.forEach((task, index) => {
            const user = activeUsers[index % activeUsers.length];
            task.responsavelNome = user.nome;
            
            console.log(`🤖 [AUTO] Tarefa "${task.title}" auto-atribuída a ${user.nome}`);
            this.historyLog.addLog(
                `[AUTO] Tarefa "${task.title}" auto-atribuída a ${user.nome}`
            );
        });
    }

    /**
     * Notifica sobre tarefas próximas do deadline
     */
    notifyUpcomingDeadlines(tasks: ITask[], deadlines: Map<number, Date>, daysThreshold: number = 3): void {
        const now = Date.now();
        const thresholdTime = now + (daysThreshold * 24 * 60 * 60 * 1000);

        tasks.forEach(task => {
            const deadline = deadlines.get(task.id);
            
            if (deadline && !task.completed) {
                const deadlineTime = deadline.getTime();
                
                if (deadlineTime > now && deadlineTime <= thresholdTime) {
                    const daysLeft = Math.ceil((deadlineTime - now) / (1000 * 60 * 60 * 24));
                    
                    console.log(
                        `⏰ [AUTO] Tarefa "${task.title}" expira em ${daysLeft} dia(s)`
                    );
                    
                    if (task.responsavelNome) {
                        this.notificationService.notifyUser(
                            task.id,
                            `Tarefa "${task.title}" expira em ${daysLeft} dia(s)`
                        );
                    }
                }
            }
        });
    }

    /**
     * Lista todas as regras
     */
    getAllRules(): AutomationRule[] {
        return Array.from(this.rules.values());
    }

    /**
     * Lista regras ativas
     */
    getEnabledRules(): AutomationRule[] {
        return this.getAllRules().filter(rule => rule.enabled);
    }

    /**
     * Lista regras inativas
     */
    getDisabledRules(): AutomationRule[] {
        return this.getAllRules().filter(rule => !rule.enabled);
    }

    /**
     * Obtém uma regra específica
     */
    getRule(ruleId: string): AutomationRule | undefined {
        return this.rules.get(ruleId);
    }

    /**
     * Obtém estatísticas de regras
     */
    getStats() {
        const total = this.rules.size;
        const enabled = this.getEnabledRules().length;
        const disabled = this.getDisabledRules().length;

        return {
            total,
            enabled,
            disabled,
            percentEnabled: total > 0 ? Math.round((enabled / total) * 100) : 0
        };
    }

    /**
     * Retorna histórico de logs
     */
    getHistory(): string[] {
        return this.historyLog.getLogs();
    }

    /**
     * Executa todas as regras ativas em todas as tarefas e utilizadores
     */
    runAllRules(tasks: ITask[], users: UserClass[], additionalServices?: any): void {
        console.log('🤖 Executando todas as regras de automação...');
        
        this.applyRulesToTasks(tasks, additionalServices);
        this.applyRulesToUsers(users, additionalServices);

        if (additionalServices?.deadlines) {
            this.checkExpiredDeadlines(tasks, additionalServices.deadlines);
            this.notifyUpcomingDeadlines(tasks, additionalServices.deadlines);
        }

        console.log('✅ Regras de automação executadas');
    }

    /**
     * Limpa todas as regras customizadas (mantém apenas as padrão)
     */
    resetToDefaultRules(): void {
        this.rules.clear();
        this.initializeDefaultRules();
        console.log('🔄 Regras resetadas para padrão');
    }
}
