'use client'

import { boardService } from '@/services/board-service'
import { Project } from '@/types/board'
import React, { useState, useEffect } from 'react'
import BoardManagementHeader from './board-managent-header'
import BoardManagementTable from './board-managent-table'
import CreateBoardModal from './create-board-modal'
import EditBoardModal from './edit-board-modal'
import ConfirmStatusModal from './confirm-status-modal'

export default function BoardManagementPanel() {
  const [boards, setBoards] = useState<Project[]>([])
  const [filteredBoards, setFilteredBoards] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [areaFilter, setAreaFilter] = useState('all')
  
  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState<Project | null>(null)
  const [newStatusValue, setNewStatusValue] = useState(false)

  // Función para cargar tableros
  const fetchBoards = async () => {
    try {
      const data = await boardService.getAllBoards()
      setBoards(data)
      setFilteredBoards(data)
      console.log(data)
    } catch (error) {
      console.error('Error fetching boards:', error)
    }
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  // Filtrar tableros
  useEffect(() => {
    let filtered = [...boards]

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(board =>
        board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        board.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro de estado
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active'
      filtered = filtered.filter(board => board.isActive === isActive)
    }

    // Filtro de área
    if (areaFilter !== 'all') {
      filtered = filtered.filter(board => 
        board.area.name.toLowerCase() === areaFilter.toLowerCase()
      )
    }

    setFilteredBoards(filtered)
  }, [searchTerm, statusFilter, areaFilter, boards])

  const handleSearch = (search: string) => {
    setSearchTerm(search)
  }

  const handleFilterStatus = (status: string) => {
    setStatusFilter(status)
  }

  const handleFilterArea = (area: string) => {
    setAreaFilter(area)
  }

  const handleAddBoard = () => {
    setIsCreateModalOpen(true)
  }

  const handleBoardCreated = () => {
    fetchBoards()
  }

  const handleExport = () => {
    console.log('Exportar tableros')
  }

  const handleView = (board: Project) => {
    console.log('Ver tablero:', board)
    // Redirigir al tablero Kanban
  }

  const handleEdit = (board: Project) => {
    setSelectedBoard(board)
    setIsEditModalOpen(true)
  }

  const handleBoardUpdated = () => {
    fetchBoards()
  }

  const handleToggleStatus = (board: Project) => {
    setSelectedBoard(board)
    setNewStatusValue(!board.isActive)
    setIsStatusModalOpen(true)
  }

  const handleStatusChanged = () => {
    fetchBoards()
  }

  return (
    <div className='p-6 bg-background min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-card rounded-lg shadow-sm p-6'>
          <BoardManagementHeader
            onSearch={handleSearch}
            onFilterArea={handleFilterArea}
            onFilterStatus={handleFilterStatus}
            onAddBoard={handleAddBoard}
            onExport={handleExport}
            totalBoards={filteredBoards.length}
          />
          <BoardManagementTable
            boards={filteredBoards}
            onView={handleView}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>

      {/* Modal de creación */}
      <CreateBoardModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleBoardCreated}
      />

      {/* Modal de edición */}
      <EditBoardModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleBoardUpdated}
        board={selectedBoard}
      />

      {/* Modal de confirmación de cambio de estado */}
      <ConfirmStatusModal
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        onSuccess={handleStatusChanged}
        board={selectedBoard}
        newStatus={newStatusValue}
      />
    </div>
  )
}