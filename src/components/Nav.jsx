import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="flex items-center gap-4 bg-white p-4 border-b border-slate-200">
      <Link to="/" className="text-slate-700 hover:text-slate-900">Ordenes</Link>
      <Link to="/vehiculos" className="text-slate-700 hover:text-slate-900">Vehículos</Link>
      <Link to="/choferes" className="text-slate-700 hover:text-slate-900">Choferes</Link>
      {/* Nueva Orden removed */}
      <Link to="/historial" className="text-slate-700 hover:text-slate-900">Historial</Link>
    </nav>
  )
}
