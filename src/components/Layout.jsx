import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <aside className="w-64 bg-slate-900 text-white sidebar-scroll">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-semibold">Flota Martinez</h1>
          <p className="text-sm text-slate-400">Gestión de Taller</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800">
                <svg className="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4l9 5.75M12 4v16"/></svg>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/ordenes/nueva" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800">
                <svg className="w-5 h-5 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                <span>Ingreso</span>
              </Link>
            </li>
            <li>
              <Link to="/historial" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800">
                <svg className="w-5 h-5 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7v6h6"/></svg>
                <span>Historial</span>
              </Link>
            </li>
            <li>
              <Link to="/vehiculos" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800">
                <svg className="w-5 h-5 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 13l2-6h14l2 6v6a1 1 0 0 1-1 1h-1a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H4a1 1 0 0 1-1-1v-6z"/></svg>
                <span>Vehículos</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 min-h-screen">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-700">Panel</h2>
            <p className="text-sm text-slate-500">Resumen y operaciones</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">Maxi</div>
            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-700">M</div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
