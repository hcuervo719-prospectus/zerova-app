'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function OnboardingPage() {
  const t = useTranslations('onboarding')
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [usageMode, setUsageMode] = useState<'solo' | 'couple' | ''>('')
  const [relationshipDuration, setRelationshipDuration] = useState('')
  const [relationshipStatus, setRelationshipStatus] = useState('')
  const [primaryFrictionArea, setPrimaryFrictionArea] = useState('')

  async function handleFinish() {
    setLoading(true)
    await fetch('/api/zerova/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usageMode,
        relationshipDuration,
        relationshipStatus,
        primaryFrictionArea,
      }),
    })
    router.push(`/${locale}/dashboard`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700">Zerova</h1>
          <p className="mt-2 text-slate-500">{t('subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step indicator */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-teal-500' : 'bg-slate-100'
                }`}
              />
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">{t('step1.title')}</h2>
              <p className="text-slate-500 text-sm">{t('step1.desc')}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'solo', label: t('step1.solo'), emoji: '🧍', desc: t('step1.soloDesc') },
                  { value: 'couple', label: t('step1.couple'), emoji: '👫', desc: t('step1.coupleDesc') },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setUsageMode(opt.value as 'solo' | 'couple')}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      usageMode === opt.value
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-slate-200 hover:border-teal-200'
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <p className="font-semibold text-slate-900 mt-2">{opt.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
              <button
                disabled={!usageMode}
                onClick={() => setStep(2)}
                className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition disabled:opacity-40 mt-2"
              >
                {t('continue')}
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">{t('step2.title')}</h2>
              <div className="grid grid-cols-2 gap-3">
                {(['opt1','opt2','opt3','opt4','opt5','opt6'] as const).map(key => (
                  <button
                    key={key}
                    onClick={() => setRelationshipDuration(t(`step2.${key}`))}
                    className={`p-3 rounded-xl border-2 text-sm text-left transition ${
                      relationshipDuration === t(`step2.${key}`)
                        ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
                        : 'border-slate-200 text-slate-600 hover:border-teal-200'
                    }`}
                  >
                    {t(`step2.${key}`)}
                  </button>
                ))}
              </div>
              <button
                disabled={!relationshipDuration}
                onClick={() => setStep(3)}
                className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition disabled:opacity-40"
              >
                {t('continue')}
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">{t('step3.title')}</h2>
              <div className="space-y-3">
                {[
                  { value: 'stable', label: t('step3.stable'), desc: t('step3.stableDesc') },
                  { value: 'tension', label: t('step3.tension'), desc: t('step3.tensionDesc') },
                  { value: 'crisis', label: t('step3.crisis'), desc: t('step3.crisisDesc') },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setRelationshipStatus(opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      relationshipStatus === opt.value
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-slate-200 hover:border-teal-200'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{opt.label}</p>
                    <p className="text-sm text-slate-500 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
              <button
                disabled={!relationshipStatus}
                onClick={() => setStep(4)}
                className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition disabled:opacity-40"
              >
                {t('continue')}
              </button>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">{t('step4.title')}</h2>
              <p className="text-slate-500 text-sm">{t('step4.desc')}</p>
              <div className="grid grid-cols-2 gap-2">
                {(['opt1','opt2','opt3','opt4','opt5','opt6','opt7','opt8'] as const).map(key => (
                  <button
                    key={key}
                    onClick={() => setPrimaryFrictionArea(t(`step4.${key}`))}
                    className={`p-3 rounded-xl border-2 text-sm transition ${
                      primaryFrictionArea === t(`step4.${key}`)
                        ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
                        : 'border-slate-200 text-slate-600 hover:border-teal-200'
                    }`}
                  >
                    {t(`step4.${key}`)}
                  </button>
                ))}
              </div>
              <button
                disabled={!primaryFrictionArea || loading}
                onClick={handleFinish}
                className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition disabled:opacity-40"
              >
                {loading ? t('step4.loading') : t('step4.button')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
