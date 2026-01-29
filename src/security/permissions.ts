import { UserRoles } from './UserRoles';

export function canCreateTask(role: UserRoles): boolean {
    return role === UserRoles.ADMIN || role === UserRoles.GUEST || role === UserRoles.MEMBER;
}

export function canEditTask(role: UserRoles): boolean {
    return role === UserRoles.ADMIN || role === UserRoles.GUEST || role === UserRoles.MEMBER;
}

export function canDeleteTask(role: UserRoles): boolean {
    return role === UserRoles.ADMIN || role === UserRoles.GUEST;
}

export function canAssignTask(role: UserRoles): boolean {
    return role === UserRoles.ADMIN || role === UserRoles.GUEST;
}
