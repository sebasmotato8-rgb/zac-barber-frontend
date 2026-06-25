import { useState, useEffect, useRef } from 'react'
import ChatWidget from '../components/ChatWidget'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, cls: `transition-all duration-700 ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}` }
}

const ICONS: Record<string, string> = {
  scissors: '/img/scissors.png', chair: '/img/chair.png', clipper: '/img/clipper.png',
  spray: '/img/spray.png', razor: '/img/razor.png', razor2: '/img/razor2.png',
  brush: '/img/brush.png', pole: '/img/pole.png', pole2: '/img/pole2.png',
}

function Ico({ name, size = 48, className = '' }: { name: string; size?: number; className?: string }) {
  return <img src={ICONS[name] ?? ICONS.scissors} alt="" className={`inline-block flex-shrink-0 object-contain ${className}`} style={{ width: size, height: size }} loading="lazy" />
}

function Label({ text }: { text: string }) {
  return <p className="text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">{text}</p>
}

function Title({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-semibold text-white leading-tight">{children}</h2>
}

/* ═══════════ NAVBAR ═══════════ */
function Navbar({ onChat }: { onChat: () => void }) {
  const [sc, setSc] = useState(false)
  const [mo, setMo] = useState(false)
  useEffect(() => { const h = () => setSc(scrollY > 60); addEventListener('scroll', h, { passive: true }); return () => removeEventListener('scroll', h) }, [])
  const links = [
    { l: 'Inicio', h: '#hero' }, { l: 'Nosotros', h: '#about' }, { l: 'Servicios', h: '#services' },
    { l: 'Galería', h: '#gallery' }, { l: 'FAQ', h: '#faq' }, { l: 'Contacto', h: '#location' },
  ]
  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${sc ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-black/30 py-2' : 'bg-gradient-to-b from-black/70 to-transparent py-4'}`}>
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6">
        <a href="#hero" className="flex items-center gap-3 group">
          <img src="/img/logo.png" alt="Zac Barber" className="h-10 w-10 rounded-full group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-shadow" />
          <span className="text-lg font-display font-semibold tracking-wider text-amber-400">ZAC BARBER</span>
        </a>
        <div className="hidden lg:flex items-center gap-8">
          {links.map(l => <a key={l.h} href={l.h} className="text-[13px] font-medium text-zinc-300 hover:text-amber-400 transition-colors tracking-wide">{l.l}</a>)}
          <button onClick={onChat} className="rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition-all hover:shadow-lg hover:shadow-amber-500/20">Reservar Cita</button>
        </div>
        <button onClick={() => setMo(!mo)} className="lg:hidden text-amber-400 p-2">
          {mo ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
               : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>}
        </button>
      </div>
      {mo && (
        <div className="lg:hidden bg-black/98 backdrop-blur-md border-t border-zinc-800/50 px-6 pb-6 pt-4 space-y-1">
          {links.map(l => <a key={l.h} href={l.h} onClick={() => setMo(false)} className="block py-2.5 text-zinc-300 hover:text-amber-400 transition-colors font-medium">{l.l}</a>)}
          <button onClick={() => { setMo(false); onChat() }} className="mt-3 w-full rounded-full bg-amber-500 px-5 py-3 text-sm font-bold text-black">Reservar Cita</button>
        </div>
      )}
    </nav>
  )
}

/* ═══════════ HERO ═══════════ */
function Hero({ onChat }: { onChat: () => void }) {
  return (
    <section id="hero" className="relative h-screen min-h-[600px] max-h-[1000px] flex items-center justify-center overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(0.4) contrast(1.1)', objectPosition: 'center 30%' }}>
        <source src="/mp4/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <img src="/img/logo.png" alt="Zac Barber" className="mx-auto mb-8 h-28 w-28 sm:h-36 sm:w-36 rounded-full shadow-2xl shadow-amber-500/30 ring-2 ring-amber-500/20 animate-[fadeInDown_1s_ease-out]" />
        <h1 className="animate-[fadeInUp_1s_ease-out_0.3s_both]">
          <span className="block font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] mb-2">Donde el Estilo</span>
          <span className="block font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1]"><em className="text-amber-400 italic">se Hace Arte</em></span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-zinc-300/90 max-w-xl mx-auto animate-[fadeInUp_1s_ease-out_0.5s_both] font-light tracking-wide">
          Más que un corte, una experiencia premium. Transforma tu look con los mejores barberos de la ciudad.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-[fadeInUp_1s_ease-out_0.7s_both]">
          <button onClick={onChat} className="rounded-full bg-amber-500 px-10 py-4 text-base font-bold text-black hover:bg-amber-400 hover:scale-[1.03] active:scale-100 transition-all shadow-xl shadow-amber-500/25">Reservar Cita</button>
          <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm px-10 py-4 text-base font-bold text-white hover:border-amber-400/50 hover:text-amber-400 transition-all flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.315 0-4.458-.766-6.183-2.059l-.433-.324-2.641.885.885-2.641-.324-.433A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            WhatsApp
          </a>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </section>
  )
}

/* ═══════════ STATS ═══════════ */
function Stats() {
  const r = useReveal()
  const items = [
    { v: '5,000+', l: 'Clientes Satisfechos', i: 'scissors' },
    { v: '8+', l: 'Años de Experiencia', i: 'pole' },
    { v: '15,000+', l: 'Cortes Realizados', i: 'clipper' },
    { v: '4.9', l: 'Calificación Promedio', i: 'pole2' },
  ]
  return (
    <section className="py-20 bg-zinc-950/80">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-10 ${r.cls}`}>
        {items.map(s => (
          <div key={s.l} className="text-center">
            <Ico name={s.i} size={52} className="mx-auto mb-4" />
            <div className="font-display text-3xl md:text-4xl font-semibold text-amber-400">{s.v}</div>
            <div className="text-sm text-zinc-500 mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═══════════ ABOUT ═══════════ */
function About() {
  const r = useReveal()
  return (
    <section id="about" className="py-24 bg-black">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 items-center ${r.cls}`}>
        <div>
          <Label text="Sobre Nosotros" />
          <Title>Tradición y <span className="text-amber-400">Modernidad</span> en cada corte</Title>
          <p className="text-zinc-400 mt-6 leading-relaxed">En Zac Barber fusionamos la tradición barbera con las técnicas más modernas. Cada servicio es una experiencia personalizada donde el detalle y la precisión se combinan para resaltar tu mejor versión.</p>
          <p className="text-zinc-400 mt-4 leading-relaxed">Nuestro equipo de barberos profesionales se capacita constantemente en las últimas tendencias internacionales para ofrecerte un resultado impecable.</p>
          <div className="flex flex-wrap gap-3 mt-8">
            {['Barberos Certificados', 'Productos Premium', 'Ambiente Exclusivo'].map(t => (
              <span key={t} className="rounded-full border border-amber-500/20 bg-amber-500/5 px-5 py-2 text-xs font-medium text-amber-400 tracking-wide">{t}</span>
            ))}
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative group">
            <img src="/img/chair.png" alt="Silla de barbería" className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent rounded-2xl" />
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <p className="font-display text-lg text-amber-400">Zac Barber</p>
              <p className="text-sm text-zinc-400 mt-1">Donde tu estilo cobra vida</p>
            </div>
          </div>
          <div className="absolute -bottom-5 -right-5 h-20 w-20 rounded-2xl overflow-hidden shadow-xl border border-amber-500/15">
            <img src="/img/scissors.png" alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════ SERVICES ═══════════ */
function Services({ onChat }: { onChat: (m?: string) => void }) {
  const r = useReveal()
  const items = [
    { name: 'Corte Clásico', price: '$25.000', dur: '30 min', icon: 'scissors', desc: 'Corte tradicional con acabado impecable.' },
    { name: 'Corte + Barba', price: '$40.000', dur: '45 min', icon: 'razor', desc: 'Combo completo para un look definido.' },
    { name: 'Barba Premium', price: '$20.000', dur: '25 min', icon: 'brush', desc: 'Perfilado y diseño de barba con toalla caliente.' },
    { name: 'Corte Degradado', price: '$30.000', dur: '40 min', icon: 'clipper', desc: 'Fade perfecto con transiciones suaves.' },
    { name: 'Tratamiento Capilar', price: '$35.000', dur: '30 min', icon: 'spray', desc: 'Hidratación y cuidado profesional.' },
    { name: 'Afeitado Clásico', price: '$18.000', dur: '20 min', icon: 'razor2', desc: 'Afeitado con navaja y toalla caliente.' },
  ]
  return (
    <section id="services" className="py-24 bg-zinc-950">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 ${r.cls}`}>
        <div className="text-center mb-14"><Label text="Servicios" /><Title>Nuestros <span className="text-amber-400">Servicios</span></Title></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(s => (
            <div key={s.name} className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 hover:border-amber-500/40 hover:bg-zinc-900/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5">
              <div className="flex items-start justify-between mb-5">
                <div className="h-14 w-14 rounded-xl bg-amber-500/10 flex items-center justify-center p-1"><Ico name={s.icon} size={44} /></div>
                <span className="text-amber-400 text-xl font-display font-semibold">{s.price}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{s.name}</h3>
              <p className="text-sm text-zinc-500 mb-4 leading-relaxed">{s.desc}</p>
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                <span className="text-xs text-zinc-600 font-medium">{s.dur}</span>
                <button onClick={() => onChat(`Quiero reservar un ${s.name}`)} className="rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500 hover:text-black transition-all duration-200">Reservar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════ GALLERY ═══════════ */
function Gallery() {
  const r = useReveal()
  const items = [
    { icon: 'scissors', label: 'Corte Clásico', sub: 'Elegancia atemporal' },
    { icon: 'clipper', label: 'Degradado', sub: 'Transiciones perfectas' },
    { icon: 'razor', label: 'Barba Esculpida', sub: 'Detalle artístico' },
    { icon: 'brush', label: 'Hot Towel Shave', sub: 'Experiencia premium' },
    { icon: 'spray', label: 'Tratamiento', sub: 'Cuidado profesional' },
    { icon: 'razor2', label: 'Afeitado Clásico', sub: 'Tradición barbera' },
  ]
  return (
    <section id="gallery" className="py-24 bg-black">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 ${r.cls}`}>
        <div className="text-center mb-14"><Label text="Galería" /><Title>Nuestros <span className="text-amber-400">Trabajos</span></Title></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((it, i) => (
            <div key={i} className="group relative aspect-square rounded-2xl bg-zinc-900/60 border border-zinc-800/60 overflow-hidden hover:border-amber-500/40 transition-all duration-500 cursor-pointer">
              <img src={ICONS[it.icon]} alt={it.label} className="absolute inset-0 w-full h-full object-contain p-4 sm:p-6 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-5 right-5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-sm font-semibold text-amber-400">{it.label}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{it.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════ BENEFITS ═══════════ */
function Benefits() {
  const r = useReveal()
  const items = [
    { i: 'chair', t: 'Ambiente Premium', d: 'Espacio diseñado para tu comodidad con música, bebidas y la mejor atención.' },
    { i: 'spray', t: 'Productos de Calidad', d: 'Trabajamos con las mejores marcas profesionales del mercado.' },
    { i: 'brush', t: 'Higiene Garantizada', d: 'Protocolos estrictos de limpieza y esterilización en cada servicio.' },
    { i: 'razor', t: 'Estilistas Expertos', d: 'Equipo capacitado en las últimas tendencias internacionales.' },
  ]
  return (
    <section className="py-24 bg-zinc-950">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 ${r.cls}`}>
        <div className="text-center mb-14"><Label text="¿Por qué elegirnos?" /><Title>La <span className="text-amber-400">Diferencia</span> Zac Barber</Title></div>
        <div className="grid sm:grid-cols-2 gap-5">
          {items.map(b => (
            <div key={b.t} className="flex gap-5 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-7 hover:border-amber-500/30 hover:bg-zinc-900/60 transition-all duration-300">
              <div className="flex-shrink-0 h-16 w-16 rounded-xl bg-amber-500/10 flex items-center justify-center p-1"><Ico name={b.i} size={48} /></div>
              <div><h3 className="text-base font-semibold text-white mb-1.5">{b.t}</h3><p className="text-sm text-zinc-500 leading-relaxed">{b.d}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════ TESTIMONIALS ═══════════ */
function Testimonials() {
  const r = useReveal()
  const items = [
    { n: 'Carlos M.', t: 'El mejor lugar para cortarse el pelo. La atención es increíble y el resultado siempre es impecable. 100% recomendado.' },
    { n: 'Andrés R.', t: 'Llevo más de 2 años viniendo y nunca me han decepcionado. Los barberos son verdaderos artistas.' },
    { n: 'David L.', t: 'El ambiente, la atención, los productos... todo es de primera. Reservar por el chat es súper fácil.' },
  ]
  return (
    <section className="py-24 bg-black">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 ${r.cls}`}>
        <div className="text-center mb-14"><Label text="Testimonios" /><Title>Lo que dicen nuestros <span className="text-amber-400">clientes</span></Title></div>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map(t => (
            <div key={t.n} className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-7 hover:border-amber-500/30 transition-all duration-300">
              <div className="flex gap-0.5 mb-5">{[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-sm">★</span>)}</div>
              <p className="text-zinc-300 text-sm leading-relaxed italic mb-6">"{t.t}"</p>
              <div className="flex items-center gap-3 pt-5 border-t border-zinc-800/50">
                <div className="h-9 w-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-xs font-bold">{t.n.split(' ').map(w => w[0]).join('')}</div>
                <div><p className="text-sm font-medium text-white">{t.n}</p><p className="text-[11px] text-zinc-500">Cliente frecuente</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════ PROCESS ═══════════ */
function Process({ onChat }: { onChat: () => void }) {
  const r = useReveal()
  const steps = [
    { n: '01', t: 'Elige tu servicio', d: 'Explora nuestro catálogo y elige lo que necesitas.', i: 'scissors' },
    { n: '02', t: 'Reserva tu cita', d: 'Agenda en segundos por chat, WhatsApp o llamada.', i: 'chair' },
    { n: '03', t: 'Disfruta la experiencia', d: 'Relájate mientras nuestros expertos trabajan.', i: 'brush' },
    { n: '04', t: 'Luce increíble', d: 'Sal con un look renovado y listo para conquistar.', i: 'pole' },
  ]
  return (
    <section className="py-24 bg-zinc-950">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 ${r.cls}`}>
        <div className="text-center mb-14"><Label text="Cómo funciona" /><Title>Reserva en <span className="text-amber-400">4 pasos</span></Title></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.n} className="text-center group relative">
              {i < 3 && <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-amber-500/20 to-transparent" />}
              <div className="relative mx-auto mb-5 h-20 w-20 rounded-2xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-300 p-1">
                <Ico name={s.i} size={56} />
              </div>
              <span className="text-amber-500/40 text-[11px] font-bold tracking-widest">{s.n}</span>
              <h3 className="text-white font-semibold mt-1.5 mb-2">{s.t}</h3>
              <p className="text-sm text-zinc-500">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <button onClick={onChat} className="rounded-full bg-amber-500 px-10 py-3.5 text-sm font-bold text-black hover:bg-amber-400 transition-all hover:shadow-lg hover:shadow-amber-500/20">Comenzar Ahora</button>
        </div>
      </div>
    </section>
  )
}

/* ═══════════ FAQ ═══════════ */
function FAQ() {
  const r = useReveal()
  const [op, setOp] = useState<number | null>(null)
  const faqs = [
    { q: '¿Cómo puedo reservar una cita?', a: 'Puedes reservar directamente desde nuestro chat con IA, por WhatsApp, o llamándonos al teléfono de la barbería.' },
    { q: '¿Aceptan pagos con tarjeta?', a: 'Sí, aceptamos efectivo, tarjeta débito/crédito, Nequi y Daviplata.' },
    { q: '¿Qué pasa si llego tarde a mi cita?', a: 'Tenemos una tolerancia de 10 minutos. Después de ese tiempo, la cita podría ser reasignada.' },
    { q: '¿Puedo cancelar o reagendar mi cita?', a: 'Sí, puedes cancelar o reagendar con al menos 1 hora de anticipación sin ningún cargo.' },
    { q: '¿Trabajan con productos específicos?', a: 'Usamos productos premium de marcas reconocidas. Si tienes alguna preferencia o alergia, cuéntanos.' },
  ]
  return (
    <section id="faq" className="py-24 bg-black">
      <div ref={r.ref} className={`mx-auto max-w-3xl px-6 ${r.cls}`}>
        <div className="text-center mb-14"><Label text="FAQ" /><Title>Preguntas <span className="text-amber-400">Frecuentes</span></Title></div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className={`rounded-xl border bg-zinc-900/30 overflow-hidden transition-colors duration-200 ${op === i ? 'border-amber-500/30' : 'border-zinc-800/60 hover:border-zinc-700'}`}>
              <button onClick={() => setOp(op === i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                <span className="text-sm font-medium text-white">{f.q}</span>
                <span className={`text-amber-400 text-lg transition-transform duration-300 flex-shrink-0 ${op === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${op === i ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                <p className="px-6 text-sm text-zinc-400 leading-relaxed">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════ LOCATION ═══════════ */
function Location() {
  const r = useReveal()
  return (
    <section id="location" className="py-24 bg-zinc-950">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 ${r.cls}`}>
        <div>
          <Label text="Ubicación" />
          <Title>Visítanos en nuestra <span className="text-amber-400">Sede</span></Title>
          <div className="space-y-5 mt-8">
            {[
              { l: 'Dirección', v: 'Calle 85 #15-20, Bogotá' },
              { l: 'Horario', v: 'Lun - Sáb: 9:00 AM - 8:00 PM' },
              { l: 'Teléfono', v: '+57 300 123 4567' },
              { l: 'Email', v: 'info@zacbarber.co' },
            ].map(it => (
              <div key={it.l} className="flex items-start gap-4">
                <div className="h-2 w-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <div><p className="text-[11px] text-zinc-600 uppercase tracking-[0.15em] font-medium">{it.l}</p><p className="text-zinc-300 mt-0.5">{it.v}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/60 overflow-hidden min-h-[320px] flex items-center justify-center">
          <div className="text-center px-8">
            <img src="/img/logo.png" alt="" className="mx-auto h-16 w-16 rounded-full opacity-40" />
            <p className="text-zinc-500 text-sm mt-4">Mapa de Google Maps</p>
            <p className="text-zinc-700 text-xs mt-1">Reemplazar con iframe</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════ CTA FINAL ═══════════ */
function CTAFinal({ onChat }: { onChat: () => void }) {
  const r = useReveal()
  return (
    <section className="relative py-28 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/[0.03] blur-[120px]" />
      <div ref={r.ref} className={`relative mx-auto max-w-3xl px-6 text-center ${r.cls}`}>
        <Ico name="scissors" size={52} className="mx-auto" />
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mt-8 mb-5 leading-tight">¿Listo para un <em className="text-amber-400 italic">nuevo look</em>?</h2>
        <p className="text-zinc-400 mb-10 max-w-lg mx-auto leading-relaxed">No esperes más. Reserva tu cita ahora y descubre por qué somos la barbería preferida de la ciudad.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onChat} className="rounded-full bg-amber-500 px-12 py-4 text-base font-bold text-black hover:bg-amber-400 hover:scale-[1.03] transition-all shadow-xl shadow-amber-500/20">Reservar Ahora</button>
          <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-zinc-700 px-12 py-4 text-base font-bold text-zinc-300 hover:border-amber-500/40 hover:text-amber-400 transition-all">WhatsApp</a>
        </div>
      </div>
    </section>
  )
}

/* ═══════════ FOOTER ═══════════ */
function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/img/logo.png" alt="Zac Barber" className="h-10 w-10 rounded-full" />
              <span className="font-display text-lg font-semibold text-amber-400">ZAC BARBER</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">Más que una barbería, una experiencia premium. Donde cada corte es una obra de arte.</p>
            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a href="https://instagram.com/zacbarber" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-amber-500/10 hover:text-amber-400 transition-all" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://facebook.com/zacbarber" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-amber-500/10 hover:text-amber-400 transition-all" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://tiktok.com/@zacbarber" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-amber-500/10 hover:text-amber-400 transition-all" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
              <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-amber-500/10 hover:text-amber-400 transition-all" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.315 0-4.458-.766-6.183-2.059l-.433-.324-2.641.885.885-2.641-.324-.433A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              </a>
            </div>
          </div>
          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Servicios</h4>
            <div className="space-y-2.5">
              {['Corte Clásico', 'Corte + Barba', 'Degradado', 'Barba Premium', 'Tratamiento Capilar'].map(s => (
                <a key={s} href="#services" className="block text-sm text-zinc-500 hover:text-amber-400 transition-colors">{s}</a>
              ))}
            </div>
          </div>
          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Información</h4>
            <div className="space-y-2.5">
              {[['Nosotros', '#about'], ['Galería', '#gallery'], ['FAQ', '#faq'], ['Ubicación', '#location']].map(([l, h]) => (
                <a key={l} href={h} className="block text-sm text-zinc-500 hover:text-amber-400 transition-colors">{l}</a>
              ))}
            </div>
          </div>
          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contacto</h4>
            <div className="space-y-3 text-sm text-zinc-500">
              <p>Calle 85 #15-20</p>
              <p>Bogotá, Colombia</p>
              <p>+57 300 123 4567</p>
              <p>info@zacbarber.co</p>
              <p className="text-xs text-zinc-600 mt-4">Lun - Sáb: 9:00 AM - 8:00 PM</p>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom */}
      <div className="border-t border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">© 2026 Zac Barber. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-xs text-zinc-600">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════ PAGE ═══════════ */
export default function Landing() {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMsg, setChatMsg] = useState<string | undefined>()
  function openChat(m?: string) { setChatMsg(m); setChatOpen(true) }
  function closeChat() { setChatOpen(false); setChatMsg(undefined) }
  return (
    <div className="bg-black text-white font-body">
      <Navbar onChat={() => openChat()} />
      <Hero onChat={() => openChat()} />
      <Stats />
      <About />
      <Services onChat={openChat} />
      <Gallery />
      <Benefits />
      <Testimonials />
      <Process onChat={() => openChat()} />
      <FAQ />
      <Location />
      <CTAFinal onChat={() => openChat()} />
      <Footer />
      {!chatOpen && (
        <button onClick={() => openChat()} className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 shadow-xl shadow-amber-500/30 transition-all hover:bg-amber-400 hover:scale-110 active:scale-100" aria-label="Abrir chat">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </button>
      )}
      {chatOpen && <ChatWidget onClose={closeChat} initialMessage={chatMsg} />}
    </div>
  )
}
