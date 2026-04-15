// User login page
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/app/components/ehs/ui/button"
import { Input } from "@/app/components/ehs/ui/input"
import { Label } from "@/app/components/ehs/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ehs/ui/card"
import { login } from "@/app/lib/ehs-api"
import { setToken, setUserName } from "@/app/lib/ehs-auth"
import { useLanguage } from "@/app/components/ehs/language-provider"
import { LanguageToggle } from "@/app/components/ehs/language-toggle"
import { Logo } from "@/app/components/ehs/logo"

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await login({ email, password })
      setToken(response.access_token)
      setUserName(response.full_name)
      router.push("/ai-projects/verity-ehs")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <div className="flex flex-col items-center mb-8">
        <Logo variant="mark" className="h-16 w-16 mb-4" />
        <h1 className="text-2xl font-bold">
          <span className="text-stone-800">Verity</span>
          <span className="text-teal-700 ml-1">EHS</span>
        </h1>
      </div>
      <Card className="w-full max-w-md bg-white border border-stone-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-stone-800">{t.auth.signIn}</CardTitle>
          <CardDescription className="text-stone-500">{t.auth.enterCredentials}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-stone-700">{t.auth.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="min-h-[44px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-stone-700">{t.auth.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="min-h-[44px]"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full min-h-[44px] ehs-btn-primary" disabled={loading}>
              {loading ? t.auth.signingIn : t.auth.signIn}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-stone-500">
            {t.auth.noAccount}{" "}
            <Link href="/ai-projects/verity-ehs/register" className="text-teal-700 font-medium hover:text-teal-800 hover:underline">
              {t.auth.register}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
