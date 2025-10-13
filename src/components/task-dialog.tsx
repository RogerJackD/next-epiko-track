import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';

const priorityColors = {
  ALTA: "bg-red-100 text-red-800 border-red-200",
  MEDIA: "bg-yellow-100 text-yellow-800 border-yellow-200",
  BAJA: "bg-green-100 text-green-800 border-green-200",
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskDialog({ open, onOpenChange }: TaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Tarea</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title">Título</label>
            <Input id="title" placeholder="Nombre de la tarea" />
          </div>

          <div className="space-y-2">
            <label htmlFor="description">Descripción</label>
            <textarea 
              id="description" 
              placeholder="Descripción de la tarea"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate">Fecha Inicio</label>
              <Input id="startDate" type="datetime-local" />
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate">Fecha Límite</label>
              <Input id="dueDate" type="datetime-local" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="priority">Prioridad</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baja">Baja</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="bg-green-800 hover:bg-green-900">
              Crear
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
