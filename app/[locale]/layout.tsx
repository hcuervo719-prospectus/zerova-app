import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

const RTL_LOCALES = ['ar']

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages({ locale })

  const isRTL = RTL_LOCALES.includes(locale)

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div dir={isRTL ? 'rtl' : 'ltr'} lang={locale}>
        {children}
      </div>
    </NextIntlClientProvider>
  )
}
