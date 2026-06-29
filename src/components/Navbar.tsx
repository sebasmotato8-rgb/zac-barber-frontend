import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E4DF] bg-[#FAFAF8]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl tracking-tight text-[#1a1a1a]">
          CHARGLY
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm text-[#888880] transition-colors hover:text-[#1a1a1a]">Home</Link>
          <Link to="/product" className="text-sm text-[#888880] transition-colors hover:text-[#1a1a1a]">Product</Link>
          <Link to="/cart" className="relative flex items-center gap-1.5 text-sm text-[#888880] transition-colors hover:text-[#1a1a1a]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Cart
            {count > 0 && (
              <span className="absolute -right-3.5 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-terra text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-[#1a1a1a]">
          {open
            ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#E8E4DF] bg-[#FAFAF8] px-6 pb-5 pt-3 md:hidden space-y-1">
          <Link to="/" onClick={() => setOpen(false)} className="block py-2.5 text-sm text-[#888880]">Home</Link>
          <Link to="/product" onClick={() => setOpen(false)} className="block py-2.5 text-sm text-[#888880]">Product</Link>
          <Link to="/cart" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2.5 text-sm text-[#888880]">
            Cart {count > 0 && <span className="rounded-full bg-terra px-2 py-0.5 text-[10px] font-bold text-white">{count}</span>}
          </Link>
        </div>
      )}
    </header>
  )
}
