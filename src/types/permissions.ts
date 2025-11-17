// types/permissions.ts

// Roles disponibles en el sistema
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

// Permisos disponibles en el sistema
export enum Permission {
  // Administración
  VIEW_ADMIN_PANEL = 'view_admin_panel',
  MANAGE_USERS = 'manage_users',
  MANAGE_BOARDS = 'manage_boards',
  
  // Tareas
  MOVE_ANY_TASK = 'move_any_task',
  MOVE_OWN_TASK = 'move_own_task',
  EDIT_ANY_TASK = 'edit_any_task',
  EDIT_OWN_TASK = 'edit_own_task',
  DELETE_ANY_TASK = 'delete_any_task',
  DELETE_OWN_TASK = 'delete_own_task',
  CREATE_TASK = 'create_task',
  
  // Vistas
  VIEW_ALL_BOARDS = 'view_all_boards',
  VIEW_OWN_BOARDS = 'view_own_boards',
  VIEW_NOTIFICATIONS = 'view_notifications',
}

// Mapeo de roles a permisos
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin tiene todos los permisos
    Permission.VIEW_ADMIN_PANEL,
    Permission.MANAGE_USERS,
    Permission.MANAGE_BOARDS,
    Permission.MOVE_ANY_TASK,
    Permission.MOVE_OWN_TASK,
    Permission.EDIT_ANY_TASK,
    Permission.EDIT_OWN_TASK,
    Permission.DELETE_ANY_TASK,
    Permission.DELETE_OWN_TASK,
    Permission.CREATE_TASK,
    Permission.VIEW_ALL_BOARDS,
    Permission.VIEW_OWN_BOARDS,
    Permission.VIEW_NOTIFICATIONS,
  ],
  [UserRole.MANAGER]: [
    // Manager puede gestionar tareas de cualquiera pero no usuarios
    Permission.MOVE_ANY_TASK,
    Permission.MOVE_OWN_TASK,
    Permission.EDIT_ANY_TASK,
    Permission.EDIT_OWN_TASK,
    Permission.DELETE_ANY_TASK,
    Permission.DELETE_OWN_TASK,
    Permission.CREATE_TASK,
    Permission.VIEW_ALL_BOARDS,
    Permission.VIEW_OWN_BOARDS,
    Permission.VIEW_NOTIFICATIONS,
  ],
  [UserRole.USER]: [
    // User solo puede gestionar sus propias tareas
    Permission.MOVE_OWN_TASK,
    Permission.EDIT_OWN_TASK,
    Permission.DELETE_OWN_TASK,
    Permission.CREATE_TASK,
    Permission.VIEW_OWN_BOARDS,
    Permission.VIEW_NOTIFICATIONS,
  ],
};