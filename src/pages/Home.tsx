import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { PRODUCT } from '../data/product'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

export default function Home() {
  const { addItem } = useCart()
  const [videoPlaying, setVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroImgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onScroll() {
      if (!heroImgRef.current) return
      heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function playVideo() {
    if (!videoRef.current) return
    videoRef.current.muted = false
    videoRef.current.play()
    setVideoPlaying(true)
  }

  return (
    <div>

      {/* ═══ 1 · HERO — OSCURA ═══ */}
      <section className="relative flex h-screen min-h-[600px] items-center overflow-hidden bg-[#0D0D0D]">
        <div ref={heroImgRef} className="absolute inset-0">
          <img src={PRODUCT.images[0]} alt="Chargly Power Bank Magnético 10000mAh" className="h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(13,13,13,0.88) 0%, rgba(13,13,13,0.4) 100%)' }} />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-2 w-2 rounded-full bg-[#D4825A] animate-pulse" />
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-[#D4825A]">
              Chargly&trade; &mdash; Power Bank Magn&eacute;tico
            </p>
          </div>
          <h1 className="font-display text-[clamp(4rem,9vw,8.5rem)] leading-[0.9] tracking-tight text-white">
            CARGA<br />SIN L&Iacute;MITES
          </h1>
          <div className="mt-5 h-px w-10 bg-[#D4825A]" />
          <p className="mt-5 max-w-md text-base font-light leading-relaxed text-[#aaaaaa] sm:text-lg">
            Deja de cargar cables que se rompen. Adhiere el power bank a tu iPhone
            y obt&eacute;n 2 cargas completas en segundos. 10,000mAh &middot; MagSafe 15W.
          </p>

          {/* Social proof above the fold */}
          <div className="mt-5 flex items-center gap-4">
            <div className="flex -space-x-1.5">
              {['CM', 'VR', 'DS', 'LP'].map(n => (
                <span key={n} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0D0D0D] bg-[#D4825A] text-[9px] font-bold text-white">{n}</span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="h-3.5 w-3.5 text-[#D4825A]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
              <span className="ml-1 text-xs text-white/50">4.8/5 &middot; 127+ rese&ntilde;as</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/product" className="inline-flex items-center justify-center bg-[#D4825A] px-8 py-4 text-sm font-bold tracking-wider text-white uppercase transition-all hover:bg-[#B86C45]">
              Obtener el m&iacute;o &mdash; $29.99
            </Link>
            <Link to="/product" className="inline-flex items-center justify-center border border-white/30 px-8 py-4 text-sm font-bold tracking-wider text-white uppercase transition-colors hover:bg-white/10">
              Ver producto
            </Link>
          </div>
          <p className="mt-3 text-xs text-white/35">Env&iacute;o gratis &middot; Garant&iacute;a 30 d&iacute;as &middot; Pago seguro con PayPal</p>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <svg className="h-5 w-5 animate-[scrollBounce_2s_ease-in-out_infinite]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ═══ 2 · MÉTRICAS — CLARA ═══ */}
      <section className="bg-[#F5F2EE] py-20">
        <Reveal>
          <div className="mx-auto grid max-w-5xl grid-cols-2 sm:grid-cols-4">
            {[
              { value: '10,000', label: 'mAh de capacidad' },
              { value: '15W', label: 'carga sin cables' },
              { value: '30', label: 'días de garantía' },
              { value: '2X', label: 'cargas completas' },
            ].map((s, i) => (
              <div key={s.label} className={`flex flex-col items-center py-6 ${i > 0 ? 'border-l border-[#D8D4CE]' : ''}`}>
                <span className="font-display text-5xl tracking-tight text-[#D4825A] sm:text-6xl">{s.value}</span>
                <span className="mt-2 text-[11px] font-medium uppercase tracking-[0.15em] text-[#888880]">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ 3 · EL PROBLEMA — OSCURA ═══ */}
      <section className="bg-[#0D0D0D] py-24 sm:py-32">
        <Reveal>
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#D4825A] mb-6">
              &mdash; El problema
            </p>
            <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl">
              &iquest;TE SUENA ESTO?
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-3 text-left">
              {[
                { pain: 'Tu iPhone muere a media tarde', detail: 'Justo cuando más lo necesitas: navegando, trabajando o en una reunión importante.' },
                { pain: 'Cables que se rompen cada mes', detail: 'Siempre en el peor momento. Y cada cargador nuevo son $15-$25 que tiras a la basura.' },
                { pain: 'Power banks enormes que no usas', detail: 'Pesan, abultan, necesitan su propio cable. Al final los dejas en casa.' },
              ].map(p => (
                <div key={p.pain} className="border border-white/10 p-6 rounded">
                  <span className="text-2xl mb-3 block">✕</span>
                  <h3 className="text-sm font-bold text-white mb-2">{p.pain}</h3>
                  <p className="text-sm font-light text-[#888888] leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 4 · LA SOLUCIÓN — CLARA ═══ */}
      <section className="bg-[#EEEBE6] py-24">
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[45%_55%] lg:gap-20">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#D4825A] mb-6">
                &mdash; La soluci&oacute;n
              </p>
              <h2 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.92] tracking-tight text-[#1a1a1a]">
                DELGADO COMO<br />UNA TARJETA.<br />POTENTE COMO<br />UN CARGADOR.
              </h2>
              <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-[#888880]">
                Solo adhi&eacute;relo a tu iPhone. Sin cables, sin complicaciones.
                Tan delgado que lo olvidar&aacute;s en tu bolsillo,
                tan potente que nunca te quedar&aacute;s sin bater&iacute;a.
              </p>
              <div className="mt-6 space-y-2">
                {['Se adhiere magnéticamente en 1 segundo', 'Carga 2 veces completas tu iPhone', 'Más delgado que una tarjeta de crédito'].map(b => (
                  <div key={b} className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                    <svg className="h-4 w-4 flex-shrink-0 text-[#D4825A]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {b}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-baseline gap-3">
                <span className="font-display text-5xl text-[#1a1a1a]">$29.99</span>
                <span className="text-sm font-light text-[#888880] line-through">$59.99</span>
                <span className="bg-[#D4825A] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  50% OFF
                </span>
              </div>
              <button
                onClick={() => addItem(PRODUCT, 1)}
                className="mt-6 inline-flex items-center bg-[#D4825A] px-8 py-4 text-sm font-bold tracking-wider text-white uppercase transition-all hover:bg-[#B86C45]"
              >
                Agregar al carrito
              </button>
              <p className="mt-2 text-xs text-[#888880]">Env&iacute;o gratis &middot; Llega en 15-20 d&iacute;as</p>
            </div>
            <div className="relative overflow-hidden">
              <img src={PRODUCT.images[1]} alt="Chargly Power Bank vista frontal" className="w-full object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 5 · CÓMO FUNCIONA — OSCURA ═══ */}
      <section className="bg-[#0D0D0D] py-24">
        <Reveal>
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#D4825A] mb-3">Tan simple que no lo creer&aacute;s</p>
              <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl">3 PASOS. 0 CABLES.</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { step: '01', title: 'Adhiérelo', desc: 'Acerca el Chargly a tu iPhone. Los imanes lo alinean y fijan al instante.', img: PRODUCT.images[2] },
                { step: '02', title: 'Carga automática', desc: 'La carga inalámbrica 15W comienza inmediatamente. Sin botones, sin cables.', img: PRODUCT.images[3] },
                { step: '03', title: 'Vive sin límites', desc: '10,000mAh te dan 2+ cargas completas. Úsalo todo el día sin preocuparte.', img: PRODUCT.images[4] },
              ].map(s => (
                <div key={s.step} className="border border-white/10 overflow-hidden rounded">
                  <div className="aspect-square overflow-hidden bg-[#141414]">
                    <img src={s.img} alt={s.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-6">
                    <span className="font-display text-3xl text-[#D4825A]">{s.step}</span>
                    <h3 className="mt-2 text-sm font-bold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm font-light leading-relaxed text-[#888888]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 6 · GALERÍA EDITORIAL — CLARA ═══ */}
      <section className="bg-[#EEEBE6] py-24">
        <Reveal>
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-10 text-center">
              <h2 className="font-display text-5xl tracking-tight text-[#1a1a1a] sm:text-6xl">LA COLECCI&Oacute;N</h2>
              <p className="mt-3 text-sm text-[#888880]">Disponible en m&uacute;ltiples colores. El mismo poder en cada uno.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:grid-rows-2" style={{ gridTemplateRows: 'repeat(2, 280px)' }}>
              <Link to="/product" className="group relative row-span-2 overflow-hidden bg-[#FAFAF8]">
                <img src={PRODUCT.images[5]} alt="Power bank vista colores" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-[#D4825A]/0 transition-colors duration-500 group-hover:bg-[#D4825A]/[0.12]" />
              </Link>
              {PRODUCT.images.slice(6, 10).map((img, i) => (
                <Link key={i} to="/product" className="group relative overflow-hidden bg-[#FAFAF8]">
                  <img src={img} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-[#D4825A]/0 transition-colors duration-500 group-hover:bg-[#D4825A]/[0.12]" />
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/product" className="inline-flex items-center gap-2 text-sm font-medium tracking-wider uppercase text-[#888880] transition-colors hover:text-[#1a1a1a]">
                Ver todas las im&aacute;genes
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 7 · VIDEO DEMO — OSCURA ═══ */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#0D0D0D] pt-20 pb-20">
        <video
          ref={videoRef}
          // TODO: reemplazar con pagina.mp4 cuando esté disponible
          src="/mp4/pagina.mp4"
          muted
          loop
          playsInline
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className={`absolute inset-0 transition-opacity duration-700 ${videoPlaying ? 'bg-[#0D0D0D]/30' : 'bg-[#0D0D0D]/55'}`} />

        {!videoPlaying && (
          <Reveal className="relative z-10 flex flex-col items-center text-center">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-[#D4825A] mb-3">Demo del producto</p>
            <h2 className="font-display text-[clamp(3rem,8vw,5.5rem)] tracking-tight text-white">
              V&Eacute;LO EN ACCI&Oacute;N
            </h2>
            <button
              onClick={playVideo}
              className="mt-8 flex h-20 w-20 items-center justify-center border border-white/30 rounded-full transition-all hover:border-white hover:scale-110"
            >
              <svg className="ml-1 h-7 w-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
            <p className="mt-6 text-sm font-light text-[#aaaaaa]">Sin cables. Sin l&iacute;mites. Sin excusas.</p>
          </Reveal>
        )}
      </section>

      {/* ═══ 8 · POR QUÉ CHARGLY — CLARA ═══ */}
      <section className="bg-[#F5F2EE] py-24">
        <Reveal>
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-12 text-center font-display text-5xl tracking-tight text-[#1a1a1a] sm:text-6xl">
              POR QU&Eacute; CHARGLY
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Carga 15W', desc: 'La carga inalámbrica más rápida del mercado. Tu iPhone al 50% en 30 minutos.' },
                { icon: 'M4 8V6a6 6 0 0112 0v2h2a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1h2zm6-4a4 4 0 00-4 4v2h8V6a4 4 0 00-4-4z', title: '10,000mAh reales', desc: '37Wh certificados. Hasta 2.3 cargas completas de iPhone 15 comprobadas.' },
                { icon: 'M12 2a4 4 0 00-4 4v8a4 4 0 008 0V6a4 4 0 00-4-4zM6 6v8a6 6 0 0012 0V6', title: 'MagSafe perfecto', desc: 'Imanes N52 de alta densidad. Se alinea solo, no se cae, no se mueve.' },
                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Garantía 30 días', desc: 'No te convence, te devolvemos tu dinero. Sin preguntas, sin letra pequeña.' },
              ].map(f => (
                <div key={f.title} className="border border-[#E0DCD6] bg-[#FAFAF8] p-6 rounded">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center">
                    <svg className="h-6 w-6 text-[#D4825A]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-[#1a1a1a]">{f.title}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-[#888880]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 9 · COMPATIBILIDAD — OSCURA ═══ */}
      <section className="bg-[#141414] py-24 sm:py-32">
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#D4825A] mb-4">
                Compatibilidad Universal
              </p>
              <h2 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.92] tracking-tight text-white">
                FUNCIONA<br />CON TODO
              </h2>
              <ul className="mt-8 space-y-3">
                {[
                  'iPhone 12, 13, 14, 15, 16 — MagSafe nativo',
                  'Android con Qi inalámbrico (Samsung, Pixel, Xiaomi)',
                  'Cualquier dispositivo USB-C — carga por cable 20W',
                  'AirPods Pro, Galaxy Buds — carga inalámbrica directa',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#888888]">
                    <svg className="h-4 w-4 flex-shrink-0 text-[#D4825A]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/product"
                className="mt-10 inline-flex items-center border border-white/30 px-8 py-4 text-sm font-bold tracking-wider text-white uppercase transition-colors hover:bg-white/10"
              >
                Ver especificaciones completas
              </Link>
            </div>
            <div>
              <img src={PRODUCT.images[7]} alt="Chargly compatible con iPhone y Android" className="w-full object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 10 · REVIEWS — CLARA ═══ */}
      <section className="bg-[#EEEBE6] py-24">
        <Reveal>
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#D4825A] mb-3">+127 rese&ntilde;as verificadas</p>
              <h2 className="font-display text-5xl tracking-tight text-[#1a1a1a] sm:text-6xl">LO QUE DICEN</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { name: 'Carlos M.', city: 'Bogotá', text: 'Increíble. Lo llevo en el bolsillo todo el día y no lo noto. Me dio 2 cargas completas de mi iPhone 15 Pro.' },
                { name: 'Valentina R.', city: 'Medellín', text: 'Llegó en 16 días, antes de lo esperado. El producto es exactamente como en las fotos. Ya pedí otro para mi novio.' },
                { name: 'Diego S.', city: 'Ciudad de México', text: 'Se adhiere solo al iPhone sin cables. No se cae, no se mueve. Lo mejor que compré este año con diferencia.' },
              ].map(r => (
                <div key={r.name} className="border border-[#E0DCD6] bg-[#FAFAF8] p-8 rounded">
                  <span className="font-display text-4xl leading-none text-[#D4825A]">&ldquo;</span>
                  <div className="mt-2 flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="h-3.5 w-3.5 text-[#D4825A]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm font-light leading-relaxed text-[#555550] mb-6">&ldquo;{r.text}&rdquo;</p>
                  <div className="border-t border-[#E8E4DF] pt-4">
                    <p className="text-sm font-bold text-[#1a1a1a]">{r.name}</p>
                    <p className="text-[11px] text-[#888880] mt-0.5">{r.city} &middot; Compra verificada</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 11 · FAQ — OSCURA ═══ */}
      <section className="bg-[#0D0D0D] py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-12 text-center font-display text-4xl tracking-tight text-white sm:text-5xl">
              PREGUNTAS FRECUENTES
            </h2>
            <div className="space-y-4">
              {[
                { q: '¿Funciona con mi iPhone?', a: 'Sí. Compatible con iPhone 12, 13, 14, 15 y 16 (todas las variantes: Mini, Pro, Pro Max, Plus). También funciona con Android vía carga Qi o cable USB-C.' },
                { q: '¿Cuánto tarda en llegar?', a: 'El envío tarda entre 15 y 20 días hábiles. Recibirás un número de tracking por email para rastrear tu pedido en tiempo real.' },
                { q: '¿Qué pasa si no me convence?', a: 'Tienes 30 días para devolverlo. Sin preguntas, sin letra pequeña. Te devolvemos el 100% del dinero.' },
                { q: '¿Es realmente de 10,000mAh?', a: 'Sí. 10,000mAh / 37Wh certificados con celdas de litio-polímero de grado A. Probado para dar 2-2.3 cargas completas de iPhone 15.' },
                { q: '¿Se cae del teléfono?', a: 'No. Los imanes N52 de alta densidad generan una sujeción firme. Puedes usarlo mientras caminas, escribes o incluso con una funda MagSafe compatible.' },
              ].map(faq => (
                <details key={faq.q} className="group border border-white/10 rounded">
                  <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-medium text-white">
                    {faq.q}
                    <svg className="h-4 w-4 flex-shrink-0 text-[#D4825A] transition-transform group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </summary>
                  <div className="border-t border-white/10 px-5 pb-5 pt-3">
                    <p className="text-sm font-light leading-relaxed text-[#888888]">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 12 · CHATBOT CTA — CLARA ═══ */}
      <section className="bg-[#F5F2EE] py-20">
        <Reveal>
          <div className="mx-auto max-w-3xl px-6 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4825A]/10">
              <svg className="h-8 w-8 text-[#D4825A]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="font-display text-4xl tracking-tight text-[#1a1a1a] sm:text-5xl">
              &iquest;TIENES DUDAS?
            </h2>
            <p className="mt-4 max-w-md mx-auto text-sm font-light leading-relaxed text-[#888880]">
              Nuestro asistente virtual est&aacute; disponible 24/7 para responder
              tus preguntas sobre env&iacute;os, compatibilidad, garant&iacute;a y m&aacute;s.
            </p>
            <button
              onClick={() => window.dispatchEvent(new Event('open-chat'))}
              className="mt-8 inline-flex items-center gap-3 border-2 border-[#D4825A] px-8 py-4 text-sm font-bold tracking-wider text-[#D4825A] uppercase transition-all hover:bg-[#D4825A] hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Abrir chat de soporte
            </button>
            <p className="mt-3 text-xs text-[#888880]">Respuesta inmediata &middot; Sin esperas &middot; Disponible ahora</p>
          </div>
        </Reveal>
      </section>

      {/* ═══ 13 · CTA FINAL — CLARA (garantía) + OSCURA (cierre) ═══ */}
      <section className="bg-gradient-to-b from-[#F5F2EE] to-[#EEEBE6] py-16">
        <Reveal>
          <div className="mx-auto max-w-4xl px-6">
            <div className="border border-[#E0DCD6] bg-[#FAFAF8] p-10 sm:p-14 rounded text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[#E0DCD6] rounded-full">
                <svg className="h-8 w-8 text-[#D4825A]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-display text-3xl tracking-tight text-[#1a1a1a] sm:text-4xl">GARANT&Iacute;A SIN RIESGO</h3>
              <p className="mt-4 max-w-lg mx-auto text-sm font-light leading-relaxed text-[#888880]">
                Prueba el Chargly durante 30 d&iacute;as. Si no te convence por cualquier raz&oacute;n,
                te devolvemos el 100% de tu dinero. Sin preguntas, sin formularios, sin complicaciones.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-gradient-to-b from-[#0D0D0D] to-zinc-900 py-40">
        <Reveal className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-[#D4825A] mb-6">
            Oferta por tiempo limitado
          </p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] tracking-tight text-white">
            &iquest;LISTO PARA NUNCA<br />QUEDARTE SIN<br />BATER&Iacute;A?
          </h2>
          <p className="mt-6 text-base font-light text-[#888888]">
            $29.99 USD &mdash; Env&iacute;o gratis a todo el mundo &middot; Garant&iacute;a 30 d&iacute;as
          </p>
          <Link
            to="/product"
            className="mt-10 inline-flex items-center gap-3 bg-[#D4825A] px-10 py-5 text-sm font-bold tracking-wider text-white uppercase transition-all hover:bg-[#B86C45] hover:scale-105"
          >
            Obtener el m&iacute;o ahora
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="mt-4 text-xs text-white/30">Pago seguro con PayPal &middot; M&aacute;s de 127 clientes satisfechos</p>
        </Reveal>
      </section>
    </div>
  )
}
