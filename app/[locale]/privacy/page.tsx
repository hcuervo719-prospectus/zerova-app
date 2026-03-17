import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'

export default async function PrivacyPage({
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Política de Privacidad</h1>
            <p className="text-slate-400 text-sm mb-10">Última actualización: marzo 2026</p>

            <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Quién somos</h2>
                <p>Zerova es un producto de VividShift, operado por Henry Murillo como actividad individual desde Colombia. Puedes contactarnos en <a href="mailto:contact@zerova.app" className="text-teal-600">contact@zerova.app</a>.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Qué datos recolectamos</h2>
                <p>Recolectamos únicamente los datos necesarios para prestarte el servicio:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li><strong>Datos de cuenta:</strong> nombre, correo electrónico y contraseña (almacenada de forma cifrada).</li>
                  <li><strong>Perfil relacional:</strong> las respuestas que proporcionas durante el onboarding sobre tu situación de pareja.</li>
                  <li><strong>Conversaciones:</strong> los mensajes que intercambias con Zerova, necesarios para personalizar las respuestas y construir tu perfil relacional acumulativo.</li>
                  <li><strong>Datos de uso:</strong> páginas visitadas, sesiones iniciadas, check-ins completados. Utilizamos Google Analytics para esto.</li>
                  <li><strong>Datos de pago:</strong> gestionados íntegramente por Paddle. Zerova no almacena datos de tarjetas de crédito.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Para qué usamos tus datos</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Prestarte el servicio de asistencia relacional personalizada.</li>
                  <li>Mejorar la calidad de las respuestas de Zerova a lo largo del tiempo.</li>
                  <li>Enviarte comunicaciones relacionadas con tu cuenta (confirmación de email, alertas de suscripción).</li>
                  <li>Analizar el uso agregado y anónimo del producto para mejorarlo.</li>
                </ul>
                <p className="mt-3"><strong>No vendemos tus datos a terceros. Nunca.</strong></p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Sensibilidad de los datos</h2>
                <p>Zerova procesa información sobre relaciones personales, que por su naturaleza puede ser sensible. Tomamos esto muy en serio. Tus conversaciones no son leídas por humanos salvo en caso de requerimiento legal o para resolver un problema técnico específico que tú nos hayas reportado.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Con quién compartimos datos</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Supabase:</strong> base de datos y autenticación (servidores en la nube).</li>
                  <li><strong>Anthropic:</strong> proveedor de la IA que alimenta a Zerova. Los mensajes son procesados para generar respuestas.</li>
                  <li><strong>Paddle:</strong> procesador de pagos.</li>
                  <li><strong>Google Analytics:</strong> análisis de uso anónimo.</li>
                </ul>
                <p className="mt-3">No compartimos datos con terceros más allá de estos proveedores de servicio.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Tus derechos</h2>
                <p>Puedes en cualquier momento:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Solicitar acceso a los datos que tenemos sobre ti.</li>
                  <li>Solicitar la eliminación de tu cuenta y todos tus datos.</li>
                  <li>Solicitar la portabilidad de tus datos.</li>
                </ul>
                <p className="mt-3">Para cualquiera de estas solicitudes, escríbenos a <a href="mailto:contact@zerova.app" className="text-teal-600">contact@zerova.app</a>.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Retención de datos</h2>
                <p>Conservamos tus datos mientras tu cuenta esté activa. Si eliminas tu cuenta, eliminamos tus datos personales en un plazo de 30 días, salvo obligación legal de conservarlos por más tiempo.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Cambios a esta política</h2>
                <p>Si realizamos cambios significativos, te lo notificaremos por correo electrónico con al menos 15 días de anticipación.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Contacto</h2>
                <p>Para cualquier pregunta sobre privacidad: <a href="mailto:contact@zerova.app" className="text-teal-600">contact@zerova.app</a></p>
              </section>

            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
            <p className="text-slate-400 text-sm mb-10">Last updated: March 2026</p>

            <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Who we are</h2>
                <p>Zerova is a product of VividShift, operated by Henry Murillo as an individual from Colombia. You can contact us at <a href="mailto:contact@zerova.app" className="text-teal-600">contact@zerova.app</a>.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">2. What data we collect</h2>
                <p>We collect only the data necessary to provide you with the service:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li><strong>Account data:</strong> name, email address and password (stored encrypted).</li>
                  <li><strong>Relational profile:</strong> answers you provide during onboarding about your relationship situation.</li>
                  <li><strong>Conversations:</strong> messages you exchange with Zerova, necessary to personalize responses and build your cumulative relational profile.</li>
                  <li><strong>Usage data:</strong> pages visited, sessions started, check-ins completed. We use Google Analytics for this.</li>
                  <li><strong>Payment data:</strong> managed entirely by Paddle. Zerova does not store credit card data.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">3. How we use your data</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide you with personalized relational assistance.</li>
                  <li>To improve the quality of Zerova's responses over time.</li>
                  <li>To send you account-related communications (email confirmation, subscription alerts).</li>
                  <li>To analyze aggregated and anonymous product usage to improve it.</li>
                </ul>
                <p className="mt-3"><strong>We do not sell your data to third parties. Ever.</strong></p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Sensitivity of data</h2>
                <p>Zerova processes information about personal relationships, which by nature may be sensitive. We take this very seriously. Your conversations are not read by humans except in the case of legal requirement or to resolve a specific technical issue you have reported to us.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Who we share data with</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Supabase:</strong> database and authentication (cloud servers).</li>
                  <li><strong>Anthropic:</strong> AI provider powering Zerova. Messages are processed to generate responses.</li>
                  <li><strong>Paddle:</strong> payment processor.</li>
                  <li><strong>Google Analytics:</strong> anonymous usage analysis.</li>
                </ul>
                <p className="mt-3">We do not share data with third parties beyond these service providers.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Your rights</h2>
                <p>You may at any time:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Request access to the data we hold about you.</li>
                  <li>Request deletion of your account and all your data.</li>
                  <li>Request portability of your data.</li>
                </ul>
                <p className="mt-3">For any of these requests, write to us at <a href="mailto:contact@zerova.app" className="text-teal-600">contact@zerova.app</a>.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Data retention</h2>
                <p>We retain your data while your account is active. If you delete your account, we delete your personal data within 30 days, unless legally required to retain it longer.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Changes to this policy</h2>
                <p>If we make significant changes, we will notify you by email at least 15 days in advance.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Contact</h2>
                <p>For any privacy questions: <a href="mailto:contact@zerova.app" className="text-teal-600">contact@zerova.app</a></p>
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
