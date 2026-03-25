import { ITask } from './ITask';
import { TaskStatus } from './TaskStatus';

export class FeatureTask implements ITask {
    id: number;
    title: string;
    completed: boolean;
    status: TaskStatus;
    categoria: 'trabalho' | 'pessoal' | 'estudos';
    responsavelNome?: string;
    dataConclusao?: Date;
    estimatedHours?: number;

    constructor(
        id: number,
        title: string,
        categoria: 'trabalho' | 'pessoal' | 'estudos' = 'trabalho',
        responsavelNome?: string,
        estimatedHours?: number
    ) {
        this.id = id;
        this.title = title;
        this.completed = false;
        this.status = TaskStatus.CREATED;
        this.categoria = categoria;
        this.responsavelNome = responsavelNome;
        this.estimatedHours = estimatedHours;
    }

    getType(): string {
        return "feature";
    }

    moveTo(status: TaskStatus): void {
        // Features têm regras mais flexíveis
        const invalidTransitions: Record<TaskStatus, TaskStatus[]> = {
            [TaskStatus.CREATED]: [],
            [TaskStatus.ASSIGNED]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.BLOCKED]: [],
            [TaskStatus.COMPLETED]: [],
            [TaskStatus.ARCHIVED]: [TaskStatus.CREATED, TaskStatus.ASSIGNED] // Não pode voltar para início
        };

        const invalid = invalidTransitions[this.status];
        if (invalid.includes(status)) {
            console.warn(`⚠️ Transição inválida para FEATURE: ${this.status} → ${status}`);
            return;
        }

        this.status = status;
        
        if (status === TaskStatus.COMPLETED) {
            this.completed = true;
            this.dataConclusao = new Date();
            console.log(`✨ Feature "${this.title}" completa!`);
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
