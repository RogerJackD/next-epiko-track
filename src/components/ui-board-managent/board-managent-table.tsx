// components/board-managent-table.tsx
import { Project } from '@/types/board'
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
import { Calendar, LayoutGrid, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, Archive, CheckCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BoardManagementTableProps {
  boards?: Project[]
  onView?: (board: Project) => void
  onEdit?: (board: Project) => void
  onToggleStatus?: (board: Project) => void
}

export default function BoardManagementTable({ 
  boards,
  onView,
  onEdit,
  onToggleStatus
}: BoardManagementTableProps) {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Hoy'
    if (diffInDays === 1) return 'Ayer'
    if (diffInDays < 7) return `Hace ${diffInDays} días`
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`
    return `Hace ${Math.floor(diffInDays / 30)} meses`
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Proyecto</TableHead>
              <TableHead className="font-semibold">Descripción</TableHead>
              <TableHead className="font-semibold">Área</TableHead>
              <TableHead className="font-semibold">Fechas</TableHead>
              <TableHead className="font-semibold text-center">Estado</TableHead>
              <TableHead className="font-semibold text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boards?.map((board) => (
              <TableRow key={board.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-start gap-2">
                    <LayoutGrid className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{board.title}</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {board.id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-start gap-1.5 max-w-[300px]">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {board.description}
                    </p>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">{board.area.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {board.area.descripcion}
                    </p>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Creado: {formatDate(board.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Actualizado: {getTimeAgo(board.updatedAt)}</span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Badge 
                      variant={board.isActive ? 'default' : 'secondary'}
                      className={board.isActive ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                      {board.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleStatus?.(board)}
                      className={board.isActive 
                        ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' 
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50'}
                    >
                      {board.isActive ? (
                        <>
                          <Archive className="h-3.5 w-3.5 mr-1.5" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
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
                      <DropdownMenuItem onClick={() => {
                          console.log('🔵 [Table] Click en Ver Tablero, board:', board);
                          onView?.(board);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Tablero
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(board)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onToggleStatus?.(board)}
                        className={board.isActive ? 'text-amber-600' : 'text-green-600'}
                      >
                        {board.isActive ? (
                          <>
                            <Archive className="h-4 w-4 mr-2" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activar
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            
            {(!boards || boards.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No hay tableros para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}