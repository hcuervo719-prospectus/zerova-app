'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

declare global {
  interface Window {
    Paddle: any
  }
}

export default function SubscribePage() {
  const params = useParams()
  const locale = params.locale as string
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load Paddle.js
    const script = document.createElement('script')
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
    script.onload = () => {
      const env = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as string
      if (env === 'sandbox') {
        window.Paddle.Environment.set('sandbox')
      }
      window.Paddle.Initialize({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      })
    }
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  async function handleSubscribe() {
    setLoading(true)
    try {
      // Get current user id for custom_data
      const res = await fetch('/api/auth/me')
      const { userId } = await res.json()

      window.Paddle.Checkout.open({
        items: [{ priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID, quantity: 1 }],
        customData: { userId },
        successUrl: `${window.location.origin}/${locale}/dashboard?subscribed=true`,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700">Zerova</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">Continue your journey</p>
            <p className="text-slate-500 mt-2 text-sm">Your trial has ended. Subscribe to keep building.</p>
          </div>

          {/* Price */}
          <div className="bg-teal-50 rounded-xl p-6 text-center border border-teal-100">
            <p className="text-5xl font-bold text-teal-700">$30</p>
            <p className="text-teal-600 mt-1">per month</p>
            <p className="text-sm text-teal-500 mt-2">Cancel anytime</p>
          </div>

          {/* Features */}
          <ul className="space-y-3">
            {[
              'Unlimited Safe Space sessions',
              'Full Coach mode with skill tracking',
              'Daily check-ins and streak system',
              'Cumulative Relational Profile',
              'Science-based Gottman methodology',
              '16 languages',
            ].map(f => (
              <li key={f} className="flex items-center gap-3 text-sm text-slate-700">
                <span className="text-teal-500 font-bold">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition disabled:opacity-50 text-lg"
          >
            {loading ? 'Opening checkout...' : 'Subscribe Now'}
          </button>

          <p className="text-center text-xs text-slate-400">
            Secure payment via Paddle
          </p>
        </div>

        <div className="text-center mt-4">
          <Link href={`/${locale}/dashboard`} className="text-sm text-slate-400 hover:text-slate-600">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
