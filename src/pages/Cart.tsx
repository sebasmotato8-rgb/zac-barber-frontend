import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-50">
          <svg className="h-10 w-10 text-zinc-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Tu carrito está vacío</h2>
        <p className="mt-2 text-sm text-zinc-500">Agrega productos para continuar con tu compra.</p>
        <Link
          to="/product"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-accent-600"
        >
          Ver producto
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-5 py-10 md:py-16">
        <h1 className="text-2xl font-bold mb-8">Carrito de compras</h1>

        <div className="space-y-4">
          {items.map(item => (
            <div key={item.product.id} className="flex gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 sm:p-5">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 p-2 sm:h-24 sm:w-24">
                <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-contain" />
              </div>

              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-sm font-semibold leading-tight sm:text-base truncate">{item.product.name}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{item.product.brand}</p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center rounded-lg border border-zinc-200 bg-white">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-700 disabled:opacity-30 transition-colors"
                    >−</button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
                    >+</button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-zinc-500">Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-zinc-500">Envío</span>
            <span className="font-semibold text-emerald-600">Gratis</span>
          </div>
          <div className="border-t border-zinc-200 pt-4 flex items-center justify-between">
            <span className="text-base font-bold">Total</span>
            <span className="text-xl font-extrabold">${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/checkout"
            className="flex-1 rounded-full bg-accent-500 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-accent-500/25 transition-all hover:bg-accent-600 hover:scale-[1.01]"
          >
            Proceder al pago — ${subtotal.toFixed(2)}
          </Link>
          <Link
            to="/product"
            className="flex-1 rounded-full border-2 border-zinc-200 py-3.5 text-center text-sm font-bold text-zinc-600 transition-colors hover:border-zinc-400"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
