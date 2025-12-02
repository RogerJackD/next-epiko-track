// hooks/usePermissions.ts
import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { Permission, ROLE_PERMISSIONS, UserRole, CREATABLE_ROLES } from '@/types/permissions';

export function usePermissions() {
  const { user } = useAuth();

  const userPermissions = useMemo(() => {
    if (!user?.role?.name) return [];
    
    const roleName = user.role.name.toLowerCase() as UserRole;
    return ROLE_PERMISSIONS[roleName] || [];
  }, [user?.role?.name]);

  const userRole = useMemo(() => {
    if (!user?.role?.name) return null;
    return user.role.name.toLowerCase() as UserRole;
  }, [user?.role?.name]);

  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => userPermissions.includes(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => userPermissions.includes(permission));
  };

  // Verificar si el usuario es dueño de una tarea
  const isTaskOwner = (taskUsersIds: string[]): boolean => {
    if (!user?.id) return false;
    return taskUsersIds.includes(user.id);
  };

  // Verificar si puede mover una tarea específica
  const canMoveTask = (taskUsersIds: string[]): boolean => {
    if (hasPermission(Permission.MOVE_ANY_TASK)) {
      return true;
    }
    
    if (hasPermission(Permission.MOVE_OWN_TASK) && isTaskOwner(taskUsersIds)) {
      return true;
    }
    
    return false;
  };

  // Verificar si puede editar una tarea específica
  const canEditTask = (taskUsersIds: string[]): boolean => {
    if (hasPermission(Permission.EDIT_ANY_TASK)) {
      return true;
    }
    
    if (hasPermission(Permission.EDIT_OWN_TASK) && isTaskOwner(taskUsersIds)) {
      return true;
    }
    
    return false;
  };

  // Verificar si puede eliminar una tarea específica
  const canDeleteTask = (taskUsersIds: string[]): boolean => {
    if (hasPermission(Permission.DELETE_ANY_TASK)) {
      return true;
    }
    
    if (hasPermission(Permission.DELETE_OWN_TASK) && isTaskOwner(taskUsersIds)) {
      return true;
    }
    
    return false;
  };

  // Verificar qué roles puede crear el usuario actual
  const getCreatableRoles = (): UserRole[] => {
    if (!userRole) return [];
    return CREATABLE_ROLES[userRole] || [];
  };

  // Verificar si puede crear un rol específico
  const canCreateRole = (roleToCreate: UserRole): boolean => {
    const creatableRoles = getCreatableRoles();
    return creatableRoles.includes(roleToCreate);
  };

  //Verificar si puede crear usuarios admin
  const canCreateAdminUsers = (): boolean => {
    return hasPermission(Permission.CREATE_ADMIN_USER);
  };

  //Verificar si es super admin
  const isSuperAdmin = (): boolean => {
    return userRole === UserRole.SUPER_ADMIN;
  };

  //Verificar si es admin o superior
  const isAdminOrAbove = (): boolean => {
    return userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN;
  };

  return {
    permissions: userPermissions,
    userRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isTaskOwner,
    canMoveTask,
    canEditTask,
    canDeleteTask,
    getCreatableRoles,
    canCreateRole,
    canCreateAdminUsers,
    isSuperAdmin,
    isAdminOrAbove,
  };
}