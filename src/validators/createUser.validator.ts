import { z } from "zod";

export const TaskFormSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio" }),
  description: z.string().optional().nullable(),
  startDate: z
    .string()
    .refine((s) => !Number.isNaN(Date.parse(s)), { message: "startDate debe ser una fecha válida (ISO)" }),
  dueDate: z
    .string()
    .refine((s) => !Number.isNaN(Date.parse(s)), { message: "dueDate debe ser una fecha válida (ISO)" }),
  priority: z.enum(["BAJA", "MEDIA", "ALTA"]),
  userIds: z.array(z.string().uuid({ message: "Cada userId debe ser un UUID válido" })).optional(),
})
.refine((data) => {
  const start = Date.parse(data.startDate);
  const due = Date.parse(data.dueDate);
  return !Number.isNaN(start) && !Number.isNaN(due) && due >= start;
}, {
  message: "dueDate debe ser igual o posterior a startDate",
  path: ["dueDate"],
});
