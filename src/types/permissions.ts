// types/permissions.ts

// Roles disponibles en el sistema
export enum UserRole {
  SUPER_ADMIN = 'super-admin',
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
  CREATE_ADMIN_USER = 'create_admin_user', 
  
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
  [UserRole.SUPER_ADMIN]: [
    // Super Admin tiene TODOS los permisos incluyendo crear admins
    Permission.VIEW_ADMIN_PANEL,
    Permission.MANAGE_USERS,
    Permission.MANAGE_BOARDS,
    Permission.CREATE_ADMIN_USER, //EXCLUSIVO de super-admin
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
  [UserRole.ADMIN]: [
    // Admin tiene todos los permisos EXCEPTO crear otros admins
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

// Helper para obtener roles que un rol específico puede crear
export const CREATABLE_ROLES: Record<UserRole, UserRole[]> = {
  [UserRole.SUPER_ADMIN]: [
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.USER,
  ],
  [UserRole.ADMIN]: [
    UserRole.MANAGER,
    UserRole.USER,
  ],
  [UserRole.MANAGER]: [],
  [UserRole.USER]: [],
};

// Helper para obtener nombres de roles en español
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Administrador',
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.USER]: 'Usuario',
};

// Helper para obtener el ID de rol en la base de datos
export const ROLE_IDS: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 4,
  [UserRole.ADMIN]: 2,
  [UserRole.MANAGER]: 3,
  [UserRole.USER]: 1,
};

export const ID_TO_ROLE: Record<number, UserRole> = {
  1: UserRole.USER,
  2: UserRole.ADMIN,
  3: UserRole.MANAGER,
  4: UserRole.SUPER_ADMIN,
};