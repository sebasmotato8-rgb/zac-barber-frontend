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
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, className: `transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}` }
}

const SPRITE_ICONS = [
  { name: 'logo', col: 0, row: 0 },
  { name: 'barber-pole', col: 1, row: 0 },
  { name: 'razor', col: 2, row: 0 },
  { name: 'clipper', col: 3, row: 0 },
  { name: 'scissors', col: 4, row: 0 },
  { name: 'comb', col: 0, row: 1 },
  { name: 'brush', col: 1, row: 1 },
  { name: 'chair', col: 2, row: 1 },
  { name: 'profile', col: 3, row: 1 },
  { name: 'blade', col: 4, row: 1 },
  { name: 'spray', col: 0, row: 2 },
  { name: 'bowl', col: 1, row: 2 },
  { name: 'brush2', col: 2, row: 2 },
  { name: 'towel', col: 3, row: 2 },
  { name: 'mustache', col: 4, row: 2 },
]

function SpriteIcon({ name, size = 48 }: { name: string; size?: number }) {
  const icon = SPRITE_ICONS.find(i => i.name === name)
  if (!icon) return null
  const spriteW = 1240
  const spriteH = 744
  const cellW = spriteW / 5
  const cellH = spriteH / 3
  const scale = size / Math.min(cellW, cellH)
  return (
    <div
      className="inline-block flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundImage: 'url(/img/icons-sprite.png)',
        backgroundSize: `${spriteW * scale}px ${spriteH * scale}px`,
        backgroundPosition: `-${icon.col * cellW * scale}px -${icon.row * cellH * scale}px`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const links = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Nosotros', href: '#about' },
    { label: 'Servicios', href: '#services' },
    { label: 'Galería', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contacto', href: '#location' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur shadow-lg shadow-amber-500/5' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
        <a href="#hero" className="flex items-center gap-2">
          <img src="/img/logo.png" alt="Zac Barber" className="h-10 w-10 rounded-full" />
          <span className="text-lg font-bold tracking-wider text-amber-400">ZAC BARBER</span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-sm text-zinc-300 hover:text-amber-400 transition-colors">{l.label}</a>
          ))}
          <a href="#hero" className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition-colors">
            Reservar Cita
          </a>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-amber-400 text-2xl">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur border-t border-zinc-800 px-4 pb-4">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-2 text-zinc-300 hover:text-amber-400 transition-colors">{l.label}</a>
          ))}
          <a href="#hero" onClick={() => setMenuOpen(false)} className="mt-2 block rounded-full bg-amber-500 px-5 py-2 text-center text-sm font-semibold text-black">
            Reservar Cita
          </a>
        </div>
      )}
    </nav>
  )
}

