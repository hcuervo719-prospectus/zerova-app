'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const FRICTION_AREAS = {
  es: ['Comunicación', 'Confianza', 'Intimidad', 'Finanzas', 'Crianza', 'Tiempo juntos', 'Familia extendida', 'Metas de vida'],
  en: ['Communication', 'Trust', 'Intimacy', 'Finances', 'Parenting', 'Time together', 'Extended family', 'Life goals'],
}

const MODES = {
  es: { safe_space: 'Espacio Seguro', coach: 'Coach', checkin: 'Check-in' },
  en: { safe_space: 'Safe Space', coach: 'Coach', checkin: 'Check-in' },
}

const T = {
  es: {
    title: 'Tu opinión importa',
    subtitle: 'Ayúdanos a hacer Zerova mejor. Este formulario es completamente anónimo — tus conversaciones permanecen privadas.',
    section1: 'Tu experiencia hoy',
    ratingLabel: '¿Cómo fue tu sesión con Zerova?',
    ratings: ['Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente'],
    section2: 'Cuéntanos más',
    q_useful: '¿Qué fue lo más útil de esta conversación?',
    q_improve: '¿Hay algo que Zerova podría haber hecho mejor?',
    placeholder_useful: 'Lo que más me ayudó fue...',
    placeholder_improve: 'Hubiera sido mejor si...',
    section3: 'Sobre el producto',
    q_mode: '¿Qué modo usaste más en esta sesión?',
    q_recommend: '¿Recomendarías Zerova a alguien?',
    recommend_yes: 'Sí, sin duda',
    recommend_maybe: 'Tal vez',
    recommend_no: 'Todavía no',
    q_develop: '¿Qué área te gustaría que Zerova desarrollara más?',
    select_area: 'Selecciona una área...',
    section4: 'Seguimiento opcional',
    q_email: 'Si quieres que te contactemos, déjanos tu email',
    placeholder_email: 'tu@email.com',
    email_note: 'Solo te contactaremos si tienes algo específico que quieras compartir.',
    submit: 'Enviar feedback',
    submitting: 'Enviando...',
    success_title: '¡Gracias por tu feedback!',
    success_msg: 'Tu opinión nos ayuda a mejorar Zerova para todos. Apreciamos mucho que te hayas tomado el tiempo.',
    back: 'Volver al dashboard',
    back_home: 'Volver al inicio',
    required_rating: 'Por favor selecciona una calificación antes de enviar.',
  },
  en: {
    title: 'Your opinion matters',
    subtitle: 'Help us make Zerova better. This form is completely anonymous — your conversations remain private.',
    section1: 'Your experience today',
    ratingLabel: 'How was your session with Zerova?',
    ratings: ['Very bad', 'Bad', 'OK', 'Good', 'Excellent'],
    section2: 'Tell us more',
    q_useful: 'What was most useful about this conversation?',
    q_improve: 'Is there anything Zerova could have done better?',
    placeholder_useful: 'What helped me most was...',
    placeholder_improve: 'It would have been better if...',
    section3: 'About the product',
    q_mode: 'Which mode did you use most in this session?',
    q_recommend: 'Would you recommend Zerova to someone?',
    recommend_yes: 'Yes, definitely',
    recommend_maybe: 'Maybe',
    recommend_no: 'Not yet',
    q_develop: 'Which area would you like Zerova to develop more?',
    select_area: 'Select an area...',
    section4: 'Optional follow-up',
    q_email: 'If you want us to reach out, leave your email',
    placeholder_email: 'your@email.com',
    email_note: 'We will only contact you if you have something specific to share.',
    submit: 'Submit feedback',
    submitting: 'Submitting...',
    success_title: 'Thank you for your feedback!',
    success_msg: 'Your input helps us improve Zerova for everyone. We really appreciate you taking the time.',
    back: 'Back to dashboard',
    back_home: 'Back to home',
    required_rating: 'Please select a rating before submitting.',
  },
}

