import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const TODAY_STR = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const PRICES: Record<string, number> = {
  'Corte Clásico': 25000, 'Corte + Barba': 40000, 'Degradado': 30000,
  'Barba Premium': 20000, 'Tratamiento Capilar': 35000, 'Diseño de Cejas': 10000,
}

type Status = 'confirmed' | 'pending' | 'completed' | 'cancelled'

interface Apt {
  id: string; client: string; service: string; time: string;
  status: Status; phone: string; cancelReason?: string
}

const INIT_TODAY: Apt[] = [
  { id: '1', client: 'Carlos Méndez', service: 'Corte Clásico', time: '09:00 AM', status: 'completed', phone: '+57 300 111 2222' },
  { id: '2', client: 'Andrés Ríos', service: 'Corte + Barba', time: '10:00 AM', status: 'completed', phone: '+57 301 222 3333' },
  { id: '3', client: 'David López', service: 'Degradado', time: '11:30 AM', status: 'confirmed', phone: '+57 302 333 4444' },
  { id: '4', client: 'Miguel Torres', service: 'Barba Premium', time: '01:00 PM', status: 'pending', phone: '+57 303 444 5555' },
  { id: '5', client: 'Felipe Gómez', service: 'Corte Clásico', time: '02:30 PM', status: 'pending', phone: '+57 304 555 6666' },
  { id: '6', client: 'Juan Ramírez', service: 'Tratamiento Capilar', time: '04:00 PM', status: 'confirmed', phone: '+57 305 666 7777' },
]

const INIT_UPCOMING: Apt[] = [
  { id: '7', client: 'Santiago Peña', service: 'Corte + Barba', time: 'Mañana 10:00 AM', status: 'confirmed', phone: '+57 306 777 8888' },
  { id: '8', client: 'Nicolás Vargas', service: 'Degradado', time: 'Mañana 02:00 PM', status: 'pending', phone: '+57 307 888 9999' },
  { id: '9', client: 'Mateo Cruz', service: 'Barba Premium', time: 'Vie 09:30 AM', status: 'confirmed', phone: '+57 308 999 0000' },
]

const CLIENTS = [
  { name: 'Carlos Méndez', visits: 12, lastVisit: 'Hoy' },
  { name: 'Andrés Ríos', visits: 8, lastVisit: 'Hoy' },
  { name: 'Santiago Peña', visits: 15, lastVisit: 'Hace 3 días' },
  { name: 'Felipe Gómez', visits: 5, lastVisit: 'Hace 1 semana' },
]

