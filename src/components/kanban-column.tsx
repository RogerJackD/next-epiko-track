import React from 'react'
import { Badge } from './ui/badge'

interface KanbanColumnProps {
  title: string
  status: string
}

export default function KanbanColumn({title, status}: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg border bg-muted/50">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <Badge className="text-xs">
          4
        </Badge>
      </div>
    </div>
  )
}
