// components/edit-board-modal.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, Edit } from 'lucide-react'
import { updateBoardSchema, UpdateBoardFormData } from '@/validators/board.validator'
import { boardService } from '@/services/board-service'
import { Project } from '@/types/board'
import { toast } from 'sonner'

interface EditBoardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  board: Project | null
}

export default function EditBoardModal({
  open,
  onOpenChange,
  onSuccess,
  board
}: EditBoardModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UpdateBoardFormData>({
    resolver: zodResolver(updateBoardSchema),
    defaultValues: {
      title: '',
      description: '',
    }
  })

  // Cargar datos del tablero cuando se abre el modal
  useEffect(() => {
    if (open && board) {
      form.reset({
        title: board.title,
        description: board.description,
      })
    }
  }, [open, board, form])

  const onSubmit = async (data: UpdateBoardFormData) => {
    if (!board) return

    setIsSubmitting(true)
    try {
      await boardService.updateBoard(
        {
          title: data.title,
          description: data.description,
        },
        board.id.toString()
      )

      toast.success('¡Tablero actualizado!', {
        description: 'Los cambios se han guardado correctamente'
      })

      form.reset()
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast.error('Error al actualizar tablero', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Tablero
          </DialogTitle>
          <DialogDescription>
            Actualiza la información del tablero
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Área (solo lectura) */}
            {board && (
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-medium text-muted-foreground">Área</p>
                <p className="text-sm font-semibold">{board.area.name}</p>
                <p className="text-xs text-muted-foreground">{board.area.descripcion}</p>
              </div>
            )}

            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Tablero</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Desarrollo Web 2025"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Nombre identificativo del proyecto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descripción */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el propósito y objetivos del tablero..."
                      className="resize-none"
                      rows={4}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Breve descripción del proyecto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}