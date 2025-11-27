'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Project } from '@/types/board'
import { boardService } from '@/services/board-service'
import { toast } from 'sonner'
import BoardManagementTable from './board-managent-table'
import ConfirmStatusModal from './confirm-status-modal'
import BoardManagementHeader from './board-managent-header'
import EditBoardModal from './edit-board-modal'

interface BoardManagementPanelProps {
  onNavigateToBoard?: (board: Project) => void;
}

export default function BoardManagementPanel({ onNavigateToBoard }: BoardManagementPanelProps) {
  const [boards, setBoards] = useState<Project[]>([]);
  const [filteredBoards, setFilteredBoards] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para el modal de confirmación de estado
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Project | null>(null);
  const [newStatus, setNewStatus] = useState(false);

  // Estados para el modal de edición
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState<Project | null>(null);

  // Estados para filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');

  useEffect(() => {
    loadBoards();
  }, []);

  // ✅ useCallback para evitar recrear la función en cada render
  const applyFilters = useCallback(() => {
    let filtered = [...boards];

    // Filtro de búsqueda
    if (searchQuery) {
      filtered = filtered.filter(board =>
        board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        board.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro de estado
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(board => board.isActive === isActive);
    }

    // Filtro de área
    if (areaFilter !== 'all') {
      filtered = filtered.filter(board => 
        board.area.name.toLowerCase() === areaFilter.toLowerCase()
      );
    }

    setFilteredBoards(filtered);
  }, [boards, searchQuery, statusFilter, areaFilter]); // ✅ Todas las dependencias

  // ✅ Ahora sí incluir applyFilters como dependencia
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadBoards = async () => {
    setIsLoading(true);
    try {
      const data = await boardService.getAllBoards();
      setBoards(data);
      setFilteredBoards(data);
    } catch (error) {
      toast.error('Error al cargar tableros');
      console.error('Error cargando boards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (board: Project) => {
    console.log('🟢 [Panel] handleView recibió board:', board);
    console.log('🟢 [Panel] onNavigateToBoard es:', onNavigateToBoard ? 'definido' : 'undefined');
    onNavigateToBoard?.(board);
  };

  const handleEdit = (board: Project) => {
    console.log('Editando tablero:', board);
    setBoardToEdit(board);
    setEditModalOpen(true);
  };

  const handleToggleStatus = (board: Project) => {
    setSelectedBoard(board);
    setNewStatus(!board.isActive);
    setConfirmModalOpen(true);
  };

  const handleConfirmSuccess = () => {
    loadBoards();
  };

  const handleEditSuccess = () => {
    loadBoards();
  };

  const handleAddBoard = () => {
    toast.info('Función de crear tablero en desarrollo');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Cargando tableros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BoardManagementHeader
        onSearch={setSearchQuery}
        onFilterArea={setAreaFilter}
        onFilterStatus={setStatusFilter}
        onAddBoard={handleAddBoard}
        totalBoards={filteredBoards.length}
      />

      <BoardManagementTable
        boards={filteredBoards}
        onView={handleView}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      <ConfirmStatusModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        onSuccess={handleConfirmSuccess}
        board={selectedBoard}
        newStatus={newStatus}
      />

      <EditBoardModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={handleEditSuccess}
        board={boardToEdit}
      />
    </div>
  );
}