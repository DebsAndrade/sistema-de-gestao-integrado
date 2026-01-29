import { UserRole } from './UserRole';

export function canCreateTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER || role === UserRole.MEMBER;
}

export function canEditTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER || role === UserRole.MEMBER;
}

export function canDeleteTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}

export function canAssignTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}
