import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react'
import { sendMessage } from '../api/chat'
import type { Message } from '../types'
import MessageBubble from './MessageBubble'

interface Props {
  onClose: () => void
  initialMessage?: string
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hola, bienvenido a Zac Barber. Puedo mostrarte servicios, precios o ayudarte a reservar una cita.',
}

export default function ChatWidget({ onClose, initialMessage }: Props) {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string>()
  const [minimized, setMinimized] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sentInitial = useRef(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const doSend = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return
      const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text.trim() }
      setMessages(prev => [...prev, userMsg])
      setInput('')
      setLoading(true)
      try {
        const res = await sendMessage(text.trim(), conversationId)
        setConversationId(res.conversation_id)
        setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: res.reply }])
      } catch {
        setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: 'Lo siento, ocurrió un error. ¿Puedes intentarlo de nuevo?' }])
      } finally {
        setLoading(false)
        inputRef.current?.focus()
      }
    },
    [loading, conversationId],
  )

  useEffect(() => {
    if (initialMessage && !sentInitial.current) {
      sentInitial.current = true
      doSend(initialMessage)
    }
  }, [initialMessage, doSend])

  const handleSend = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault()
      doSend(input)
    },
    [input, doSend],
  )

  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-[slideInRight_0.3s_ease-out]">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-700 px-4 py-2.5 shadow-2xl hover:border-amber-500/50 transition-colors"
        >
          <img src="/img/logo.png" alt="" className="h-6 w-6 rounded-full" />
          <span className="text-sm font-medium text-white">Zac Barber</span>
          {messages.length > 1 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black">
              {messages.filter(m => m.role === 'assistant').length - 1}
            </span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] animate-[slideInRight_0.3s_ease-out]">
      <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50 overflow-hidden"
        style={{ height: 'min(520px, calc(100vh - 6rem))' }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/img/logo.png" alt="Zac Barber" className="h-8 w-8 rounded-full" />
            <div>
              <p className="text-sm font-semibold text-white">Zac Barber</p>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                En línea
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(true)}
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
              title="Minimizar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
              title="Cerrar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {loading && (
            <div className="flex gap-1.5 px-3 py-2">
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-2 border-t border-zinc-800 bg-zinc-950 px-3 py-3">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={loading}
            className="flex-1 rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-black transition-colors hover:bg-amber-400 disabled:opacity-40"
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
