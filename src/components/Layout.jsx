import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="app-shell flex">
      <aside className="w-80 bg-brand-dark sidebar-scroll min-h-screen">
        <div className="p-6 border-b border-brand-primary/20 flex items-center justify-center">
          {/* Large centered logo */}
          <img src="/logo.png" alt="Flota Martinez" className="h-32 w-auto mx-auto object-contain logo" />
        </div>
        <nav className="p-6">
          <ul className="space-y-3">
            <li>
              <Link to="/" className="flex items-center gap-4 px-4 py-3 rounded hover:bg-brand-accent hover:text-white text-lg font-medium text-slate-900">
                <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4l9 5.75M12 4v16"/></svg>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/ordenes/nueva" className="flex items-center gap-4 px-4 py-3 rounded hover:bg-brand-accent hover:text-white text-lg font-medium text-slate-900">
                <svg className="w-6 h-6 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                <span>Ingreso</span>
              </Link>
            </li>
            <li>
              <Link to="/historial" className="flex items-center gap-4 px-4 py-3 rounded hover:bg-brand-accent hover:text-white text-lg font-medium text-slate-900">
                <svg className="w-6 h-6 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7v6h6"/></svg>
                <span>Historial</span>
              </Link>
            </li>
            <li>
              <Link to="/vehiculos" className="flex items-center gap-4 px-4 py-3 rounded hover:bg-brand-accent hover:text-white text-lg font-medium text-slate-900">
                <svg className="w-6 h-6 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 13l2-6h14l2 6v6a1 1 0 0 1-1 1h-1a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H4a1 1 0 0 1-1-1v-6z"/></svg>
                <span>Vehículos</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 min-h-screen bg-brand-bg">
        <header className="bg-white border-b border-brand-primary/20 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-brand-primary">Panel</h2>
            <p className="text-sm text-slate-500">Resumen y operaciones</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-brand-accent text-white px-3 py-1 rounded shadow-sm text-sm">Nuevo</button>
            <div className="text-sm text-slate-600">Jose Maria Martinez</div>
            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-700">JM</div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
