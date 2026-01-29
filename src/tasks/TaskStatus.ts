export enum TaskStatus {
    CREATED = "CREATED",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    BLOCKED = "BLOCKED",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED"
}

export function getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
        [TaskStatus.CREATED]: "Criada",
        [TaskStatus.ASSIGNED]: "Atribuída",
        [TaskStatus.IN_PROGRESS]: "Em Progresso",
        [TaskStatus.BLOCKED]: "Bloqueada",
        [TaskStatus.COMPLETED]: "Concluída",
        [TaskStatus.ARCHIVED]: "Arquivada"
    };
    return labels[status];
}
