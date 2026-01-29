import DataSeeder from './DataSeeder'

export default function Seeder() {
  return (
    <section>
      <h3>Seeder (temporal)</h3>
      <p>Carga datos históricos de ejemplo en Firestore. Usar solo una vez.</p>
      <DataSeeder />
    </section>
  )
}
