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
import { toast } from 'sonner'

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

  const handleViewBoard = (board: Project) => {
    if (!board.isActive) {
      toast.error('Tablero no disponible', {
        description: 'Este tablero está desactivado. Actívalo para poder verlo.',
        duration: 4000,
      })
      return
    }
    
    console.log('🔵 [Table] Click en Ver Tablero, board:', board)
    onView?.(board)
  }

  return (
    <div className="w-full">
      {/* Vista Desktop */}
      <div className="hidden lg:block rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Proyecto</TableHead>
              <TableHead className="font-semibold">Descripción</TableHead>
              <TableHead className="font-semibold">Área</TableHead>
              <TableHead className="font-semibold">Fechas</TableHead>
              <TableHead className="font-semibold text-center">Estado</TableHead>
              <TableHead className="font-semibold text-center w-20">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boards?.map((board) => (
              <TableRow key={board.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-start gap-2">
                    <LayoutGrid className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
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
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span>Creado: {formatDate(board.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span>Actualizado: {getTimeAgo(board.updatedAt)}</span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <Badge 
                    variant={board.isActive ? 'default' : 'secondary'}
                    className={board.isActive ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    {board.isActive ? 'Activo' : 'Inactivo'}
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
                      <DropdownMenuItem onClick={() => handleViewBoard(board)}>
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

      {/* Vista Mobile - Cards */}
      <div className="lg:hidden space-y-4">
        {boards?.map((board) => (
          <div key={board.id} className="rounded-lg border bg-card p-4 space-y-3">
            {/* Header con título y acciones */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <LayoutGrid className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base">{board.title}</h3>
                  <p className="text-xs text-muted-foreground">ID: {board.id}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewBoard(board)}>
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
            </div>

            {/* Badge de Estado */}
            <div>
              <Badge 
                variant={board.isActive ? 'default' : 'secondary'}
                className={board.isActive ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                {board.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>

            {/* Descripción */}
            <div className="flex items-start gap-2 pt-2 border-t">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground line-clamp-3">
                {board.description}
              </p>
            </div>

            {/* Área */}
            <div className="pt-2 border-t">
              <p className="text-xs font-semibold text-muted-foreground mb-1">ÁREA</p>
              <div>
                <p className="text-sm font-medium">{board.area.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {board.area.descripcion}
                </p>
              </div>
            </div>

            {/* Fechas */}
            <div className="space-y-1.5 pt-2 border-t">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>Creado: {formatDate(board.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>Actualizado: {getTimeAgo(board.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
        
        {(!boards || boards.length === 0) && (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No hay tableros para mostrar
          </div>
        )}
      </div>
    </div>
  )
}