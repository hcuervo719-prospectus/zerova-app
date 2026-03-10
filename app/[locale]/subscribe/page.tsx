'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

declare global {
  interface Window { Paddle: any }
}

const LAUNCH_DISCOUNT_ID = 'dsc_01kkd027qbb8914nkafnkm5hq7'

export default function SubscribePage() {
  const t = useTranslations('subscribe')
  const params = useParams()
  const locale = params.locale as string
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
    script.onload = () => {
      const env = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as string
      if (env === 'sandbox') window.Paddle.Environment.set('sandbox')
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
      const res = await fetch('/api/auth/me')
      const { userId } = await res.json()

      window.Paddle.Checkout.open({
        items: [{ priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID, quantity: 1 }],
        discountId: LAUNCH_DISCOUNT_ID,
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
            <p className="text-2xl font-bold text-slate-900">{t('title')}</p>
            <p className="text-slate-500 mt-2 text-sm">{t('subtitle')}</p>
          </div>

          {/* Price — launch offer */}
          <div className="bg-teal-50 rounded-xl p-6 text-center border border-teal-100 relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full">
              {t('badge')}
            </div>
            <p className="text-slate-400 line-through text-lg">$30</p>
            <p className="text-5xl font-bold text-teal-700">$15</p>
            <p className="text-teal-600 mt-1 text-sm">{t('perMonth')}</p>
            <p className="text-xs text-slate-500 mt-3 font-medium">{t('offerNote')}</p>
          </div>

          {/* Features */}
          <ul className="space-y-3">
            {(t.raw('features') as string[]).map((f: string) => (
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
            {loading ? t('loading') : t('button')}
          </button>

          <p className="text-center text-xs text-slate-400">{t('secure')}</p>
        </div>

        <div className="text-center mt-4">
          <Link href={`/${locale}/dashboard`} className="text-sm text-slate-400 hover:text-slate-600">
            ← {t('back')}
          </Link>
        </div>
      </div>
    </div>
  )
}
