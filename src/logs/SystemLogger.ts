export class SystemLogger {

    private static logs: string[] = [];

    static log(message: string): void {
        const timestamp = new Date().toISOString();
        this.logs.push(`[${timestamp}] ${message}`);
    }

    static getLogs(): string[] {
        return [...this.logs];
    }

    static clear(): void {
        this.logs = [];
    }
}
