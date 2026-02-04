import { useState } from 'react';
import { db } from '../services/firebase'; 
import { collection, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore';

// TUS DATOS (FLOTA MARTINEZ 1) - exportamos para poder reutilizarlos
export const historialData = [
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

// Función auxiliar para parsear fechas y compararlas
const parseDate = (dateStr) => {
  if (!dateStr) return new Date(0); // Fecha muy vieja si es null
  // Intenta parsear ISO (YYYY-MM-DD)
  let d = new Date(dateStr);
  if (!isNaN(d)) return d;
  // Intenta parsear DD/MM/YYYY si falla lo anterior
  if (dateStr && dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if(parts.length === 3) return new Date(parts[2], parts[1]-1, parts[0]);
  }
  return new Date(0);
};

// Exportamos una función utilizable desde otras páginas para insertar los 27 registros
export async function seedHistorial(onProgress) {
  try {
    if (onProgress) onProgress('Calculando los mejores datos (KM, VTV, Oblea)...');
    const bestData = {};

    historialData.forEach(item => {
      if (!item.patente) return;
      const p = item.patente;
      if (!bestData[p]) bestData[p] = { maxKm: 0, latestVTV: null, latestOblea: null, anio: null };

      if (item.km && item.km > bestData[p].maxKm) {
        bestData[p].maxKm = item.km;
      }

      if (item.vtv) {
        const currentVTV = parseDate(bestData[p].latestVTV);
        const newVTV = parseDate(item.vtv);
        if (newVTV > currentVTV) bestData[p].latestVTV = item.vtv;
      }

      if (item.oblea) {
        const currentOblea = parseDate(bestData[p].latestOblea);
        const newOblea = parseDate(item.oblea);
        if (newOblea > currentOblea) bestData[p].latestOblea = item.oblea;
      }

      if (item.anio && Number.isFinite(Number(item.anio))) {
        const y = Number(item.anio);
        if (!bestData[p].anio || y > bestData[p].anio) bestData[p].anio = y;
      }
    });

    // Removed markdown fence for valid JS
    let count = 0;

    for (const item of historialData) {
      // Guardar Vehículo
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

      // Guardar Chofer
      if (item.chofer) {
        const choferId = item.chofer.toLowerCase().replace(/\s/g, '');
        const choferRef = doc(db, 'chofer', choferId);
        await setDoc(choferRef, {
          nombre: item.chofer.trim(),
          estado: 'Activo'
        }, { merge: true });
      }

      // Crear Historial (Orden Finalizada)
      const fechaDate = item.fecha ? new Date(item.fecha) : new Date();
      await addDoc(collection(db, 'ordenes'), {
        vehiculo_patente: item.patente,
        chofer_nombre: item.chofer || 'Desconocido',
        fecha_ingreso: Timestamp.fromDate(fechaDate),
        fecha_salida: Timestamp.fromDate(fechaDate),
        km_ingreso: item.km || 0,
        estado_trabajo: 'FINALIZADO',
        origen: 'MIGRACION_FINAL_BEST_DATES',
        detalle_reparacion: item.reparaciones || {},
        observaciones: item.novedad || ''
      });

      count++;
      if (onProgress) onProgress(`Procesando registro ${count}...`);
    }

    if (onProgress) onProgress('¡Todo listo!');
    return { success: true, count };
  } catch (error) {
    console.error('Error en seedHistorial:', error);
    return { success: false, error };
  }
}

// Note: UI trigger component removed to avoid rendering import buttons.
// If you need a UI button later, re-add a component that calls `seedHistorial`.

// Restauramos una exportación por defecto vacía para mantener compatibilidad
// con importaciones existentes (p.ej. `import DataSeeder from './DataSeeder'`).
export default function DataSeeder() {
  return null;
}