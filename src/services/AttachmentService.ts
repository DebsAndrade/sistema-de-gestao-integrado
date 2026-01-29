import { Attachment } from '../models/Attachment';
import { HistoryLog } from '../logs/HistoryLog';
import { NotificationService } from '../notifications/NotificationService';

export class AttachmentService {
    private attachments: Attachment[] = [];
    private readonly historyLog: HistoryLog;
    private readonly notificationService: NotificationService;
    private maxFileSize: number = 10 * 1024 * 1024; // 10MB por padrão

    constructor() {
        this.historyLog = new HistoryLog();
        this.notificationService = new NotificationService();
    }

    /**
     * Adiciona um anexo a uma tarefa
     */
    addAttachment(
        taskId: number,
        filename: string,
        size: number,
        url: string,
        uploadedBy: number,
        mimeType?: string
    ): Attachment {
        // Validações
        if (!filename || filename.trim().length === 0) {
            throw new Error('Nome do arquivo não pode estar vazio');
        }

        if (size <= 0) {
            throw new Error('Tamanho do arquivo inválido');
        }

        if (size > this.maxFileSize) {
            const maxSizeMB = this.maxFileSize / (1024 * 1024);
            throw new Error(`Arquivo excede o tamanho máximo de ${maxSizeMB}MB`);
        }

        if (!url || url.trim().length === 0) {
            throw new Error('URL do arquivo não pode estar vazia');
        }

        const id = Date.now();
        const attachment = new Attachment(
            id,
            taskId,
            filename.trim(),
            size,
            url.trim(),
            uploadedBy,
            mimeType
        );

        this.attachments.push(attachment);
        this.historyLog.addLog(
            `Anexo "${filename}" adicionado à task #${taskId} por user #${uploadedBy}`
        );
        
        console.log(`📎 Anexo "${filename}" adicionado à task #${taskId}`);
        
        return attachment;
    }

    /**
     * Retorna todos os anexos de uma tarefa
     */
    getAttachments(taskId: number): Attachment[] {
        return this.attachments.filter(a => a.taskId === taskId);
    }

    /**
     * Retorna um anexo específico
     */
    getAttachmentById(attachmentId: number): Attachment | undefined {
        return this.attachments.find(a => a.id === attachmentId);
    }

    /**
     * Remove um anexo
     */
    removeAttachment(attachmentId: number, userId?: number): boolean {
        const index = this.attachments.findIndex(a => a.id === attachmentId);
        
        if (index === -1) {
            console.warn(`⚠️ Anexo #${attachmentId} não encontrado`);
            return false;
        }

        const attachment = this.attachments[index];

        // Se userId for fornecido, verificar permissão
        if (userId !== undefined && attachment.uploadedBy !== userId) {
            console.warn(`⚠️ User #${userId} não pode remover anexo de outro utilizador`);
            return false;
        }

        this.attachments.splice(index, 1);
        this.historyLog.addLog(`Anexo "${attachment.filename}" removido`);
        console.log(`🗑️ Anexo "${attachment.filename}" removido`);
        
        return true;
    }

    /**
     * Remove todos os anexos de uma tarefa
     */
    removeAllFromTask(taskId: number): void {
        const attachmentsToRemove = this.getAttachments(taskId);
        
        this.attachments = this.attachments.filter(a => a.taskId !== taskId);
        
        this.historyLog.addLog(
            `${attachmentsToRemove.length} anexo(s) removido(s) da task #${taskId}`
        );
        console.log(`🗑️ ${attachmentsToRemove.length} anexo(s) removido(s)`);
    }

    /**
     * Remove todos os anexos de um utilizador
     */
    removeAllFromUser(userId: number): void {
        const attachmentsToRemove = this.attachments.filter(a => a.uploadedBy === userId);
        
        this.attachments = this.attachments.filter(a => a.uploadedBy !== userId);
        
        this.historyLog.addLog(
            `${attachmentsToRemove.length} anexo(s) removido(s) do user #${userId}`
        );
        console.log(`🗑️ ${attachmentsToRemove.length} anexo(s) removido(s)`);
    }

    /**
     * Conta anexos de uma tarefa
     */
    countAttachments(taskId: number): number {
        return this.getAttachments(taskId).length;
    }

    /**
     * Retorna anexos de um utilizador
     */
    getAttachmentsByUser(userId: number): Attachment[] {
        return this.attachments.filter(a => a.uploadedBy === userId);
    }

    /**
     * Retorna anexos de imagem de uma tarefa
     */
    getImageAttachments(taskId: number): Attachment[] {
        return this.getAttachments(taskId).filter(a => a.isImage());
    }

    /**
     * Retorna anexos de documento de uma tarefa
     */
    getDocumentAttachments(taskId: number): Attachment[] {
        return this.getAttachments(taskId).filter(a => a.isDocument());
    }

    /**
     * Calcula tamanho total de anexos de uma tarefa
     */
    getTotalSize(taskId: number): number {
        const attachments = this.getAttachments(taskId);
        return attachments.reduce((total, a) => total + a.size, 0);
    }

    /**
     * Retorna tamanho total formatado
     */
    getFormattedTotalSize(taskId: number): string {
        const totalBytes = this.getTotalSize(taskId);
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        
        if (totalBytes === 0) return '0 Bytes';
        
        const i = Math.floor(Math.log(totalBytes) / Math.log(1024));
        const size = (totalBytes / Math.pow(1024, i)).toFixed(2);
        
        return `${size} ${sizes[i]}`;
    }

    /**
     * Pesquisa anexos por nome
     */
    searchAttachments(query: string): Attachment[] {
        const lowerQuery = query.toLowerCase();
        return this.attachments.filter(a => 
            a.filename.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Define tamanho máximo permitido
     */
    setMaxFileSize(sizeInMB: number): void {
        this.maxFileSize = sizeInMB * 1024 * 1024;
        console.log(`📏 Tamanho máximo definido: ${sizeInMB}MB`);
    }

    /**
     * Obtém estatísticas de anexos
     */
    getStats() {
        const total = this.attachments.length;
        const images = this.attachments.filter(a => a.isImage()).length;
        const documents = this.attachments.filter(a => a.isDocument()).length;
        const others = total - images - documents;
        
        let totalSize = 0;
        this.attachments.forEach(a => {
            totalSize += a.size;
        });

        // Contar anexos por tarefa
        const attachmentsByTask = new Map<number, number>();
        this.attachments.forEach(a => {
            attachmentsByTask.set(a.taskId, (attachmentsByTask.get(a.taskId) || 0) + 1);
        });

        return {
            total,
            images,
            documents,
            others,
            totalSizeBytes: totalSize,
            totalSizeFormatted: this.formatBytes(totalSize),
            tasksWithAttachments: attachmentsByTask.size
        };
    }

    /**
     * Formata bytes para formato legível
     */
    private formatBytes(bytes: number): string {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const size = (bytes / Math.pow(1024, i)).toFixed(2);
        
        return `${size} ${sizes[i]}`;
    }

    /**
     * Retorna histórico de logs
     */
    getHistory(): string[] {
        return this.historyLog.getLogs();
    }

    /**
     * Limpa todos os anexos
     */
    clearAll(): void {
        this.attachments = [];
        this.historyLog.addLog('Todos os anexos foram limpos');
        console.log('🗑️ Todos os anexos removidos');
    }
}