export default function FeedbackPage() {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as string) in T ? (params.locale as string) : 'en'
  const t = T[locale as keyof typeof T]
  const areas = FRICTION_AREAS[locale as keyof typeof FRICTION_AREAS] || FRICTION_AREAS.en
  const modes = MODES[locale as keyof typeof MODES] || MODES.en

  const [rating, setRating] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [usefulText, setUsefulText] = useState('')
  const [improveText, setImproveText] = useState('')
  const [mode, setMode] = useState('')
  const [recommend, setRecommend] = useState('')
  const [developArea, setDevelopArea] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const emojis = ['😞', '😕', '😐', '🙂', '😊']

  async function handleSubmit() {
    if (!rating) {
      setError(t.required_rating)
      return
    }
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      await supabase.from('feedback').insert({
        user_id: user?.id || null,
        locale,
        rating,
        useful_text: usefulText || null,
        improve_text: improveText || null,
        mode_used: mode || null,
        would_recommend: recommend || null,
        develop_area: developArea || null,
        contact_email: email || null,
      })

      setSubmitted(true)
    } catch (err) {
      console.error('Feedback error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">🙏</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">{t.success_title}</h1>
          <p className="text-slate-500 mb-8">{t.success_msg}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}/dashboard`}
              className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition text-sm font-semibold"
            >
              {t.back}
            </Link>
            <Link
              href={`/${locale}`}
              className="border border-slate-200 text-slate-600 px-6 py-3 rounded-xl hover:bg-slate-50 transition text-sm"
            >
              {t.back_home}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-100 px-4">
        <div className="max-w-2xl mx-auto h-16 flex items-center justify-between">
          <Link href={`/${locale}/dashboard`} className="text-slate-400 hover:text-slate-600 text-sm">
            ← {t.back}
          </Link>
          <span className="text-lg font-bold text-teal-700">Zerova</span>
          <div className="w-16" />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.title}</h1>
          <p className="text-slate-500 text-sm">{t.subtitle}</p>
        </div>

        {/* Section 1 — Rating */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-1">{t.section1}</h2>
          <p className="text-sm text-slate-500 mb-5">{t.ratingLabel}</p>
          <div className="flex justify-between gap-2">
            {emojis.map((emoji, i) => {
              const val = i + 1
              const isSelected = rating === val
              const isHovered = hovered === val
              return (
                <button
                  key={val}
                  onClick={() => setRating(val)}
                  onMouseEnter={() => setHovered(val)}
                  onMouseLeave={() => setHovered(null)}
                  className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition
                    ${isSelected
                      ? 'border-teal-500 bg-teal-50'
                      : isHovered
                        ? 'border-slate-200 bg-slate-50'
                        : 'border-slate-100'
                    }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs text-slate-500 hidden sm:block">{t.ratings[i]}</span>
                </button>
              )
            })}
          </div>
          {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
        </div>

        {/* Section 2 — Qualitative */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
          <h2 className="text-base font-semibold text-slate-900">{t.section2}</h2>
          <div>
            <label className="text-sm text-slate-700 font-medium block mb-2">{t.q_useful}</label>
            <textarea
              value={usefulText}
              onChange={e => setUsefulText(e.target.value)}
              placeholder={t.placeholder_useful}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-sm text-slate-700 font-medium block mb-2">{t.q_improve}</label>
            <textarea
              value={improveText}
              onChange={e => setImproveText(e.target.value)}
              placeholder={t.placeholder_improve}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>

        {/* Section 3 — Product */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
          <h2 className="text-base font-semibold text-slate-900">{t.section3}</h2>

          {/* Mode used */}
          <div>
            <label className="text-sm text-slate-700 font-medium block mb-3">{t.q_mode}</label>
            <div className="flex gap-3">
              {Object.entries(modes).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition
                    ${mode === key
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-slate-100 text-slate-600 hover:border-slate-200'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Recommend */}
          <div>
            <label className="text-sm text-slate-700 font-medium block mb-3">{t.q_recommend}</label>
            <div className="flex gap-3">
              {[
                { key: 'yes', label: t.recommend_yes },
                { key: 'maybe', label: t.recommend_maybe },
                { key: 'no', label: t.recommend_no },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setRecommend(opt.key)}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition
                    ${recommend === opt.key
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-slate-100 text-slate-600 hover:border-slate-200'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Develop area */}
          <div>
            <label className="text-sm text-slate-700 font-medium block mb-2">{t.q_develop}</label>
            <select
              value={developArea}
              onChange={e => setDevelopArea(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">{t.select_area}</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 4 — Optional email */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-1">{t.section4}</h2>
          <p className="text-xs text-slate-400 mb-4">{t.email_note}</p>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t.placeholder_email}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold text-base hover:bg-teal-700 transition disabled:opacity-50"
        >
          {loading ? t.submitting : t.submit}
        </button>

        <p className="text-center text-xs text-slate-300 pb-8">
          Zerova · VividShift
        </p>
      </div>
    </div>
  )
}
