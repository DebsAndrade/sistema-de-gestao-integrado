import { ITask } from '../tasks/ITask';
import { GenericTask } from '../tasks/GenericTask';
import { BugTask } from '../tasks/BugTask';
import { FeatureTask } from '../tasks/FeatureTask';
import { TaskStatus } from '../tasks/TaskStatus';
import { HistoryLog } from '../logs/HistoryLog';
import { NotificationService } from '../notifications/NotificationService';
import { processTask, notifyTaskChange } from '../tasks/taskUtils';

export class TaskService {
    private readonly tasks: ITask[] = [];
    private readonly historyLog: HistoryLog;
    private readonly notificationService: NotificationService;

    constructor() {
        this.historyLog = new HistoryLog();
        this.notificationService = new NotificationService();
    }

    createTask(
        titulo: string,
        categoria: 'trabalho' | 'pessoal' | 'estudos',
        responsavel?: string,
        type: 'task' | 'bug' | 'feature' = 'task'
    ): ITask {
        const id = Date.now();
        let newTask: ITask;

        switch (type) {
            case 'bug':
                newTask = new BugTask(id, titulo, categoria, responsavel);
                break;
            case 'feature':
                newTask = new FeatureTask(id, titulo, categoria, responsavel);
                break;
            default:
                newTask = new GenericTask(id, titulo, categoria, responsavel);
        }

        this.tasks.push(newTask);
        
        this.historyLog.addLog(`Tarefa criada: "${titulo}" (${type})`);
        
        if (responsavel) {
            this.notificationService.notifyTaskAssigned(titulo, responsavel);
        }

        // Demonstração do polimorfismo
        processTask(newTask);
        
        return newTask;
    }

    getTasks(): ITask[] {
        return this.tasks;
    }

    getPendingTasks(): ITask[] {
        return this.tasks.filter(t => !t.completed);
    }

    getCompletedTasks(): ITask[] {
        return this.tasks.filter(t => t.completed);
    }

    getTaskById(id: number): ITask | undefined {
        return this.tasks.find(t => t.id === id);
    }

    toggleTaskComplete(id: number): void {
        const task = this.getTaskById(id);
        if (task) {
            task.toggleComplete();
            
            const action = task.completed ? 'concluída' : 'reaberta';
            this.historyLog.addLog(`Tarefa ${action}: "${task.title}"`);
            
            if (task.completed && task.responsavelNome) {
                this.notificationService.notifyTaskCompleted(task.title, task.responsavelNome);
            }

            notifyTaskChange(task, action);
        }
    }

    updateTask(id: number, newTitle: string): void {
        const task = this.getTaskById(id);
        if (task) {
            const oldTitle = task.title;
            task.title = newTitle;
            this.historyLog.addLog(`Tarefa editada: "${oldTitle}" → "${newTitle}"`);
        }
    }

    deleteTask(id: number): boolean {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            const task = this.tasks[index];
            this.tasks.splice(index, 1);
            this.historyLog.addLog(`Tarefa removida: "${task.title}"`);
            return true;
        }
        return false;
    }

    moveTaskTo(id: number, status: TaskStatus): void {
        const task = this.getTaskById(id);
        if (task) {
            task.moveTo(status);
            this.historyLog.addLog(`Status alterado: "${task.title}" → ${status}`);
            notifyTaskChange(task, `mudou para ${status}`);
        }
    }

    searchTasks(query: string): ITask[] {
        const lowerQuery = query.toLowerCase();
        return this.tasks.filter(t => 
            t.title.toLowerCase().includes(lowerQuery) ||
            t.categoria.toLowerCase().includes(lowerQuery) ||
            t.responsavelNome?.toLowerCase().includes(lowerQuery)
        );
    }

    sortTasksByTitle(): void {
        this.tasks.sort((a, b) => a.title.localeCompare(b.title));
    }

    filterByCategory(categoria: 'trabalho' | 'pessoal' | 'estudos'): ITask[] {
        return this.tasks.filter(t => t.categoria === categoria);
    }

    filterByResponsavel(nome: string): ITask[] {
        return this.tasks.filter(t => t.responsavelNome === nome);
    }

    getStats() {
        const total = this.tasks.length;
        const pending = this.getPendingTasks().length;
        const completed = this.getCompletedTasks().length;
        const percentCompleted = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            pending,
            completed,
            percentCompleted
        };
    }

    getHistory(): string[] {
        return this.historyLog.getLogs();
    }
}
