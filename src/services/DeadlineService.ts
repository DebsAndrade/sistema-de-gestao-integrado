import { NotificationService } from '../notifications/NotificationService';

// HistoryLog class defined locally since module is not found
class HistoryLog {
    private readonly logs: string[] = [];

    addLog(message: string): void {
        this.logs.push(`${new Date().toISOString()} - ${message}`);
    }

    getLogs(): string[] {
        return [...this.logs];
    }
}

export class DeadlineService {
    private readonly deadlines: Map<number, Date> = new Map();
    private readonly historyLog: HistoryLog;
    private readonly notificationService: NotificationService;

    constructor() {
        this.historyLog = new HistoryLog();
        this.notificationService = new NotificationService();
    }

    /**
     * Define um prazo para uma tarefa
     */
    setDeadline(taskId: number, date: Date): void {
        this.deadlines.set(taskId, date);
        this.historyLog.addLog(`Deadline definido para task #${taskId}: ${date.toLocaleDateString('pt-PT')}`);
        console.log(`⏰ Deadline definido para task #${taskId}`);
    }

    /**
     * Remove o deadline de uma tarefa
     */
    removeDeadline(taskId: number): void {
        if (this.deadlines.has(taskId)) {
            this.deadlines.delete(taskId);
            this.historyLog.addLog(`Deadline removido da task #${taskId}`);
            console.log(`🗑️ Deadline removido da task #${taskId}`);
        }
    }

    /**
     * Obtém o deadline de uma tarefa
     */
    getDeadline(taskId: number): Date | undefined {
        return this.deadlines.get(taskId);
    }

    /**
     * Verifica se uma tarefa está expirada
     */
    isExpired(taskId: number): boolean {
        const deadline = this.deadlines.get(taskId);
        if (!deadline) return false;

        const now = Date.now();
        const deadlineTime = deadline.getTime();
        
        return now > deadlineTime;
    }

    /**
     * Retorna todas as tarefas expiradas
     */
    getExpiredTasks(): number[] {
        const expired: number[] = [];
        const now = Date.now();

        this.deadlines.forEach((deadline, taskId) => {
            if (deadline.getTime() < now) {
                expired.push(taskId);
            }
        });

        return expired;
    }

    /**
     * Retorna tarefas que expiram em X dias
     */
    getTasksExpiringIn(days: number): number[] {
        const expiringSoon: number[] = [];
        const now = Date.now();
        const targetTime = now + (days * 24 * 60 * 60 * 1000);

        this.deadlines.forEach((deadline, taskId) => {
            const deadlineTime = deadline.getTime();
            if (deadlineTime > now && deadlineTime <= targetTime) {
                expiringSoon.push(taskId);
            }
        });

        return expiringSoon;
    }

    /**
     * Calcula dias restantes até o deadline
     */
    getDaysRemaining(taskId: number): number | null {
        const deadline = this.deadlines.get(taskId);
        if (!deadline) return null;

        const now = Date.now();
        const deadlineTime = deadline.getTime();
        const diff = deadlineTime - now;

        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * Notifica sobre tarefas próximas do prazo
     */
    notifyUpcomingDeadlines(days: number = 3): void {
        const upcoming = this.getTasksExpiringIn(days);
        
        if (upcoming.length > 0) {
            console.log(`⚠️ ${upcoming.length} tarefa(s) expira(m) em ${days} dias:`);
            upcoming.forEach(taskId => {
                const daysLeft = this.getDaysRemaining(taskId);
                console.log(`  → Task #${taskId}: ${daysLeft} dia(s) restante(s)`);
            });
        }
    }

    /**
     * Obtém estatísticas de deadlines
     */
    getStats() {
        const total = this.deadlines.size;
        const expired = this.getExpiredTasks().length;
        const expiringSoon = this.getTasksExpiringIn(7).length;
        const active = total - expired;

        return {
            total,
            expired,
            expiringSoon,
            active
        };
    }

    /**
     * Retorna histórico de logs
     */
    getHistory(): string[] {
        return this.historyLog.getLogs();
    }

    /**
     * Limpa todos os deadlines
     */
    clearAll(): void {
        this.deadlines.clear();
        this.historyLog.addLog('Todos os deadlines foram limpos');
        console.log('🗑️ Todos os deadlines removidos');
    }
}
