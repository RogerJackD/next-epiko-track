'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TokenService } from '@/services/auth/tokens';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Check, Loader2, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { userService } from '@/services/user-service';
import { ChangePasswordFormData, changePasswordSchema } from '@/validators/change-password.schema';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watch('newPassword');

  const passwordRequirements = [
    { label: 'Al menos 8 caracteres', test: (pwd: string) => pwd?.length >= 8 },
    { label: 'Una letra mayúscula', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'Una letra minúscula', test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: 'Un número', test: (pwd: string) => /[0-9]/.test(pwd) },
    { label: 'Un carácter especial', test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd) },
  ];

  const handleClose = () => {
    reset();
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onOpenChange(false);
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);

    try {
      const userData = TokenService.getUserData();
      if (!userData?.id) {
        throw new Error('No se pudo obtener información del usuario');
      }

      await userService.changePasswordUser(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        userData.id
      );

      toast.success('¡Contraseña actualizada!', {
        description: 'Tu contraseña ha sido cambiada exitosamente',
        duration: 4000,
      });

      handleClose();
    } catch (error: any) {
      // Verificar si es error de contraseña incorrecta
      if (error.message.toLowerCase().includes('incorrecta') || 
          error.message.toLowerCase().includes('incorrect') ||
          error.message.toLowerCase().includes('invalid')) {
        toast.error('Contraseña incorrecta', {
          description: 'La contraseña actual no es válida',
          duration: 4000,
        });
      } else {
        toast.error('Error al cambiar contraseña', {
          description: error.message || 'Ocurrió un error inesperado',
          duration: 4000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">Cambiar Contraseña</DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Actualiza tu contraseña de forma segura
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {/* Alert informativo */}
          <Alert className="bg-blue-50 border-blue-200">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              Por seguridad, necesitamos verificar tu contraseña actual
            </AlertDescription>
          </Alert>

          {/* Contraseña actual */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-semibold">
              Contraseña Actual
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña actual"
                {...register('currentPassword')}
                className={`pr-10 ${errors.currentPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                tabIndex={-1}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* Separador visual */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 font-medium">Nueva contraseña</span>
            </div>
          </div>

          {/* Nueva contraseña */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-semibold">
              Nueva Contraseña
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Crea tu nueva contraseña"
                {...register('newPassword')}
                className={`pr-10 ${errors.newPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Indicador de requisitos de contraseña */}
          {newPassword && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
              <p className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Requisitos de seguridad
              </p>
              <div className="grid grid-cols-1 gap-2">
                {passwordRequirements.map((req, index) => {
                  const isPassed = req.test(newPassword);
                  return (
                    <div key={index} className="flex items-center gap-2.5 text-xs">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isPassed ? 'bg-green-500 scale-100' : 'bg-gray-300 scale-95'
                      }`}>
                        <Check className={`w-3 h-3 transition-all ${
                          isPassed ? 'text-white' : 'text-transparent'
                        }`} />
                      </div>
                      <span className={`transition-colors font-medium ${
                        isPassed ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Confirmar contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold">
              Confirmar Nueva Contraseña
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirma tu nueva contraseña"
                {...register('confirmPassword')}
                className={`pr-10 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Cambiar Contraseña
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}