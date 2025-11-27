// components/app-sidebar.tsx
import { Bell, Building2, Laptop, LogOut, TableConfig, TrendingUp, UserCog, Users, CheckSquare } from 'lucide-react'
import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { Button } from './ui/button'
import { useRouter } from "next/navigation"
import { useAuth } from '@/hooks/useAuth'
import { Badge } from './ui/badge'
import { Skeleton } from './ui/skeleton'
import { useUserTasksContext } from '@/contexts/UserTasksContext'
import { PermissionGuard } from './auth/permission-guard'
import { Permission } from '@/types/permissions'

import { KeyRound } from 'lucide-react';
import { ChangePasswordDialog } from './ui-changePassword/change-password-dialog'

const areas = [
  {
    title: "Tecnología",
    icon: Laptop,
    id: "1",
  },
  {
    title: "Administración",
    icon: Building2,
    id: "2",
  },
  {
    title: "Marketing",
    icon: TrendingUp,
    id: "3",
  },
  {
    title: "Recursos Humanos",
    icon: Users,
    id: "4",
  },
]

interface AppSidebarProps {
  activeArea: string
  onAreaChange: (area: string) => void
}

export default function AppSidebar({activeArea, onAreaChange}: AppSidebarProps) {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const { taskCount, isConnected } = useUserTasksContext()

  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'manager':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-lg font-semibold'>Areas de la empresa</SidebarGroupLabel> 
          <SidebarGroupContent>
            <SidebarMenu>
              {areas.map((area) => (
                <SidebarMenuItem key={area.id}>
                  <SidebarMenuButton
                    onClick={() => onAreaChange(area.id)}
                    isActive={activeArea === area.id}
                    className='w-full justify-start'
                  >
                    <area.icon className='h-4 w-4'/>
                    <span>{area.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/*ección de Administracinn solo visible para quienes tienen permiso */}
        <PermissionGuard permission={Permission.VIEW_ADMIN_PANEL}>
          <SidebarGroup>
            <SidebarGroupLabel className='text-lg font-semibold'>Administración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <PermissionGuard permission={Permission.MANAGE_USERS}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => onAreaChange("userManagement")}
                      isActive={activeArea === "userManagement"}
                      className="w-full justify-start"
                    >
                      <UserCog className="h-4 w-4" />
                      <span>Gestión de Usuarios</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </PermissionGuard>

                <PermissionGuard permission={Permission.MANAGE_BOARDS}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => onAreaChange("boardManagement")}
                      isActive={activeArea === "boardManagement"}
                      className="w-full justify-start"
                    >
                      <TableConfig className="h-4 w-4" />
                      <span>Gestión de Tableros</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </PermissionGuard>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => onAreaChange("notifications")}
                    isActive={activeArea === "notifications"}
                    className="w-full justify-start"
                  >
                    <Bell className="h-4 w-4" />
                    <span>Panel de Notificaciones</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </PermissionGuard>

        <SidebarGroup>
          <SidebarGroupLabel className='text-lg font-semibold'>
            Mis Tareas
            {isConnected && (
              <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onAreaChange("myTasks")}
                  isActive={activeArea === "myTasks"}
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    <span>Mis Tareas</span>
                  </div>
                  {taskCount > 0 && (
                    <Badge 
                      variant="default" 
                      className="ml-auto bg-primary hover:bg-primary text-xs min-w-[20px] h-5 flex items-center justify-center"
                    >
                      {taskCount}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 border-t">
          {isLoading ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-9 w-full" />
            </div>
          ) : user ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-sm font-semibold text-white">
                    {getInitials(user.firstName, user.lastName)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-2 py-0 ${getRoleBadgeColor(user.role.name)}`}
                    >
                      {user.role.name}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="mb-3 p-2 bg-muted/50 rounded-md">
                <p className="text-xs text-muted-foreground">Área</p>
                <p className="text-sm font-medium truncate">{user.area.name}</p>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 bg-transparent hover:bg-gray-200"
                onClick={handleLogout}
              >
                <LogOut className="h-3 w-3" />
                Cerrar Sesión
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                <KeyRound className="h-3 w-3" />
                    Cambiar Contraseña
              </Button>

                  <ChangePasswordDialog 
                    open={isChangePasswordOpen}
                    onOpenChange={setIsChangePasswordOpen}
                  />

            </>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              No hay sesión activa
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}