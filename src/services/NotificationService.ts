export class NotificationService {
    notifyUser(userId: number, message: string) {
        console.log(`Notificação para User ${userId}: ${message}`);
    }
}