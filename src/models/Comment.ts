export class Comment {
    id: number;
    taskId: number;
    userId: number;
    message: string;
    createdAt: Date;
    editedAt?: Date;

    constructor(
        id: number,
        taskId: number,
        userId: number,
        message: string
    ) {
        this.id = id;
        this.taskId = taskId;
        this.userId = userId;
        this.message = message;
        this.createdAt = new Date();
    }

    /**
     * Edita a mensagem do comentário
     */
    edit(newMessage: string): void {
        this.message = newMessage;
        this.editedAt = new Date();
    }

    /**
     * Verifica se o comentário foi editado
     */
    isEdited(): boolean {
        return this.editedAt !== undefined;
    }

    /**
     * Retorna informação formatada do comentário
     */
    toString(): string {
        const edited = this.isEdited() ? ' (editado)' : '';
        return `[${this.createdAt.toLocaleString('pt-PT')}] User #${this.userId}: ${this.message}${edited}`;
    }
}
