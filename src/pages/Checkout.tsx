import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useCart } from '../context/CartContext'
import type { OrderData } from '../types'

const PAYPAL_CLIENT_ID = 'AVSDW6oO4sd17w6zB1T8R0THjAYbbeGC5fAahSyNykPX3GMP6IdDbWOMhZcFep_b5nW_eMVRNkYbdD_N'

function OrderConfirmation({ orderId }: { orderId: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center bg-[#FAFAF8]">
      <div className="mb-5 flex h-20 w-20 items-center justify-center bg-emerald-50 border border-emerald-100 rounded">
        <svg className="h-10 w-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="font-display text-3xl tracking-tight text-[#1a1a1a]">ORDER CONFIRMED!</h2>
      <p className="mt-3 text-sm text-[#888880] max-w-md">
        Your order <strong className="text-[#1a1a1a]">#{orderId}</strong> has been processed successfully.
        You will receive a confirmation email with shipping details.
      </p>
      <div className="mt-6 border border-[#E8E4DF] bg-[#F5F2EE] p-5 text-sm text-[#888880] max-w-sm rounded">
        <p className="font-bold text-[#1a1a1a] mb-2">Next steps:</p>
        <ul className="space-y-1.5 text-left">
          <li className="flex items-start gap-2"><span className="text-terra font-bold">1.</span> You will receive a confirmation email</li>
          <li className="flex items-start gap-2"><span className="text-terra font-bold">2.</span> Your order will ship within 1-3 days</li>
          <li className="flex items-start gap-2"><span className="text-terra font-bold">3.</span> Delivery: USA 5-11 days / International 20-30 days</li>
        </ul>
      </div>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 bg-terra px-6 py-3 text-sm font-bold tracking-wider text-white uppercase transition-all hover:bg-terra-dark"
      >
        Back to Store
      </Link>
    </div>
  )
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
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
    if (!form.name.trim()) e.name = 'Full name required'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required'
    if (!form.address.trim()) e.address = 'Address required'
    if (!form.city.trim()) e.city = 'City required'
    if (!form.country.trim()) e.country = 'Country required'
    if (!form.phone.trim()) e.phone = 'Phone required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const isFormValid = form.name && form.email.includes('@') && form.address && form.city && form.country && form.phone

  if (items.length === 0 && !confirmedOrderId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center bg-[#FAFAF8]">
        <h2 className="font-display text-2xl tracking-tight text-[#1a1a1a]">Your cart is empty</h2>
        <p className="mt-2 text-sm text-[#888880]">Add products before proceeding to checkout.</p>
        <Link to="/product" className="mt-6 inline-flex bg-terra px-6 py-3 text-sm font-bold tracking-wider text-white uppercase hover:bg-terra-dark">
          View Product
        </Link>
      </div>
    )
  }

  if (confirmedOrderId) {
    return <OrderConfirmation orderId={confirmedOrderId} />
  }

  const fields: { key: keyof OrderData; label: string; type: string; placeholder: string; half?: boolean }[] = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com' },
    { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 234 567 8900' },
    { key: 'address', label: 'Shipping Address', type: 'text', placeholder: '123 Main St, Apt 4B' },
    { key: 'city', label: 'City', type: 'text', placeholder: 'New York', half: true },
    { key: 'country', label: 'Country', type: 'text', placeholder: 'US', half: true },
  ]

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD', intent: 'capture', 'disable-funding': 'credit,card', 'enable-funding': 'paypal' }}>
      <div className="min-h-screen bg-[#FAFAF8]">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-16">
          <h1 className="font-display text-3xl tracking-tight text-[#1a1a1a] mb-8">CHECKOUT</h1>

          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-5">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[#888880]">Shipping Details</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map(f => (
                  <div key={f.key} className={f.half ? '' : 'sm:col-span-2'}>
                    <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-[#888880]">{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={e => update(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className={`w-full border bg-[#FAFAF8] px-4 py-3 text-sm text-[#1a1a1a] transition-colors focus:outline-none rounded ${
                        errors[f.key]
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-[#E8E4DF] focus:border-terra'
                      }`}
                    />
                    {errors[f.key] && <p className="mt-1 text-xs text-red-500">{errors[f.key]}</p>}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[#888880] mb-4">Payment Method</h2>
                <div className="border border-[#E8E4DF] bg-[#F5F2EE] p-5 rounded">
                  {paymentError && (
                    <div className="mb-4 border border-red-200 bg-red-50 p-4 rounded">
                      <p className="text-sm font-medium text-red-700">{paymentError}</p>
                      <p className="mt-1 text-xs text-red-500">
                        Try again or contact us at{' '}
                        <a href="mailto:soporte@chargly.shop" className="underline">soporte@chargly.shop</a>
                      </p>
                    </div>
                  )}
                  {isFormValid ? (
                    <PayPalButtons
                      style={{ layout: 'vertical', shape: 'rect', color: 'gold', label: 'pay' }}
                      createOrder={(_data, actions) => {
                        setPaymentError(null)
                        if (!validate()) return Promise.reject(new Error('Invalid form'))
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
                        try {
                          const details = await actions.order!.capture()
                          setConfirmedOrderId(details.id ?? crypto.randomUUID().slice(0, 8).toUpperCase())
                          clearCart()
                        } catch {
                          setPaymentError('Could not complete the payment. Your card or PayPal account may have been declined.')
                        }
                      }}
                      onCancel={() => {
                        setPaymentError('Payment cancelled. You can try again whenever you\'re ready.')
                      }}
                      onError={() => {
                        setPaymentError('There was a problem with the payment. Please check your payment method and try again.')
                      }}
                    />
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-sm text-[#888880]">Fill in all form fields to enable payment.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24 border border-[#E8E4DF] bg-[#F5F2EE] p-6 rounded">
                <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[#888880] mb-5">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="h-14 w-14 flex-shrink-0 bg-[#FAFAF8] border border-[#E8E4DF] p-1.5 rounded">
                        <img src={item.product.images[0]} alt="" className="h-full w-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1a1a1a] truncate">{item.product.name}</p>
                        <p className="text-xs text-[#888880]">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#1a1a1a]">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-[#E0DCD6] pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888880]">Subtotal</span>
                    <span className="font-medium text-[#1a1a1a]">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888880]">Shipping</span>
                    <span className="font-medium text-terra">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E0DCD6] pt-3 mt-3">
                    <span className="font-display text-lg text-[#1a1a1a]">TOTAL</span>
                    <span className="font-display text-xl text-[#1a1a1a]">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-[#888880]">
                  <svg className="h-4 w-4 text-terra" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure payment with PayPal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  )
}
