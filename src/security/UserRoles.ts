export enum UserRoles {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  GUEST = "GUEST",
}

export function canDeleteTask(role: UserRoles): boolean {
  return role === UserRoles.ADMIN;
}
