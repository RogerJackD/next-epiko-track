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
import { Button } from '@/components/ui/button'
import { Loader2, Edit, Shield, AlertCircle } from 'lucide-react'
import { updateUserSchema, UpdateUserFormData } from '@/validators/user.validator'
import { userService } from '@/services/user-service'
import { areaService } from '@/services/area-service'
import { Area } from '@/types/area'
import { User } from '@/types/user'
import { toast } from 'sonner'
import { usePermissions } from '@/hooks/usePermissions'
import { ROLE_LABELS, ROLE_IDS, ID_TO_ROLE, UserRole } from '@/types/permissions'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface EditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  user: User | null
}

export default function EditUserModal({
  open,
  onOpenChange,
  onSuccess,
  user
}: EditUserModalProps) {
  const [areas, setAreas] = useState<Area[]>([])
  const [isLoadingAreas, setIsLoadingAreas] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ✨ Obtener roles que el usuario actual puede crear
  const { getCreatableRoles, isSuperAdmin, canCreateRole } = usePermissions()
  const creatableRoles = getCreatableRoles()

  // ✨ Verificar si el usuario que se está editando tiene un rol que no podemos modificar
  const currentUserRole = user?.role?.name ? ID_TO_ROLE[user.roleId] : null
  const canEditThisUserRole = currentUserRole ? canCreateRole(currentUserRole) : false

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      job_title: '',
      address: '',
      phoneNumber: '',
      contractDate: '',
    }
  })

  useEffect(() => {
    if (open) {
      loadAreas()
    }
  }, [open])

  useEffect(() => {
    if (open && user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        job_title: user.job_title,
        address: user.address,
        phoneNumber: user.phoneNumber,
        contractDate: user.contractDate || '',
        areaId: user.area?.id || undefined,
        roleId: user.roleId || ROLE_IDS.user, 
      })
    }
  }, [open, user, form])

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

  const onSubmit = async (data: UpdateUserFormData) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      await userService.updateUser(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          age: data.age,
          email: data.email,
          contractDate: data.contractDate || undefined,
          job_title: data.job_title,
          address: data.address,
          phoneNumber: data.phoneNumber,
          areaId: data.areaId,
          roleId: data.roleId, 
          status: user.status
        },
        user.id
      )

      toast.success('¡Usuario actualizado!', {
        description: 'Los cambios se han guardado correctamente'
      })

      form.reset()
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast.error('Error al actualizar usuario', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Usuario
          </DialogTitle>
          <DialogDescription>
            Actualiza la información del usuario
          </DialogDescription>
        </DialogHeader>

        {/* Alerta si no se puede editar el rol */}
        {currentUserRole && !canEditThisUserRole && (
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              No puedes cambiar el rol de este usuario. Solo puedes editar su información personal.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Pérez" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="juan@example.com" 
                        {...field} 
                        disabled={isSubmitting} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="25" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isSubmitting} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="987654321" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Formato: 9 dígitos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Contrato</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        disabled={isSubmitting} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="job_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puesto de Trabajo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Desarrollador Frontend" 
                      {...field} 
                      disabled={isSubmitting} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Av. Principal 123" 
                      {...field} 
                      disabled={isSubmitting} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="areaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CAMPO DE ROL CON PERMISOS DINÁMICOS */}
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Rol
                      {currentUserRole === UserRole.SUPER_ADMIN && (
                        <Shield className="h-3.5 w-3.5 text-purple-500" />
                      )}
                      {currentUserRole === UserRole.ADMIN && (
                        <Shield className="h-3.5 w-3.5 text-blue-500" />
                      )}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      disabled={isSubmitting || !canEditThisUserRole}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {canEditThisUserRole ? (
                          creatableRoles.map((role) => (
                            <SelectItem key={role} value={ROLE_IDS[role].toString()}>
                              <div className="flex items-center gap-2">
                                {role === UserRole.ADMIN && <Shield className="h-3.5 w-3.5 text-blue-500" />}
                                {role === UserRole.SUPER_ADMIN && <Shield className="h-3.5 w-3.5 text-purple-500" />}
                                <span>{ROLE_LABELS[role]}</span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value={field.value?.toString() || ''} disabled>
                            {currentUserRole && ROLE_LABELS[currentUserRole]}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      {!canEditThisUserRole 
                        ? "No tienes permisos para cambiar este rol" 
                        : isSuperAdmin() 
                          ? "Puedes asignar cualquier rol"
                          : "Solo puedes asignar roles User y Manager"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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