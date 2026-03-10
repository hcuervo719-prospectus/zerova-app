import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('dashboard')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: relProfile } = await supabase
    .from('relational_profiles')
    .select('total_sessions, checkin_sessions, dominant_horsemen, skills_in_development')
    .eq('user_id', user.id)
    .single()

  const { data: streak } = await supabase
    .from('checkin_streaks')
    .select('current_streak, total_checkins')
    .eq('user_id', user.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0] || t('defaultName')
  const isTrialExpired =
    profile?.subscription_status === 'trial' &&
    new Date(profile.trial_ends_at) < new Date()

  const trialDaysLeft = profile?.subscription_status === 'trial'
    ? Math.max(0, Math.ceil(
        (new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ))
    : null

  async function handleLogout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect(`/${locale}/login`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-100 px-4">
        <div className="max-w-4xl mx-auto h-16 flex items-center justify-between">
          <span className="text-lg font-bold text-teal-700">Zerova</span>
          <form action={handleLogout}>
            <button type="submit" className="text-sm text-slate-400 hover:text-slate-600">
              {t('signout')}
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Trial banner */}
        {profile?.subscription_status === 'trial' && !isTrialExpired && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between">
            <p className="text-sm text-amber-800">
              <strong>{trialDaysLeft} {t('trialDays')}</strong> {t('trialLeft')}
            </p>
            <Link
              href={`/${locale}/subscribe`}
              className="text-sm bg-amber-500 text-white px-4 py-1.5 rounded-lg hover:bg-amber-600 transition"
            >
              {t('subscribe')} →
            </Link>
          </div>
        )}

        {/* Trial expired */}
        {isTrialExpired && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-center">
            <p className="text-red-800 font-semibold mb-2">{t('trialExpiredTitle')}</p>
            <p className="text-red-600 text-sm mb-3">{t('trialExpiredDesc')}</p>
            <Link
              href={`/${locale}/subscribe`}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold"
            >
              {t('subscribeButton')}
            </Link>
          </div>
        )}

        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('welcome', { name: firstName })}</h1>
          <p className="text-slate-500 mt-1">{t('subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
            <p className="text-3xl font-bold text-teal-600">{streak?.current_streak || 0}</p>
            <p className="text-sm text-slate-500 mt-1">{t('streak')}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
            <p className="text-3xl font-bold text-teal-600">{relProfile?.total_sessions || 0}</p>
            <p className="text-sm text-slate-500 mt-1">{t('sessions')}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
            <p className="text-3xl font-bold text-teal-600">{streak?.total_checkins || 0}</p>
            <p className="text-sm text-slate-500 mt-1">{t('checkins')}</p>
          </div>
        </div>

        {/* Start session */}
        <Link
          href={`/${locale}/dashboard/chat`}
          className="block bg-teal-600 hover:bg-teal-700 transition rounded-2xl p-6 text-white shadow-lg shadow-teal-200"
        >
          <p className="text-xl font-bold">{t('talkTitle')}</p>
          <p className="text-teal-100 mt-1 text-sm">{t('talkDesc')}</p>
          <p className="text-teal-200 text-2xl mt-3">→</p>
        </Link>

        {/* Modes */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { emoji: '🌊', label: t('modeSafeSpace'), desc: t('modeSafeSpaceDesc'), mode: 'safe_space' },
            { emoji: '🧭', label: t('modeCoach'), desc: t('modeCoachDesc'), mode: 'coach' },
            { emoji: '✨', label: t('modeCheckin'), desc: t('modeCheckinDesc'), mode: 'checkin' },
          ].map(m => (
            <Link
              key={m.mode}
              href={`/${locale}/dashboard/chat?mode=${m.mode}`}
              className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-teal-200 hover:shadow-sm transition"
            >
              <span className="text-2xl">{m.emoji}</span>
              <p className="font-semibold text-slate-900 mt-2">{m.label}</p>
              <p className="text-sm text-slate-400 mt-1">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
