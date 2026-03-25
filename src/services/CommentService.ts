import { Comment } from '../models/Comment';
import { HistoryLog } from '../logs/HistoryLog';
import { NotificationService } from '../notifications/NotificationService';

export class CommentService {
    private comments: Comment[] = [];
    private readonly historyLog: HistoryLog;
    private readonly notificationService: NotificationService;

    constructor() {
        this.historyLog = new HistoryLog();
        this.notificationService = new NotificationService();
    }

    /**
     * Adiciona um comentário a uma tarefa
     */
    addComment(taskId: number, userId: number, message: string): Comment {
        if (!message || message.trim().length === 0) {
            throw new Error('Comentário não pode estar vazio');
        }

        const id = Date.now();
        const comment = new Comment(id, taskId, userId, message.trim());
        
        this.comments.push(comment);
        this.historyLog.addLog(`Comentário adicionado à task #${taskId} por user #${userId}`);
        
        console.log(`💬 Novo comentário na task #${taskId}`);
        
        return comment;
    }

    /**
     * Retorna todos os comentários de uma tarefa
     */
    getComments(taskId: number): Comment[] {
        return this.comments.filter(c => c.taskId === taskId);
    }

    /**
     * Retorna um comentário específico
     */
    getCommentById(commentId: number): Comment | undefined {
        return this.comments.find(c => c.id === commentId);
    }

    /**
     * Edita um comentário existente
     */
    editComment(commentId: number, userId: number, newMessage: string): boolean {
        const comment = this.getCommentById(commentId);
        
        if (!comment) {
            console.warn(`⚠️ Comentário #${commentId} não encontrado`);
            return false;
        }

        if (comment.userId !== userId) {
            console.warn(`⚠️ User #${userId} não pode editar comentário de outro utilizador`);
            return false;
        }

        if (!newMessage || newMessage.trim().length === 0) {
            console.warn('⚠️ Novo comentário não pode estar vazio');
            return false;
        }

        comment.edit(newMessage.trim());
        this.historyLog.addLog(`Comentário #${commentId} editado`);
        console.log(`✏️ Comentário #${commentId} editado`);
        
        return true;
    }

    /**
     * Remove um comentário
     */
    deleteComment(commentId: number, userId?: number): boolean {
        const index = this.comments.findIndex(c => c.id === commentId);
        
        if (index === -1) {
            console.warn(`⚠️ Comentário #${commentId} não encontrado`);
            return false;
        }

        const comment = this.comments[index];

        // Se userId for fornecido, verificar permissão
        if (userId !== undefined && comment.userId !== userId) {
            console.warn(`⚠️ User #${userId} não pode remover comentário de outro utilizador`);
            return false;
        }

        this.comments.splice(index, 1);
        this.historyLog.addLog(`Comentário #${commentId} removido`);
        console.log(`🗑️ Comentário #${commentId} removido`);
        
        return true;
    }

    /**
     * Remove todos os comentários de uma tarefa
     */
    deleteAllFromTask(taskId: number): void {
        const commentsToDelete = this.getComments(taskId);
        
        this.comments = this.comments.filter(c => c.taskId !== taskId);
        
        this.historyLog.addLog(
            `${commentsToDelete.length} comentário(s) removido(s) da task #${taskId}`
        );
        console.log(`🗑️ ${commentsToDelete.length} comentário(s) removido(s)`);
    }

    /**
     * Remove todos os comentários de um utilizador
     */
    deleteAllFromUser(userId: number): void {
        const commentsToDelete = this.comments.filter(c => c.userId === userId);
        
        this.comments = this.comments.filter(c => c.userId !== userId);
        
        this.historyLog.addLog(
            `${commentsToDelete.length} comentário(s) removido(s) do user #${userId}`
        );
        console.log(`🗑️ ${commentsToDelete.length} comentário(s) removido(s)`);
    }

    /**
     * Conta comentários de uma tarefa
     */
    countComments(taskId: number): number {
        return this.getComments(taskId).length;
    }

    /**
     * Retorna comentários de um utilizador
     */
    getCommentsByUser(userId: number): Comment[] {
        return this.comments.filter(c => c.userId === userId);
    }

    /**
     * Pesquisa comentários por texto
     */
    searchComments(query: string): Comment[] {
        const lowerQuery = query.toLowerCase();
        return this.comments.filter(c => 
            c.message.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Retorna comentários recentes (últimos N comentários)
     */
    getRecentComments(count: number = 10): Comment[] {
        return [...this.comments]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, count);
    }

    /**
     * Obtém estatísticas de comentários
     */
    getStats() {
        const total = this.comments.length;
        const edited = this.comments.filter(c => c.isEdited()).length;
        
        // Contar comentários por tarefa
        const commentsByTask = new Map<number, number>();
        this.comments.forEach(c => {
            commentsByTask.set(c.taskId, (commentsByTask.get(c.taskId) || 0) + 1);
        });

        // Contar comentários por utilizador
        const commentsByUser = new Map<number, number>();
        this.comments.forEach(c => {
            commentsByUser.set(c.userId, (commentsByUser.get(c.userId) || 0) + 1);
        });

        return {
            total,
            edited,
            percentEdited: total > 0 ? Math.round((edited / total) * 100) : 0,
            tasksWithComments: commentsByTask.size,
            activeUsers: commentsByUser.size
        };
    }

    /**
     * Retorna histórico de logs
     */
    getHistory(): string[] {
        return this.historyLog.getLogs();
    }

    /**
     * Limpa todos os comentários
     */
    clearAll(): void {
        this.comments = [];
        this.historyLog.addLog('Todos os comentários foram limpos');
        console.log('🗑️ Todos os comentários removidos');
    }
}
