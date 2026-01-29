import { ITask } from '../tasks/ITask';
import { UserClass } from '../models/UserClass';
import { TaskStatus } from '../tasks/TaskStatus';
import { UserRole } from '../security/UserRole';

export class StatisticsService {
    /**
     * Conta total de utilizadores
     */
    countUsers(users: UserClass[]): number {
        return users.length;
    }

    /**
     * Conta utilizadores ativos
     */
    countActiveUsers(users: UserClass[]): number {
        return users.filter(u => u.isActive()).length;
    }

    /**
     * Conta utilizadores inativos
     */
    countInactiveUsers(users: UserClass[]): number {
        return users.filter(u => !u.isActive()).length;
    }

    /**
     * Conta total de tarefas
     */
    countTasks(tasks: ITask[]): number {
        return tasks.length;
    }

    /**
     * Conta tarefas concluídas
     */
    countCompletedTasks(tasks: ITask[]): number {
        return tasks.filter(t => t.completed).length;
    }

    /**
     * Conta tarefas ativas (não concluídas)
     */
    countActiveTasks(tasks: ITask[]): number {
        return tasks.filter(t => !t.completed).length;
    }

    /**
     * Agrupa tarefas por status
     */
    tasksByStatus(tasks: ITask[]): Record<TaskStatus, number> {
        const stats: Record<TaskStatus, number> = {
            [TaskStatus.CREATED]: 0,
            [TaskStatus.ASSIGNED]: 0,
            [TaskStatus.IN_PROGRESS]: 0,
            [TaskStatus.BLOCKED]: 0,
            [TaskStatus.COMPLETED]: 0,
            [TaskStatus.ARCHIVED]: 0
        };

        tasks.forEach(task => {
            stats[task.status]++;
        });

        return stats;
    }

    /**
     * Agrupa tarefas por categoria
     */
    tasksByCategory(tasks: ITask[]): Record<string, number> {
        const stats: Record<string, number> = {
            trabalho: 0,
            pessoal: 0,
            estudos: 0
        };

        tasks.forEach(task => {
            stats[task.categoria]++;
        });

        return stats;
    }

    /**
     * Agrupa tarefas por tipo
     */
    tasksByType(tasks: ITask[]): Record<string, number> {
        const stats: Record<string, number> = {};

        tasks.forEach(task => {
            const type = task.getType();
            stats[type] = (stats[type] || 0) + 1;
        });

        return stats;
    }

    /**
     * Agrupa utilizadores por role
     */
    usersByRole(users: UserClass[]): Record<UserRole, number> {
        const stats: Record<UserRole, number> = {
            [UserRole.ADMIN]: 0,
            [UserRole.MANAGER]: 0,
            [UserRole.MEMBER]: 0,
            [UserRole.VIEWER]: 0
        };

        users.forEach(user => {
            stats[user.role]++;
        });

        return stats;
    }

    /**
     * Calcula percentagem de conclusão
     */
    completionRate(tasks: ITask[]): number {
        if (tasks.length === 0) return 0;
        
        const completed = this.countCompletedTasks(tasks);
        return Math.round((completed / tasks.length) * 100);
    }

    /**
     * Calcula percentagem de utilizadores ativos
     */
    activeUserRate(users: UserClass[]): number {
        if (users.length === 0) return 0;
        
        const active = this.countActiveUsers(users);
        return Math.round((active / users.length) * 100);
    }

    /**
     * Conta tarefas por responsável
     */
    tasksByUser(tasks: ITask[]): Record<string, number> {
        const stats: Record<string, number> = {};

        tasks.forEach(task => {
            if (task.responsavelNome) {
                stats[task.responsavelNome] = (stats[task.responsavelNome] || 0) + 1;
            }
        });

        return stats;
    }

    /**
     * Retorna utilizador com mais tarefas
     */
    getMostProductiveUser(tasks: ITask[]): { name: string; count: number } | null {
        const tasksByUser = this.tasksByUser(tasks);
        const entries = Object.entries(tasksByUser);

        if (entries.length === 0) return null;

        const [name, count] = entries.reduce((max, current) =>
            current[1] > max[1] ? current : max
        , entries[0]);

        return { name, count };
    }

    /**
     * Retorna o tipo de tarefa mais comum
     */
    getMostCommonTaskType(tasks: ITask[]): { type: string; count: number } | null {
        const tasksByType = this.tasksByType(tasks);
        const entries = Object.entries(tasksByType);

        if (entries.length === 0) return null;

        const [type, count] = entries.reduce((max, current) => 
            current[1] > max[1] ? current : max
        , entries[0]);

        return { type, count };
    }

