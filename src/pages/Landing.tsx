import { useState, useEffect, useRef } from 'react'
import ChatWidget from '../components/ChatWidget'

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, cls: visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6' }
}

const SPRITE = [
  { name: 'logo', col: 0, row: 0 }, { name: 'barber-pole', col: 1, row: 0 },
  { name: 'razor', col: 2, row: 0 }, { name: 'clipper', col: 3, row: 0 },
  { name: 'scissors', col: 4, row: 0 }, { name: 'comb', col: 0, row: 1 },
  { name: 'brush', col: 1, row: 1 }, { name: 'chair', col: 2, row: 1 },
  { name: 'profile', col: 3, row: 1 }, { name: 'blade', col: 4, row: 1 },
  { name: 'spray', col: 0, row: 2 }, { name: 'bowl', col: 1, row: 2 },
  { name: 'brush2', col: 2, row: 2 }, { name: 'towel', col: 3, row: 2 },
  { name: 'mustache', col: 4, row: 2 },
]

function Icon({ name, size = 48 }: { name: string; size?: number }) {
  const ic = SPRITE.find(i => i.name === name)
  if (!ic) return null
  const W = 1240, H = 744, cW = W / 5, cH = H / 3
  const scale = (size * 1.35) / Math.min(cW, cH)
  const oX = -ic.col * cW * scale + (size - cW * scale) / 2
  const oY = -ic.row * cH * scale + (size - cH * scale) / 2
  return (
    <div className="inline-block flex-shrink-0" style={{
      width: size, height: size,
      backgroundImage: 'url(/img/icons-sprite.png)',
      backgroundSize: `${W * scale}px ${H * scale}px`,
      backgroundPosition: `${oX}px ${oY}px`,
      backgroundRepeat: 'no-repeat',
    }} />
  )
}

function SectionLabel({ icon, text }: { icon?: string; text: string }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      {icon && <Icon name={icon} size={24} />}
      <span className="text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase">{text}</span>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-semibold text-white leading-tight">
      {children}
    </h2>
  )
}

/* ════════════════════════════════════════════════════════════════ */

function Navbar({ onOpenChat }: { onOpenChat: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links = [
    { label: 'Inicio', href: '#hero' }, { label: 'Nosotros', href: '#about' },
    { label: 'Servicios', href: '#services' }, { label: 'Galería', href: '#gallery' },
    { label: 'FAQ', href: '#faq' }, { label: 'Contacto', href: '#location' },
  ]
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-black/30 py-2' : 'bg-gradient-to-b from-black/60 to-transparent py-4'}`}>
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6">
        <a href="#hero" className="flex items-center gap-3 group">
          <img src="/img/logo.png" alt="Zac Barber" className="h-10 w-10 rounded-full group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-shadow" />
          <span className="text-lg font-display font-semibold tracking-wider text-amber-400">ZAC BARBER</span>
        </a>
        <div className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-[13px] font-medium text-zinc-300 hover:text-amber-400 transition-colors tracking-wide">{l.label}</a>
          ))}
          <button onClick={onOpenChat} className="rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition-all hover:shadow-lg hover:shadow-amber-500/20">
            Reservar Cita
          </button>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-amber-400 p-2">
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          )}
        </button>
      </div>
      {menuOpen && (
        <div className="lg:hidden bg-black/98 backdrop-blur-md border-t border-zinc-800/50 px-6 pb-6 pt-4 space-y-1">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-2.5 text-zinc-300 hover:text-amber-400 transition-colors font-medium">{l.label}</a>
          ))}
          <button onClick={() => { setMenuOpen(false); onOpenChat() }} className="mt-3 w-full rounded-full bg-amber-500 px-5 py-3 text-sm font-bold text-black">
            Reservar Cita
          </button>
        </div>
      )}
    </nav>
  )
}

