import type { Metadata } from "next"
import "./ehs.css"
import { AuthGuard } from "@/app/components/ehs/auth-guard"
import { LanguageProvider } from "@/app/components/ehs/language-provider"

export const metadata: Metadata = {
  title: "Verity EHS",
  description: "AI-powered EHS compliance platform for the chemical industry",
}

export default function VerityEhsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ehs-route">
      <LanguageProvider>
        <AuthGuard>{children}</AuthGuard>
      </LanguageProvider>
    </div>
  )
}
