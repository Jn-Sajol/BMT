"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { AuthService } from "../../../services/auth.service"

const schema = z.object({
  email: z.string().email("Invalid email address"),
})

type Inputs = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Inputs) => {
    try {
      setError(null)
      await AuthService.forgotPassword(data)
      setSuccess(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">Reset password</h2>
        <p className="mt-2 text-sm text-muted-foreground">We'll send recovery links to your inbox</p>
      </div>

      {error && (
        <div className="rounded bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded bg-emerald-500/15 p-3 text-sm text-emerald-500">
          Recovery email sent successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email Address</label>
          <input
            type="email"
            {...register("email")}
            className="mt-1 block w-full rounded border px-3 py-2 text-sm bg-background"
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Send Recovery Link
        </button>
      </form>

      <div className="text-center text-sm">
        <button onClick={() => router.push("/auth/login")} className="font-semibold text-primary hover:underline">
          Return to Sign In
        </button>
      </div>
    </div>
  )
}
