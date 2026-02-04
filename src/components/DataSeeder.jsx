import { useState } from 'react';
import { db } from '../services/firebase'; 
import { collection, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore';

const DataSeeder = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // TUS DATOS (FLOTA MARTINEZ 1) - Con campo ESTADO agregado
  const historialData = [
    { "patente": "AD129AI", "modelo": "Kangoo", "anio": null, "fecha": "2025-12-26", "km": 129879, "estado": "FINALIZADO", "chofer": "JOSE MARIA", "reparaciones": {"tren_delantero": "bieletas- casoletas- crapodinas- ruleman de rueda lado izq"} },
    { "patente": "JAO082", "modelo": "H1", "anio": 2010, "vtv": "2024-04-01", "fecha": "2025-11-04", "km": 229635, "estado": "FINALIZADO", "chofer": "JOSE MARIA", "reparaciones": {}, "novedad": "LEVANTA TEMPERATURA" },
    { "patente": "JAO082", "modelo": "H1", "anio": null, "fecha": "2025-11-11", "km": null, "estado": "FINALIZADO", "chofer": "JOSE MARIA", "reparaciones": {"mecanica_ligera": "REPARACION DE RADIADOR "} },
    { "patente": "JAO082", "modelo": "H1", "anio": null, "fecha": "2025-11-29", "km": null, "estado": "FINALIZADO", "chofer": "JOSE MARIA", "reparaciones": {"frenos": "ARREGLO DE CERBO DE FRENO "} },
    { "patente": "AF684MI", "modelo": "kangoo", "anio": 2022, "vtv": "2027-06-01", "oblea": "2026-06-01", "fecha": "2025-10-08", "km": 154360, "estado": "FINALIZADO", "chofer": "LUIS", "reparaciones": {"tren_delantero": "casoleta- parrillas- bujes y bieletas de la barra- amortiguador izq", "frenos": "delanteros"} },
    { "patente": "AF684MI", "modelo": "kangoo", "anio": null, "fecha": "2025-11-11", "km": 156111, "estado": "FINALIZADO", "chofer": "LUIS", "reparaciones": {"mecanica_ligera": "CORREA POLI V"} },
    { "patente": "AC867PP", "modelo": "kangoo", "anio": null, "fecha": "2025-12-03", "km": 315555, "estado": "FINALIZADO", "chofer": "NAHUEL", "reparaciones": {"tren_delantero": "parrilla izquierda y derecha", "electronica": "cambio de llave de luz"} },
    { "patente": "AC897PP", "modelo": "kangoo", "anio": 2018, "vtv": "2025-09-01", "oblea": "2026-04-01", "fecha": "2025-08-18", "km": 300900, "estado": "FINALIZADO", "chofer": "NAHUEL", "reparaciones": {}, "novedad": "choque parte delantera, capot y panel izquierdo  rot" },
    { "patente": "AC897PP", "modelo": "Kangoo", "anio": null, "fecha": "2025-12-10", "km": 316532, "estado": "FINALIZADO", "chofer": "NAHUEL", "reparaciones": {"electronica": "cambio de bomba y reparacion de aforador "} },
    { "patente": "AC897PP", "modelo": "kangoo", "anio": null, "fecha": "2025-11-18", "km": 312000, "estado": "FINALIZADO", "chofer": "NAHUEL ", "reparaciones": {"tren_delantero": "bujes de parrillas- bieletas", "tren_trasero": "bujes de tren trasero izquierdo y derecho"} },
    { "patente": "PGD755", "modelo": "Kangoo", "anio": 2014, "km": null, "estado": "FINALIZADO", "chofer": "JORGE", "reparaciones": {}, "novedad": "REPARANDO TAPA" },
    { "patente": "AH641WH", "modelo": "kangoo", "anio": 2025, "fecha": "2026-11-04", "km": 4150, "estado": "FINALIZADO", "chofer": "JORGE", "reparaciones": {"frenos": " "} },
    { "patente": "AC897PP", "modelo": "kangoo", "anio": null, "fecha": "2026-11-06", "km": 312220, "estado": "FINALIZADO", "chofer": "nahuel", "reparaciones": {"tren_delantero": "bujes de parrilla lado derecho- bujes y bieletas", "tren_trasero": "bujes izquiero y derecho", "electronica": "cambio de bateria "}, "novedad": "choque en la parte trasera, manija de puerta trasera, cinturon roto " },
    { "patente": "AC897PP", "modelo": "Kangoo", "anio": null, "fecha": "2025-11-07", "km": null, "estado": "FINALIZADO", "chofer": "NAHUEL ", "reparaciones": {"electronica": "cambio de bateria"} },
    { "patente": "AD129AI", "modelo": "Kangoo", "anio": 2022, "vtv": "2026-01-01", "fecha": "2025-10-23", "km": 126369, "estado": "FINALIZADO", "chofer": "PABLO", "reparaciones": {"tren_delantero": "casoleta- parrillas- bujes y bieletas de la barra", "frenos": "delanteros"} },
    { "patente": "AG764GA", "modelo": "Kangoo", "anio": null, "fecha": "2025-09-06", "km": 48000, "estado": "FINALIZADO", "chofer": "PABLO", "reparaciones": {"frenos": "delanteros"} },
    { "patente": "AD129AI", "modelo": "kangoo", "anio": null, "fecha": "2025-12-01", "km": null, "estado": "FINALIZADO", "chofer": "PABLO ", "reparaciones": {"electronica": "cambio de llave de luz "} },
    { "patente": "AF501DC", "modelo": "kangoo", "anio": 2023, "vtv": "31/10/0205", "oblea": "2026-09-01", "fecha": "2025-10-16", "km": 131354, "estado": "FINALIZADO", "chofer": "PEDRO", "reparaciones": {}},
    { "patente": "AF501DC", "modelo": "kangoo", "anio": null, "fecha": "2025-11-17", "km": null, "estado": "FINALIZADO", "chofer": "PEDRO", "reparaciones": {"tren_delantero": "casoletas-crapodinas-amortiguadores-bieletas-bujes de barra-parrillas ambos lados"}, "novedad": "LLAMADO DE ATENCION POR MENTIR " },
    { "patente": "AF263YQ", "modelo": "kangoo", "anio": null, "fecha": "2025-09-06", "km": 178100, "estado": "FINALIZADO", "chofer": "PIKI", "reparaciones": {}},
    { "patente": "AF263YQ", "modelo": "Kangoo", "anio": 2022, "vtv": "2026-01-31", "oblea": "2026-01-01", "fecha": "2025-10-22", "km": 185397, "estado": "FINALIZADO", "chofer": "PIKI", "reparaciones": {"tren_delantero": "casoleta- parrilla- bujes y bieletas de barra", "tren_trasero": "amortiguadores"} },
    { "patente": "408", "modelo": "kangoo", "anio": null, "km": 194060, "estado": "FINALIZADO", "chofer": "LUIS", "reparaciones": {"tren_delantero": "bieleta derecha "} },
    { "patente": "AF263YQ", "modelo": "kangoo", "anio": null, "fecha": "2025-11-28", "km": null, "estado": "FINALIZADO", "chofer": "PIKI", "reparaciones": {"mecanica_ligera": "PERDIDA DE AGUA "} },
    { "patente": "AF263YQ", "modelo": "Kangoo", "anio": null, "fecha": "2025-12-26", "km": 191470, "estado": "FINALIZADO", "chofer": "PIKI", "reparaciones": {"tren_delantero": "amortiguadores x2- casoletas x2- crapodinas x2- espiral derecho x2"}, "novedad": "AGARRO UN POSO Y ROMPIO TODO " },
    { "patente": "AE142MW", "modelo": "kangoo", "anio": 2020, "vtv": "2026-07-01", "oblea": "2026-04-01", "fecha": "2025-10-09", "km": 256362, "estado": "FINALIZADO", "chofer": "SUSANA", "reparaciones": {}},
    { "patente": "AD129AI", "modelo": "kangoo", "anio": null, "fecha": "2025-08-18", "km": 124000, "estado": "FINALIZADO", "chofer": "JOSE MARIA", "reparaciones": {}, "novedad": "DISTRIBUCION" },
    { "patente": "JAO082", "modelo": "H1", "anio": null, "fecha": "2025-12-08", "km": null, "estado": "FINALIZADO", "chofer": "JOSE MARIA", "reparaciones": {"frenos": "CAMBIO DE CABLE DE FRENO TRASERO"} }
  ];

  // Función auxiliar para parsear fechas
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0); 
    let d = new Date(dateStr);
    if (!isNaN(d)) return d;
    if (dateStr && dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if(parts.length === 3) return new Date(parts[2], parts[1]-1, parts[0]);
    }
    return new Date(0);
  };

  const handleUpload = async () => {
    setLoading(true);
    setStatus('Calculando los mejores datos (KM, VTV, Oblea, Año)...');
    try {
      const bestData = {};

      historialData.forEach(item => {
        if (!item.patente) return;
        const p = item.patente;

        if (!bestData[p]) {
            bestData[p] = { maxKm: 0, latestVTV: null, latestOblea: null, anio: null };
        }

        // KM
        if (item.km && item.km > bestData[p].maxKm) {
            bestData[p].maxKm = item.km;
        }
        // VTV
        if (item.vtv) {
            const currentVTV = parseDate(bestData[p].latestVTV);
            const newVTV = parseDate(item.vtv);
            if (newVTV > currentVTV) bestData[p].latestVTV = item.vtv;
        }
        // Oblea
        if (item.oblea) {
            const currentOblea = parseDate(bestData[p].latestOblea);
            const newOblea = parseDate(item.oblea);
            if (newOblea > currentOblea) bestData[p].latestOblea = item.oblea;
        }
        // Año
        if (item.anio && Number.isFinite(Number(item.anio))) {
            const y = Number(item.anio);
            if (!bestData[p].anio || y > bestData[p].anio) bestData[p].anio = y;
        }
      });

      setStatus('Iniciando carga de datos...');
      let count = 0;

      for (const item of historialData) {
        
        // 1. Guardar Vehículo
        if (item.patente) {
          const vehiculoRef = doc(db, 'vehiculo', item.patente);
          const mejoresDatos = bestData[item.patente] || {};

          const vehPayload = {
            patente: item.patente,
            modelo: item.modelo || 'Desconocido',
            vtv_vencimiento: mejoresDatos.latestVTV || null,
            oblea_vencimiento: mejoresDatos.latestOblea || null,
            kilometros: mejoresDatos.maxKm || item.km || 0,
            fecha_trabajo: item.fecha || null 
          };
          if (mejoresDatos.anio) vehPayload.anio = mejoresDatos.anio;

          await setDoc(vehiculoRef, vehPayload, { merge: true });
        }

        // 2. Guardar Chofer
        if (item.chofer) {
          const choferId = item.chofer.toLowerCase().replace(/\s/g, '');
          const choferRef = doc(db, 'chofer', choferId);
          await setDoc(choferRef, {
            nombre: item.chofer.trim(),
            estado: 'Activo'
          }, { merge: true });
        }

        // 3. Crear Historial (Orden)
        const fechaDate = item.fecha ? new Date(item.fecha) : new Date();
        
        await addDoc(collection(db, 'ordenes'), {
          vehiculo_patente: item.patente,
          chofer_nombre: item.chofer || 'Desconocido',
          fecha_ingreso: Timestamp.fromDate(fechaDate),
          fecha_salida: Timestamp.fromDate(fechaDate),
          km_ingreso: item.km || 0,
          // AQUI USAMOS EL NUEVO CAMPO "item.estado"
          estado_trabajo: item.estado || 'FINALIZADO',
          origen: 'MIGRACION_FINAL_BEST_DATES',
          detalle_reparacion: item.reparaciones || {},
          observaciones: item.novedad || ''
        });

        count++;
        setStatus(`Procesando registro ${count}...`);
      }
      setStatus('¡Todo listo! Historial cargado con estados.');
      alert('Datos actualizados correctamente.');
    } catch (error) {
      console.error(error);
      setStatus('Error al cargar datos. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mb-4 shadow-sm text-center">
      <h3 className="text-xl font-bold text-blue-800 mb-2">📥 Cargar Datos Maestros</h3>
      <p className="text-blue-700 mb-4">
        Carga los 27 registros históricos con estado <b>FINALIZADO</b>.
      </p>
      <button 
        onClick={handleUpload} 
        disabled={loading}
        className={`px-8 py-3 rounded-lg text-white font-bold text-lg shadow transition-colors ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Procesando...' : 'INICIAR CARGA DE DATOS'}
      </button>
      {status && <p className="mt-4 text-sm font-semibold text-blue-900 bg-blue-100 py-2 rounded">{status}</p>}
    </div>
  );
};

export default DataSeeder;