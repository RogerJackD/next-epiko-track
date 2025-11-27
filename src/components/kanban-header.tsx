'use client'

import { Plus, TableIcon, Filter, X, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Area } from '@/types/area'
import { boardService } from '@/services/board-service'
import { Board } from '@/types/board'
import { Button } from './ui/button'
import TaskDialog from './task-dialog'
import TaskProgressBar from './task-progress-bar'
import { Badge } from './ui/badge'
import { Input } from './ui/input'

export interface TaskFilters {
  search: string;
  priority: 'ALL' | 'BAJA' | 'MEDIA' | 'ALTA';
  assignedToMe: boolean;
}

interface KanbanHeaderProps {
  activeArea: Area;
  onBoardChange: (boardId: string | null) => void;
  currentBoardId: string | null;
  onTaskCreated: () => void;
  totalTasks: number;
  completedTasks: number;
  onFiltersChange?: (filters: TaskFilters) => void;
}

export default function KanbanHeader({
  activeArea, 
  onBoardChange, 
  currentBoardId, 
  onTaskCreated,
  totalTasks,
  completedTasks,
  onFiltersChange
}: KanbanHeaderProps) {

  const [boards, setBoards] = useState<Board[] | null>(null);
  const [openDialogTask, setOpenDialogTask] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    priority: 'ALL',
    assignedToMe: false,
  });

  const handleBoardChange = (BoardId: string) => {
    console.log("📌 Usuario seleccionó tablero:", BoardId);
    onBoardChange(BoardId);
  }

  const handleFilterChange = (key: keyof TaskFilters, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const resetFilters: TaskFilters = {
      search: '',
      priority: 'ALL',
      assignedToMe: false,
    };
    setFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.priority !== 'ALL' || 
    filters.assignedToMe;

  // ✅ Solo cargar boards cuando cambia el área - SIN auto-selección
  useEffect(() => {
    const fetchBoardsByArea = async() => {
      try {
        console.log("🔄 Cargando boards del área:", activeArea.id);
        const boardsResponseData: Board[] | null = await boardService.getBoardsByArea(activeArea.id);
        console.log("✅ Boards cargados:", boardsResponseData?.length || 0);
        setBoards(boardsResponseData);
        
        // ✅ NO seleccionar automáticamente ningún tablero
        // El usuario debe elegir manualmente
      } catch (error) {
        console.error("❌ Error al cargar boards:", error);
        setBoards(null);
      }
    }

    fetchBoardsByArea();
  }, [activeArea.id]);

  return (
    <div className="border-b bg-background px-4 md:px-6 py-4 space-y-4">
      {/* Header principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold text-foreground truncate">
            Tablero Kanban - Epiko
          </h1>
          <p className="text-sm text-muted-foreground truncate">{activeArea.descripcion}</p>
        </div>
        
        <Button 
          className="gap-2 bg-green-800 hover:bg-green-900 w-full md:w-auto" 
          onClick={() => setOpenDialogTask(true)}
          disabled={!currentBoardId}
        >
          <Plus className="h-4 w-4" />
          <span className="md:inline">Nueva Tarea</span>
        </Button>
      </div>

      {/* Barra de progreso */}
      {currentBoardId && (
        <TaskProgressBar 
          totalTasks={totalTasks} 
          completedTasks={completedTasks} 
        />
      )}

      {/* Selector de tablero y filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <TableIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {boards?.length || 0} Tableros
          </span>
          <Select
            value={currentBoardId || undefined}
            onValueChange={handleBoardChange}
          >
            <SelectTrigger className="flex-1 sm:w-48">
              <SelectValue placeholder="Seleccionar tablero" />
            </SelectTrigger>
            <SelectContent>
              {boards && boards.length > 0 ? (
                boards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.title}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  No hay tableros disponibles
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {currentBoardId && (
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 w-full sm:w-auto"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {[filters.search !== '', filters.priority !== 'ALL', filters.assignedToMe]
                  .filter(Boolean).length}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && currentBoardId && (
        <div className="p-4 bg-muted/30 rounded-lg space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filtrar tareas</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 text-xs gap-1"
              >
                <X className="h-3 w-3" />
                Limpiar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Búsqueda */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Título o descripción..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Prioridad */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Prioridad
              </label>
              <Select
                value={filters.priority}
                onValueChange={(value) => handleFilterChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  <SelectItem value="ALTA">Alta</SelectItem>
                  <SelectItem value="MEDIA">Media</SelectItem>
                  <SelectItem value="BAJA">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Asignadas a mí */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Asignación
              </label>
              <Button
                variant={filters.assignedToMe ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleFilterChange('assignedToMe', !filters.assignedToMe)}
              >
                {filters.assignedToMe ? 'Mis tareas' : 'Todas las tareas'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <TaskDialog 
        open={openDialogTask} 
        onOpenChange={setOpenDialogTask} 
        currentBoardId={currentBoardId}  
        onTaskCreated={onTaskCreated} 
      />
    </div>
  )
}