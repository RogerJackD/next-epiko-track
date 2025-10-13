'use client'

import { Plus, TableIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Area } from '@/types/area'
import { boardService } from '@/services/board-service'
import { Board } from '@/types/board'
import { Button } from './ui/button'
import TaskDialog from './task-dialog'


interface KanbanHeaderProps {
  activeArea: Area;
  onBoardChange: (boardId: string) => void;
  currentBoardId: string | null;
}

export default function KanbanHeader({activeArea, onBoardChange, currentBoardId}: KanbanHeaderProps) {

  const [boards, setBoards] = useState<Board[] | null>(null);
  
  const [openDialogTask, setOpenDialogTask] = useState(false);


  const handleBoardChange = (BoardId: string) => {
    console.log("boardId seleccionado:", BoardId);
    onBoardChange(BoardId);
  }

  // Verificar boards en base a areas
  useEffect(() => {
    const fetchBoardsByArea = async() => {
      const boardsResponseData: Board[] | null = await boardService.getBoardsByArea(activeArea.id);
      console.log("Boards del área:", boardsResponseData);
      setBoards(boardsResponseData);
      
      // Seleccionar automaticamente el primer board cuando cambia el areaa
      if (boardsResponseData && boardsResponseData.length > 0) {
        onBoardChange(boardsResponseData[0].id);
      }
    }

    fetchBoardsByArea();
  }, [activeArea, onBoardChange]);

  return (
    <div className="border-b bg-background px-6 py-4">
       <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-stretch-75% text-foreground">
            Tablero kanban - Epiko
          </h1>
          <p className="text-muted-foreground">{activeArea.descripcion}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TableIcon/>
        <span>{boards?.length || 0} Tableros</span>
        <Select
          value={currentBoardId || undefined} // Valor controlado
          onValueChange={(value) => handleBoardChange(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Seleccionar tablero" />
          </SelectTrigger>
          <SelectContent>
            {boards?.map((board) => (
              <SelectItem key={board?.id} value={board?.id}>
                {board.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex justify-end'>
        <Button className="gap-2 bg-green-800">
          <Plus className="h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      <div>
        {openDialogTask && (
          <div>
            {/* Componente del diálogo */}
            <TaskDialog />
          </div>
        )}
      </div>
    </div>
  )
}