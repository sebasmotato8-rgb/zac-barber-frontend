import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-2xl tracking-tight">CHARGLY</span>
            <p className="mt-4 text-sm font-light leading-relaxed text-[#888888]">
              Portable power for your lifestyle. Magnetic, ultra-slim, and powerful.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-4">Store</h4>
            <div className="space-y-3">
              <Link to="/product" className="block text-sm text-[#888888] transition-colors hover:text-terra">Power Bank 10,000mAh</Link>
              <Link to="/cart" className="block text-sm text-[#888888] transition-colors hover:text-terra">Cart</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-4">Support</h4>
            <div className="space-y-3 text-sm text-[#888888]">
              <p>USA: 5-11 business days</p>
              <p>International: 20-30 days</p>
              <p>Warranty: 30 days</p>
              <p>Worldwide shipping available</p>
              <p>soporte@chargly.shop</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-4">Legal</h4>
            <div className="space-y-3 text-sm text-[#888888]">
              <a href="#" className="block transition-colors hover:text-terra">Privacy Policy</a>
              <a href="#" className="block transition-colors hover:text-terra">Terms & Conditions</a>
              <a href="#" className="block transition-colors hover:text-terra">Return Policy</a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-[#555555]">&copy; 2026 Chargly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
