import { Link } from 'react-router-dom'

function BenefitIcon({ type }: { type: 'magnet' | 'battery' | 'bolt' }) {
  const paths: Record<string, string> = {
    magnet: 'M12 2a4 4 0 00-4 4v8a4 4 0 008 0V6a4 4 0 00-4-4zM6 6v8a6 6 0 0012 0V6',
    battery: 'M17 6H3a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2zm4 5v2',
    bolt: 'M13 2L3 14h9l-1 8 10-12h-9l1-8',
  }
  return (
    <svg className="h-7 w-7 text-accent-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
    </svg>
  )
}

const REVIEWS = [
  { name: 'María G.', stars: 5, text: 'Se pega al iPhone al instante. Lo uso todo el día y me da dos cargas completas. Increíble lo delgado que es.' },
  { name: 'Carlos R.', stars: 5, text: 'Lo compré para viajes. Cabe perfecto en el bolsillo y carga rapidísimo por USB-C. Muy recomendado.' },
  { name: 'Laura P.', stars: 5, text: 'Llegó en 18 días, bien empacado. La carga magnética funciona perfecto con mi iPhone 15. Calidad premium.' },
]

export default function Home() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24 lg:py-32">
          <div className="order-2 md:order-1">
            <span className="inline-block rounded-full bg-accent-50 px-4 py-1 text-xs font-semibold text-accent-600 mb-5 animate-[fadeInDown_0.6s_ease-out]">
              🔥 50% OFF — Oferta limitada
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl animate-[fadeInUp_0.8s_ease-out]">
              Carga tu iPhone en segundos, <span className="text-accent-500">sin cables</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-500 leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
              Mini Power Bank Magnético 10000mAh • Envío gratis
            </p>

            <div className="mt-8 flex items-baseline gap-3 animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
              <span className="text-4xl font-extrabold">$29.99</span>
              <span className="text-lg text-zinc-400 line-through">$59.99</span>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-500">-50%</span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
              <Link
                to="/product"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-accent-500/25 transition-all hover:bg-accent-600 hover:shadow-xl hover:shadow-accent-500/30 hover:scale-[1.02] active:scale-100"
              >
                Comprar ahora
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-zinc-400 animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Envío gratis
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Garantía 30 días
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Pago seguro
              </span>
            </div>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <div className="relative">
              <div className="h-72 w-72 rounded-[2rem] bg-gradient-to-br from-zinc-100 to-zinc-50 p-8 shadow-2xl shadow-zinc-200/60 sm:h-96 sm:w-96 animate-[float_4s_ease-in-out_infinite]">
                <img src="/img/product-1.svg" alt="Chargly Power Bank" className="h-full w-full object-contain" />
              </div>
              <div className="absolute -bottom-3 -right-3 rounded-2xl bg-white px-4 py-2 shadow-lg border border-zinc-100">
                <p className="text-xs font-semibold text-zinc-500">⚡ 10000mAh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="border-y border-zinc-100 bg-white py-16">
        <div className="mx-auto max-w-4xl px-5">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: 'magnet' as const, title: 'Magnético MagSafe', desc: 'Se adhiere al instante a tu iPhone. Sin cables, sin complicaciones.' },
              { icon: 'battery' as const, title: '10000mAh', desc: 'Capacidad para 2+ cargas completas. Energía para todo el día.' },
              { icon: 'bolt' as const, title: 'Carga rápida 15W', desc: 'Inalámbrica 15W + USB-C 20W. Tu teléfono listo en minutos.' },
            ].map(b => (
              <div key={b.title} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-zinc-50 transition-colors">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50">
                  <BenefitIcon type={b.icon} />
                </div>
                <h3 className="text-base font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-500 mb-2">Testimonios</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Lo que dicen nuestros clientes</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {REVIEWS.map(r => (
              <div key={r.name} className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3 border-t border-zinc-50 pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-50 text-accent-600 text-xs font-bold">
                    {r.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-[11px] text-zinc-400">Compra verificada</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guarantee ── */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-5">
          <div className="rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-800 p-10 text-white sm:p-14">
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <svg className="h-6 w-6 text-accent-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Garantía 30 días</h3>
                  <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                    Si no estás 100% satisfecho, te devolvemos tu dinero. Sin preguntas.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <svg className="h-6 w-6 text-accent-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Envío gratis incluido</h3>
                  <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                    Envío gratuito a todo el mundo. Entrega en 15-20 días hábiles con tracking.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/product"
                className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-accent-600 hover:scale-[1.02]"
              >
                Ver producto
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