const ST: Record<string, { bg: string; label: string }> = {
  confirmed: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Confirmada' },
  pending: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Pendiente' },
  completed: { bg: 'bg-zinc-700/20 text-zinc-400 border-zinc-600/20', label: 'Completada' },
  cancelled: { bg: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Cancelada' },
}

function Badge({ status }: { status: string }) {
  const s = ST[status]
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${s?.bg ?? ''}`}>{s?.label ?? status}</span>
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-[fadeInUp_0.2s_ease-out]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed top-4 right-4 z-50 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 shadow-xl animate-[slideInRight_0.3s_ease-out]">
      <p className="text-sm text-white">{message}</p>
    </div>
  )
}

/* ══════════════════════════════════════════════ */

export default function Dashboard() {
  const [todayApts, setTodayApts] = useState(INIT_TODAY)
  const [upcomingApts, setUpcomingApts] = useState(INIT_UPCOMING)
  const [tab, setTab] = useState<'today' | 'upcoming' | 'history'>('today')
  const [toast, setToast] = useState('')
  const [cancelModal, setCancelModal] = useState<Apt | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [historyFilter, setHistoryFilter] = useState('')
  const [blockModal, setBlockModal] = useState(false)
  const [blockDate, setBlockDate] = useState('')
  const [blockStart, setBlockStart] = useState('')
  const [blockEnd, setBlockEnd] = useState('')
  const [blockReason, setBlockReason] = useState('')
  const [blocks, setBlocks] = useState<{ id: string; date: string; start: string; end: string; reason: string }[]>([])
  const [configModal, setConfigModal] = useState(false)
  const [configSlot, setConfigSlot] = useState('30')
  const [configAdvance, setConfigAdvance] = useState('60')
  const [configMaxDays, setConfigMaxDays] = useState('30')

  const addRealtimeApt = useCallback((payload: Record<string, unknown>) => {
    const row = payload as { id: string; scheduled_at: string; status: string; notes?: string }
    const date = new Date(row.scheduled_at)
    const timeStr = date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Bogota' })
    const newApt: Apt = {
      id: row.id,
      client: 'Nuevo Cliente (Chat)',
      service: 'Servicio agendado',
      time: timeStr,
      status: (row.status as Status) ?? 'pending',
      phone: '',
    }
    const isToday = date.toDateString() === new Date().toDateString()
    if (isToday) {
      setTodayApts(p => [...p, newApt])
    } else {
      setUpcomingApts(p => [...p, newApt])
    }
    setToast(`Nueva cita desde el chat: ${timeStr}`)
  }, [])

  useEffect(() => {
    const sb = supabase
    if (!sb) return
    const channel = sb
      .channel('appointments-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'appointments' }, (payload) => {
        addRealtimeApt(payload.new)
      })
      .subscribe()
    return () => { sb.removeChannel(channel) }
  }, [addRealtimeApt])

  const allApts = [...todayApts, ...upcomingApts]
  const activeToday = todayApts.filter(a => a.status !== 'cancelled')
  const completed = todayApts.filter(a => a.status === 'completed').length
  const pending = todayApts.filter(a => a.status === 'pending' || a.status === 'confirmed').length
  const cancelled = todayApts.filter(a => a.status === 'cancelled').length
  const revenue = todayApts.filter(a => a.status === 'completed').reduce((s, a) => s + (PRICES[a.service] ?? 0), 0)
  const historyApts = allApts.filter(a => ['completed', 'cancelled'].includes(a.status))
    .filter(a => !historyFilter || a.client.toLowerCase().includes(historyFilter.toLowerCase()) || a.service.toLowerCase().includes(historyFilter.toLowerCase()))

  function updateApt(id: string, update: Partial<Apt>) {
    setTodayApts(p => p.map(a => a.id === id ? { ...a, ...update } : a))
    setUpcomingApts(p => p.map(a => a.id === id ? { ...a, ...update } : a))
  }

  function deleteApt(id: string) {
    setTodayApts(p => p.filter(a => a.id !== id))
    setUpcomingApts(p => p.filter(a => a.id !== id))
    setToast('Cita eliminada correctamente')
  }

  function confirmCancel() {
    if (!cancelModal || !cancelReason.trim()) return
    updateApt(cancelModal.id, { status: 'cancelled', cancelReason: cancelReason.trim() })
    setToast(`Cita de ${cancelModal.client} cancelada. Motivo: ${cancelReason.trim()}`)
    setCancelModal(null)
    setCancelReason('')
  }

  function addBlock() {
    if (!blockDate || !blockStart || !blockEnd) return
    setBlocks(p => [...p, { id: crypto.randomUUID(), date: blockDate, start: blockStart, end: blockEnd, reason: blockReason }])
    setToast(`Horario bloqueado: ${blockDate} ${blockStart}-${blockEnd}`)
    setBlockModal(false)
    setBlockDate(''); setBlockStart(''); setBlockEnd(''); setBlockReason('')
  }

  function removeBlock(id: string) {
    setBlocks(p => p.filter(b => b.id !== id))
    setToast('Bloqueo eliminado')
  }

  const now = new Date()
  const year = now.getFullYear(), month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = now.getDate()
  const aptDays = [today, today + 1, today + 3, today + 5]
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="min-h-screen bg-black text-white font-body">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      {/* Cancel Modal */}
      <Modal open={!!cancelModal} onClose={() => { setCancelModal(null); setCancelReason('') }} title="Cancelar Cita">
        <p className="text-sm text-zinc-400 mb-3">
          ¿Cancelar la cita de <strong className="text-white">{cancelModal?.client}</strong> ({cancelModal?.service} — {cancelModal?.time})?
        </p>
        <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Motivo de cancelación *</label>
        <textarea
          value={cancelReason} onChange={e => setCancelReason(e.target.value)}
          placeholder="Escribe el motivo..."
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none resize-none h-20"
        />
        <div className="flex gap-3 mt-5">
          <button onClick={() => { setCancelModal(null); setCancelReason('') }}
            className="flex-1 rounded-xl bg-zinc-800 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors">
            Cancelar
          </button>
          <button onClick={confirmCancel} disabled={!cancelReason.trim()}
            className="flex-1 rounded-xl bg-red-500/80 py-2.5 text-sm font-medium text-white hover:bg-red-500 transition-colors disabled:opacity-40">
            Confirmar Cancelación
          </button>
        </div>
      </Modal>

      {/* Block Modal */}
      <Modal open={blockModal} onClose={() => setBlockModal(false)} title="Bloquear Horario">
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1 font-medium">Fecha</label>
            <input type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1 font-medium">Inicio</label>
              <input type="time" value={blockStart} onChange={e => setBlockStart(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1 font-medium">Fin</label>
              <input type="time" value={blockEnd} onChange={e => setBlockEnd(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1 font-medium">Motivo (opcional)</label>
            <input type="text" value={blockReason} onChange={e => setBlockReason(e.target.value)} placeholder="Ej: Almuerzo, descanso..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none" />
          </div>
        </div>
        <button onClick={addBlock} disabled={!blockDate || !blockStart || !blockEnd}
          className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition-colors disabled:opacity-40">
          Bloquear Horario
        </button>
      </Modal>

      {/* Config Modal */}
      <Modal open={configModal} onClose={() => setConfigModal(false)} title="Configuración">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1 font-medium">Duración de slot (minutos)</label>
            <input type="number" value={configSlot} onChange={e => setConfigSlot(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1 font-medium">Anticipación mínima (minutos)</label>
            <input type="number" value={configAdvance} onChange={e => setConfigAdvance(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1 font-medium">Máximo días de anticipación</label>
            <input type="number" value={configMaxDays} onChange={e => setConfigMaxDays(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
          </div>
        </div>
        <button onClick={() => { setConfigModal(false); setToast('Configuración guardada') }}
          className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition-colors">
          Guardar Cambios
        </button>
      </Modal>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-black/95 backdrop-blur-md px-6 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/img/logo.png" alt="Zac Barber" className="h-9 w-9 rounded-full" />
            <div>
              <h1 className="text-sm font-bold text-amber-400">Zac Barber</h1>
              <p className="text-[11px] text-zinc-500">Panel del Barbero</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
              ← Landing
            </a>
            <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-sm font-bold">ZB</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Greeting */}
        <div>
          <h2 className="text-2xl font-display font-semibold">Buenos días, Barbero</h2>
          <p className="text-sm text-zinc-500 mt-1 capitalize">{TODAY_STR}</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: '📅', label: 'Citas Hoy', value: String(activeToday.length), sub: `${cancelled} canceladas` },
            { icon: '✅', label: 'Completadas', value: String(completed), sub: `${pending} pendientes` },
            { icon: '❌', label: 'Canceladas', value: String(cancelled), sub: 'hoy' },
            { icon: '💰', label: 'Ingresos Hoy', value: `$${revenue.toLocaleString('es-CO')}`, sub: '+12% vs ayer' },
            { icon: '⭐', label: 'Calificación', value: '4.9', sub: '+0.1 este mes' },
          ].map(m => (
            <div key={m.label} className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{m.icon}</span>
                <span className="text-[11px] text-zinc-500">{m.sub}</span>
              </div>
              <p className="text-xl font-bold text-white">{m.value}</p>
              <p className="text-[11px] text-zinc-600 mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Bloquear Horario', icon: '🚫', action: () => setBlockModal(true), style: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' },
            { label: 'Configuración', icon: '⚙️', action: () => setConfigModal(true), style: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' },
          ].map(a => (
            <button key={a.label} onClick={a.action}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${a.style}`}>
              <span>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {([
                { key: 'today' as const, label: `Hoy (${activeToday.length})` },
                { key: 'upcoming' as const, label: `Próximas (${upcomingApts.filter(a => a.status !== 'cancelled').length})` },
                { key: 'history' as const, label: `Historial (${historyApts.length})` },
              ]).map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t.key ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'history' && (
              <input type="text" placeholder="Buscar por cliente o servicio..." value={historyFilter}
                onChange={e => setHistoryFilter(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none" />
            )}

            {/* List */}
            <div className="space-y-2">
              {(tab === 'today' ? todayApts : tab === 'upcoming' ? upcomingApts : historyApts).map(apt => (
                <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-xs">
                      {apt.client.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{apt.client}</p>
                      <p className="text-xs text-zinc-500">{apt.service} — {apt.time}</p>
                      {apt.cancelReason && <p className="text-[11px] text-red-400/70 mt-0.5">Motivo: {apt.cancelReason}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge status={apt.status} />
                    {apt.status === 'pending' && (
                      <button onClick={() => { updateApt(apt.id, { status: 'confirmed' }); setToast(`${apt.client} confirmada`) }}
                        className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/20 transition-colors">Confirmar</button>
                    )}
                    {['confirmed', 'pending'].includes(apt.status) && (
                      <>
                        <button onClick={() => { updateApt(apt.id, { status: 'completed' }); setToast(`${apt.client} completada`) }}
                          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors">Completar</button>
                        <button onClick={() => setCancelModal(apt)}
                          className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition-colors">Cancelar</button>
                      </>
                    )}
                    <button onClick={() => deleteApt(apt.id)}
                      className="rounded-lg bg-zinc-800 px-2 py-1.5 text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Eliminar">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              ))}
              {((tab === 'today' ? todayApts : tab === 'upcoming' ? upcomingApts : historyApts).length === 0) && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-8 text-center">
                  <p className="text-sm text-zinc-500">No hay citas para mostrar</p>
                </div>
              )}
            </div>

            {/* Blocked Hours */}
            {blocks.length > 0 && (
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Horarios Bloqueados</h3>
                <div className="space-y-2">
                  {blocks.map(b => (
                    <div key={b.id} className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-4 py-2.5">
                      <div>
                        <p className="text-sm text-white">{b.date} · {b.start} - {b.end}</p>
                        {b.reason && <p className="text-xs text-zinc-500">{b.reason}</p>}
                      </div>
                      <button onClick={() => removeBlock(b.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Desbloquear</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Calendar */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
              <h3 className="text-sm font-semibold text-white mb-3 capitalize">
                {now.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(d => (
                  <div key={d} className="text-[11px] text-zinc-600 py-1">{d}</div>
                ))}
                {cells.map((d, i) => (
                  <div key={i} className={`text-[11px] py-1.5 rounded-lg transition-colors cursor-pointer
                    ${!d ? '' : d === today ? 'bg-amber-500 text-black font-bold' : aptDays.includes(d) ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'text-zinc-500 hover:bg-zinc-800'}`}>
                    {d ?? ''}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-4 text-[11px] text-zinc-600">
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Hoy</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500/30" /> Con citas</span>
              </div>
            </div>

            {/* Clients */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Clientes Recientes</h3>
              <div className="space-y-3">
                {CLIENTS.map(c => (
                  <div key={c.name} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-[11px] text-zinc-400 font-medium">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{c.name}</p>
                      <p className="text-[11px] text-zinc-500">{c.visits} visitas · {c.lastVisit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Progreso del Día</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-zinc-500">Completadas</span>
                    <span className="text-amber-400 font-medium">{completed}/{activeToday.length}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-800">
                    <div className="h-1.5 rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${activeToday.length ? (completed / activeToday.length) * 100 : 0}%` }} />
                  </div>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Siguiente cita</span>
                  <span className="text-white font-medium">
                    {todayApts.find(a => a.status === 'confirmed' || a.status === 'pending')?.time ?? 'Ninguna'}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Ingresos estimados</span>
                  <span className="text-amber-400 font-medium">
                    ${todayApts.filter(a => !['cancelled'].includes(a.status)).reduce((s, a) => s + (PRICES[a.service] ?? 0), 0).toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
