import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import { preguntarCopiloto, type MensajeChat } from '../logic/copilot'
import { Vacio } from '../components/ui'
import type { Nav } from '../App'

const SUGERIDAS = [
  '¿Dónde me estoy quedando atrás?',
  '¿Qué hago hoy para re-balancearme?',
  'Ayúdame con mi próxima meta',
]

export function Copilot({ nav }: { nav: Nav }) {
  const ajustes = useLiveQuery(() => db.ajustes.get('main'))
  const [mensajes, setMensajes] = useState<MensajeChat[]>([])
  const [texto, setTexto] = useState('')
  const [pensando, setPensando] = useState(false)
  const [parcial, setParcial] = useState('')
  const finRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, parcial])

  async function enviar(pregunta?: string) {
    const contenido = (pregunta ?? texto).trim()
    if (!contenido || pensando || !ajustes?.ai) return
    const historial: MensajeChat[] = [...mensajes, { rol: 'usuario', texto: contenido }]
    setMensajes(historial)
    setTexto('')
    setPensando(true)
    setParcial('')
    try {
      const respuesta = await preguntarCopiloto(ajustes.ai, historial, (t) =>
        setParcial((p) => p + t),
      )
      setMensajes([...historial, { rol: 'copiloto', texto: respuesta }])
    } catch (e) {
      setMensajes([
        ...historial,
        {
          rol: 'copiloto',
          texto: `⚠️ No pude conectar con ${ajustes.ai.proveedor}. Revisa tu API key en Ajustes.\n(${e instanceof Error ? e.message : e})`,
        },
      ])
    } finally {
      setPensando(false)
      setParcial('')
    }
  }

  if (ajustes && !ajustes.ai?.apiKey) {
    return (
      <div className="pantalla">
        <Encabezado nav={nav} />
        <Vacio icono="🤖" texto="El copiloto AI es opcional y usa tu propia API key." />
        <p className="subtitulo" style={{ textAlign: 'center', marginBottom: 16 }}>
          Sin él, la app funciona completa: las sugerencias de re-balanceo son locales. Con él,
          puedes conversar sobre tus datos.
        </p>
        <button className="btn btn-primario btn-bloque" onClick={() => nav.abrir({ t: 'ajustes' })}>
          Configurar en Ajustes
        </button>
      </div>
    )
  }

  return (
    <div className="pantalla" style={{ display: 'flex', flexDirection: 'column' }}>
      <Encabezado nav={nav} />

      <div className="crece" style={{ flex: 1 }}>
        {mensajes.length === 0 && (
          <>
            <Vacio icono="🤖" texto="Tu copiloto conoce tus áreas, ritmos, gente y metas." />
            <div className="chips" style={{ justifyContent: 'center' }}>
              {SUGERIDAS.map((s) => (
                <button key={s} className="chip" onClick={() => enviar(s)}>
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
        {mensajes.map((m, i) => (
          <div key={i} className={`burbuja ${m.rol}`}>
            {m.texto}
          </div>
        ))}
        {pensando && <div className="burbuja copiloto">{parcial || 'Pensando…'}</div>}
        <div ref={finRef} />
      </div>

      <div className="fila" style={{ marginTop: 12 }}>
        <input
          className="crece"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Pregúntale a tu copiloto…"
          onKeyDown={(e) => e.key === 'Enter' && enviar()}
          disabled={pensando}
        />
        <button
          className="btn btn-primario"
          onClick={() => enviar()}
          disabled={pensando || !texto.trim()}
          aria-label="Enviar"
        >
          ↑
        </button>
      </div>
    </div>
  )
}

function Encabezado({ nav }: { nav: Nav }) {
  return (
    <div className="encabezado">
      <button className="link" onClick={nav.volver}>
        ← Volver
      </button>
      <h1 style={{ fontSize: 22 }}>🤖 Copiloto</h1>
      <span style={{ width: 48 }} />
    </div>
  )
}
