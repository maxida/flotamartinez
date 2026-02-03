import { useState } from 'react';
import { db } from '../services/firebase';
import { collection, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore';

const DataSeeder = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // DATOS DEL EXCEL LIMPIOS Y LISTOS PARA SUBIR
  const historialData = [
    { "patente": "AD129AI", "modelo": "Kangoo", "anio": null, "fecha": "2025-12-26", "km": 129879, "chofer": "JOSE MARIA", "reparaciones": {"tren_delantero": "bieletas- casoletas- crapodinas- ruleman de rueda lado izq"} },
    { "patente": "JAO082", "modelo": "H1", "anio": 2010, "vtv": "2024-04-01", "fecha": "2025-11-04", "km": 229635, "chofer": "JOSE MARIA", "reparaciones": {}, "novedad": "LEVANTA TEMPERATURA" },
    { "patente": "JAO082", "modelo": "H1", "anio": null, "fecha": "2025-11-11", "km": null, "chofer": "JOSE MARIA", "reparaciones": {"mecanica_ligera": "REPARACION DE RADIADOR "} },
    { "patente": "JAO082", "modelo": "H1", "anio": null, "fecha": "2025-11-29", "km": null, "chofer": "JOSE MARIA", "reparaciones": {"frenos": "ARREGLO DE CERBO DE FRENO "} },
    { "patente": "AF684MI", "modelo": "kangoo", "anio": 2022, "vtv": "2027-06-01", "oblea": "2026-06-01", "fecha": "2025-10-08", "km": 154360, "chofer": "LUIS", "reparaciones": {"tren_delantero": "casoleta- parrillas- bujes y bieletas de la barra- amortiguador izq", "frenos": "delanteros"} },
    { "patente": "AF684MI", "modelo": "kangoo", "anio": null, "fecha": "2025-11-11", "km": 156111, "chofer": "LUIS", "reparaciones": {"mecanica_ligera": "CORREA POLI V"} },
    { "patente": "AC867PP", "modelo": "kangoo", "anio": null, "fecha": "2025-12-03", "km": 315555, "chofer": "NAHUEL", "reparaciones": {"tren_delantero": "parrilla izquierda y derecha", "electronica": "cambio de llave de luz"} },
    { "patente": "AC897PP", "modelo": "kangoo", "anio": 2018, "vtv": "2025-09-01", "oblea": "2026-04-01", "fecha": "2025-08-18", "km": 300900, "chofer": "NAHUEL", "reparaciones": {}, "novedad": "choque parte delantera, capot y panel izquierdo  rot" },
    { "patente": "AC897PP", "modelo": "Kangoo", "anio": null, "fecha": "2025-12-10", "km": 316532, "chofer": "NAHUEL", "reparaciones": {"electronica": "cambio de bomba y reparacion de aforador "} },
    { "patente": "AC897PP", "modelo": "kangoo", "anio": null, "fecha": "2025-11-18", "km": 312000, "chofer": "NAHUEL ", "reparaciones": {"tren_delantero": "bujes de parrillas- bieletas", "tren_trasero": "bujes de tren trasero izquierdo y derecho"} },
    { "patente": "PGD755", "modelo": "Kangoo", "anio": 2014, "km": null, "reparaciones": {}, "novedad": "REPARANDO TAPA" },
    { "patente": "AH641WH", "modelo": "kangoo", "anio": 2025, "fecha": "2026-11-04", "km": 4150, "chofer": "JORGE", "reparaciones": {"frenos": " "} },
    { "patente": "AC897PP", "modelo": "kangoo", "anio": null, "fecha": "2026-11-06", "km": 312220, "chofer": "nahuel", "reparaciones": {"tren_delantero": "bujes de parrilla lado derecho- bujes y bieletas", "tren_trasero": "bujes izquiero y derecho", "electronica": "cambio de bateria "}, "novedad": "choque en la parte trasera, manija de puerta trasera, cinturon roto " },
    { "patente": "AC897PP", "modelo": "Kangoo", "anio": null, "fecha": "2025-11-07", "km": null, "chofer": "NAHUEL ", "reparaciones": {"electronica": "cambio de bateria"} },
    { "patente": "AD129AI", "modelo": "Kangoo", "anio": 2022, "vtv": "2026-01-01", "fecha": "2025-10-23", "km": 126369, "chofer": "PABLO", "reparaciones": {"tren_delantero": "casoleta- parrillas- bujes y bieletas de la barra", "frenos": "delanteros"} },
    { "patente": "AG764GA", "modelo": "Kangoo", "anio": null, "fecha": "2025-09-06", "km": 48000, "chofer": "PABLO", "reparaciones": {"frenos": "delanteros"} },
    { "patente": "AD129AI", "modelo": "kangoo", "anio": null, "fecha": "2025-12-01", "km": null, "chofer": "PABLO ", "reparaciones": {"electronica": "cambio de llave de luz "} },
    { "patente": "AF501DC", "modelo": "kangoo", "anio": 2023, "vtv": "31/10/0205", "oblea": "2026-09-01", "fecha": "2025-10-16", "km": 131354, "chofer": "PEDRO", "reparaciones": {}},
    { "patente": "AF501DC", "modelo": "kangoo", "anio": null, "fecha": "2025-11-17", "km": null, "chofer": "PEDRO", "reparaciones": {"tren_delantero": "casoletas-crapodinas-amortiguadores-bieletas-bujes de barra-parrillas ambos lados"}, "novedad": "LLAMADO DE ATENCION POR MENTIR " },
    { "patente": "AF263YQ", "modelo": "kangoo", "anio": null, "fecha": "2025-09-06", "km": 178100, "chofer": "PIKI", "reparaciones": {}},
    { "patente": "AF263YQ", "modelo": "Kangoo", "anio": 2022, "vtv": "2026-01-31", "oblea": "2026-01-01", "fecha": "2025-10-22", "km": 185397, "chofer": "PIKI", "reparaciones": {"tren_delantero": "casoleta- parrilla- bujes y bieletas de barra", "tren_trasero": "amortiguadores"} },
    { "patente": "408", "modelo": "kangoo", "anio": null, "km": 194060, "chofer": "LUIS", "reparaciones": {"tren_delantero": "bieleta derecha "} },
    { "patente": "AF263YQ", "modelo": "kangoo", "anio": null, "fecha": "2025-11-28", "km": null, "chofer": "PIKI", "reparaciones": {"mecanica_ligera": "PERDIDA DE AGUA "} },
    { "patente": "AF263YQ", "modelo": "Kangoo", "anio": null, "fecha": "2025-12-26", "km": 191470, "chofer": "PIKI", "reparaciones": {"tren_delantero": "amortiguadores x2- casoletas x2- crapodinas x2- espiral derecho x2"}, "novedad": "AGARRO UN POSO Y ROMPIO TODO " },
    { "patente": "AE142MW", "modelo": "kangoo", "anio": 2020, "vtv": "2026-07-01", "oblea": "2026-04-01", "fecha": "2025-10-09", "km": 256362, "chofer": "SUSANA", "reparaciones": {}},
    { "patente": "AD129AI", "modelo": "kangoo", "anio": null, "fecha": "2025-08-18", "km": 124000, "reparaciones": {}, "novedad": "DISTRIBUCION" },
    { "patente": "JAO082", "modelo": "H1", "anio": null, "fecha": "2025-12-08", "km": null, "reparaciones": {"frenos": "CAMBIO DE CABLE DE FRENO TRASERO"} }
  ];

  const handleUpload = async () => {
    setLoading(true);
    setStatus('Iniciando carga masiva...');
    try {
      let count = 0;
      for (const item of historialData) {
        
        // 1. Guardar Vehículo
        if (item.patente) {
          const vehiculoRef = doc(db, 'vehiculo', item.patente); // OJO: 'vehiculo' en singular como tienes en tu DB
          await setDoc(vehiculoRef, {
            patente: item.patente,
            modelo: item.modelo || 'Desconocido',
            anio: item.anio || null,
            vtv_vencimiento: item.vtv || null,
            oblea_vencimiento: item.oblea || null
          }, { merge: true });
        }

        // 2. Guardar Chofer
        if (item.chofer) {
          const choferId = item.chofer.toLowerCase().replace(/\s/g, '');
          const choferRef = doc(db, 'chofer', choferId); // OJO: 'chofer' en singular
          await setDoc(choferRef, {
            nombre: item.chofer.trim(),
            estado: 'Activo'
          }, { merge: true });
        }

        // 3. Crear Historial (Orden Finalizada)
        const fechaDate = item.fecha ? new Date(item.fecha) : new Date();
        
        await addDoc(collection(db, 'ordenes'), {
          vehiculo_patente: item.patente,
          chofer_nombre: item.chofer || 'Desconocido',
          fecha_ingreso: Timestamp.fromDate(fechaDate),
          fecha_salida: Timestamp.fromDate(fechaDate), // Como ya pasó, ponemos la misma fecha
          km_ingreso: item.km || 0,
          estado_trabajo: 'FINALIZADO',
          origen: 'HISTORIAL_EXCEL',
          detalle_reparacion: item.reparaciones || {},
          observaciones: item.novedad || ''
        });

        count++;
        setStatus(`Subiendo registro ${count} de ${historialData.length}...`);
      }
      setStatus('¡Carga completa! Revisa la pestaña Historial.');
      alert('Datos históricos cargados exitosamente.');
    } catch (error) {
      console.error(error);
      setStatus('Error al cargar. Revisa la consola (F12).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg m-4 shadow-sm">
      <h3 className="text-lg font-bold text-blue-800 mb-2">📥 Cargar Historial Excel</h3>
      <p className="text-sm text-blue-600 mb-4">
        Presiona para subir los {historialData.length} registros del Excel a Firebase.
      </p>
      <button 
        onClick={handleUpload} 
        disabled={loading}
        className={`px-6 py-2 rounded text-white font-bold transition-colors ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Subiendo datos...' : 'INICIAR CARGA AHORA'}
      </button>
      {status && <p className="mt-3 text-sm font-semibold text-slate-700">{status}</p>}
    </div>
  );
};

export default DataSeeder;