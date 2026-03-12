import type { Metadata } from 'next'
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: 'Zerova — Inteligencia para amar mejor',
  description: 'Asistente de inteligencia relacional basado en la metodología Gottman. Disponible 24/7 en 16 idiomas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-S01WR4EDDE" />
      </body>
    </html>
  )
}
