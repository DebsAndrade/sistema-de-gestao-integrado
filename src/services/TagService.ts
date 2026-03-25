import { HistoryLog } from '../logs/HistoryLog';

export class TagService {
    private readonly taskTags: Map<number, Set<string>> = new Map();
    private readonly historyLog: HistoryLog;

    constructor() {
        this.historyLog = new HistoryLog();
    }

    /**
     * Adiciona uma tag a uma tarefa
     */
    addTag(taskId: number, tag: string): void {
        if (!tag || tag.trim().length === 0) {
            console.warn('⚠️ Tag não pode estar vazia');
            return;
        }

        const normalizedTag = tag.trim().toLowerCase();

        if (!this.taskTags.has(taskId)) {
            this.taskTags.set(taskId, new Set());
        }

        const tags = this.taskTags.get(taskId)!;
        
        if (tags.has(normalizedTag)) {
            console.warn(`⚠️ Tag "${normalizedTag}" já existe na task #${taskId}`);
            return;
        }

        tags.add(normalizedTag);
        this.historyLog.addLog(`Tag "${normalizedTag}" adicionada à task #${taskId}`);
        console.log(`🏷️ Tag "${normalizedTag}" adicionada à task #${taskId}`);
    }

    /**
     * Remove uma tag de uma tarefa
     */
    removeTag(taskId: number, tag: string): void {
        const normalizedTag = tag.trim().toLowerCase();
        const tags = this.taskTags.get(taskId);

        if (!tags?.has(normalizedTag)) {
            console.warn(`⚠️ Tag "${normalizedTag}" não encontrada na task #${taskId}`);
            return;
        }

        tags.delete(normalizedTag);
        
        // Se não há mais tags, remover a entrada
        if (tags.size === 0) {
            this.taskTags.delete(taskId);
        }

        this.historyLog.addLog(`Tag "${normalizedTag}" removida da task #${taskId}`);
        console.log(`🗑️ Tag "${normalizedTag}" removida`);
    }

    /**
     * Retorna todas as tags de uma tarefa
     */
    getTags(taskId: number): string[] {
        const tags = this.taskTags.get(taskId);
        return tags ? Array.from(tags) : [];
    }

    /**
     * Verifica se uma tarefa tem uma tag específica
     */
    hasTag(taskId: number, tag: string): boolean {
        const normalizedTag = tag.trim().toLowerCase();
        const tags = this.taskTags.get(taskId);
        return tags ? tags.has(normalizedTag) : false;
    }

    /**
     * Retorna todas as tarefas que têm uma tag específica
     */
    getTasksByTag(tag: string): number[] {
        const normalizedTag = tag.trim().toLowerCase();
        const taskIds: number[] = [];

        this.taskTags.forEach((tags, taskId) => {
            if (tags.has(normalizedTag)) {
                taskIds.push(taskId);
            }
        });

        return taskIds;
    }

    /**
     * Adiciona múltiplas tags a uma tarefa
     */
    addMultipleTags(taskId: number, tags: string[]): void {
        tags.forEach(tag => {
            this.addTag(taskId, tag);
        });
        console.log(`✅ ${tags.length} tag(s) adicionada(s) à task #${taskId}`);
    }

    /**
     * Remove todas as tags de uma tarefa
     */
    removeAllFromTask(taskId: number): void {
        const tags = this.getTags(taskId);
        
        if (tags.length > 0) {
            this.taskTags.delete(taskId);
            this.historyLog.addLog(`${tags.length} tag(s) removida(s) da task #${taskId}`);
            console.log(`🗑️ ${tags.length} tag(s) removida(s)`);
        }
    }

    /**
     * Retorna todas as tags únicas do sistema
     */
    getAllTags(): string[] {
        const allTags = new Set<string>();

        this.taskTags.forEach(tags => {
            tags.forEach(tag => {
                allTags.add(tag);
            });
        });

        return Array.from(allTags).sort((a, b) => a.localeCompare(b));
    }

    /**
     * Conta quantas tarefas têm uma tag específica
     */
    countTasksWithTag(tag: string): number {
        return this.getTasksByTag(tag).length;
    }

    /**
     * Retorna as tags mais usadas
     */
    getMostUsedTags(limit: number = 10): Array<{ tag: string; count: number }> {
        const tagCounts = new Map<string, number>();

        this.taskTags.forEach(tags => {
            tags.forEach(tag => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        });

        return Array.from(tagCounts.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    /**
     * Pesquisa tags por texto parcial
     */
    searchTags(query: string): string[] {
        const lowerQuery = query.toLowerCase();
        const allTags = this.getAllTags();
        
        return allTags.filter(tag => tag.includes(lowerQuery));
    }

    /**
     * Retorna tarefas que têm todas as tags especificadas
     */
    getTasksWithAllTags(tags: string[]): number[] {
        const normalizedTags = tags.map(t => t.trim().toLowerCase());
        const taskIds: number[] = [];

        this.taskTags.forEach((taskTagSet, taskId) => {
            const hasAllTags = normalizedTags.every(tag => taskTagSet.has(tag));
            if (hasAllTags) {
                taskIds.push(taskId);
            }
        });

        return taskIds;
    }

    /**
     * Retorna tarefas que têm qualquer uma das tags especificadas
     */
    getTasksWithAnyTag(tags: string[]): number[] {
        const normalizedTags = tags.map(t => t.trim().toLowerCase());
        const taskIds = new Set<number>();

        this.taskTags.forEach((taskTagSet, taskId) => {
            const hasAnyTag = normalizedTags.some(tag => taskTagSet.has(tag));
            if (hasAnyTag) {
                taskIds.add(taskId);
            }
        });

        return Array.from(taskIds);
    }

    /**
     * Renomeia uma tag em todas as tarefas
     */
    renameTag(oldTag: string, newTag: string): void {
        const normalizedOld = oldTag.trim().toLowerCase();
        const normalizedNew = newTag.trim().toLowerCase();

        if (normalizedOld === normalizedNew) {
            console.warn('⚠️ As tags são iguais');
            return;
        }

        let count = 0;

        this.taskTags.forEach((tags, taskId) => {
            if (tags.has(normalizedOld)) {
                tags.delete(normalizedOld);
                tags.add(normalizedNew);
                count++;
            }
        });

        if (count > 0) {
            this.historyLog.addLog(
                `Tag "${normalizedOld}" renomeada para "${normalizedNew}" em ${count} tarefa(s)`
            );
            console.log(`✏️ Tag renomeada em ${count} tarefa(s)`);
        }
    }

    /**
     * Obtém estatísticas de tags
     */
    getStats() {
        const totalTasks = this.taskTags.size;
        const totalTags = this.getAllTags().length;
        
        let totalAssignments = 0;
        this.taskTags.forEach(tags => {
            totalAssignments += tags.size;
        });

        const avgTagsPerTask = totalTasks > 0 ? (totalAssignments / totalTasks).toFixed(2) : 0;
        const mostUsed = this.getMostUsedTags(5);

        return {
            totalTasks,
            totalTags,
            totalAssignments,
            avgTagsPerTask,
            mostUsed
        };
    }

    /**
     * Retorna histórico de logs
     */
    getHistory(): string[] {
        return this.historyLog.getLogs();
    }

    /**
     * Limpa todas as tags
     */
    clearAll(): void {
        this.taskTags.clear();
        this.historyLog.addLog('Todas as tags foram limpas');
        console.log('🗑️ Todas as tags removidas');
    }
}
