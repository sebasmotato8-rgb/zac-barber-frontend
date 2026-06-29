import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-2xl tracking-tight">CHARGLY</span>
            <p className="mt-4 text-sm font-light leading-relaxed text-[#888888]">
              Energía portátil para tu estilo de vida. Carga magnética, ultradelgada y potente.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-4">Tienda</h4>
            <div className="space-y-3">
              <Link to="/product" className="block text-sm text-[#888888] transition-colors hover:text-terra">Power Bank 10000mAh</Link>
              <Link to="/cart" className="block text-sm text-[#888888] transition-colors hover:text-terra">Carrito</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-4">Soporte</h4>
            <div className="space-y-3 text-sm text-[#888888]">
              <p>USA: 5-11 días hábiles</p>
              <p>Internacional: 20-30 días</p>
              <p>Garantía: 30 días</p>
              <p>Envíos mundiales disponibles</p>
              <p>soporte@chargly.shop</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-4">Legal</h4>
            <div className="space-y-3 text-sm text-[#888888]">
              <a href="#" className="block transition-colors hover:text-terra">Política de privacidad</a>
              <a href="#" className="block transition-colors hover:text-terra">Términos y condiciones</a>
              <a href="#" className="block transition-colors hover:text-terra">Política de devoluciones</a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-[#555555]">&copy; 2026 Chargly. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
