"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from "@/validators/login.validator"



type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error("Credenciales incorrectas")
      }

      router.push("/dashboard")
    } catch (error) {
      setError("root", { message: "Correo o contraseña incorrectos" })
      console.log(error)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-[380px] shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold tracking-tight text-gray-800">
            Bienvenido a <span className="text-primary">KanbanEpiko</span>
          </CardTitle>
          <p className="text-center text-sm text-gray-500 mt-2">
            Inicia sesión para acceder a tu panel
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="mb-2">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tuemail@correo.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="mb-2">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Error general */}
            {errors.root && (
              <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.root.message}</span>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Iniciando...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
