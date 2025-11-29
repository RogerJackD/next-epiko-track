import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Filter, LayoutGrid } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BoardManagementHeaderProps {
  onSearch?: (search: string) => void
  onFilterArea?: (area: string) => void
  onFilterStatus?: (status: string) => void
  onAddBoard?: () => void
  totalBoards?: number
}

export default function BoardManagementHeader({
  onSearch,
  onFilterArea,
  onFilterStatus,
  onAddBoard,
  totalBoards = 0
}: BoardManagementHeaderProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* Header superior */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <LayoutGrid className="h-6 w-6" />
            Tableros Kanban
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona y visualiza todos los proyectos y tableros del sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onAddBoard}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Tablero
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título o descripción..."
            className="pl-9"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select onValueChange={onFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={onFilterArea}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las áreas</SelectItem>
              <SelectItem value="tecnologia">Tecnología</SelectItem>
              <SelectItem value="administracion">Administración</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="recursos humanos">Recursos Humanos</SelectItem>

            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{totalBoards} tableros encontrados</span>
      </div>
    </div>
  )
}