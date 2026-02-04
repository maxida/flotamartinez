import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV = [
  { to: '/', label: 'Dashboard', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4l9 5.75M12 4v16" />
    </svg>
  ) },
  { to: '/historial', label: 'Historial', icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7v6h6" />
    </svg>
  ) },
  { to: '/vehiculos', label: 'Vehículos', icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 13l2-6h14l2 6v6a1 1 0 0 1-1 1h-1a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H4a1 1 0 0 1-1-1v-6z" />
    </svg>
  ) },
  { to: '/choferes', label: 'Choferes', icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.12 17.804zM12 11a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  ) }
]

export default function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-100 text-slate-700">
      {/* Sidebar - solid block on the left (no absolute/fixed positioning) */}
      <aside className="w-48 h-[calc(100vh-1cm)] flex-shrink-0 bg-slate-900 text-slate-300 flex flex-col">
        {/* Logo - fixed height */}
        <div className="h-20 flex items-center justify-center border-b border-slate-800 px-4">
          <img src="/logo.png" alt="Flota Martinez" className="h-16 w-auto object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`group flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm font-medium transition-colors ${active ? 'bg-slate-800 text-white border-l-4 border-amber-500' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                  >
                    <span className="opacity-90 text-slate-300 group-hover:text-white">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">Conectado como</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-white text-sm">JM</div>
            <div>
              <div className="text-sm text-slate-100">Jose M. Martinez</div>
              <div className="text-xs text-slate-400">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col h-full bg-slate-50">
        {/* Main content area: children pages control their own headers */}
        <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="w-full max-w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
