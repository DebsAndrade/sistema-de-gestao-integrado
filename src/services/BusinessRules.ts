export class BusinessRules {

    static canUserBeDeactivated(activeTasks: number): boolean {
        return activeTasks === 0;
    }

    static canTaskBeCompleted(isBlocked: boolean): boolean {
        return !isBlocked;
    }

    static canAssignTask(active: boolean): boolean {
        return active;
    }

    static isValidTitle(title: string): boolean {
        const trimmedTitle = title.trim();
        return trimmedTitle.length >= 5 && trimmedTitle.length <= 100;
    }
}
