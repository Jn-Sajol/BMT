"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { AuthService } from "../../../services/auth.service"

const schema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type Inputs = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Inputs) => {
    try {
      setError(null)
      await AuthService.resetPassword(data)
      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid or expired token.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">Confirm new password</h2>
        <p className="mt-2 text-sm text-muted-foreground">Type your new password below</p>
      </div>

      {error && (
        <div className="rounded bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded bg-emerald-500/15 p-3 text-sm text-emerald-500">
          Password updated successfully. Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Reset Token</label>
          <input
            type="text"
            {...register("token")}
            className="mt-1 block w-full rounded border px-3 py-2 text-sm bg-background"
          />
          {errors.token && <p className="mt-1 text-xs text-destructive">{errors.token.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            {...register("password")}
            className="mt-1 block w-full rounded border px-3 py-2 text-sm bg-background"
          />
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Reset Password
        </button>
      </form>
    </div>
  )
}
