import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Vehiculos from './pages/Vehiculos'
import Choferes from './pages/Choferes'
import Ordenes from './pages/Ordenes'
import CreateOrder from './pages/CreateOrder'
import Historial from './pages/Historial'
import Seeder from './components/Seeder'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/choferes" element={<Choferes />} />
          <Route path="/ordenes/nueva" element={<CreateOrder />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/seed" element={<Seeder />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
