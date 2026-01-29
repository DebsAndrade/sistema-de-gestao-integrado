import { UserClass } from '../models/UserClass';
import { UserRoles } from '../security/UserRoles';

export class NotificationService {
    notifyUser(userId: number, message: string): void {
        console.log(`📧 Notificação para User #${userId}: ${message}`);
        // Aqui poderia integrar com sistema real de emails/push notifications
    }

    notifyGroup(userIds: number[], message: string): void {
        console.log(`📢 Notificação em grupo (${userIds.length} usuários): ${message}`);
        userIds.forEach(id => {
            console.log(`  → User #${id}`);
        });
    }

    notifyAdmins(message: string, users: UserClass[]): void {
        const admins = users.filter(u => u.role === UserRoles.ADMIN);
        console.log(`🚨 Notificação ADMIN (${admins.length} admins): ${message}`);
        admins.forEach(admin => {
            console.log(`  → ${admin.nome} (${admin.email})`);
        });
    }

    notifyManagers(message: string, users: UserClass[]): void {
        const managers = users.filter(u =>
            u.role === UserRoles.ADMIN || u.role === UserRoles.GUEST
        );
        console.log(`👔 Notificação MANAGERS (${managers.length}): ${message}`);
        managers.forEach(manager => {
            console.log(`  → ${manager.nome}`);
        });
    }

    notifyTaskAssigned(taskTitle: string, assignedTo: string): void {
        console.log(`✉️ Nova tarefa atribuída: "${taskTitle}" → ${assignedTo}`);
    }

    notifyTaskCompleted(taskTitle: string, completedBy: string): void {
        console.log(`✅ Tarefa concluída: "${taskTitle}" por ${completedBy}`);
    }

    notifyUrgent(message: string): void {
        console.log(`🚨🚨🚨 URGENTE: ${message} 🚨🚨🚨`);
    }
}