function Hero({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/mp4/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <img src="/img/logo.png" alt="Zac Barber" className="mx-auto mb-6 h-28 w-28 rounded-full shadow-2xl shadow-amber-500/20 animate-[fadeInDown_1s_ease-out]" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight animate-[fadeInUp_1s_ease-out_0.3s_both]">
          Donde el Estilo<br />
          <span className="text-amber-400">se Hace Arte</span>
        </h1>
        <p className="text-lg sm:text-xl text-zinc-300 mb-8 animate-[fadeInUp_1s_ease-out_0.5s_both]">
          Más que un corte, una experiencia premium. Transforma tu look con los mejores barberos de la ciudad.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-[fadeInUp_1s_ease-out_0.7s_both]">
          <button onClick={onOpenChat} className="rounded-full bg-amber-500 px-8 py-3.5 text-lg font-bold text-black hover:bg-amber-400 hover:scale-105 transition-all shadow-lg shadow-amber-500/25">
            Reservar Cita
          </button>
          <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer"
            className="rounded-full border-2 border-amber-500 px-8 py-3.5 text-lg font-bold text-amber-400 hover:bg-amber-500/10 hover:scale-105 transition-all flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.315 0-4.458-.766-6.183-2.059l-.433-.324-2.641.885.885-2.641-.324-.433A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            WhatsApp
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

function Stats() {
  const r = useScrollReveal()
  const stats = [
    { value: '5,000+', label: 'Clientes Satisfechos', icon: 'profile' as const },
    { value: '8+', label: 'Años de Experiencia', icon: 'scissors' as const },
    { value: '15,000+', label: 'Cortes Realizados', icon: 'clipper' as const },
    { value: '4.9', label: 'Calificación Promedio', icon: 'barber-pole' as const },
  ]
  return (
    <section className="relative py-16 bg-zinc-950 border-y border-zinc-800">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-4 grid grid-cols-2 md:grid-cols-4 gap-8 ${r.className}`}>
        {stats.map(s => (
          <div key={s.label} className="text-center group">
            <div className="flex justify-center mb-3">
              <SpriteIcon name={s.icon} size={40} />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-1">{s.value}</div>
            <div className="text-sm text-zinc-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function About() {
  const r = useScrollReveal()
  return (
    <section id="about" className="py-20 bg-black">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-12 items-center ${r.className}`}>
        <div>
          <div className="flex items-center gap-3 mb-4">
            <SpriteIcon name="barber-pole" size={32} />
            <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">Sobre Nosotros</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Tradición y <span className="text-amber-400">Modernidad</span> en cada corte
          </h2>
          <p className="text-zinc-400 mb-4 leading-relaxed">
            En Zac Barber fusionamos la tradición barbera con las técnicas más modernas. Cada servicio es una experiencia
            personalizada donde el detalle y la precisión se combinan para resaltar tu mejor versión.
          </p>
          <p className="text-zinc-400 mb-6 leading-relaxed">
            Nuestro equipo de barberos profesionales se capacita constantemente en las últimas tendencias
            internacionales para ofrecerte un resultado impecable. Más que una barbería, somos tu espacio de confianza.
          </p>
          <div className="flex flex-wrap gap-4">
            {['Barberos Certificados', 'Productos Premium', 'Ambiente Exclusivo'].map(tag => (
              <span key={tag} className="rounded-full border border-amber-500/30 bg-amber-500/5 px-4 py-1.5 text-xs text-amber-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <SpriteIcon name="chair" size={120} />
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <p className="text-amber-400 text-sm font-semibold">Zac Barber</p>
              <p className="text-white text-xs">Donde tu estilo cobra vida</p>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-center">
            <SpriteIcon name="scissors" size={40} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Services() {
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
    <section id="services" className="py-20 bg-zinc-950">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-4 ${r.className}`}>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SpriteIcon name="comb" size={28} />
            <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">Servicios</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Nuestros <span className="text-amber-400">Servicios</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s.name} className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-amber-500/50 hover:bg-zinc-900 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <SpriteIcon name={s.icon} size={40} />
                <span className="text-amber-400 text-xl font-bold">{s.price}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{s.name}</h3>
              <p className="text-sm text-zinc-400 mb-3">{s.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">⏱ {s.duration}</span>
                <button className="text-xs text-amber-400 hover:text-amber-300 transition-colors group-hover:underline">
                  Reservar →
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
  const icons = ['profile', 'scissors', 'clipper', 'razor', 'brush', 'comb'] as const
  return (
    <section id="gallery" className="py-20 bg-black">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-4 ${r.className}`}>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SpriteIcon name="profile" size={28} />
            <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">Galería</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Nuestros <span className="text-amber-400">Trabajos</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {icons.map((icon, i) => (
            <div key={i} className="group relative aspect-square rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                <SpriteIcon name={icon} size={80} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <p className="text-xs text-amber-400 font-semibold">Trabajo #{i + 1}</p>
                <p className="text-xs text-zinc-400">Estilo personalizado</p>
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
  const benefits = [
    { icon: 'chair', title: 'Ambiente Premium', desc: 'Espacio diseñado para tu comodidad con música, bebidas y la mejor atención.' },
    { icon: 'bowl', title: 'Productos de Calidad', desc: 'Trabajamos con las mejores marcas profesionales del mercado.' },
    { icon: 'towel', title: 'Higiene Garantizada', desc: 'Protocolos estrictos de limpieza y esterilización en cada servicio.' },
    { icon: 'mustache', title: 'Estilistas Expertos', desc: 'Equipo capacitado en las últimas tendencias internacionales.' },
  ]
  return (
    <section className="py-20 bg-zinc-950">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-4 ${r.className}`}>
        <div className="text-center mb-12">
          <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">¿Por qué elegirnos?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            La <span className="text-amber-400">Diferencia</span> Zac Barber
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {benefits.map(b => (
            <div key={b.title} className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-amber-500/30 transition-all duration-300">
              <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <SpriteIcon name={b.icon} size={32} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{b.title}</h3>
                <p className="text-sm text-zinc-400">{b.desc}</p>
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
  const testimonials = [
    { name: 'Carlos M.', text: 'El mejor lugar para cortarse el pelo. La atención es increíble y el resultado siempre es impecable. 100% recomendado.', rating: 5 },
    { name: 'Andrés R.', text: 'Llevo más de 2 años viniendo y nunca me han decepcionado. Los barberos son verdaderos artistas.', rating: 5 },
    { name: 'David L.', text: 'El ambiente, la atención, los productos... todo es de primera. Reservar por el chat es súper fácil.', rating: 5 },
  ]
  return (
    <section className="py-20 bg-black">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-4 ${r.className}`}>
        <div className="text-center mb-12">
          <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">Testimonios</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Lo que dicen nuestros <span className="text-amber-400">clientes</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-amber-500/30 transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
              <p className="text-zinc-300 text-sm mb-4 leading-relaxed italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <SpriteIcon name="profile" size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500">Cliente frecuente</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  const r = useScrollReveal()
  const steps = [
    { num: '01', title: 'Elige tu servicio', desc: 'Explora nuestro catálogo y elige lo que necesitas.', icon: 'comb' },
    { num: '02', title: 'Reserva tu cita', desc: 'Agenda en segundos por chat, WhatsApp o llamada.', icon: 'chair' },
    { num: '03', title: 'Disfruta la experiencia', desc: 'Relájate mientras nuestros expertos trabajan su magia.', icon: 'scissors' },
    { num: '04', title: 'Luce increíble', desc: 'Sal con un look renovado y listo para conquistar.', icon: 'profile' },
  ]
  return (
    <section className="py-20 bg-zinc-950">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-4 ${r.className}`}>
        <div className="text-center mb-12">
          <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">Cómo funciona</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Reserva en <span className="text-amber-400">4 pasos</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(s => (
            <div key={s.num} className="text-center group">
              <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-300">
                <SpriteIcon name={s.icon} size={32} />
              </div>
              <span className="text-amber-400/50 text-xs font-bold">{s.num}</span>
              <h3 className="text-white font-semibold mt-1 mb-2">{s.title}</h3>
              <p className="text-sm text-zinc-400">{s.desc}</p>
            </div>
          ))}
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
    <section id="faq" className="py-20 bg-black">
      <div ref={r.ref} className={`mx-auto max-w-3xl px-4 ${r.className}`}>
        <div className="text-center mb-12">
          <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Preguntas <span className="text-amber-400">Frecuentes</span>
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden hover:border-amber-500/30 transition-colors">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium text-white">{f.q}</span>
                <span className={`text-amber-400 transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                <p className="px-6 text-sm text-zinc-400">{f.a}</p>
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
    <section id="location" className="py-20 bg-zinc-950">
      <div ref={r.ref} className={`mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-8 ${r.className}`}>
        <div>
          <div className="flex items-center gap-3 mb-4">
            <SpriteIcon name="barber-pole" size={28} />
            <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">Ubicación</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Visítanos en nuestra <span className="text-amber-400">Sede</span>
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Dirección', value: 'Calle 85 #15-20, Bogotá' },
              { label: 'Horario', value: 'Lun - Sáb: 9:00 AM - 8:00 PM' },
              { label: 'Teléfono', value: '+57 300 123 4567' },
              { label: 'Email', value: 'info@zacbarber.co' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">{item.label}</p>
                  <p className="text-zinc-300">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            {['Instagram', 'TikTok', 'Facebook'].map(s => (
              <a key={s} href="#" className="rounded-full border border-zinc-700 px-4 py-2 text-xs text-zinc-400 hover:border-amber-500/50 hover:text-amber-400 transition-all">
                {s}
              </a>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden min-h-[300px] flex items-center justify-center">
          <div className="text-center px-8">
            <SpriteIcon name="logo" size={60} />
            <p className="text-zinc-500 text-sm mt-4">Aquí va el mapa de Google Maps</p>
            <p className="text-zinc-600 text-xs mt-1">Reemplazar con iframe de Maps</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTAFinal({ onOpenChat }: { onOpenChat: () => void }) {
  const r = useScrollReveal()
  return (
    <section className="relative py-24 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
      <div ref={r.ref} className={`relative mx-auto max-w-3xl px-4 text-center ${r.className}`}>
        <SpriteIcon name="scissors" size={48} />
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-4">
          ¿Listo para un <span className="text-amber-400">nuevo look</span>?
        </h2>
        <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
          No esperes más. Reserva tu cita ahora y descubre por qué somos la barbería preferida de la ciudad.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onOpenChat} className="rounded-full bg-amber-500 px-10 py-4 text-lg font-bold text-black hover:bg-amber-400 hover:scale-105 transition-all shadow-lg shadow-amber-500/25">
            Reservar Ahora
          </button>
          <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer"
            className="rounded-full border-2 border-amber-500/50 px-10 py-4 text-lg font-bold text-amber-400 hover:bg-amber-500/10 transition-all">
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-8">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/img/logo.png" alt="Zac Barber" className="h-8 w-8 rounded-full" />
          <span className="text-sm text-zinc-500">© 2026 Zac Barber. Todos los derechos reservados.</span>
        </div>
        <div className="flex gap-6 text-xs text-zinc-500">
          <a href="#" className="hover:text-amber-400 transition-colors">Privacidad</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Términos</a>
          <a href="#services" className="hover:text-amber-400 transition-colors">Servicios</a>
        </div>
      </div>
    </footer>
  )
}

export default function Landing() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="bg-black text-white">
      <Navbar />
      <Hero onOpenChat={() => setChatOpen(true)} />
      <Stats />
      <About />
      <Services />
      <Gallery />
      <Benefits />
      <Testimonials />
      <Process />
      <FAQ />
      <Location />
      <CTAFinal onOpenChat={() => setChatOpen(true)} />
      <Footer />

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-2xl text-zinc-900 shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-400 hover:scale-110"
          aria-label="Abrir chat"
        >
          💬
        </button>
      )}
      {chatOpen && <ChatWidget onClose={() => setChatOpen(false)} />}
    </div>
  )
}
