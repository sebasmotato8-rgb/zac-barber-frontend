import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { PRODUCT } from '../data/product'

export default function Product() {
  const [selectedImg, setSelectedImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const navigate = useNavigate()

  function handleAdd() {
    addItem(PRODUCT, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    addItem(PRODUCT, qty)
    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
          {/* ── Gallery ── */}
          <div>
            <div className="mb-4 overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-100">
              <img
                src={PRODUCT.images[selectedImg]}
                alt={PRODUCT.name}
                className="mx-auto h-80 w-full object-contain p-6 sm:h-[420px]"
              />
            </div>
            <div className="flex gap-3">
              {PRODUCT.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`flex-1 overflow-hidden rounded-xl border-2 bg-zinc-50 p-2 transition-colors ${
                    i === selectedImg ? 'border-accent-500' : 'border-zinc-100 hover:border-zinc-300'
                  }`}
                >
                  <img src={img} alt="" className="h-16 w-full object-contain sm:h-20" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Info ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-500 mb-2">{PRODUCT.brand}</p>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{PRODUCT.name}</h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <span className="text-sm text-zinc-400">(127 reseñas)</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold">${PRODUCT.price}</span>
              <span className="text-lg text-zinc-400 line-through">${PRODUCT.comparePrice}</span>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-500">-50%</span>
            </div>

            <p className="mt-6 text-sm text-zinc-500 leading-relaxed">{PRODUCT.description}</p>

            {/* Quantity + Buttons */}
            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">Cantidad</label>
                <div className="inline-flex items-center rounded-xl border border-zinc-200">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-zinc-400 hover:text-zinc-700 transition-colors"
                  >−</button>
                  <span className="w-12 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="px-4 py-2.5 text-zinc-400 hover:text-zinc-700 transition-colors"
                  >+</button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 rounded-full bg-accent-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent-500/25 transition-all hover:bg-accent-600 hover:scale-[1.01] active:scale-100"
                >
                  Comprar ahora — ${(PRODUCT.price * qty).toFixed(2)}
                </button>
                <button
                  onClick={handleAdd}
                  className={`flex-1 rounded-full border-2 py-3.5 text-sm font-bold transition-all ${
                    added
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: '🚚', label: 'Envío gratis' },
                { icon: '🛡️', label: 'Garantía 30d' },
                { icon: '🔒', label: 'Pago seguro' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center gap-1 rounded-xl bg-zinc-50 p-3 text-center">
                  <span className="text-lg">{b.icon}</span>
                  <span className="text-[11px] font-medium text-zinc-500">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Features list ── */}
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold mb-5">Características</h2>
            <ul className="space-y-3">
              {PRODUCT.features.map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-zinc-600">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-5">Especificaciones técnicas</h2>
            <div className="rounded-2xl border border-zinc-100 overflow-hidden">
              {Object.entries(PRODUCT.specs).map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex justify-between gap-4 px-5 py-3 text-sm ${
                    i % 2 === 0 ? 'bg-zinc-50' : 'bg-white'
                  }`}
                >
                  <span className="font-medium text-zinc-500">{key}</span>
                  <span className="text-right text-zinc-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
