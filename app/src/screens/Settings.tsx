import { useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { borrarTodo, db, exportarJSON, importarJSON } from '../db/db'
import { toast } from '../components/ui'
import type { Nav } from '../App'

export function Settings({ nav }: { nav: Nav }) {
  const ajustes = useLiveQuery(() => db.ajustes.get('main'))
  const [confirmarBorrado, setConfirmarBorrado] = useState(false)
  const importarRef = useRef<HTMLInputElement>(null)

  if (!ajustes) return null

  async function exportar() {
    const json = await exportarJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `life-copilot-respaldo-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function importar(archivo: File) {
    try {
      await importarJSON(await archivo.text())
      toast('Datos importados ✓')
    } catch {
      toast('Archivo inválido')
    }
  }

  return (
    <div className="pantalla">
      <div className="encabezado">
        <button className="link" onClick={nav.volver}>
          ← Volver
        </button>
        <h1 style={{ fontSize: 22 }}>Ajustes</h1>
        <span style={{ width: 48 }} />
      </div>

      <div className="tarjeta">
        <label style={{ marginTop: 0 }}>Tu nombre</label>
        <input
          value={ajustes.nombre}
          onChange={(e) => db.ajustes.update('main', { nombre: e.target.value })}
        />
        <label>Tema</label>
        <div className="chips">
          {(['sistema', 'claro', 'oscuro'] as const).map((t) => (
            <button
              key={t}
              className={`chip ${ajustes.tema === t ? 'activo' : ''}`}
              onClick={() => db.ajustes.update('main', { tema: t })}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <label>Capa RPG</label>
        <button
          className={`chip ${ajustes.mostrarNiveles ? 'activo' : ''}`}
          onClick={() => db.ajustes.update('main', { mostrarNiveles: !ajustes.mostrarNiveles })}
        >
          {ajustes.mostrarNiveles ? '✓ Niveles y XP visibles' : 'Niveles y XP ocultos'}
        </button>
      </div>

      <div className="tarjeta">
        <div className="seccion-titulo">Tus datos</div>
        <p className="subtitulo" style={{ marginBottom: 12 }}>
          Todo vive en este dispositivo (local-first). Exporta un respaldo JSON cuando quieras.
        </p>
        <div className="fila">
          <button className="btn btn-secundario btn-mini crece" onClick={exportar}>
            ⬇️ Exportar respaldo
          </button>
          <button className="btn btn-fantasma btn-mini crece" onClick={() => importarRef.current?.click()}>
            ⬆️ Importar
          </button>
        </div>
        <input
          ref={importarRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) importar(f)
            e.target.value = ''
          }}
        />
      </div>

      <div className="tarjeta">
        <div className="seccion-titulo">Instalar en tu celular</div>
        <p className="subtitulo">
          <b>iPhone:</b> en Safari toca Compartir → “Agregar a pantalla de inicio”.
          <br />
          <b>Android:</b> en Chrome toca el menú ⋮ → “Instalar app”.
          <br />
          La app funciona sin conexión una vez instalada.
        </p>
      </div>

      <div className="tarjeta">
        <div className="seccion-titulo">Zona de peligro</div>
        {!confirmarBorrado ? (
          <button className="btn btn-peligro btn-mini" onClick={() => setConfirmarBorrado(true)}>
            Borrar todos mis datos
          </button>
        ) : (
          <div className="fila">
            <button
              className="btn btn-peligro btn-mini crece"
              onClick={async () => {
                await borrarTodo()
                location.reload()
              }}
            >
              Sí, borrar todo (irreversible)
            </button>
            <button className="btn btn-fantasma btn-mini" onClick={() => setConfirmarBorrado(false)}>
              Cancelar
            </button>
          </div>
        )}
      </div>

      <p className="subtitulo" style={{ textAlign: 'center', marginTop: 8 }}>
        Life Copilot v1.0 · local-first · sin cuentas, sin nube
      </p>
    </div>
  )
}
