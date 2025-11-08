// components/create-board-modal.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, LayoutGrid } from 'lucide-react'
import { createBoardSchema, CreateBoardFormData } from '@/validators/board.validator'
import { boardService } from '@/services/board-service'
import { areaService } from '@/services/area-service'
import { Area } from '@/types/area'
import { toast } from 'sonner'

interface CreateBoardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function CreateBoardModal({
  open,
  onOpenChange,
  onSuccess
}: CreateBoardModalProps) {
  const [areas, setAreas] = useState<Area[]>([])
  const [isLoadingAreas, setIsLoadingAreas] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      title: '',
      description: '',
    }
  })

  // Cargar áreas cuando se abre el modal
  useEffect(() => {
    if (open) {
      loadAreas()
    }
  }, [open])

  const loadAreas = async () => {
    setIsLoadingAreas(true)
    try {
      const data = await areaService.getAllAreas()
      setAreas(data)
    } catch (error) {
      toast.error('Error al cargar áreas', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsLoadingAreas(false)
    }
  }

  const onSubmit = async (data: CreateBoardFormData) => {
    setIsSubmitting(true)
    try {
      await boardService.createBoard({
        title: data.title,
        description: data.description,
        areaId: data.areaId
      })

      toast.success('¡Tablero creado!', {
        description: 'El tablero se ha creado correctamente'
      })

      form.reset()
      onOpenChange(false)
      onSuccess() // Refrescar la lista de tableros
    } catch (error) {
      toast.error('Error al crear tablero', {
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
            <LayoutGrid className="h-5 w-5" />
            Crear Nuevo Tablero
          </DialogTitle>
          <DialogDescription>
            Completa la información para crear un nuevo tablero Kanban
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            {/* Área */}
            <FormField
              control={form.control}
              name="areaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    disabled={isSubmitting || isLoadingAreas}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un área" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingAreas ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : areas.length === 0 ? (
                        <div className="py-4 text-center text-sm text-muted-foreground">
                          No hay áreas disponibles
                        </div>
                      ) : (
                        areas.map((area) => (
                          <SelectItem key={area.id} value={area.id.toString()}>
                            <div className="flex flex-col">
                              <span className="font-medium">{area.title}</span>
                              {area.descripcion && (
                                <span className="text-xs text-muted-foreground">
                                  {area.descripcion}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Área a la que pertenece el tablero
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
                    Creando...
                  </>
                ) : (
                  'Crear Tablero'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}