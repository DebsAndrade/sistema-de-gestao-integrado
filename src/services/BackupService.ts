import { ITask } from '../tasks/ITask';
import { UserClass } from '../models/UserClass';
import { HistoryLog } from '../logs/HistoryLog';

export interface BackupData {
    timestamp: Date;
    version: string;
    users?: any[];
    tasks?: any[];
    assignments?: any;
    metadata?: any;
}

export class BackupService {
    private readonly historyLog: HistoryLog;
    private readonly version = '1.0.0';

    constructor() {
        this.historyLog = new HistoryLog();
    }

    /**
     * Exporta dados dos utilizadores
     */
    exportUsers(users: UserClass[]): any[] {
        return users.map(user => ({
            id: user.getId(),
            nome: user.nome,
            email: user.email,
            role: user.role,
            active: user.isActive(),
            createdAt: user.getCreatedAt()
        }));
    }

    /**
     * Exporta dados das tarefas
     */
    exportTasks(tasks: ITask[]): any[] {
        return tasks.map(task => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
            status: task.status,
            categoria: task.categoria,
            type: task.getType(),
            responsavelNome: task.responsavelNome,
            dataConclusao: task.dataConclusao
        }));
    }

    /**
     * Exporta relações de atribuição
     */
    exportAssignments(
        taskToUsers?: Map<number, Set<number>>,
        userToTasks?: Map<number, Set<number>>
    ): any {
        const assignments: any = {
            taskToUsers: {},
            userToTasks: {}
        };

        if (taskToUsers) {
            taskToUsers.forEach((users, taskId) => {
                assignments.taskToUsers[taskId] = Array.from(users);
            });
        }

        if (userToTasks) {
            userToTasks.forEach((tasks, userId) => {
                assignments.userToTasks[userId] = Array.from(tasks);
            });
        }

        return assignments;
    }

    /**
     * Exporta deadlines
     */
    exportDeadlines(deadlines?: Map<number, Date>): any {
        const exported: any = {};

        if (deadlines) {
            deadlines.forEach((date, taskId) => {
                exported[taskId] = date.toISOString();
            });
        }

        return exported;
    }

    /**
     * Exporta prioridades
     */
    exportPriorities(priorities?: Map<number, any>): any {
        const exported: any = {};

        if (priorities) {
            priorities.forEach((priority, taskId) => {
                exported[taskId] = priority;
            });
        }

        return exported;
    }

    /**
     * Exporta tags
     */
    exportTags(taskTags?: Map<number, Set<string>>): any {
        const exported: any = {};

        if (taskTags) {
            taskTags.forEach((tags, taskId) => {
                exported[taskId] = Array.from(tags);
            });
        }

        return exported;
    }

    /**
     * Exporta comentários
     */
    exportComments(comments?: any[]): any[] {
        if (!comments) return [];

        return comments.map(comment => ({
            id: comment.id,
            taskId: comment.taskId,
            userId: comment.userId,
            message: comment.message,
            createdAt: comment.createdAt,
            editedAt: comment.editedAt
        }));
    }

    /**
     * Exporta anexos
     */
    exportAttachments(attachments?: any[]): any[] {
        if (!attachments) return [];

        return attachments.map(attachment => ({
            id: attachment.id,
            taskId: attachment.taskId,
            filename: attachment.filename,
            size: attachment.size,
            url: attachment.url,
            mimeType: attachment.mimeType,
            uploadedAt: attachment.uploadedAt,
            uploadedBy: attachment.uploadedBy
        }));
    }

    /**
     * Exporta todos os dados do sistema
     */
    exportAll(data: {
        users: UserClass[];
        tasks: ITask[];
        taskToUsers?: Map<number, Set<number>>;
        userToTasks?: Map<number, Set<number>>;
        deadlines?: Map<number, Date>;
        priorities?: Map<number, any>;
        taskTags?: Map<number, Set<string>>;
        comments?: any[];
        attachments?: any[];
        logs?: string[];
    }): BackupData {
        const backup: BackupData = {
            timestamp: new Date(),
            version: this.version,
            users: this.exportUsers(data.users),
            tasks: this.exportTasks(data.tasks),
            assignments: this.exportAssignments(data.taskToUsers, data.userToTasks),
            metadata: {
                deadlines: this.exportDeadlines(data.deadlines),
                priorities: this.exportPriorities(data.priorities),
                tags: this.exportTags(data.taskTags),
                comments: this.exportComments(data.comments),
                attachments: this.exportAttachments(data.attachments),
                logs: data.logs || []
            }
        };

        this.historyLog.addLog('Backup completo criado');
        console.log('💾 Backup completo criado');

        return backup;
    }

    /**
     * Converte backup para JSON
     */
    toJSON(backup: BackupData): string {
        return JSON.stringify(backup, null, 2);
    }

    /**
     * Converte JSON para backup
     */
    fromJSON(json: string): BackupData {
        try {
            const data = JSON.parse(json);
            
            // Converter strings de data de volta para objetos Date
            if (data.timestamp) {
                data.timestamp = new Date(data.timestamp);
            }

            if (data.metadata?.deadlines) {
                Object.keys(data.metadata.deadlines).forEach(key => {
                    data.metadata.deadlines[key] = new Date(data.metadata.deadlines[key]);
                });
            }

            return data;
        } catch (error) {
            const errorMessage = 'Erro ao ler backup: JSON inválido';
            this.historyLog.addLog(errorMessage);
            console.error('❌', errorMessage, error);
            throw new Error(errorMessage);
        }
    }

    /**
     * Salva backup em arquivo (simula download)
     */
    saveToFile(backup: BackupData, filename?: string): void {
        const json = this.toJSON(backup);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `backup_${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        this.historyLog.addLog(`Backup salvo: ${link.download}`);
        console.log(`💾 Backup salvo: ${link.download}`);
    }

    /**
     * Valida estrutura do backup
     */
    validateBackup(backup: BackupData): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!backup.timestamp) {
            errors.push('Backup não possui timestamp');
        }

        if (!backup.version) {
            errors.push('Backup não possui versão');
        }

        if (!backup.users || !Array.isArray(backup.users)) {
            errors.push('Dados de utilizadores inválidos');
        }

        if (!backup.tasks || !Array.isArray(backup.tasks)) {
            errors.push('Dados de tarefas inválidos');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Cria backup incremental (apenas mudanças desde último backup)
     */
    createIncrementalBackup(
        currentData: BackupData,
        lastBackup: BackupData
    ): BackupData {
        // Aqui implementaríamos lógica para detectar apenas as mudanças
        // Por simplicidade, retornamos backup completo
        this.historyLog.addLog('Backup incremental criado');
        console.log('💾 Backup incremental criado');

        return currentData;
    }

    /**
     * Obtém informações sobre o backup
     */
    getBackupInfo(backup: BackupData): any {
        return {
            timestamp: backup.timestamp,
            version: backup.version,
            usersCount: backup.users?.length || 0,
            tasksCount: backup.tasks?.length || 0,
            hasAssignments: !!backup.assignments,
            hasMetadata: !!backup.metadata,
            size: new Blob([this.toJSON(backup)]).size
        };
    }

    /**
     * Compara dois backups
     */
    compareBackups(backup1: BackupData, backup2: BackupData): any {
        const info1 = this.getBackupInfo(backup1);
        const info2 = this.getBackupInfo(backup2);

        return {
            usersDiff: info2.usersCount - info1.usersCount,
            tasksDiff: info2.tasksCount - info1.tasksCount,
            sizeDiff: info2.size - info1.size,
            timeDiff: backup2.timestamp.getTime() - backup1.timestamp.getTime()
        };
    }

    /**
     * Retorna histórico de logs
     */
    getHistory(): string[] {
        return this.historyLog.getLogs();
    }

    /**
     * Obtém estatísticas de backups
     */
    getStats(backups: BackupData[]) {
        if (backups.length === 0) {
            return {
                total: 0,
                totalSize: 0,
                averageSize: 0,
                oldest: null,
                newest: null
            };
        }

        let totalSize = 0;
        backups.forEach(backup => {
            totalSize += new Blob([this.toJSON(backup)]).size;
        });

        const sorted = [...backups].sort((a, b) => 
            a.timestamp.getTime() - b.timestamp.getTime()
        );

        return {
            total: backups.length,
            totalSize,
            averageSize: Math.round(totalSize / backups.length),
            oldest: sorted[0].timestamp,
            newest: sorted[sorted.length - 1].timestamp
        };
    }
}
