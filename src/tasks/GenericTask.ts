import { ITask } from './ITask';
import { TaskStatus } from './TaskStatus';

export class GenericTask implements ITask {
    id: number;
    title: string;
    completed: boolean;
    status: TaskStatus;
    categoria: 'trabalho' | 'pessoal' | 'estudos';
    responsavelNome?: string;
    dataConclusao?: Date;

    constructor(
        id: number,
        title: string,
        categoria: 'trabalho' | 'pessoal' | 'estudos' = 'trabalho',
        responsavelNome?: string
    ) {
        this.id = id;
        this.title = title;
        this.completed = false;
        this.status = TaskStatus.CREATED;
        this.categoria = categoria;
        this.responsavelNome = responsavelNome;
    }

    getType(): string {
        return "task";
    }

    moveTo(status: TaskStatus): void {
        // Tarefas genéricas têm comportamento padrão simples
        this.status = status;
        
        if (status === TaskStatus.COMPLETED) {
            this.completed = true;
            this.dataConclusao = new Date();
            console.log(`✅ Tarefa "${this.title}" concluída!`);
        } else {
            this.completed = false;
            this.dataConclusao = undefined;
        }
    }

    toggleComplete(): void {
        if (this.completed) {
            this.moveTo(TaskStatus.CREATED);
            this.completed = false;
            this.dataConclusao = undefined;
        } else {
            this.moveTo(TaskStatus.COMPLETED);
        }
    }
}
