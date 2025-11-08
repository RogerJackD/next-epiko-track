// validators/user.validator.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  firstName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim(),
  lastName: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .trim(),
  age: z.number({
    required_error: 'La edad es requerida',
    invalid_type_error: 'La edad debe ser un número'
  })
    .min(18, 'La edad mínima es 18 años')
    .max(100, 'La edad máxima es 100 años'),
  email: z.string()
    .email('Ingrese un email válido')
    .trim()
    .toLowerCase(),
  contractDate: z.string().optional(),
  job_title: z.string()
    .min(2, 'El puesto debe tener al menos 2 caracteres')
    .max(100, 'El puesto no puede exceder 100 caracteres')
    .trim(),
  address: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .trim(),
  phoneNumber: z.string()
    .regex(/^9\d{8}$/, 'El teléfono debe comenzar con 9 y tener 9 dígitos')
    .trim(),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'La contraseña debe tener una mayúscula, una minúscula y un número'
    ),
  areaId: z.number({
    required_error: 'Debe seleccionar un área',
    invalid_type_error: 'Debe seleccionar un área válida'
  })
    .positive('Debe seleccionar un área válida')
})

export const updateUserSchema = z.object({
  firstName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim(),
  lastName: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .trim(),
  age: z.number({
    required_error: 'La edad es requerida',
    invalid_type_error: 'La edad debe ser un número'
  })
    .min(18, 'La edad mínima es 18 años')
    .max(100, 'La edad máxima es 100 años'),
  email: z.string()
    .email('Ingrese un email válido')
    .trim()
    .toLowerCase(),
  contractDate: z.string().optional(),
  job_title: z.string()
    .min(2, 'El puesto debe tener al menos 2 caracteres')
    .max(100, 'El puesto no puede exceder 100 caracteres')
    .trim(),
  address: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .trim(),
  phoneNumber: z.string()
    .regex(/^9\d{8}$/, 'El teléfono debe comenzar con 9 y tener 9 dígitos')
    .trim(),
  areaId: z.number({
    required_error: 'Debe seleccionar un área',
    invalid_type_error: 'Debe seleccionar un área válida'
  })
    .positive('Debe seleccionar un área válida')
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>