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

      {/* ═══ 1 · HERO ═══ */}
      <section className="relative flex h-screen min-h-[600px] items-center overflow-hidden bg-[#0D0D0D]">
        <div ref={heroImgRef} className="absolute inset-0">
          <img src={PRODUCT.images[0]} alt="Chargly Magnetic Power Bank 10000mAh" className="h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(13,13,13,0.88) 0%, rgba(13,13,13,0.4) 100%)' }} />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-2 w-2 rounded-full bg-[#D4825A] animate-pulse" />
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-[#D4825A]">
              Chargly&trade; &mdash; Magnetic Power Bank
            </p>
          </div>
          <h1 className="font-display text-[clamp(4rem,9vw,8.5rem)] leading-[0.9] tracking-tight text-white">
            CHARGE<br />WITHOUT LIMITS
          </h1>
          <div className="mt-5 h-px w-10 bg-[#D4825A]" />
          <p className="mt-5 max-w-md text-base font-light leading-relaxed text-[#aaaaaa] sm:text-lg">
            Stop carrying cables that break. Snap the power bank onto your iPhone
            and get 2 full charges instantly. 10,000mAh &middot; MagSafe 15W.
          </p>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex -space-x-1.5">
              {['SM', 'JR', 'ES', 'MK'].map(n => (
                <span key={n} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0D0D0D] bg-[#D4825A] text-[9px] font-bold text-white">{n}</span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="h-3.5 w-3.5 text-[#D4825A]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
              <span className="ml-1 text-xs text-white/50">4.8/5 &middot; 127+ reviews</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/product" className="inline-flex items-center justify-center bg-[#D4825A] px-8 py-4 text-sm font-bold tracking-wider text-white uppercase transition-all hover:bg-[#B86C45]">
              Buy Now &mdash; $29.99
            </Link>
            <Link to="/product" className="inline-flex items-center justify-center border border-white/30 px-8 py-4 text-sm font-bold tracking-wider text-white uppercase transition-colors hover:bg-white/10">
              See Product
            </Link>
          </div>
          <p className="mt-3 text-xs text-white/35">Free worldwide shipping &middot; USA 5-11 days &middot; 30-day warranty</p>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <svg className="h-5 w-5 animate-[scrollBounce_2s_ease-in-out_infinite]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ═══ 2 · METRICS ═══ */}
      <section className="bg-[#F5F2EE] py-20">
        <Reveal>
          <div className="mx-auto grid max-w-5xl grid-cols-2 sm:grid-cols-4">
            {[
              { value: '10,000', label: 'mAh capacity' },
              { value: '15W', label: 'wireless charging' },
              { value: '30', label: 'day warranty' },
              { value: '2X', label: 'full iPhone charges' },
            ].map((s, i) => (
              <div key={s.label} className={`flex flex-col items-center py-6 ${i > 0 ? 'border-l border-[#D8D4CE]' : ''}`}>
                <span className="font-display text-5xl tracking-tight text-[#D4825A] sm:text-6xl">{s.value}</span>
                <span className="mt-2 text-[11px] font-medium uppercase tracking-[0.15em] text-[#888880]">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ 3 · THE PROBLEM ═══ */}
      <section className="bg-[#0D0D0D] py-24 sm:py-32">
        <Reveal>
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#D4825A] mb-6">
              &mdash; The problem
            </p>
            <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl">
              SOUND FAMILIAR?
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-3 text-left">
              {[
                { pain: 'Your iPhone dies by mid-afternoon', detail: 'Right when you need it most: navigating, working, or in an important meeting.' },
                { pain: 'Cables that break every month', detail: 'Always at the worst moment. And every new charger is $15-$25 thrown away.' },
                { pain: 'Huge power banks you never use', detail: 'Heavy, bulky, need their own cable. You end up leaving them at home.' },
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

      {/* ═══ 4 · THE SOLUTION ═══ */}
      <section className="bg-[#EEEBE6] py-24">
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[45%_55%] lg:gap-20">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#D4825A] mb-6">
                &mdash; The solution
              </p>
              <h2 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.92] tracking-tight text-[#1a1a1a]">
                SLIM AS<br />A CARD.<br />POWERFUL AS<br />A CHARGER.
              </h2>
              <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-[#888880]">
                Just snap it onto your iPhone. No cables, no hassle.
                So slim you'll forget it's in your pocket,
                so powerful you'll never run out of battery.
              </p>
              <div className="mt-6 space-y-2">
                {['Magnetically attaches in 1 second', 'Charges your iPhone 2 full times', 'Slimmer than a credit card'].map(b => (
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
                Add to Cart
              </button>
              <p className="mt-2 text-xs text-[#888880]">Free shipping &middot; USA 5-11 days / International 20-30 days</p>
            </div>
            <div className="relative overflow-hidden">
              <img src={PRODUCT.images[1]} alt="Chargly Power Bank front view" className="w-full object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 5 · HOW IT WORKS ═══ */}
      <section className="bg-[#0D0D0D] py-24">
        <Reveal>
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#D4825A] mb-3">So simple you won't believe it</p>
              <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl">3 STEPS. 0 CABLES.</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { step: '01', title: 'Snap it on', desc: 'Bring the Chargly close to your iPhone. The magnets align and lock it in place instantly.', img: PRODUCT.images[2] },
                { step: '02', title: 'Auto-charge', desc: '15W wireless charging starts immediately. No buttons, no cables.', img: PRODUCT.images[3] },
                { step: '03', title: 'Live limitless', desc: '10,000mAh gives you 2+ full charges. Use it all day without worry.', img: PRODUCT.images[4] },
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

      {/* ═══ 6 · GALLERY ═══ */}
      <section className="bg-[#EEEBE6] py-24">
        <Reveal>
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-10 text-center">
              <h2 className="font-display text-5xl tracking-tight text-[#1a1a1a] sm:text-6xl">THE COLLECTION</h2>
              <p className="mt-3 text-sm text-[#888880]">Available in multiple colors. Same power in every one.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:grid-rows-2" style={{ gridTemplateRows: 'repeat(2, 280px)' }}>
              <Link to="/product" className="group relative row-span-2 overflow-hidden bg-[#FAFAF8]">
                <img src={PRODUCT.images[5]} alt="Power bank color options" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
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
                View all images
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 7 · VIDEO DEMO ═══ */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#0D0D0D] pt-20 pb-20">
        <video ref={videoRef} src="/mp4/pagina.mp4" muted loop playsInline autoPlay className="absolute inset-0 h-full w-full object-cover" />
        <div className={`absolute inset-0 transition-opacity duration-700 ${videoPlaying ? 'bg-[#0D0D0D]/30' : 'bg-[#0D0D0D]/55'}`} />

        {!videoPlaying && (
          <Reveal className="relative z-10 flex flex-col items-center text-center">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-[#D4825A] mb-3">Product demo</p>
            <h2 className="font-display text-[clamp(3rem,8vw,5.5rem)] tracking-tight text-white">
              SEE IT IN ACTION
            </h2>
            <button
              onClick={playVideo}
              className="mt-8 flex h-20 w-20 items-center justify-center border border-white/30 rounded-full transition-all hover:border-white hover:scale-110"
            >
              <svg className="ml-1 h-7 w-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
            <p className="mt-6 text-sm font-light text-[#aaaaaa]">No cables. No limits. No excuses.</p>
          </Reveal>
        )}
      </section>

      {/* ═══ 8 · WHY CHARGLY ═══ */}
      <section className="bg-[#F5F2EE] py-24">
        <Reveal>
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-12 text-center font-display text-5xl tracking-tight text-[#1a1a1a] sm:text-6xl">
              WHY CHARGLY
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: '15W Charging', desc: 'The fastest wireless charging on the market. Your iPhone at 50% in 30 minutes.' },
                { icon: 'M4 8V6a6 6 0 0112 0v2h2a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1h2zm6-4a4 4 0 00-4 4v2h8V6a4 4 0 00-4-4z', title: 'Real 10,000mAh', desc: '37Wh certified. Up to 2.3 full charges of iPhone 15 verified.' },
                { icon: 'M12 2a4 4 0 00-4 4v8a4 4 0 008 0V6a4 4 0 00-4-4zM6 6v8a6 6 0 0012 0V6', title: 'Perfect MagSafe', desc: 'High-density N52 magnets. Self-aligns, won\'t fall, won\'t shift.' },
                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: '30-Day Warranty', desc: 'Not convinced? We refund your money. No questions, no fine print.' },
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

      {/* ═══ 9 · COMPATIBILITY ═══ */}
      <section className="bg-[#141414] py-24 sm:py-32">
        <Reveal>
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#D4825A] mb-4">
                Universal Compatibility
              </p>
              <h2 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.92] tracking-tight text-white">
                WORKS WITH<br />EVERYTHING
              </h2>
              <ul className="mt-8 space-y-3">
                {[
                  'iPhone 12, 13, 14, 15, 16 — native MagSafe',
                  'Android with Qi wireless (Samsung, Pixel, Xiaomi)',
                  'Any USB-C device — 20W wired charging',
                  'AirPods Pro, Galaxy Buds — direct wireless charging',
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
                View full specifications
              </Link>
            </div>
            <div>
              <img src={PRODUCT.images[7]} alt="Chargly compatible with iPhone and Android" className="w-full object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 10 · REVIEWS ═══ */}
      <section className="bg-[#EEEBE6] py-24">
        <Reveal>
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#D4825A] mb-3">127+ verified reviews</p>
              <h2 className="font-display text-5xl tracking-tight text-[#1a1a1a] sm:text-6xl">WHAT THEY SAY</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { name: 'Sarah M.', city: 'Los Angeles', text: 'Amazing product! So slim I forget it\'s in my pocket. Got 2 full charges on my iPhone 15 Pro.' },
                { name: 'Jake R.', city: 'New York', text: 'Arrived faster than expected. The product is exactly as shown in the photos. Already ordered another one for my girlfriend.' },
                { name: 'Emily S.', city: 'Miami', text: 'Snaps right onto my iPhone without cables. Doesn\'t fall off, doesn\'t shift. Best purchase I\'ve made this year by far.' },
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
                    <p className="text-[11px] text-[#888880] mt-0.5">{r.city} &middot; Verified purchase</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ 11 · FAQ ═══ */}
      <section className="bg-[#0D0D0D] py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-12 text-center font-display text-4xl tracking-tight text-white sm:text-5xl">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="space-y-4">
              {[
                { q: 'Does it work with my iPhone?', a: 'Yes. Compatible with iPhone 12, 13, 14, 15, and 16 (all variants: Mini, Pro, Pro Max, Plus). Also works with Android via Qi charging or USB-C cable.' },
                { q: 'How long does shipping take?', a: 'Delivery to the USA takes 5-11 business days. International shipping takes 20-30 business days. You\'ll receive a tracking number via email.' },
                { q: 'What if I\'m not satisfied?', a: 'You have 30 days to return it. No questions, no fine print. We refund 100% of your money.' },
                { q: 'Is it really 10,000mAh?', a: 'Yes. 10,000mAh / 37Wh certified with grade-A lithium-polymer cells. Tested to deliver 2-2.3 full charges of iPhone 15.' },
                { q: 'Does it fall off the phone?', a: 'No. High-density N52 magnets provide a firm grip. You can use it while walking, typing, or even with a MagSafe-compatible case.' },
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

      {/* ═══ 12 · CHATBOT CTA ═══ */}
      <section className="bg-[#F5F2EE] py-20">
        <Reveal>
          <div className="mx-auto max-w-3xl px-6 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4825A]/10">
              <svg className="h-8 w-8 text-[#D4825A]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="font-display text-4xl tracking-tight text-[#1a1a1a] sm:text-5xl">
              GOT QUESTIONS?
            </h2>
            <p className="mt-4 max-w-md mx-auto text-sm font-light leading-relaxed text-[#888880]">
              Our virtual assistant is available 24/7 to answer
              your questions about shipping, compatibility, warranty and more.
            </p>
            <button
              onClick={() => window.dispatchEvent(new Event('open-chat'))}
              className="mt-8 inline-flex items-center gap-3 border-2 border-[#D4825A] px-8 py-4 text-sm font-bold tracking-wider text-[#D4825A] uppercase transition-all hover:bg-[#D4825A] hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Open Support Chat
            </button>
            <p className="mt-3 text-xs text-[#888880]">Instant response &middot; No waiting &middot; Available now</p>
          </div>
        </Reveal>
      </section>

      {/* ═══ 13 · GUARANTEE + FINAL CTA ═══ */}
      <section className="bg-gradient-to-b from-[#F5F2EE] to-[#EEEBE6] py-16">
        <Reveal>
          <div className="mx-auto max-w-4xl px-6">
            <div className="border border-[#E0DCD6] bg-[#FAFAF8] p-10 sm:p-14 rounded text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[#E0DCD6] rounded-full">
                <svg className="h-8 w-8 text-[#D4825A]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-display text-3xl tracking-tight text-[#1a1a1a] sm:text-4xl">RISK-FREE GUARANTEE</h3>
              <p className="mt-4 max-w-lg mx-auto text-sm font-light leading-relaxed text-[#888880]">
                Try the Chargly for 30 days. If you're not convinced for any reason,
                we refund 100% of your money. No questions, no forms, no hassle.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-gradient-to-b from-[#0D0D0D] to-zinc-900 py-40">
        <Reveal className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-[#D4825A] mb-6">
            Limited time offer
          </p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] tracking-tight text-white">
            READY TO NEVER<br />RUN OUT OF<br />BATTERY?
          </h2>
          <p className="mt-6 text-base font-light text-[#888888]">
            $29.99 USD &mdash; Free shipping &middot; USA 5-11 days / International 20-30 days
          </p>
          <Link
            to="/product"
            className="mt-10 inline-flex items-center gap-3 bg-[#D4825A] px-10 py-5 text-sm font-bold tracking-wider text-white uppercase transition-all hover:bg-[#B86C45] hover:scale-105"
          >
            Get Mine Now
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="mt-4 text-xs text-white/30">Secure payment with PayPal &middot; 127+ satisfied customers</p>
        </Reveal>
      </section>
    </div>
  )
}
