import { TaskStatus } from './TaskStatus';

export interface ITask {
    id: number;
    title: string;
    completed: boolean;
    status: TaskStatus;
    categoria: 'trabalho' | 'pessoal' | 'estudos';
    responsavelNome?: string;
    dataConclusao?: Date;

    getType(): string;
    moveTo(status: TaskStatus): void;
    toggleComplete(): void;
}
