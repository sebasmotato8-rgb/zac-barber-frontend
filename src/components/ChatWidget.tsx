import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react'
import type { Message } from '../types'
import MessageBubble from './MessageBubble'

interface Props {
  onClose: () => void
}

// TODO: agregar WhatsApp cuando esté disponible
const FAQ: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['envío', 'envio', 'llega', 'demora', 'tarda', 'cuanto tarda', 'shipping', 'entrega', 'tiempo', 'días', 'dias'],
    answer: 'Realizamos envíos a todo el mundo. Para USA la entrega es de 5-11 días hábiles. Para otros países tarda entre 20-30 días hábiles. Una vez despachado tu pedido, recibirás un número de seguimiento por email. Si necesitas ayuda, escríbenos a soporte@chargly.shop.',
  },
  {
    keywords: ['garantía', 'garantia', 'devolucion', 'devolución', 'devolver', 'reembolso', 'roto', 'defecto', 'dañado'],
    answer: 'Ofrecemos garantía de 30 días. Si el producto llega defectuoso o no funciona correctamente, te enviamos uno nuevo o te hacemos un reembolso completo. Sin preguntas, sin letra pequeña. Escríbenos a soporte@chargly.shop.',
  },
  {
    keywords: ['compatible', 'compatibilidad', 'iphone', 'android', 'samsung', 'funciona con', 'sirve para', 'magsafe', 'pixel', 'xiaomi'],
    answer: 'Compatible con iPhone 12, 13, 14, 15 y 16 con adhesión magnética MagSafe. También funciona con Android que soporte carga inalámbrica Qi (Samsung, Pixel, Xiaomi). Incluye puerto USB-C para carga con cable de cualquier dispositivo.',
  },
  {
    keywords: ['pedido', 'orden', 'estado', 'seguimiento', 'tracking', 'donde esta', 'dónde está', 'rastrear', 'número'],
    answer: 'Para consultar el estado de tu pedido, revisa el email de confirmación que enviamos a tu correo con el número de seguimiento. Si no lo encuentras o tienes dudas, escríbenos a soporte@chargly.shop con tu número de orden.',
  },
  {
    keywords: ['precio', 'costo', 'cuanto cuesta', 'cuánto cuesta', 'vale', 'descuento', 'oferta', 'promoción', 'promocion'],
    answer: 'El Mini Magnetic Wireless Power Bank 10000mAh tiene un precio de $29.99 USD (precio regular $59.99). ¡50% de descuento por tiempo limitado! El envío gratis está incluido a todo el mundo.',
  },
  {
    keywords: ['pago', 'pagar', 'paypal', 'tarjeta', 'forma de pago', 'método', 'metodo', 'crédito', 'credito', 'débito', 'debito'],
    answer: 'Aceptamos pagos con PayPal, incluyendo tarjetas de crédito y débito. No necesitas cuenta PayPal para pagar con tarjeta. Tu pago está 100% protegido por la garantía de comprador de PayPal.',
  },
  {
    keywords: ['capacidad', 'mah', 'cuanto carga', 'cuánto carga', 'batería', 'bateria', 'duración', 'duracion', 'carga completa', 'potencia', 'watts'],
    answer: 'El power bank tiene 10,000mAh / 37Wh de capacidad real. Esto es suficiente para cargar un iPhone completamente 2+ veces. Soporta carga inalámbrica MagSafe de 15W y carga por cable USB-C de 20W.',
  },
  {
    keywords: ['redes', 'social', 'tiktok', 'instagram', 'ig', 'insta', 'síguenos', 'siguenos'],
    answer: 'Síguenos en nuestras redes sociales para ver videos del producto y promociones exclusivas:\n\n• TikTok: @charglyoficial\n• Instagram: @chargly\n\n¡Comparte tu experiencia con el hashtag #Chargly!',
  },
  {
    keywords: ['contacto', 'email', 'correo', 'soporte', 'ayuda', 'comunicar', 'hablar', 'persona', 'humano', 'agente'],
    answer: 'Puedes contactarnos por estos medios:\n\n• Email: soporte@chargly.shop\n• TikTok: @charglyoficial\n• Instagram: @chargly\n\nHorario de atención: Lunes a Viernes 9am-6pm. Respondemos en máximo 24 horas.',
  },
  {
    keywords: ['hola', 'buenas', 'hey', 'hi', 'buenos días', 'qué tal', 'ayuda', 'help', 'menu', 'menú', 'opciones'],
    answer: '¡Hola! 👋 Soy el asistente de Chargly. ¿En qué puedo ayudarte hoy?\n\n1. Información del producto\n2. Envíos y entregas\n3. Garantía y devoluciones\n4. Estado de mi pedido\n5. Métodos de pago\n\nEscribe tu pregunta o el número de la opción.',
  },
  {
    keywords: ['gracias', 'thanks', 'genial', 'perfecto', 'listo', 'ok', 'vale', 'entendido'],
    answer: '¡Con gusto! Si tienes alguna otra pregunta no dudes en escribirme. También puedes contactarnos en soporte@chargly.shop. ¡Que tengas un excelente día! 😊',
  },
]

function getResponse(input: string): string {
  const lower = input.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  for (const faq of FAQ) {
    if (faq.keywords.some(k => lower.includes(k.normalize('NFD').replace(/[̀-ͯ]/g, '')))) {
      return faq.answer
    }
  }
  return 'No encontré una respuesta exacta para tu pregunta. Puedes escribirnos directamente a soporte@chargly.shop y te responderemos en menos de 24 horas.\n\n¿Te puedo ayudar con envíos, garantía, compatibilidad o el estado de tu pedido?'
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: '¡Hola! 👋 Soy el asistente de Chargly. ¿En qué puedo ayudarte hoy?\n\n1. Información del producto\n2. Envíos y entregas\n3. Garantía y devoluciones\n4. Estado de mi pedido\n5. Métodos de pago',
}

export default function ChatWidget({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [minimized, setMinimized] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }) }, [messages])

  const handleSend = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault()
      const text = input.trim()
      if (!text) return
      const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
      const botMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: getResponse(text) }
      setMessages(prev => [...prev, userMsg, botMsg])
      setInput('')
      setTimeout(() => inputRef.current?.focus(), 50)
    },
    [input],
  )

  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-[slideInRight_0.3s_ease-out]">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 rounded-full bg-white border border-zinc-200 px-4 py-2.5 shadow-xl hover:border-accent-500/50 transition-colors"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">C</span>
          <span className="text-sm font-medium text-zinc-700">Soporte</span>
          {messages.length > 1 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
              {messages.filter(m => m.role === 'assistant').length - 1}
            </span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] animate-[slideInRight_0.3s_ease-out]">
      <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/50 overflow-hidden"
        style={{ height: 'min(520px, calc(100vh - 6rem))' }}>
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">C</span>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Chargly Soporte</p>
              <p className="text-[11px] text-emerald-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                En línea
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setMinimized(true)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors" title="Minimizar">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M20 12H4" /></svg>
            </button>
            <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors" title="Cerrar">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 bg-white">
          {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 border-t border-zinc-100 bg-zinc-50 px-3 py-3">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-accent-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-white transition-colors hover:bg-accent-600 disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
