import { Priority } from '../priorities/Priority';
import { HistoryLog } from '../logs/HistoryLog';
import { NotificationService } from '../notifications/NotificationService';

export class PriorityService {
    private readonly priorities: Map<number, Priority> = new Map();
    private readonly historyLog: HistoryLog;
    private readonly notificationService: NotificationService;

    constructor() {
        this.historyLog = new HistoryLog();
        this.notificationService = new NotificationService();
    }

    /**
     * Define a prioridade de uma tarefa
     */
    setPriority(taskId: number, priority: Priority): void {
        const oldPriority = this.priorities.get(taskId);
        this.priorities.set(taskId, priority);
        
        if (oldPriority) {
            this.historyLog.addLog(
                `Prioridade alterada task #${taskId}: ${oldPriority} → ${priority}`
            );
        } else {
            this.historyLog.addLog(`Prioridade definida task #${taskId}: ${priority}`);
        }

        // Notificar se for crítica
        if (priority === Priority.CRITICAL) {
            console.log(`🚨 PRIORIDADE CRÍTICA definida para task #${taskId}`);
            this.notificationService.notifyUrgent(`Task #${taskId} marcada como CRÍTICA`);
        }
    }

    /**
     * Obtém a prioridade de uma tarefa
     */
    getPriority(taskId: number): Priority | undefined {
        return this.priorities.get(taskId);
    }

    /**
     * Remove a prioridade de uma tarefa
     */
    removePriority(taskId: number): void {
        if (this.priorities.has(taskId)) {
            this.priorities.delete(taskId);
            this.historyLog.addLog(`Prioridade removida da task #${taskId}`);
        }
    }

    /**
     * Retorna tarefas de alta prioridade (HIGH e CRITICAL)
     */
    getHighPriorityTasks(): number[] {
        const highPriority: number[] = [];

        this.priorities.forEach((priority, taskId) => {
            if (priority === Priority.HIGH || priority === Priority.CRITICAL) {
                highPriority.push(taskId);
            }
        });

        return highPriority;
    }

    /**
     * Retorna tarefas críticas
     */
    getCriticalTasks(): number[] {
        const critical: number[] = [];

        this.priorities.forEach((priority, taskId) => {
            if (priority === Priority.CRITICAL) {
                critical.push(taskId);
            }
        });

        return critical;
    }

    /**
     * Retorna tarefas por prioridade específica
     */
    getTasksByPriority(priority: Priority): number[] {
        const tasks: number[] = [];

        this.priorities.forEach((p, taskId) => {
            if (p === priority) {
                tasks.push(taskId);
            }
        });

        return tasks;
    }

    /**
     * Aumenta a prioridade de uma tarefa
     */
    increasePriority(taskId: number): void {
        const current = this.priorities.get(taskId) || Priority.LOW;
        
        const priorityOrder = [
            Priority.LOW,
            Priority.MEDIUM,
            Priority.HIGH,
            Priority.CRITICAL
        ];

        const currentIndex = priorityOrder.indexOf(current);
        if (currentIndex < priorityOrder.length - 1) {
            const newPriority = priorityOrder[currentIndex + 1];
            this.setPriority(taskId, newPriority);
            console.log(`⬆️ Prioridade aumentada: task #${taskId} → ${newPriority}`);
        }
    }

    /**
     * Diminui a prioridade de uma tarefa
     */
    decreasePriority(taskId: number): void {
        const current = this.priorities.get(taskId);
        if (!current) return;
        
        const priorityOrder = [
            Priority.LOW,
            Priority.MEDIUM,
            Priority.HIGH,
            Priority.CRITICAL
        ];

        const currentIndex = priorityOrder.indexOf(current);
        if (currentIndex > 0) {
            const newPriority = priorityOrder[currentIndex - 1];
            this.setPriority(taskId, newPriority);
            console.log(`⬇️ Prioridade diminuída: task #${taskId} → ${newPriority}`);
        }
    }

    /**
     * Obtém estatísticas de prioridades
     */
    getStats() {
        const total = this.priorities.size;
        let low = 0, medium = 0, high = 0, critical = 0;

        this.priorities.forEach(priority => {
            switch (priority) {
                case Priority.LOW: low++; break;
                case Priority.MEDIUM: medium++; break;
                case Priority.HIGH: high++; break;
                case Priority.CRITICAL: critical++; break;
            }
        });

        return {
            total,
            low,
            medium,
            high,
            critical
        };
    }

    /**
     * Retorna histórico de logs
     */
    getHistory(): string[] {
        return this.historyLog.getLogs();
    }

    /**
     * Lista todas as prioridades
     */
    getAllPriorities(): Map<number, Priority> {
        return new Map(this.priorities);
    }
}
