import { useState } from 'react'

const TODAY = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

interface Appointment {
  id: string
  client: string
  service: string
  time: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  phone: string
}

const MOCK_TODAY: Appointment[] = [
  { id: '1', client: 'Carlos Méndez', service: 'Corte Clásico', time: '09:00 AM', status: 'completed', phone: '+57 300 111 2222' },
  { id: '2', client: 'Andrés Ríos', service: 'Corte + Barba', time: '10:00 AM', status: 'completed', phone: '+57 301 222 3333' },
  { id: '3', client: 'David López', service: 'Degradado', time: '11:30 AM', status: 'confirmed', phone: '+57 302 333 4444' },
  { id: '4', client: 'Miguel Torres', service: 'Barba Premium', time: '01:00 PM', status: 'pending', phone: '+57 303 444 5555' },
  { id: '5', client: 'Felipe Gómez', service: 'Corte Clásico', time: '02:30 PM', status: 'pending', phone: '+57 304 555 6666' },
  { id: '6', client: 'Juan Ramírez', service: 'Tratamiento Capilar', time: '04:00 PM', status: 'confirmed', phone: '+57 305 666 7777' },
]

const MOCK_UPCOMING: Appointment[] = [
  { id: '7', client: 'Santiago Peña', service: 'Corte + Barba', time: 'Mañana 10:00 AM', status: 'confirmed', phone: '+57 306 777 8888' },
  { id: '8', client: 'Nicolás Vargas', service: 'Degradado', time: 'Mañana 02:00 PM', status: 'pending', phone: '+57 307 888 9999' },
  { id: '9', client: 'Mateo Cruz', service: 'Barba Premium', time: 'Vie 09:30 AM', status: 'confirmed', phone: '+57 308 999 0000' },
]

const MOCK_CLIENTS = [
  { name: 'Carlos Méndez', visits: 12, lastVisit: 'Hoy' },
  { name: 'Andrés Ríos', visits: 8, lastVisit: 'Hoy' },
  { name: 'Santiago Peña', visits: 15, lastVisit: 'Hace 3 días' },
  { name: 'Felipe Gómez', visits: 5, lastVisit: 'Hace 1 semana' },
]

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  completed: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? ''}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

function MetricCard({ label, value, change, icon }: { label: string; value: string; change: string; icon: string }) {
  const isPositive = change.startsWith('+')
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>{change}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{label}</p>
    </div>
  )
}

function AppointmentRow({ apt, onAction }: { apt: Appointment; onAction: (id: string, action: string) => void }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 hover:border-zinc-700 transition-colors">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-sm">
        {apt.client.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{apt.client}</p>
        <p className="text-xs text-zinc-500">{apt.service} — {apt.time}</p>
      </div>
      <StatusBadge status={apt.status} />
      <div className="flex gap-1">
        {apt.status === 'pending' && (
          <button
            onClick={() => onAction(apt.id, 'confirm')}
            className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            Confirmar
          </button>
        )}
        {(apt.status === 'confirmed' || apt.status === 'pending') && (
          <>
            <button
              onClick={() => onAction(apt.id, 'complete')}
              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              Completar
            </button>
            <button
              onClick={() => onAction(apt.id, 'cancel')}
              className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function MiniCalendar() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = now.getDate()
  const daysWithAppts = [today, today + 1, today + 3, today + 5, today + 7]
  const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

  const cells: (number | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">
          {now.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-1">
          <button className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:text-white transition-colors">‹</button>
          <button className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:text-white transition-colors">›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map(d => (
          <div key={d} className="text-xs text-zinc-600 py-1">{d}</div>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            className={`text-xs py-1.5 rounded-lg transition-colors cursor-pointer
              ${!d ? '' : d === today ? 'bg-amber-500 text-black font-bold' : daysWithAppts.includes(d) ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'text-zinc-400 hover:bg-zinc-800'}
            `}
          >
            {d ?? ''}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Hoy</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500/30" /> Con citas</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState(MOCK_TODAY)
  const [tab, setTab] = useState<'today' | 'upcoming'>('today')

  function handleAction(id: string, action: string) {
    setAppointments(prev =>
      prev.map(a => {
        if (a.id !== id) return a
        if (action === 'confirm') return { ...a, status: 'confirmed' as const }
        if (action === 'complete') return { ...a, status: 'completed' as const }
        if (action === 'cancel') return { ...a, status: 'cancelled' as const }
        return a
      })
    )
  }

  const todayCompleted = appointments.filter(a => a.status === 'completed').length
  const todayPending = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/95 backdrop-blur px-4 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/img/logo.png" alt="Zac Barber" className="h-8 w-8 rounded-full" />
            <div>
              <h1 className="text-sm font-bold text-amber-400">Zac Barber</h1>
              <p className="text-xs text-zinc-500">Panel del Barbero</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
              ← Landing
            </a>
            <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-sm font-bold">
              ZB
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Greeting */}
        <div>
          <h2 className="text-2xl font-bold">Buenos días, Barbero 👋</h2>
          <p className="text-sm text-zinc-500 mt-1 capitalize">{TODAY}</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon="📅" label="Citas Hoy" value={String(appointments.length)} change="+2 vs ayer" />
          <MetricCard icon="✅" label="Completadas" value={String(todayCompleted)} change={`${todayPending} pendientes`} />
          <MetricCard icon="💰" label="Ingresos Hoy" value="$155.000" change="+12% vs ayer" />
          <MetricCard icon="⭐" label="Calificación" value="4.9" change="+0.1 este mes" />
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Nueva Cita', icon: '➕', style: 'bg-amber-500 text-black hover:bg-amber-400' },
            { label: 'Bloquear Horario', icon: '🚫', style: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' },
            { label: 'Ver Historial', icon: '📋', style: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' },
            { label: 'Configuración', icon: '⚙️', style: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' },
          ].map(a => (
            <button key={a.label} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${a.style}`}>
              <span>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Appointments - spans 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setTab('today')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === 'today' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                Hoy ({appointments.length})
              </button>
              <button
                onClick={() => setTab('upcoming')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === 'upcoming' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                Próximas ({MOCK_UPCOMING.length})
              </button>
            </div>

            {/* Appointment list */}
            <div className="space-y-2">
              {(tab === 'today' ? appointments : MOCK_UPCOMING).map(apt => (
                <AppointmentRow key={apt.id} apt={apt} onAction={handleAction} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <MiniCalendar />

            {/* Recent clients */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Clientes Recientes</h3>
              <div className="space-y-3">
                {MOCK_CLIENTS.map(c => (
                  <div key={c.name} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 font-medium">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{c.name}</p>
                      <p className="text-xs text-zinc-500">{c.visits} visitas · {c.lastVisit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today progress */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Progreso del Día</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400">Citas completadas</span>
                    <span className="text-amber-400">{todayCompleted}/{appointments.length}</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800">
                    <div
                      className="h-2 rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${(todayCompleted / appointments.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Siguiente cita</span>
                  <span className="text-white font-medium">
                    {appointments.find(a => a.status === 'confirmed' || a.status === 'pending')?.time ?? 'Ninguna'}
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
