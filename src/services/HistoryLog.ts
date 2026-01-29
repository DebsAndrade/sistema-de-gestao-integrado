export class HistoryLog {
  private static readonly instance: HistoryLog; // Bónus: Singleton
  private readonly logs: string[] = [];

  addLog(msg: string) {
    this.logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
  }
  getLogs() {
    return this.logs;
  }
}
