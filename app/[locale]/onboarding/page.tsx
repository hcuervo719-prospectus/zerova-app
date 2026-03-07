'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

const FRICTION_OPTIONS = [
  'Communication', 'Trust', 'Intimacy', 'Finances',
  'Parenting', 'Time together', 'Extended family', 'Life goals',
]

export default function OnboardingPage() {
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
          <p className="mt-2 text-slate-500">
            Help us personalize your experience
          </p>
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

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">How will you use Zerova?</h2>
              <p className="text-slate-500 text-sm">This shapes how the assistant responds to you.</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'solo', label: 'On my own', emoji: '🧍', desc: 'I want to work on myself and my relationship skills' },
                  { value: 'couple', label: 'As a couple', emoji: '👫', desc: 'My partner and I will use it together' },
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
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">How long have you been together?</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Less than 1 year', '1–3 years',
                  '3–7 years', '7–15 years',
                  '15+ years', 'Not in a relationship yet',
                ].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setRelationshipDuration(opt)}
                    className={`p-3 rounded-xl border-2 text-sm text-left transition ${
                      relationshipDuration === opt
                        ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
                        : 'border-slate-200 text-slate-600 hover:border-teal-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button
                disabled={!relationshipDuration}
                onClick={() => setStep(3)}
                className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition disabled:opacity-40"
              >
                Continue →
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">How would you describe things right now?</h2>
              <div className="space-y-3">
                {[
                  { value: 'stable', label: '🌱 Stable', desc: 'Things are mostly good — I want to keep growing' },
                  { value: 'tension', label: '⚡ Some tension', desc: 'We have recurring friction but we\'re managing' },
                  { value: 'crisis', label: '🌊 In crisis', desc: 'Things are difficult and we need real help' },
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
                Continue →
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">What's the main area you want to work on?</h2>
              <p className="text-slate-500 text-sm">Choose the one that feels most relevant right now.</p>
              <div className="grid grid-cols-2 gap-2">
                {FRICTION_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setPrimaryFrictionArea(opt)}
                    className={`p-3 rounded-xl border-2 text-sm transition ${
                      primaryFrictionArea === opt
                        ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
                        : 'border-slate-200 text-slate-600 hover:border-teal-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button
                disabled={!primaryFrictionArea || loading}
                onClick={handleFinish}
                className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition disabled:opacity-40"
              >
                {loading ? 'Setting up...' : 'Start my journey →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
