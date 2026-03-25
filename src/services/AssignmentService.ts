import { HistoryLog } from '../logs/HistoryLog';
import { NotificationService } from '../notifications/NotificationService';

export class AssignmentService {
    // Estruturas bidirecionais para manter relacionamentos
    private readonly taskToUsers: Map<number, Set<number>> = new Map();
    private readonly userToTasks: Map<number, Set<number>> = new Map();
    
    private readonly historyLog: HistoryLog;
    private readonly notificationService: NotificationService;
    constructor() {
        this.historyLog = new HistoryLog();
        this.notificationService = new NotificationService();
    }

    /**
     * Atribui um utilizador a uma tarefa
     */
    assignUser(taskId: number, userId: number): void {
        // Adicionar user à task
        if (!this.taskToUsers.has(taskId)) {
            this.taskToUsers.set(taskId, new Set());
        }
        this.taskToUsers.get(taskId)!.add(userId);

        // Adicionar task ao user
        if (!this.userToTasks.has(userId)) {
            this.userToTasks.set(userId, new Set());
        }
        this.userToTasks.get(userId)!.add(taskId);

        this.historyLog.addLog(`User #${userId} atribuído à task #${taskId}`);
        this.notificationService.notifyUser(userId, `Você foi atribuído à task #${taskId}`);
        console.log(`✅ User #${userId} atribuído à task #${taskId}`);
    }

    /**
     * Remove um utilizador de uma tarefa
     */
    unassignUser(taskId: number, userId: number): void {
        // Remover user da task
        const taskUsers = this.taskToUsers.get(taskId);
        if (taskUsers) {
            taskUsers.delete(userId);
            if (taskUsers.size === 0) {
                this.taskToUsers.delete(taskId);
            }
        }

        // Remover task do user
        const userTasks = this.userToTasks.get(userId);
        if (userTasks) {
            userTasks.delete(taskId);
            if (userTasks.size === 0) {
                this.userToTasks.delete(userId);
            }
        }

        this.historyLog.addLog(`User #${userId} removido da task #${taskId}`);
        console.log(`❌ User #${userId} removido da task #${taskId}`);
    }

    /**
     * Retorna todos os utilizadores atribuídos a uma tarefa
     */
    getUsersFromTask(taskId: number): number[] {
        const users = this.taskToUsers.get(taskId);
        return users ? Array.from(users) : [];
    }

    /**
     * Retorna todas as tarefas atribuídas a um utilizador
     */
    getTasksFromUser(userId: number): number[] {
        const tasks = this.userToTasks.get(userId);
        return tasks ? Array.from(tasks) : [];
    }

    /**
     * Verifica se um utilizador está atribuído a uma tarefa
     */
    isAssigned(taskId: number, userId: number): boolean {
        const users = this.taskToUsers.get(taskId);
        return users ? users.has(userId) : false;
    }

    /**
     * Remove todas as atribuições de uma tarefa
     */
    unassignAllFromTask(taskId: number): void {
        const users = this.getUsersFromTask(taskId);
        
        users.forEach(userId => {
            this.unassignUser(taskId, userId);
        });

        this.historyLog.addLog(`Todas as atribuições removidas da task #${taskId}`);
        console.log(`🗑️ Todas as atribuições removidas da task #${taskId}`);
    }

    /**
     * Remove todas as tarefas de um utilizador
     */
    unassignAllFromUser(userId: number): void {
        const tasks = this.getTasksFromUser(userId);
        
        tasks.forEach(taskId => {
            this.unassignUser(taskId, userId);
        });

        this.historyLog.addLog(`Todas as tarefas removidas do user #${userId}`);
        console.log(`🗑️ Todas as tarefas removidas do user #${userId}`);
    }

    /**
     * Atribui múltiplos utilizadores a uma tarefa
     */
    assignMultipleUsers(taskId: number, userIds: number[]): void {
        userIds.forEach(userId => {
            this.assignUser(taskId, userId);
        });
        console.log(`✅ ${userIds.length} utilizadores atribuídos à task #${taskId}`);
    }

    /**
     * Conta quantos utilizadores estão atribuídos a uma tarefa
     */
    countUsersInTask(taskId: number): number {
        return this.getUsersFromTask(taskId).length;
    }

    /**
     * Conta quantas tarefas um utilizador tem
     */
    countTasksForUser(userId: number): number {
        return this.getTasksFromUser(userId).length;
    }

    /**
     * Retorna utilizadores sem tarefas
     */
    getUsersWithoutTasks(): number[] {
        const allUserIds = Array.from(this.userToTasks.keys());
        return allUserIds.filter(userId => {
            const tasks = this.userToTasks.get(userId);
            return !tasks || tasks.size === 0;
        });
    }

    /**
     * Retorna tarefas sem utilizadores atribuídos
     */
    getTasksWithoutUsers(): number[] {
        const allTaskIds = Array.from(this.taskToUsers.keys());
        return allTaskIds.filter(taskId => {
            const users = this.taskToUsers.get(taskId);
            return !users || users.size === 0;
        });
    }

    /**
     * Obtém estatísticas de atribuições
     */
    getStats() {
        const totalTasks = this.taskToUsers.size;
        const totalUsers = this.userToTasks.size;
        let totalAssignments = 0;

        this.taskToUsers.forEach(users => {
            totalAssignments += users.size;
        });

        const tasksWithoutUsers = this.getTasksWithoutUsers().length;
        const usersWithoutTasks = this.getUsersWithoutTasks().length;

        return {
            totalTasks,
            totalUsers,
            totalAssignments,
            tasksWithoutUsers,
            usersWithoutTasks,
            avgUsersPerTask: totalTasks > 0 ? (totalAssignments / totalTasks).toFixed(2) : 0,
            avgTasksPerUser: totalUsers > 0 ? (totalAssignments / totalUsers).toFixed(2) : 0
        };
    }

    /**
     * Retorna histórico de logs
     */
    getHistory(): string[] {
        return this.historyLog.getLogs();
    }

    /**
     * Limpa todas as atribuições
     */
    clearAll(): void {
        this.taskToUsers.clear();
        this.userToTasks.clear();
        this.historyLog.addLog('Todas as atribuições foram limpas');
        console.log('🗑️ Todas as atribuições removidas');
    }
}
