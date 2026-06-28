import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useCart } from '../context/CartContext'
import type { OrderData } from '../types'

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb'

function OrderConfirmation({ orderId }: { orderId: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <svg className="h-10 w-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold">¡Pedido confirmado!</h2>
      <p className="mt-3 text-sm text-zinc-500 max-w-md">
        Tu orden <strong className="text-zinc-700">#{orderId}</strong> ha sido procesada exitosamente.
        Recibirás un email de confirmación con los detalles de envío.
      </p>
      <div className="mt-6 rounded-xl bg-zinc-50 border border-zinc-100 p-5 text-sm text-zinc-500 max-w-sm">
        <p className="font-medium text-zinc-700 mb-2">Próximos pasos:</p>
        <ul className="space-y-1.5 text-left">
          <li className="flex items-start gap-2"><span className="text-accent-500">1.</span> Recibirás un email de confirmación</li>
          <li className="flex items-start gap-2"><span className="text-accent-500">2.</span> Tu pedido será enviado en 1-3 días</li>
          <li className="flex items-start gap-2"><span className="text-accent-500">3.</span> Entrega estimada: 15-20 días hábiles</li>
        </ul>
      </div>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-accent-600"
      >
        Volver a la tienda
      </Link>
    </div>
  )
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null)
  const [form, setForm] = useState<OrderData>({
    name: '', email: '', address: '', city: '', country: '', phone: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof OrderData, string>>>({})

  const update = useCallback((field: keyof OrderData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }, [])

  function validate(): boolean {
    const e: Partial<Record<keyof OrderData, string>> = {}
    if (!form.name.trim()) e.name = 'Nombre requerido'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Email válido requerido'
    if (!form.address.trim()) e.address = 'Dirección requerida'
    if (!form.city.trim()) e.city = 'Ciudad requerida'
    if (!form.country.trim()) e.country = 'País requerido'
    if (!form.phone.trim()) e.phone = 'Teléfono requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const isFormValid = form.name && form.email.includes('@') && form.address && form.city && form.country && form.phone

  if (items.length === 0 && !confirmedOrderId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <h2 className="text-xl font-bold">No hay productos en el carrito</h2>
        <p className="mt-2 text-sm text-zinc-500">Agrega productos antes de proceder al pago.</p>
        <Link to="/product" className="mt-6 inline-flex rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white hover:bg-accent-600">
          Ver producto
        </Link>
      </div>
    )
  }

  if (confirmedOrderId) {
    return <OrderConfirmation orderId={confirmedOrderId} />
  }

  const fields: { key: keyof OrderData; label: string; type: string; placeholder: string; half?: boolean }[] = [
    { key: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Juan Pérez' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com' },
    { key: 'phone', label: 'Teléfono', type: 'tel', placeholder: '+1 234 567 8900' },
    { key: 'address', label: 'Dirección de envío', type: 'text', placeholder: 'Calle 123, Apto 4B' },
    { key: 'city', label: 'Ciudad', type: 'text', placeholder: 'Ciudad', half: true },
    { key: 'country', label: 'País', type: 'text', placeholder: 'País', half: true },
  ]

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD' }}>
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-5 py-10 md:py-16">
          <h1 className="text-2xl font-bold mb-8">Checkout</h1>

          <div className="grid gap-10 lg:grid-cols-5">
            {/* ── Form ── */}
            <div className="lg:col-span-3 space-y-5">
              <h2 className="text-lg font-semibold">Datos de envío</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map(f => (
                  <div key={f.key} className={f.half ? '' : 'sm:col-span-2'}>
                    <label className="mb-1 block text-xs font-medium text-zinc-500">{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={e => update(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors focus:outline-none ${
                        errors[f.key]
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-zinc-200 focus:border-accent-500'
                      }`}
                    />
                    {errors[f.key] && <p className="mt-1 text-xs text-red-500">{errors[f.key]}</p>}
                  </div>
                ))}
              </div>

              {/* PayPal */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Método de pago</h2>
                <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
                  {isFormValid ? (
                    <PayPalButtons
                      style={{ layout: 'vertical', shape: 'pill', color: 'gold', label: 'pay' }}
                      createOrder={(_data, actions) => {
                        if (!validate()) return Promise.reject(new Error('Formulario inválido'))
                        return actions.order.create({
                          intent: 'CAPTURE',
                          purchase_units: [{
                            amount: { currency_code: 'USD', value: subtotal.toFixed(2) },
                            description: items.map(i => `${i.quantity}x ${i.product.name}`).join(', '),
                            shipping: {
                              name: { full_name: form.name },
                              address: {
                                address_line_1: form.address,
                                admin_area_2: form.city,
                                country_code: form.country.length === 2 ? form.country.toUpperCase() : 'US',
                              },
                            },
                          }],
                        })
                      }}
                      onApprove={async (_data, actions) => {
                        const details = await actions.order!.capture()
                        setConfirmedOrderId(details.id ?? crypto.randomUUID().slice(0, 8).toUpperCase())
                        clearCart()
                      }}
                      onError={() => {
                        navigate('/cart')
                      }}
                    />
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-sm text-zinc-400">Completa todos los campos del formulario para habilitar el pago.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Order summary ── */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
                <h2 className="text-lg font-semibold mb-5">Resumen del pedido</h2>

                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-white border border-zinc-100 p-1.5">
                        <img src={item.product.images[0]} alt="" className="h-full w-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-zinc-400">Cantidad: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-zinc-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Envío</span>
                    <span className="font-medium text-emerald-600">Gratis</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-200 pt-3 mt-3">
                    <span className="font-bold">Total</span>
                    <span className="text-lg font-extrabold">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-zinc-400">
                  <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  Pago seguro con PayPal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  )
}
