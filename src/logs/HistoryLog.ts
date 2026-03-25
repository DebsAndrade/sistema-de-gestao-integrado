export class HistoryLog {
    private logs: string[] = [];

    addLog(message: string): void {
        const timestamp = new Date().toLocaleTimeString('pt-PT');
        const logEntry = `[${timestamp}] ${message}`;
        this.logs.push(logEntry);
        console.log(`📝 Log: ${logEntry}`);
    }

    getLogs(): string[] {
        return [...this.logs]; // Retorna cópia para evitar modificação externa
    }

    clearLogs(): void {
        this.logs = [];
        console.log('🗑️ Histórico limpo');
    }

    getRecentLogs(count: number = 10): string[] {
        return this.logs.slice(-count);
    }

    searchLogs(keyword: string): string[] {
        return this.logs.filter(log => 
            log.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    exportLogs(): string {
        return this.logs.join('\n');
    }
}
