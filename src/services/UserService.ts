import { UserClass } from '../models/UserClass';
import { UserRoles } from '../security/UserRoles';
import { HistoryLog } from '../logs/HistoryLog';
import { NotificationService } from '../notifications/NotificationService';

export class UserService {
    private readonly users: UserClass[] = [];
    private readonly historyLog: HistoryLog;
    private readonly notificationService: NotificationService;

    constructor() {
        this.historyLog = new HistoryLog();
        this.notificationService = new NotificationService();
    }

    addUser(nome: string, email: string, role: UserRoles = UserRoles.MEMBER): UserClass {
        const id = Date.now();
        const newUser = new UserClass(id, nome, email, role);
        this.users.push(newUser);
        
        this.historyLog.addLog(`Utilizador criado: ${nome} (${email})`);
        this.notificationService.notifyAdmins(`Novo utilizador: ${nome}`, this.users);
        
        return newUser;
    }

    getUsers(): UserClass[] {
        return this.users;
    }

    getActiveUsers(): UserClass[] {
        return this.users.filter(u => u.isActive());
    }

    getInactiveUsers(): UserClass[] {
        return this.users.filter(u => !u.isActive());
    }

    getUserById(id: number): UserClass | undefined {
        return this.users.find(u => u.getId() === id);
    }

    toggleUserStatus(id: number): void {
        const user = this.getUserById(id);
        if (user) {
            (user as any).active = !user.isActive();
            const status = user.isActive() ? 'ativo' : 'inativo';
            this.historyLog.addLog(`Status alterado: ${user.nome} → ${status}`);
        }
    }

    removeUser(id: number): boolean {
        const index = this.users.findIndex(u => u.getId() === id);
        if (index !== -1) {
            const user = this.users[index];
            this.users.splice(index, 1);
            this.historyLog.addLog(`Utilizador removido: ${user.nome}`);
            return true;
        }
        return false;
    }

    searchUsers(query: string): UserClass[] {
        const lowerQuery = query.toLowerCase();
        return this.users.filter(u => 
            u.nome.toLowerCase().includes(lowerQuery) ||
            u.email.toLowerCase().includes(lowerQuery)
        );
    }

    sortUsersByName(): void {
        this.users.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    getStats() {
        const total = this.users.length;
        const active = this.getActiveUsers().length;
        const inactive = this.getInactiveUsers().length;
        const percentActive = total > 0 ? Math.round((active / total) * 100) : 0;

        return {
            total,
            active,
            inactive,
            percentActive
        };
    }

    getHistory(): string[] {
        return this.historyLog.getLogs();
    }
}
