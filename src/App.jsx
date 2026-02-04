import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Vehiculos from './pages/Vehiculos'
import Choferes from './pages/Choferes'
import Ordenes from './pages/Ordenes'
import Historial from './pages/Historial'
import Seeder from './components/Seeder'
import Dashboard from './pages/Dashboard'
import DataSeeder from './components/DataSeeder' // <--- 1. Importamos la nueva herramienta

function App() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
      }}
    >
      <Layout>
        {/* 2. Ponemos el botón aquí temporalmente para usarlo */}
        <DataSeeder /> 
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/choferes" element={<Choferes />} />
          {/* Route for creating orders removed */}
          <Route path="/historial" element={<Historial />} />
          <Route path="/seed" element={<Seeder />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App