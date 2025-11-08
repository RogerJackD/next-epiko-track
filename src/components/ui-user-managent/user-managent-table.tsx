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
    <div className="w-full overflow-x-auto">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Usuario</TableHead>
              <TableHead className="font-semibold">Contacto</TableHead>
              <TableHead className="font-semibold">Puesto</TableHead>
              <TableHead className="font-semibold">Área</TableHead>
              <TableHead className="font-semibold">Rol</TableHead>
              <TableHead className="font-semibold text-center">Estado</TableHead>
              <TableHead className="font-semibold text-center">Acciones</TableHead>
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
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[200px]">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{user.job_title}</span>
                    </div>
                    {user.contractDate && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
                  <div className="flex flex-col items-center gap-2">
                    <Badge 
                      variant={user.status ? 'default' : 'destructive'}
                      className={user.status ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                      {user.status ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleStatus?.(user)}
                      className={user.status 
                        ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50'}
                    >
                      {user.status ? (
                        <>
                          <UserX className="h-3.5 w-3.5 mr-1.5" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-3.5 w-3.5 mr-1.5" />
                          Activar
                        </>
                      )}
                    </Button>
                  </div>
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
    </div>
  )
}