function Hero({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <section id="hero" className="relative h-screen min-h-[600px] max-h-[1000px] flex items-center justify-center overflow-hidden">
      <video autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.45) contrast(1.1)', objectPosition: 'center 30%' }}>
        <source src="/mp4/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <img src="/img/logo.png" alt="Zac Barber"
          className="mx-auto mb-8 h-24 w-24 sm:h-32 sm:w-32 rounded-full shadow-2xl shadow-amber-500/30 ring-2 ring-amber-500/20 animate-[fadeInDown_1s_ease-out]" />
        <h1 className="animate-[fadeInUp_1s_ease-out_0.3s_both]">
          <span className="block font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] mb-2">
            Donde el Estilo
          </span>
          <span className="block font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1]">
            <em className="text-amber-400 italic">se Hace Arte</em>
          </span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-zinc-300/90 max-w-xl mx-auto animate-[fadeInUp_1s_ease-out_0.5s_both] font-light tracking-wide">
          Más que un corte, una experiencia premium. Transforma tu look con los mejores barberos de la ciudad.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-[fadeInUp_1s_ease-out_0.7s_both]">
          <button onClick={onOpenChat}
            className="rounded-full bg-amber-500 px-10 py-4 text-base font-bold text-black hover:bg-amber-400 hover:scale-[1.03] active:scale-100 transition-all shadow-xl shadow-amber-500/25">
            Reservar Cita
          </button>
          <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer"
            className="rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm px-10 py-4 text-base font-bold text-white hover:border-amber-400/50 hover:text-amber-400 hover:scale-[1.03] active:scale-100 transition-all flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.315 0-4.458-.766-6.183-2.059l-.433-.324-2.641.885.885-2.641-.324-.433A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            WhatsApp
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

function Stats() {
  const r = useScrollReveal()
  const stats = [
    { value: '5,000+', label: 'Clientes Satisfechos', icon: 'profile' },
    { value: '8+', label: 'Años de Experiencia', icon: 'scissors' },
    { value: '15,000+', label: 'Cortes Realizados', icon: 'clipper' },
    { value: '4.9', label: 'Calificación Promedio', icon: 'barber-pole' },
  ]
  return (
    <section className="py-20 bg-zinc-950/80">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-10 transition-all duration-700 ${r.cls}`}>
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <div className="flex justify-center mb-4"><Icon name={s.icon} size={36} /></div>
            <div className="font-display text-3xl md:text-4xl font-semibold text-amber-400">{s.value}</div>
            <div className="text-sm text-zinc-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function About() {
  const r = useScrollReveal()
  return (
    <section id="about" className="py-24 bg-black">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 items-center transition-all duration-700 ${r.cls}`}>
        <div>
          <SectionLabel icon="barber-pole" text="Sobre Nosotros" />
          <SectionTitle>
            Tradición y <span className="text-amber-400">Modernidad</span> en cada corte
          </SectionTitle>
          <p className="text-zinc-400 mt-6 leading-relaxed">
            En Zac Barber fusionamos la tradición barbera con las técnicas más modernas. Cada servicio es una experiencia
            personalizada donde el detalle y la precisión se combinan para resaltar tu mejor versión.
          </p>
          <p className="text-zinc-400 mt-4 leading-relaxed">
            Nuestro equipo de barberos profesionales se capacita constantemente en las últimas tendencias
            internacionales para ofrecerte un resultado impecable.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {['Barberos Certificados', 'Productos Premium', 'Ambiente Exclusivo'].map(tag => (
              <span key={tag} className="rounded-full border border-amber-500/20 bg-amber-500/5 px-5 py-2 text-xs font-medium text-amber-400 tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="w-full max-w-sm aspect-[3/4] rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-zinc-900/20 to-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="chair" size={180} />
            </div>
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <p className="font-display text-lg text-amber-400">Zac Barber</p>
              <p className="text-sm text-zinc-400 mt-1">Donde tu estilo cobra vida</p>
            </div>
          </div>
          <div className="absolute -bottom-5 -right-5 h-28 w-28 rounded-2xl border border-amber-500/15 bg-zinc-900 flex items-center justify-center shadow-xl">
            <Icon name="scissors" size={50} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Services({ onOpenChat }: { onOpenChat: (msg?: string) => void }) {
  const r = useScrollReveal()
  const services = [
    { name: 'Corte Clásico', price: '$25.000', duration: '30 min', icon: 'scissors', desc: 'Corte tradicional con acabado impecable.' },
    { name: 'Corte + Barba', price: '$40.000', duration: '45 min', icon: 'razor', desc: 'Combo completo para un look definido.' },
    { name: 'Barba Premium', price: '$20.000', duration: '25 min', icon: 'brush', desc: 'Perfilado y diseño de barba con toalla caliente.' },
    { name: 'Corte Degradado', price: '$30.000', duration: '40 min', icon: 'clipper', desc: 'Fade perfecto con transiciones suaves.' },
    { name: 'Tratamiento Capilar', price: '$35.000', duration: '30 min', icon: 'spray', desc: 'Hidratación y cuidado profesional.' },
    { name: 'Diseño de Cejas', price: '$10.000', duration: '15 min', icon: 'blade', desc: 'Perfilado preciso para una mirada definida.' },
  ]
  return (
    <section id="services" className="py-24 bg-zinc-950">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 transition-all duration-700 ${r.cls}`}>
        <div className="text-center mb-14">
          <SectionLabel icon="comb" text="Servicios" />
          <SectionTitle>Nuestros <span className="text-amber-400">Servicios</span></SectionTitle>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(s => (
            <div key={s.name} className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 hover:border-amber-500/40 hover:bg-zinc-900/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5">
              <div className="flex items-start justify-between mb-5">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Icon name={s.icon} size={28} />
                </div>
                <span className="text-amber-400 text-xl font-display font-semibold">{s.price}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{s.name}</h3>
              <p className="text-sm text-zinc-500 mb-4 leading-relaxed">{s.desc}</p>
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                <span className="text-xs text-zinc-600 font-medium">{s.duration}</span>
                <button
                  onClick={() => onOpenChat(`Quiero reservar un ${s.name}`)}
                  className="rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500 hover:text-black transition-all duration-200"
                >
                  Reservar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  const r = useScrollReveal()
  const items = [
    { icon: 'profile', label: 'Corte Fade', sub: 'Degradado perfecto' },
    { icon: 'scissors', label: 'Corte Clásico', sub: 'Elegancia atemporal' },
    { icon: 'clipper', label: 'Buzz Cut', sub: 'Limpio y preciso' },
    { icon: 'razor', label: 'Barba Esculpida', sub: 'Detalle artístico' },
    { icon: 'brush', label: 'Hot Towel Shave', sub: 'Experiencia premium' },
    { icon: 'comb', label: 'Texturizado', sub: 'Movimiento natural' },
  ]
  return (
    <section id="gallery" className="py-24 bg-black">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 transition-all duration-700 ${r.cls}`}>
        <div className="text-center mb-14">
          <SectionLabel icon="profile" text="Galería" />
          <SectionTitle>Nuestros <span className="text-amber-400">Trabajos</span></SectionTitle>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((it, i) => (
            <div key={i} className="group relative aspect-square rounded-2xl bg-zinc-900/60 border border-zinc-800/60 overflow-hidden hover:border-amber-500/40 transition-all duration-500 cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                <Icon name={it.icon} size={130} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-5 right-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
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

function Benefits() {
  const r = useScrollReveal()
  const items = [
    { icon: 'chair', title: 'Ambiente Premium', desc: 'Espacio diseñado para tu comodidad con música, bebidas y la mejor atención.' },
    { icon: 'bowl', title: 'Productos de Calidad', desc: 'Trabajamos con las mejores marcas profesionales del mercado.' },
    { icon: 'towel', title: 'Higiene Garantizada', desc: 'Protocolos estrictos de limpieza y esterilización en cada servicio.' },
    { icon: 'mustache', title: 'Estilistas Expertos', desc: 'Equipo capacitado en las últimas tendencias internacionales.' },
  ]
  return (
    <section className="py-24 bg-zinc-950">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 transition-all duration-700 ${r.cls}`}>
        <div className="text-center mb-14">
          <SectionLabel text="¿Por qué elegirnos?" />
          <SectionTitle>La <span className="text-amber-400">Diferencia</span> Zac Barber</SectionTitle>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {items.map(b => (
            <div key={b.title} className="flex gap-5 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-7 hover:border-amber-500/30 hover:bg-zinc-900/60 transition-all duration-300">
              <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Icon name={b.icon} size={30} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1.5">{b.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const r = useScrollReveal()
  const items = [
    { name: 'Carlos M.', text: 'El mejor lugar para cortarse el pelo. La atención es increíble y el resultado siempre es impecable. 100% recomendado.', rating: 5 },
    { name: 'Andrés R.', text: 'Llevo más de 2 años viniendo y nunca me han decepcionado. Los barberos son verdaderos artistas.', rating: 5 },
    { name: 'David L.', text: 'El ambiente, la atención, los productos... todo es de primera. Reservar por el chat es súper fácil.', rating: 5 },
  ]
  return (
    <section className="py-24 bg-black">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 transition-all duration-700 ${r.cls}`}>
        <div className="text-center mb-14">
          <SectionLabel text="Testimonios" />
          <SectionTitle>Lo que dicen nuestros <span className="text-amber-400">clientes</span></SectionTitle>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map(t => (
            <div key={t.name} className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-7 hover:border-amber-500/30 transition-all duration-300">
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed italic mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-5 border-t border-zinc-800/50">
                <div className="h-9 w-9 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Icon name="profile" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-[11px] text-zinc-500">Cliente frecuente</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process({ onOpenChat }: { onOpenChat: () => void }) {
  const r = useScrollReveal()
  const steps = [
    { num: '01', title: 'Elige tu servicio', desc: 'Explora nuestro catálogo y elige lo que necesitas.', icon: 'comb' },
    { num: '02', title: 'Reserva tu cita', desc: 'Agenda en segundos por chat, WhatsApp o llamada.', icon: 'chair' },
    { num: '03', title: 'Disfruta la experiencia', desc: 'Relájate mientras nuestros expertos trabajan.', icon: 'scissors' },
    { num: '04', title: 'Luce increíble', desc: 'Sal con un look renovado y listo para conquistar.', icon: 'profile' },
  ]
  return (
    <section className="py-24 bg-zinc-950">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 transition-all duration-700 ${r.cls}`}>
        <div className="text-center mb-14">
          <SectionLabel text="Cómo funciona" />
          <SectionTitle>Reserva en <span className="text-amber-400">4 pasos</span></SectionTitle>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.num} className="text-center group relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-amber-500/20 to-transparent" />
              )}
              <div className="relative mx-auto mb-5 h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-300">
                <Icon name={s.icon} size={30} />
              </div>
              <span className="text-amber-500/40 text-[11px] font-bold tracking-widest">{s.num}</span>
              <h3 className="text-white font-semibold mt-1.5 mb-2">{s.title}</h3>
              <p className="text-sm text-zinc-500">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <button onClick={onOpenChat}
            className="rounded-full bg-amber-500 px-10 py-3.5 text-sm font-bold text-black hover:bg-amber-400 transition-all hover:shadow-lg hover:shadow-amber-500/20">
            Comenzar Ahora
          </button>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const r = useScrollReveal()
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    { q: '¿Cómo puedo reservar una cita?', a: 'Puedes reservar directamente desde nuestro chat con IA, por WhatsApp, o llamándonos al teléfono de la barbería. El proceso es rápido y sencillo.' },
    { q: '¿Aceptan pagos con tarjeta?', a: 'Sí, aceptamos efectivo, tarjeta débito/crédito, Nequi y Daviplata.' },
    { q: '¿Qué pasa si llego tarde a mi cita?', a: 'Tenemos una tolerancia de 10 minutos. Después de ese tiempo, la cita podría ser reasignada.' },
    { q: '¿Puedo cancelar o reagendar mi cita?', a: 'Sí, puedes cancelar o reagendar con al menos 1 hora de anticipación sin ningún cargo.' },
    { q: '¿Trabajan con productos específicos?', a: 'Usamos productos premium de marcas reconocidas. Si tienes alguna preferencia o alergia, cuéntanos con anticipación.' },
  ]
  return (
    <section id="faq" className="py-24 bg-black">
      <div ref={r.ref} className={`mx-auto max-w-3xl px-6 transition-all duration-700 ${r.cls}`}>
        <div className="text-center mb-14">
          <SectionLabel text="FAQ" />
          <SectionTitle>Preguntas <span className="text-amber-400">Frecuentes</span></SectionTitle>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className={`rounded-xl border bg-zinc-900/30 overflow-hidden transition-colors duration-200 ${open === i ? 'border-amber-500/30' : 'border-zinc-800/60 hover:border-zinc-700'}`}>
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                <span className="text-sm font-medium text-white">{f.q}</span>
                <span className={`text-amber-400 text-lg transition-transform duration-300 flex-shrink-0 ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${open === i ? 'max-h-40 pb-5' : 'max-h-0'} overflow-hidden`}>
                <p className="px-6 text-sm text-zinc-400 leading-relaxed">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Location() {
  const r = useScrollReveal()
  return (
    <section id="location" className="py-24 bg-zinc-950">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 transition-all duration-700 ${r.cls}`}>
        <div>
          <SectionLabel icon="barber-pole" text="Ubicación" />
          <SectionTitle>Visítanos en nuestra <span className="text-amber-400">Sede</span></SectionTitle>
          <div className="space-y-5 mt-8">
            {[
              { label: 'Dirección', value: 'Calle 85 #15-20, Bogotá' },
              { label: 'Horario', value: 'Lun - Sáb: 9:00 AM - 8:00 PM' },
              { label: 'Teléfono', value: '+57 300 123 4567' },
              { label: 'Email', value: 'info@zacbarber.co' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="h-2 w-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-zinc-600 uppercase tracking-[0.15em] font-medium">{item.label}</p>
                  <p className="text-zinc-300 mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            {['Instagram', 'TikTok', 'Facebook'].map(s => (
              <a key={s} href="#" className="rounded-full border border-zinc-800 px-5 py-2 text-xs font-medium text-zinc-400 hover:border-amber-500/40 hover:text-amber-400 transition-all">
                {s}
              </a>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/60 overflow-hidden min-h-[320px] flex items-center justify-center">
          <div className="text-center px-8">
            <Icon name="logo" size={60} />
            <p className="text-zinc-500 text-sm mt-4">Mapa de Google Maps</p>
            <p className="text-zinc-700 text-xs mt-1">Reemplazar con iframe de Maps</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTAFinal({ onOpenChat }: { onOpenChat: () => void }) {
  const r = useScrollReveal()
  return (
    <section className="relative py-28 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/3 blur-[120px]" />
      <div ref={r.ref} className={`relative mx-auto max-w-3xl px-6 text-center transition-all duration-700 ${r.cls}`}>
        <Icon name="scissors" size={44} />
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mt-8 mb-5 leading-tight">
          ¿Listo para un <em className="text-amber-400 italic">nuevo look</em>?
        </h2>
        <p className="text-zinc-400 mb-10 max-w-lg mx-auto leading-relaxed">
          No esperes más. Reserva tu cita ahora y descubre por qué somos la barbería preferida de la ciudad.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onOpenChat}
            className="rounded-full bg-amber-500 px-12 py-4 text-base font-bold text-black hover:bg-amber-400 hover:scale-[1.03] transition-all shadow-xl shadow-amber-500/20">
            Reservar Ahora
          </button>
          <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer"
            className="rounded-full border-2 border-zinc-700 px-12 py-4 text-base font-bold text-zinc-300 hover:border-amber-500/40 hover:text-amber-400 transition-all">
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 bg-zinc-950 py-10">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/img/logo.png" alt="Zac Barber" className="h-8 w-8 rounded-full" />
          <span className="text-sm text-zinc-600">© 2026 Zac Barber. Todos los derechos reservados.</span>
        </div>
        <div className="flex gap-8 text-xs text-zinc-600">
          <a href="#" className="hover:text-amber-400 transition-colors">Privacidad</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Términos</a>
          <a href="#services" className="hover:text-amber-400 transition-colors">Servicios</a>
        </div>
      </div>
    </footer>
  )
}

/* ════════════════════════════════════════════════════════════════ */

export default function Landing() {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInitMsg, setChatInitMsg] = useState<string | undefined>()

  function openChat(msg?: string) {
    setChatInitMsg(msg)
    setChatOpen(true)
  }

  function closeChat() {
    setChatOpen(false)
    setChatInitMsg(undefined)
  }

  return (
    <div className="bg-black text-white font-body">
      <Navbar onOpenChat={() => openChat()} />
      <Hero onOpenChat={() => openChat()} />
      <Stats />
      <About />
      <Services onOpenChat={openChat} />
      <Gallery />
      <Benefits />
      <Testimonials />
      <Process onOpenChat={() => openChat()} />
      <FAQ />
      <Location />
      <CTAFinal onOpenChat={() => openChat()} />
      <Footer />

      {!chatOpen && (
        <button onClick={() => openChat()}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 shadow-xl shadow-amber-500/30 transition-all hover:bg-amber-400 hover:scale-110 active:scale-100"
          aria-label="Abrir chat">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}
      {chatOpen && <ChatWidget onClose={closeChat} initialMessage={chatInitMsg} />}
    </div>
  )
}
