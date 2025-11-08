// components/confirm-status-modal.tsx
'use client'

import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Project } from '@/types/board'
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { boardService } from '@/services/board-service'
import { toast } from 'sonner'

interface ConfirmStatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  board: Project | null
  newStatus: boolean
}

export default function ConfirmStatusModal({
  open,
  onOpenChange,
  onSuccess,
  board,
  newStatus
}: ConfirmStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (!board) return

    setIsSubmitting(true)
    try {
      await boardService.updateBoard(
        { isActive: newStatus },
        board.id.toString()
      )

      toast.success(
        newStatus ? '¡Tablero activado!' : '¡Tablero desactivado!',
        {
          description: newStatus 
            ? 'El tablero ha sido activado correctamente' 
            : 'El tablero ha sido marcado como inactivo'
        }
      )

      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast.error('Error al cambiar el estado', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {newStatus ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            )}
            {newStatus ? 'Activar Tablero' : 'Desactivar Tablero'}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            {newStatus ? (
                <div className="space-y-2">
                <p>¿Estás seguro de que deseas activar el tablero <strong>{board?.title}</strong>?</p>
                <p className="text-sm">El tablero volverá a estar disponible para trabajar.</p>
                </div>
            ) : (
                <div className="space-y-2">
                <p>¿Estás seguro de que deseas desactivar el tablero <strong>{board?.title}</strong>?</p>
                <p className="text-sm">Esto puede significar que el proyecto está completado o pausado. Podrás reactivarlo más adelante si lo necesitas.</p>
                </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={newStatus ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              newStatus ? 'Sí, Activar' : 'Sí, Desactivar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}