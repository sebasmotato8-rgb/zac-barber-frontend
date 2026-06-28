import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { PRODUCT } from '../data/product'

type GalleryItem = { type: 'video'; src: string } | { type: 'image'; src: string }

function buildGallery(): GalleryItem[] {
  const items: GalleryItem[] = []
  if (PRODUCT.videos) {
    for (const v of PRODUCT.videos) items.push({ type: 'video', src: v })
  }
  for (const img of PRODUCT.images) items.push({ type: 'image', src: img })
  return items
}

const GALLERY = buildGallery()

export default function Product() {
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const navigate = useNavigate()
  const thumbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!thumbRef.current) return
    const btn = thumbRef.current.children[selected] as HTMLElement | undefined
    btn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [selected])

  function handleAdd() {
    addItem(PRODUCT, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    addItem(PRODUCT, qty)
    navigate('/cart')
  }

  const current = GALLERY[selected]

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
          {/* ── Gallery ── */}
          <div>
            <div
              className="mb-4 aspect-square cursor-pointer overflow-hidden border border-[#E8E4DF] rounded"
              onClick={() => current.type !== 'video' && setLightbox(selected)}
            >
              {current.type === 'video' ? (
                <video
                  key={current.src}
                  src={current.src}
                  autoPlay
                  controls
                  playsInline
                  className="h-full w-full object-cover"
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <img
                  src={current.src}
                  alt={PRODUCT.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div ref={thumbRef} className="flex gap-2 overflow-x-auto pb-2">
              {GALLERY.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`relative flex-shrink-0 overflow-hidden border-2 bg-[#F5F2EE] transition-colors rounded ${
                    i === selected ? 'border-terra' : 'border-[#E8E4DF] hover:border-[#D8D4CE]'
                  }`}
                  style={{ width: 68, height: 68 }}
                >
                  {item.type === 'video' ? (
                    <>
                      <video src={item.src} muted className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <img src={item.src} alt="" className="h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Info ── */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-terra mb-2">{PRODUCT.brand}</p>
            <h1 className="font-display text-3xl tracking-tight text-[#1a1a1a] sm:text-4xl">{PRODUCT.name}</h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-terra" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <span className="text-sm text-[#888880]">(127 reseñas)</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl text-[#1a1a1a]">${PRODUCT.price}</span>
              <span className="text-base text-[#888880] line-through">${PRODUCT.comparePrice}</span>
              <span className="bg-terra px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">-50%</span>
            </div>

            <p className="mt-6 text-sm font-light leading-relaxed text-[#888880]">{PRODUCT.description}</p>

            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[#888880]">Cantidad</label>
                <div className="inline-flex items-center border border-[#E8E4DF] rounded">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-[#888880] hover:text-[#1a1a1a] transition-colors"
                  >−</button>
                  <span className="w-12 text-center text-sm font-semibold text-[#1a1a1a]">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="px-4 py-2.5 text-[#888880] hover:text-[#1a1a1a] transition-colors"
                  >+</button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-terra py-3.5 text-sm font-bold tracking-wider text-white uppercase transition-all hover:bg-terra-dark"
                >
                  Comprar ahora — ${(PRODUCT.price * qty).toFixed(2)}
                </button>
                <button
                  onClick={handleAdd}
                  className={`flex-1 border py-3.5 text-sm font-bold tracking-wider uppercase transition-all ${
                    added
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-600'
                      : 'border-[#E8E4DF] text-[#1a1a1a] hover:border-[#D8D4CE]'
                  }`}
                >
                  {added ? '✓ Agregado' : 'Agregar al carrito'}
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', label: 'Envío gratis' },
                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Garantía 30d' },
                { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: 'Pago seguro' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center gap-2 border border-[#E8E4DF] bg-[#F5F2EE] p-3 text-center rounded">
                  <svg className="h-5 w-5 text-terra" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                  </svg>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#888880]">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Features + Specs ── */}
        <div className="mt-20 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl tracking-tight text-[#1a1a1a] mb-6">CARACTERÍSTICAS</h2>
            <ul className="space-y-3">
              {PRODUCT.features.map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-[#555550]">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-terra" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-3xl tracking-tight text-[#1a1a1a] mb-6">ESPECIFICACIONES</h2>
            <div className="border border-[#E8E4DF] overflow-hidden rounded">
              {Object.entries(PRODUCT.specs).map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex justify-between gap-4 px-5 py-3 text-sm ${
                    i % 2 === 0 ? 'bg-[#F5F2EE]' : 'bg-[#FAFAF8]'
                  }`}
                >
                  <span className="font-medium text-[#888880]">{key}</span>
                  <span className="text-right text-[#1a1a1a]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white/20 rounded"
            onClick={() => setLightbox(null)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {lightbox > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white/20 rounded"
              onClick={e => { e.stopPropagation(); setLightbox(lightbox - 1) }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          {lightbox < GALLERY.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white/20 rounded"
              onClick={e => { e.stopPropagation(); setLightbox(lightbox + 1) }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          )}

          <div className="max-h-[85vh] max-w-[90vw]" onClick={e => e.stopPropagation()}>
            {GALLERY[lightbox].type === 'video' ? (
              <video key={GALLERY[lightbox].src} src={GALLERY[lightbox].src} autoPlay controls playsInline className="max-h-[85vh] max-w-[90vw]" />
            ) : (
              <img src={GALLERY[lightbox].src} alt={PRODUCT.name} className="max-h-[85vh] max-w-[90vw] object-contain" />
            )}
          </div>

          <div className="absolute bottom-4 text-sm text-white/50">
            {lightbox + 1} / {GALLERY.length}
          </div>
        </div>
      )}
    </div>
  )
}