    /**
     * Calcula média de tarefas por utilizador
     */
    averageTasksPerUser(tasks: ITask[]): number {
        const tasksByUser = this.tasksByUser(tasks);
        const users = Object.keys(tasksByUser).length;

        if (users === 0) return 0;

        const totalTasks = Object.values(tasksByUser).reduce((sum, count) => sum + count, 0);
        return Number.parseFloat((totalTasks / users).toFixed(2));
    }

    /**
     * Conta tarefas criadas hoje
     */
    countTasksCreatedToday(tasks: ITask[]): number {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return tasks.filter(task => {
            const taskDate = new Date(task.id); // id é timestamp
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime();
        }).length;
    }

    /**
     * Conta tarefas concluídas hoje
     */
    countTasksCompletedToday(tasks: ITask[]): number {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return tasks.filter(task => {
            if (!task.completed || !task.dataConclusao) return false;
            
            const completionDate = new Date(task.dataConclusao);
            completionDate.setHours(0, 0, 0, 0);
            return completionDate.getTime() === today.getTime();
        }).length;
    }

    /**
     * Retorna estatísticas completas do sistema
     */
    getSystemStats(tasks: ITask[], users: UserClass[]) {
        return {
            users: {
                total: this.countUsers(users),
                active: this.countActiveUsers(users),
                inactive: this.countInactiveUsers(users),
                activeRate: this.activeUserRate(users),
                byRole: this.usersByRole(users)
            },
            tasks: {
                total: this.countTasks(tasks),
                completed: this.countCompletedTasks(tasks),
                active: this.countActiveTasks(tasks),
                completionRate: this.completionRate(tasks),
                byStatus: this.tasksByStatus(tasks),
                byCategory: this.tasksByCategory(tasks),
                byType: this.tasksByType(tasks),
                createdToday: this.countTasksCreatedToday(tasks),
                completedToday: this.countTasksCompletedToday(tasks)
            },
            productivity: {
                mostProductiveUser: this.getMostProductiveUser(tasks),
                mostCommonType: this.getMostCommonTaskType(tasks),
                averageTasksPerUser: this.averageTasksPerUser(tasks),
                tasksByUser: this.tasksByUser(tasks)
            }
        };
    }

    /**
     * Gera relatório em texto
     */
    generateReport(tasks: ITask[], users: UserClass[]): string {
        const stats = this.getSystemStats(tasks, users);
        
        let report = '═══════════════════════════════════════\n';
        report += '     RELATÓRIO DE ESTATÍSTICAS\n';
        report += '═══════════════════════════════════════\n\n';

        report += '📊 UTILIZADORES\n';
        report += '─────────────────────────────────────\n';
        report += `Total: ${stats.users.total}\n`;
        report += `Ativos: ${stats.users.active} (${stats.users.activeRate}%)\n`;
        report += `Inativos: ${stats.users.inactive}\n\n`;

        report += '📋 TAREFAS\n';
        report += '─────────────────────────────────────\n';
        report += `Total: ${stats.tasks.total}\n`;
        report += `Concluídas: ${stats.tasks.completed} (${stats.tasks.completionRate}%)\n`;
        report += `Ativas: ${stats.tasks.active}\n`;
        report += `Criadas hoje: ${stats.tasks.createdToday}\n`;
        report += `Concluídas hoje: ${stats.tasks.completedToday}\n\n`;

        report += '📈 PRODUTIVIDADE\n';
        report += '─────────────────────────────────────\n';
        if (stats.productivity.mostProductiveUser) {
            report += `Utilizador mais produtivo: ${stats.productivity.mostProductiveUser.name} `;
            report += `(${stats.productivity.mostProductiveUser.count} tarefas)\n`;
        }
        if (stats.productivity.mostCommonType) {
            report += `Tipo mais comum: ${stats.productivity.mostCommonType.type} `;
            report += `(${stats.productivity.mostCommonType.count} tarefas)\n`;
        }
        report += `Média tarefas/utilizador: ${stats.productivity.averageTasksPerUser}\n\n`;

        report += '═══════════════════════════════════════\n';

        return report;
    }

    /**
     * Exibe relatório no console
     */
    printReport(tasks: ITask[], users: UserClass[]): void {
        console.log(this.generateReport(tasks, users));
    }
}
