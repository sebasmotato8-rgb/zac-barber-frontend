import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-sm font-extrabold text-white">C</span>
          <span className="text-lg font-bold tracking-tight">Chargly</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Inicio</Link>
          <Link to="/product" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Producto</Link>
          <Link to="/cart" className="relative flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Carrito
            {count > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-zinc-600">
          {open
            ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-100 bg-white px-5 pb-4 pt-2 md:hidden space-y-1">
          <Link to="/" onClick={() => setOpen(false)} className="block py-2 text-sm text-zinc-600">Inicio</Link>
          <Link to="/product" onClick={() => setOpen(false)} className="block py-2 text-sm text-zinc-600">Producto</Link>
          <Link to="/cart" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2 text-sm text-zinc-600">
            Carrito {count > 0 && <span className="rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-white">{count}</span>}
          </Link>
        </div>
      )}
    </header>
  )
}
