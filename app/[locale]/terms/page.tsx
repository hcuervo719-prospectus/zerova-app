import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const isES = locale === 'es'

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100 px-4">
        <div className="max-w-3xl mx-auto h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-xl font-bold text-teal-700">
            Zerova
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {isES ? (
          <>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Términos de Servicio</h1>
            <p className="text-slate-400 text-sm mb-10">Última actualización: marzo 2026</p>

            <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Aceptación de términos</h2>
                <p>Al usar Zerova, aceptas estos términos. Si no los aceptas, por favor no uses el servicio. Zerova es operado por VividShift (Henry Murillo) desde Colombia.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Descripción del servicio</h2>
                <p>Zerova es un asistente de inteligencia relacional basado en IA. Proporciona orientación y herramientas inspiradas en la metodología Gottman para apoyar el bienestar relacional.</p>
                <p className="mt-3"><strong>Zerova no es un servicio de salud mental, terapia, ni consejería profesional.</strong> No reemplaza la atención de un profesional de salud mental licenciado. Si estás en una situación de crisis, por favor contacta a un profesional o línea de crisis en tu país.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Elegibilidad</h2>
                <p>Debes tener al menos 18 años para usar Zerova. Al registrarte, confirmas que cumples con este requisito.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Tu cuenta</h2>
                <p>Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta. Notifícanos inmediatamente si sospechas uso no autorizado.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Suscripción y pagos</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Zerova ofrece un período de prueba gratuito de 7 días.</li>
                  <li>Después del período de prueba, la suscripción se cobra mensualmente a través de Paddle.</li>
                  <li>Puedes cancelar en cualquier momento desde tu cuenta. La cancelación es efectiva al final del período de facturación actual.</li>
                  <li>No realizamos reembolsos por períodos parciales, salvo donde lo exija la ley aplicable.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Uso aceptable</h2>
                <p>Al usar Zerova, te comprometes a no:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Usar el servicio para actividades ilegales.</li>
                  <li>Intentar acceder a datos de otros usuarios.</li>
                  <li>Compartir tu cuenta con terceros.</li>
                  <li>Usar el servicio de forma que pueda dañar, deshabilitar o sobrecargar la plataforma.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Propiedad intelectual</h2>
                <p>El contenido, diseño y código de Zerova son propiedad de VividShift. Tus conversaciones y datos personales son tuyos — nos otorgas una licencia limitada para procesarlos con el único propósito de prestarte el servicio.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Limitación de responsabilidad</h2>
                <p>Zerova se proporciona "tal como está". No garantizamos resultados específicos en tu relación. En la máxima medida permitida por la ley, nuestra responsabilidad total no excederá el importe pagado por ti en los 3 meses anteriores al evento que dio lugar al reclamo.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Modificaciones al servicio</h2>
                <p>Nos reservamos el derecho de modificar o discontinuar el servicio con un aviso previo razonable. En caso de discontinuación, reembolsaremos el tiempo prepagado no utilizado.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">10. Cambios a estos términos</h2>
                <p>Te notificaremos por correo electrónico con al menos 15 días de anticipación antes de que los cambios entren en vigor. El uso continuado del servicio implica la aceptación de los nuevos términos.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">11. Contacto</h2>
                <p>Para cualquier pregunta sobre estos términos: <a href="mailto:contact@zerova.app" className="text-teal-600">contact@zerova.app</a></p>
              </section>

            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
            <p className="text-slate-400 text-sm mb-10">Last updated: March 2026</p>

            <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Acceptance of terms</h2>
                <p>By using Zerova, you accept these terms. If you do not accept them, please do not use the service. Zerova is operated by VividShift (Henry Murillo) from Colombia.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Description of service</h2>
                <p>Zerova is an AI-based relational intelligence assistant. It provides guidance and tools inspired by the Gottman methodology to support relational wellbeing.</p>
                <p className="mt-3"><strong>Zerova is not a mental health service, therapy, or professional counseling.</strong> It does not replace the care of a licensed mental health professional. If you are in a crisis situation, please contact a professional or crisis line in your country.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Eligibility</h2>
                <p>You must be at least 18 years old to use Zerova. By registering, you confirm that you meet this requirement.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Your account</h2>
                <p>You are responsible for maintaining the confidentiality of your password and all activities that occur under your account. Notify us immediately if you suspect unauthorized use.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Subscription and payments</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Zerova offers a 7-day free trial period.</li>
                  <li>After the trial period, the subscription is billed monthly through Paddle.</li>
                  <li>You can cancel at any time from your account. Cancellation is effective at the end of the current billing period.</li>
                  <li>We do not issue refunds for partial periods, except where required by applicable law.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Acceptable use</h2>
                <p>By using Zerova, you agree not to:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Use the service for illegal activities.</li>
                  <li>Attempt to access other users' data.</li>
                  <li>Share your account with third parties.</li>
                  <li>Use the service in a way that could damage, disable or overload the platform.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Intellectual property</h2>
                <p>The content, design and code of Zerova are the property of VividShift. Your conversations and personal data are yours — you grant us a limited license to process them for the sole purpose of providing the service.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Limitation of liability</h2>
                <p>Zerova is provided "as is". We do not guarantee specific results in your relationship. To the maximum extent permitted by law, our total liability shall not exceed the amount paid by you in the 3 months prior to the event giving rise to the claim.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Service modifications</h2>
                <p>We reserve the right to modify or discontinue the service with reasonable prior notice. In the event of discontinuation, we will refund any unused prepaid time.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">10. Changes to these terms</h2>
                <p>We will notify you by email at least 15 days before changes take effect. Continued use of the service implies acceptance of the new terms.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">11. Contact</h2>
                <p>For any questions about these terms: <a href="mailto:contact@zerova.app" className="text-teal-600">contact@zerova.app</a></p>
              </section>

            </div>
          </>
        )}

        <div className="mt-12 pt-8 border-t border-slate-100">
          <Link href={`/${locale}`} className="text-sm text-teal-600 hover:underline">
            ← {isES ? 'Volver al inicio' : 'Back to home'}
          </Link>
        </div>
      </div>
    </div>
  )
}
