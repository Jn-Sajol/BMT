"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../hooks/useAuth"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterFormInputs = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const { register: registerField, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      setError(null)
      await registerUser(data)
      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed. Try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">Create your account</h2>
        <p className="mt-2 text-sm text-muted-foreground">Join the BMT Marketing Operating System</p>
      </div>

      {error && (
        <div className="rounded bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded bg-emerald-500/15 p-3 text-sm text-emerald-500">
          Account created successfully! Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            {...registerField("name")}
            className="mt-1 block w-full rounded border px-3 py-2 text-sm bg-background"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Email Address</label>
          <input
            type="email"
            {...registerField("email")}
            className="mt-1 block w-full rounded border px-3 py-2 text-sm bg-background"
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...registerField("password")}
            className="mt-1 block w-full rounded border px-3 py-2 text-sm bg-background"
          />
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isRegistering}
          className="w-full rounded bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isRegistering ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <button onClick={() => router.push("/auth/login")} className="font-semibold text-primary hover:underline">
          Sign In
        </button>
      </div>
    </div>
  )
}
