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
import { Mail, Phone, Briefcase, Calendar } from 'lucide-react'

interface UsersTableProps {
  users?: User[]
}

export default function UsersTable({ users }: UsersTableProps) {
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
                  <Badge 
                    variant={user.status ? 'default' : 'destructive'}
                    className={user.status ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    {user.status ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            
            {(!users || users.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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