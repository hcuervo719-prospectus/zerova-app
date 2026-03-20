'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function LandingPage() {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/icon.jpg"
              alt="Zerova"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-teal-700">Zerova</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/login`}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              {t('nav.login')}
            </Link>
            <Link
              href={`/${locale}/signup`}
              className="text-sm bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              {t('nav.signup')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">

            {/* Left — Text */}
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-teal-600 mb-4 uppercase tracking-wide">
                {t('hero.badge')}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {t('hero.headline')}
                <span className="text-slate-500 block mt-2 font-normal text-3xl">{t('hero.headlineAccent')}</span>
                <span className="text-teal-600 block mt-2">{t('hero.headlineLine3')}</span>
              </h1>
              <p className="text-lg text-slate-500 mb-8 max-w-lg">
                {t('hero.subheadline')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/${locale}/signup`}
                  className="bg-teal-600 text-white text-lg font-semibold px-8 py-4 rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-200 text-center"
                >
                  {t('hero.cta')}
                </Link>
                <Link
                  href="#how"
                  className="border border-slate-200 text-slate-700 text-lg px-8 py-4 rounded-xl hover:bg-slate-50 transition text-center"
                >
                  {t('hero.ctaSecondary')}
                </Link>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-600">{t('hero.trial')}</p>
              <p className="mt-1 text-xs text-slate-400">{t('hero.trialNote')}</p>
            </div>

            {/* Right — Sophia */}
            <div className="relative hidden md:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero-image.webp"
                  alt="Zerova"
                  width={600}
                  height={700}
                  className="w-full object-cover"
                  priority
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg">
                  <p className="text-sm font-semibold text-slate-900 mb-1">Zerova</p>
                  <p className="text-xs text-slate-500">{t('hero.cardDesc')}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-teal-600 font-medium">{t('hero.available')}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Three modes */}
      <section id="how" className="py-20 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            {t('modes.title')}
          </h2>
          <p className="text-center text-slate-500 mb-12">{t('modes.subtitle')}</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-4 text-2xl">🌊</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('modes.safeSpace.title')}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{t('modes.safeSpace.desc')}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-teal-100 ring-2 ring-teal-500/20">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 text-2xl">🧭</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('modes.coach.title')}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{t('modes.coach.desc')}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-2xl">✨</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('modes.checkin.title')}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{t('modes.checkin.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Science + Social proof */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('science.title')}</h2>
          <p className="text-slate-500 mb-10">{t('science.subtitle')}</p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <p className="text-4xl font-bold text-teal-600 mb-2">94%</p>
              <p className="text-slate-600 text-sm">{t('science.stat1')}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-600 mb-2">40+</p>
              <p className="text-slate-600 text-sm">{t('science.stat2')}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-600 mb-2">3</p>
              <p className="text-slate-600 text-sm">{t('science.stat3')}</p>
            </div>
          </div>

          {/* Social proof — Gottman based */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
            <p className="text-lg text-slate-700 italic mb-4">"{t('science.quote')}"</p>
            <p className="text-sm text-slate-400 font-medium">{t('science.quoteSource')}</p>
          </div>
        </div>
      </section>

      {/* Urgency */}
      <section className="py-20 bg-slate-900 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-10">{t('urgency.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-slate-800 rounded-2xl p-6">
              <p className="text-3xl font-bold text-red-400 mb-2">6</p>
              <p className="text-slate-300 text-sm">{t('urgency.stat1')}</p>
            </div>
            <div className="bg-slate-800 rounded-2xl p-6">
              <p className="text-3xl font-bold text-red-400 mb-2">50%</p>
              <p className="text-slate-300 text-sm">{t('urgency.stat2')}</p>
            </div>
            <div className="bg-slate-800 rounded-2xl p-6">
              <p className="text-3xl font-bold text-teal-400 mb-2">24/7</p>
              <p className="text-slate-300 text-sm">{t('urgency.stat3')}</p>
            </div>
          </div>
          <p className="text-slate-300 mb-8 text-lg">{t('urgency.message')}</p>
          <Link
            href={`/${locale}/signup`}
            className="bg-teal-500 text-white text-lg font-bold px-10 py-4 rounded-xl hover:bg-teal-400 transition inline-block"
          >
            {t('urgency.cta')}
          </Link>
          <p className="mt-4 text-slate-400 text-sm">{t('hero.trial')}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-teal-600 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-teal-100 mb-8">{t('cta.subtitle')}</p>
          <Link
            href={`/${locale}/signup`}
            className="bg-white text-teal-700 text-lg font-bold px-10 py-4 rounded-xl hover:bg-teal-50 transition inline-block"
          >
            {t('cta.button')}
          </Link>
          <p className="mt-4 text-teal-200 text-sm">{t('cta.trial')}</p>
          <p className="mt-1 text-teal-300 text-xs">{t('hero.trialNote')}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-slate-400 text-sm">{t('footer.copyright')}</span>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href={`/${locale}/privacy`} className="hover:text-slate-600">Privacy</Link>
            <Link href={`/${locale}/terms`} className="hover:text-slate-600">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
