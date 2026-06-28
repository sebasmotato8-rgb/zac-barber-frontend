import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500 text-xs font-extrabold text-white">C</span>
              <span className="font-bold">Chargly</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Energía portátil para tu estilo de vida. Carga magnética, ultradelgada y potente.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Tienda</h4>
            <div className="space-y-2">
              <Link to="/product" className="block text-sm text-zinc-500 hover:text-accent-500 transition-colors">Power Bank 10000mAh</Link>
              <Link to="/cart" className="block text-sm text-zinc-500 hover:text-accent-500 transition-colors">Carrito</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Soporte</h4>
            <div className="space-y-2 text-sm text-zinc-500">
              <p>Envío: 15-20 días hábiles</p>
              <p>Garantía: 30 días</p>
              <p>soporte@chargly.store</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <div className="space-y-2 text-sm text-zinc-500">
              <a href="#" className="block hover:text-accent-500 transition-colors">Política de privacidad</a>
              <a href="#" className="block hover:text-accent-500 transition-colors">Términos y condiciones</a>
              <a href="#" className="block hover:text-accent-500 transition-colors">Política de devoluciones</a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 text-center">
          <p className="text-xs text-zinc-400">© 2026 Chargly. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
