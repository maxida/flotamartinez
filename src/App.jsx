import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Vehiculos from './pages/Vehiculos'
import Choferes from './pages/Choferes'
import Ordenes from './pages/Ordenes'
import Historial from './pages/Historial'
import Dashboard from './pages/Dashboard'
import Inventario from './pages/Inventario'
import Seeder from './components/Seeder'

function App() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/seed" element={<Seeder />} />
          <Route path="/choferes" element={<Choferes />} />
          {/* Route for creating orders removed */}
          <Route path="/historial" element={<Historial />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App