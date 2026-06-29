import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center bg-[#FAFAF8]">
        <div className="mb-4 flex h-20 w-20 items-center justify-center bg-[#F5F2EE] border border-[#E8E4DF] rounded">
          <svg className="h-10 w-10 text-[#D8D4CE]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl tracking-tight text-[#1a1a1a]">Your cart is empty</h2>
        <p className="mt-2 text-sm text-[#888880]">Add products to continue with your purchase.</p>
        <Link
          to="/product"
          className="mt-6 inline-flex items-center bg-terra px-6 py-3 text-sm font-bold tracking-wider text-white uppercase transition-all hover:bg-terra-dark"
        >
          View Product
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="mx-auto max-w-3xl px-6 py-10 md:py-16">
        <h1 className="font-display text-3xl tracking-tight text-[#1a1a1a] mb-8">YOUR CART</h1>

        <div className="space-y-3">
          {items.map(item => (
            <div key={item.product.id} className="flex gap-4 border border-[#E8E4DF] bg-[#F5F2EE] p-4 sm:p-5 rounded">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden bg-[#FAFAF8] border border-[#E8E4DF] p-2 sm:h-24 sm:w-24 rounded">
                <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-contain" />
              </div>

              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-sm font-semibold leading-tight text-[#1a1a1a] sm:text-base truncate">{item.product.name}</h3>
                  <p className="text-xs text-[#888880] mt-0.5">{item.product.brand}</p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center border border-[#E8E4DF] bg-[#FAFAF8] rounded">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1.5 text-sm text-[#888880] hover:text-[#1a1a1a] disabled:opacity-30 transition-colors"
                    >−</button>
                    <span className="w-8 text-center text-sm font-semibold text-[#1a1a1a]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-sm text-[#888880] hover:text-[#1a1a1a] transition-colors"
                    >+</button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[#1a1a1a]">${(item.product.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-[#888880] hover:text-red-500 transition-colors"
                      title="Remove"
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

        <div className="mt-8 border border-[#E8E4DF] bg-[#F5F2EE] p-6 rounded">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[#888880]">Subtotal</span>
            <span className="font-semibold text-[#1a1a1a]">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-[#888880]">Shipping</span>
            <span className="font-semibold text-terra">Free</span>
          </div>
          <div className="border-t border-[#E0DCD6] pt-4 flex items-center justify-between">
            <span className="font-display text-xl text-[#1a1a1a]">TOTAL</span>
            <span className="font-display text-2xl text-[#1a1a1a]">${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/checkout"
            className="flex-1 bg-terra py-3.5 text-center text-sm font-bold tracking-wider text-white uppercase transition-all hover:bg-terra-dark"
          >
            Proceed to Checkout — ${subtotal.toFixed(2)}
          </Link>
          <Link
            to="/product"
            className="flex-1 border border-[#E8E4DF] py-3.5 text-center text-sm font-bold tracking-wider text-[#1a1a1a] uppercase transition-colors hover:border-[#D8D4CE]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
