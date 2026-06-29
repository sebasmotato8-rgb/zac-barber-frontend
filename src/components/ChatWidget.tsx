import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react'
import type { Message } from '../types'
import MessageBubble from './MessageBubble'

interface Props {
  onClose: () => void
}

// TODO: add WhatsApp when available
const FAQ: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['shipping', 'ship', 'deliver', 'delivery', 'arrive', 'how long', 'days', 'tracking', 'track'],
    answer: 'We ship worldwide! Delivery to the USA takes 5-11 business days. International shipping takes 20-30 business days. Once your order ships, you\'ll receive a tracking number via email. Need help? Email us at soporte@chargly.shop.',
  },
  {
    keywords: ['warranty', 'return', 'refund', 'broken', 'defective', 'money back', 'guarantee'],
    answer: 'We offer a 30-day warranty. If the product arrives defective or doesn\'t work properly, we\'ll send you a new one or issue a full refund. No questions asked, no fine print. Contact us at soporte@chargly.shop.',
  },
  {
    keywords: ['compatible', 'compatibility', 'iphone', 'android', 'samsung', 'work with', 'magsafe', 'pixel', 'xiaomi'],
    answer: 'Compatible with iPhone 12, 13, 14, 15, and 16 with MagSafe magnetic attachment. Also works with Android devices that support Qi wireless charging (Samsung, Pixel, Xiaomi). Includes USB-C port for wired charging of any device.',
  },
  {
    keywords: ['order', 'status', 'where is', 'track', 'tracking', 'number', 'confirmation'],
    answer: 'To check your order status, look for the confirmation email we sent to your inbox with a tracking number. If you can\'t find it, email us at soporte@chargly.shop with your order number and we\'ll help you right away.',
  },
  {
    keywords: ['price', 'cost', 'how much', 'discount', 'sale', 'deal', 'coupon'],
    answer: 'The Mini Magnetic Wireless Power Bank 10,000mAh is $29.99 USD (regular price $59.99). That\'s 50% OFF for a limited time! Free worldwide shipping included.',
  },
  {
    keywords: ['pay', 'payment', 'paypal', 'card', 'credit', 'debit', 'checkout'],
    answer: 'We accept payments through PayPal, including credit and debit cards. You don\'t need a PayPal account to pay with a card. Your payment is 100% protected by PayPal Buyer Protection.',
  },
  {
    keywords: ['capacity', 'mah', 'charge', 'battery', 'power', 'watts', 'how many'],
    answer: 'The power bank has a real 10,000mAh / 37Wh capacity. That\'s enough to fully charge an iPhone 2+ times. It supports 15W MagSafe wireless charging and 20W USB-C wired charging.',
  },
  {
    keywords: ['social', 'tiktok', 'instagram', 'ig', 'follow', 'media'],
    answer: 'Follow us on social media for product videos and exclusive deals:\n\n• TikTok: @charglyoficial\n• Instagram: @chargly\n\nShare your experience with #Chargly!',
  },
  {
    keywords: ['contact', 'email', 'support', 'help', 'talk', 'person', 'human', 'agent', 'reach'],
    answer: 'You can reach us through:\n\n• Email: soporte@chargly.shop\n• TikTok: @charglyoficial\n• Instagram: @chargly\n\nBusiness hours: Monday to Friday, 9am-6pm. We respond within 24 hours.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good', 'help', 'menu', 'options', 'what can'],
    answer: 'Hi! 👋 I\'m the Chargly assistant. How can I help you today?\n\n1. Product information\n2. Shipping & delivery\n3. Warranty & returns\n4. Order status\n5. Payment methods\n\nType your question or pick a number!',
  },
  {
    keywords: ['thanks', 'thank', 'great', 'perfect', 'awesome', 'cool', 'ok', 'got it'],
    answer: 'You\'re welcome! If you have any other questions, feel free to ask. You can also reach us at soporte@chargly.shop. Have a great day! 😊',
  },
]

function getResponse(input: string): string {
  const lower = input.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  for (const faq of FAQ) {
    if (faq.keywords.some(k => lower.includes(k.normalize('NFD').replace(/[̀-ͯ]/g, '')))) {
      return faq.answer
    }
  }
  return 'I couldn\'t find an exact answer to your question. You can email us directly at soporte@chargly.shop and we\'ll get back to you within 24 hours.\n\nCan I help you with shipping, warranty, compatibility, or your order status?'
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hi! 👋 Welcome to Chargly. How can I help you today?\n\n1. Product information\n2. Shipping & delivery\n3. Warranty & returns\n4. Order status\n5. Payment methods',
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
          <span className="text-sm font-medium text-zinc-700">Support</span>
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
              <p className="text-sm font-semibold text-zinc-900">Chargly Support</p>
              <p className="text-[11px] text-emerald-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setMinimized(true)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors" title="Minimize">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M20 12H4" /></svg>
            </button>
            <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors" title="Close">
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
            placeholder="Type your question..."
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
