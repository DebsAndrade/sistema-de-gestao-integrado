export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}

export function getPriorityLabel(priority: Priority): string {
    const labels: Record<Priority, string> = {
        [Priority.LOW]: "Baixa",
        [Priority.MEDIUM]: "Média",
        [Priority.HIGH]: "Alta",
        [Priority.CRITICAL]: "Crítica"
    };
    return labels[priority];
}

export function getPriorityColor(priority: Priority): string {
    const colors: Record<Priority, string> = {
        [Priority.LOW]: "#95a5a6",
        [Priority.MEDIUM]: "#3498db",
        [Priority.HIGH]: "#f39c12",
        [Priority.CRITICAL]: "#e74c3c"
    };
    return colors[priority];
}
