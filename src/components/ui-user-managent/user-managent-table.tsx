import { User } from '@/types/user'
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, Briefcase, Calendar, MoreHorizontal, Edit, UserX, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UsersTableProps {
  users?: User[]
  onEdit?: (user: User) => void
  onToggleStatus?: (user: User) => void
}

export default function UsersTable({ users, onEdit, onToggleStatus }: UsersTableProps) {
  return (
    <div className="w-full">
      {/* Vista Desktop */}
      <div className="hidden lg:block rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Usuario</TableHead>
              <TableHead className="font-semibold">Contacto</TableHead>
              <TableHead className="font-semibold">Puesto</TableHead>
              <TableHead className="font-semibold">Área</TableHead>
              <TableHead className="font-semibold">Rol</TableHead>
              <TableHead className="font-semibold text-center">Estado</TableHead>
              <TableHead className="font-semibold text-center w-20">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.age} años
                    </p>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1.5 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate max-w-[200px]">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium">{user.job_title}</span>
                    </div>
                    {user.contractDate && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span>
                          {new Date(user.contractDate).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  {user.area ? (
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium">{user.area.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {user.area.descripcion}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Sin área</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {user.role ? (
                    <Badge 
                      variant={user.role.name === 'admin' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {user.role.name}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">Sin rol</span>
                  )}
                </TableCell>
                
                <TableCell className="text-center">
                  <Badge 
                    variant={user.status ? 'default' : 'destructive'}
                    className={user.status ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    {user.status ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onToggleStatus?.(user)}
                        className={user.status ? 'text-red-600' : 'text-green-600'}
                      >
                        {user.status ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activar
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            
            {(!users || users.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No hay usuarios para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Vista Mobile - Cards */}
      <div className="lg:hidden space-y-4">
        {users?.map((user) => (
          <div key={user.id} className="rounded-lg border bg-card p-4 space-y-3">
            {/* Header con nombre y acciones */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {user.age} años
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(user)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onToggleStatus?.(user)}
                    className={user.status ? 'text-red-600' : 'text-green-600'}
                  >
                    {user.status ? (
                      <>
                        <UserX className="h-4 w-4 mr-2" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Activar
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Badges de Estado y Rol */}
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={user.status ? 'default' : 'destructive'}
                className={user.status ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                {user.status ? 'Activo' : 'Inactivo'}
              </Badge>
              {user.role && (
                <Badge 
                  variant={user.role.name === 'admin' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {user.role.name}
                </Badge>
              )}
            </div>

            {/* Contacto */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate text-muted-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">{user.phoneNumber}</span>
              </div>
            </div>

            {/* Puesto y Área */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-start gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{user.job_title}</p>
                  {user.contractDate && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(user.contractDate).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {user.area && (
                <div className="pl-6">
                  <p className="text-sm font-medium text-muted-foreground">
                    Área: <span className="text-foreground">{user.area.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {user.area.descripcion}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {(!users || users.length === 0) && (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No hay usuarios para mostrar
          </div>
        )}
      </div>
    </div>
  )
}