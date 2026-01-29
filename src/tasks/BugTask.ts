import { ITask } from './ITask';
import { TaskStatus } from './TaskStatus';

export class BugTask implements ITask {
    id: number;
    title: string;
    completed: boolean;
    status: TaskStatus;
    categoria: 'trabalho' | 'pessoal' | 'estudos';
    responsavelNome?: string;
    dataConclusao?: Date;
    severity: 'low' | 'medium' | 'high' | 'critical';

    constructor(
        id: number,
        title: string,
        categoria: 'trabalho' | 'pessoal' | 'estudos' = 'trabalho',
        responsavelNome?: string,
        severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
    ) {
        this.id = id;
        this.title = title;
        this.completed = false;
        this.status = TaskStatus.CREATED;
        this.categoria = categoria;
        this.responsavelNome = responsavelNome;
        this.severity = severity;
    }

    getType(): string {
        return "bug";
    }

    moveTo(status: TaskStatus): void {
        // Bugs têm regras mais rígidas de transição
        const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
            [TaskStatus.CREATED]: [TaskStatus.ASSIGNED, TaskStatus.ARCHIVED],
            [TaskStatus.ASSIGNED]: [TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED],
            [TaskStatus.IN_PROGRESS]: [TaskStatus.BLOCKED, TaskStatus.COMPLETED],
            [TaskStatus.BLOCKED]: [TaskStatus.IN_PROGRESS, TaskStatus.ARCHIVED],
            [TaskStatus.COMPLETED]: [TaskStatus.ARCHIVED, TaskStatus.IN_PROGRESS], // Reabrir se necessário
            [TaskStatus.ARCHIVED]: []
        };

        const allowed = allowedTransitions[this.status];
        if (!allowed.includes(status)) {
            console.warn(`⚠️ Transição inválida para BUG: ${this.status} → ${status}`);
            return;
        }

        this.status = status;
        
        if (status === TaskStatus.COMPLETED) {
            this.completed = true;
            this.dataConclusao = new Date();
            console.log(`🐛 Bug "${this.title}" corrigido!`);
        } else {
            this.completed = false;
            this.dataConclusao = undefined;
        }
    }

    toggleComplete(): void {
        if (this.completed) {
            this.moveTo(TaskStatus.IN_PROGRESS);
        } else {
            this.moveTo(TaskStatus.COMPLETED);
        }
    }
}
