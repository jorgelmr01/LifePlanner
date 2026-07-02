import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import { DIA_MS, claveDia, inicioDia } from '../logic/dates'
import { esperadasPorSemana } from '../logic/suggestions'
import { actualizarRitmo, cambiarEstadoRitmo } from '../logic/actions'
import { ChipsSelector, Hoja } from '../components/ui'
import type { Nav } from '../App'

export function RitmoDetail({ nav, id }: { nav: Nav; id: string }) {
  const [editando, setEditando] = useState(false)
  const ritmo = useLiveQuery(() => db.ritmos.get(id), [id])
  const logs = useLiveQuery(() => db.ritmoLogs.where('ritmoId').equals(id).toArray(), [id]) ?? []

  if (!ritmo) return null

  // heatmap de 28 días (4 semanas)
  const dias = new Set(logs.map((l) => l.dia))
  const celdas = [...Array(28)].map((_, i) => claveDia(inicioDia() - (27 - i) * DIA_MS))
  const hechas7 = logs.filter((l) => l.fecha >= inicioDia() - 6 * DIA_MS).length
  const esperadas = esperadasPorSemana(ritmo)

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button className="link" onClick={nav.volver}>
          ← Volver
        </button>
        <h1 style={{ fontSize: 22 }}>
          {ritmo.icono} {ritmo.nombre}
        </h1>
        <button className="link" onClick={() => setEditando(true)}>
          Editar
        </button>
      </div>

      <div className="tarjeta">
        <div className="fila">
          <span className={`badge ${ritmo.estado === 'activo' ? 'badge-alta' : 'badge-media'}`}>
            ● {ritmo.estado[0].toUpperCase() + ritmo.estado.slice(1)}
          </span>
          <span className="crece" />
          <span className="subtitulo">
            {ritmo.frecuencia === 'diario' ? 'Diario' : `${ritmo.vecesPorSemana}x por semana`}
          </span>
        </div>
        <div className="subtitulo" style={{ marginTop: 8 }}>
          Esta semana: {hechas7}/{esperadas} · Total histórico: {logs.length}
        </div>
      </div>

      <div className="tarjeta">
        <div className="seccion-titulo">Últimas 4 semanas</div>
        <div className="heat">
          {celdas.map((d) => (
            <div key={d} className={dias.has(d) ? 'on' : ''} title={d} />
          ))}
        </div>
        <div className="subtitulo" style={{ marginTop: 8 }}>
          Sin juicio, solo información: la consistencia flexible gana.
        </div>
      </div>

      <div className="fila">
        {ritmo.estado === 'activo' ? (
          <button
            className="btn btn-fantasma crece"
            onClick={() => cambiarEstadoRitmo(ritmo, 'pausado')}
          >
            ⏸ Pausar temporalmente
          </button>
        ) : (
          <button
            className="btn btn-secundario crece"
            onClick={() => cambiarEstadoRitmo(ritmo, 'activo')}
          >
            ▶ Reactivar
          </button>
        )}
        {ritmo.estado !== 'archivado' && (
          <button
            className="btn btn-peligro"
            onClick={async () => {
              await cambiarEstadoRitmo(ritmo, 'archivado')
              nav.volver()
            }}
          >
            Archivar
          </button>
        )}
      </div>

      <EditarRitmoHoja abierta={editando} onCerrar={() => setEditando(false)} ritmoId={id} />
    </div>
  )
}

function EditarRitmoHoja({
  abierta,
  onCerrar,
  ritmoId,
}: {
  abierta: boolean
  onCerrar: () => void
  ritmoId: string
}) {
  const ritmo = useLiveQuery(() => db.ritmos.get(ritmoId), [ritmoId])
  const areas = useLiveQuery(() => db.areas.orderBy('orden').toArray()) ?? []
  const [nombre, setNombre] = useState<string>()
  const [frecuencia, setFrecuencia] = useState<'diario' | 'semanal'>()
  const [veces, setVeces] = useState<number>()
  const [areaIds, setAreaIds] = useState<string[]>()

  if (!ritmo) return null
  const vNombre = nombre ?? ritmo.nombre
  const vFrec = frecuencia ?? (ritmo.frecuencia === 'diario' ? 'diario' : 'semanal')
  const vVeces = veces ?? ritmo.vecesPorSemana
  const vAreas = areaIds ?? ritmo.areaIds

  async function guardar() {
    await actualizarRitmo(ritmoId, {
      nombre: vNombre.trim() || ritmo!.nombre,
      frecuencia: vFrec,
      vecesPorSemana: vFrec === 'diario' ? 7 : Math.max(1, vVeces),
      areaIds: vAreas,
    })
    onCerrar()
  }

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar}>
      <h2>Editar ritmo</h2>
      <label>Nombre</label>
      <input value={vNombre} onChange={(e) => setNombre(e.target.value)} />
      <label>Frecuencia</label>
      <div className="chips">
        <button
          className={`chip ${vFrec === 'diario' ? 'activo' : ''}`}
          onClick={() => setFrecuencia('diario')}
        >
          Diario
        </button>
        <button
          className={`chip ${vFrec === 'semanal' ? 'activo' : ''}`}
          onClick={() => setFrecuencia('semanal')}
        >
          Por semana
        </button>
      </div>
      {vFrec === 'semanal' && (
        <>
          <label>¿Cuántas veces por semana?</label>
          <div className="chips">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={`chip ${vVeces === n ? 'activo' : ''}`} onClick={() => setVeces(n)}>
                {n}x
              </button>
            ))}
          </div>
        </>
      )}
      {areas.length > 0 && (
        <>
          <label>Áreas a las que da XP</label>
          <ChipsSelector
            items={areas}
            seleccion={vAreas}
            onCambio={setAreaIds}
            etiqueta={(a) => `${a.icono} ${a.nombre}`}
          />
        </>
      )}
      <button className="btn btn-primario btn-bloque" style={{ marginTop: 20 }} onClick={guardar}>
        Guardar
      </button>
    </Hoja>
  )
}
