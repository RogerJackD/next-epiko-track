'use client'

import { TableIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Area } from '@/types/area'
import { boardService } from '@/services/board-service'
import { Board } from '@/types/boards'

export default function KanbanHeader(activeArea: Area) {

  console.log(activeArea)
  const [status, setStatus] = useState("all");

  const [boards, setBoards] = useState<Board[] | null>(null);

    //verificar boards en base a areas
   useEffect(() => {
    const fetchBoardsByArea = async() =>{
      const boardsResponseData: Board[] | null = await boardService.getBoardsByArea(activeArea.id);
      setBoards(boardsResponseData)
    }

    fetchBoardsByArea()
  }, [activeArea])

  const projects = [
  { title: "all", id: "Todos los tableros" },
  { title: "proyecto marketplace", id: "1" },
  { title: "proyecto app movil", id: "2" },
]

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
        <Select
            value={status}
            onValueChange={setStatus}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
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
      
    </div>
  )
}
