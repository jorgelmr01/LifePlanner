import { useState } from 'react'
import { db, uid } from '../db/db'
import { AREAS_CATALOGO, AREAS_DEFAULT, RITMOS_CATALOGO } from '../db/seeds'
import type { Persona } from '../db/types'

interface PersonaBorrador {
  nombre: string
  frecuenciaDias: number
}

const FRECUENCIAS: { dias: number; texto: string }[] = [
  { dias: 7, texto: 'Cada semana' },
  { dias: 14, texto: 'Cada 2 semanas' },
  { dias: 30, texto: 'Cada mes' },
  { dias: 90, texto: 'Cada 3 meses' },
]

export function Onboarding({ onListo }: { onListo: () => void }) {
  const [paso, setPaso] = useState(0)
  const [nombre, setNombre] = useState('')
  const [areasSel, setAreasSel] = useState<string[]>(AREAS_DEFAULT)
  const [ritmosSel, setRitmosSel] = useState<string[]>(['Beber agua', 'Movimiento', 'Gratitud'])
  const [personas, setPersonas] = useState<PersonaBorrador[]>([])
  const [nuevaPersona, setNuevaPersona] = useState('')

  const alternar = (lista: string[], setLista: (v: string[]) => void, valor: string) =>
    setLista(lista.includes(valor) ? lista.filter((x) => x !== valor) : [...lista, valor])

  const ritmosVisibles = RITMOS_CATALOGO.filter(
    (r) => areasSel.includes(r.area) || ritmosSel.includes(r.nombre),
  )

  async function terminar() {
    const ahora = Date.now()
    const areaIdPorNombre = new Map<string, string>()
    let orden = 0
    for (const cat of AREAS_CATALOGO) {
      if (!areasSel.includes(cat.nombre)) continue
      const id = uid()
      areaIdPorNombre.set(cat.nombre, id)
      await db.areas.add({
        id,
        nombre: cat.nombre,
        icono: cat.icono,
        color: cat.color,
        visible: true,
        orden: orden++,
        prompts: cat.prompts,
      })
    }
    for (const cat of RITMOS_CATALOGO) {
      if (!ritmosSel.includes(cat.nombre)) continue
      const areaId = areaIdPorNombre.get(cat.area)
      await db.ritmos.add({
        id: uid(),
        nombre: cat.nombre,
        icono: cat.icono,
        proposito: '',
        frecuencia: cat.frecuencia,
        diasSemana: [],
        vecesPorSemana: cat.vecesPorSemana,
        areaIds: areaId ? [areaId] : [],
        estado: 'activo',
        creado: ahora,
      })
    }
    const areaRel = areaIdPorNombre.get('Relaciones')
    for (const p of personas) {
      const persona: Persona = {
        id: uid(),
        nombre: p.nombre,
        circulo: 'cercano',
        loQueImporta: '',
        preguntarProxima: '',
        frecuenciaDias: p.frecuenciaDias,
        areaIds: areaRel ? [areaRel] : [],
        estado: 'activa',
        silenciarSugerencias: false,
      }
      await db.personas.add(persona)
    }
    await db.ajustes.put({
      id: 'main',
      nombre: nombre.trim() || 'Aventurero',
      onboardingCompleto: true,
      tema: 'sistema',
      mostrarNiveles: true,
    })
    onListo()
  }

  const pasos = [
    /* 0 — Bienvenida */
    <div key="0">
      <div style={{ textAlign: 'center', padding: '48px 0 24px' }}>
        <div style={{ fontSize: 64 }}>🧭</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: '16px 0 8px' }}>Life Copilot</h1>
        <p className="subtitulo" style={{ fontSize: 16, maxWidth: 320, margin: '0 auto' }}>
          Tu vida como un personaje de RPG: tú defines el objetivo, la app te ayuda a mantener el
          balance y a subir de nivel en lo que te importa.
        </p>
      </div>
      <label>¿Cómo te llamamos?</label>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Tu nombre"
        autoFocus
      />
      <button className="btn btn-primario btn-bloque" style={{ marginTop: 24 }} onClick={() => setPaso(1)}>
        Crear mi personaje →
      </button>
    </div>,

    /* 1 — Áreas */
    <div key="1">
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Tus atributos de vida</h2>
      <p className="subtitulo" style={{ margin: '6px 0 18px' }}>
        Como las estadísticas de un personaje: elige las dimensiones que quieres seguir. Cada una
        sube de nivel con tu actividad real.
      </p>
      <div className="lista-opciones">
        {AREAS_CATALOGO.map((a) => (
          <div
            key={a.nombre}
            className="tarjeta tocable fila"
            onClick={() => alternar(areasSel, setAreasSel, a.nombre)}
          >
            <span style={{ fontSize: 22 }}>{a.icono}</span>
            <span className="crece" style={{ fontWeight: 600 }}>
              {a.nombre}
            </span>
            <span className={`check ${areasSel.includes(a.nombre) ? 'hecho' : ''}`}>
              {areasSel.includes(a.nombre) ? '✓' : ''}
            </span>
          </div>
        ))}
      </div>
      <button
        className="btn btn-primario btn-bloque"
        style={{ marginTop: 16 }}
        disabled={areasSel.length < 3}
        onClick={() => setPaso(2)}
      >
        {areasSel.length < 3 ? 'Elige al menos 3 áreas' : 'Siguiente →'}
      </button>
    </div>,

    /* 2 — Ritmos */
    <div key="2">
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Tus misiones recurrentes</h2>
      <p className="subtitulo" style={{ margin: '6px 0 18px' }}>
        Hábitos y prácticas que dan XP a tus áreas. Elige 3-8 para empezar; puedes crear más
        después.
      </p>
      <div className="lista-opciones">
        {ritmosVisibles.map((r) => (
          <div
            key={r.nombre}
            className="tarjeta tocable fila"
            onClick={() => alternar(ritmosSel, setRitmosSel, r.nombre)}
          >
            <span style={{ fontSize: 22 }}>{r.icono}</span>
            <div className="crece">
              <div style={{ fontWeight: 600 }}>{r.nombre}</div>
              <div className="subtitulo">
                {r.frecuencia === 'diario' ? 'Diario' : `${r.vecesPorSemana}x por semana`} ·{' '}
                {r.area}
              </div>
            </div>
            <span className={`check ${ritmosSel.includes(r.nombre) ? 'hecho' : ''}`}>
              {ritmosSel.includes(r.nombre) ? '✓' : ''}
            </span>
          </div>
        ))}
      </div>
      <button className="btn btn-primario btn-bloque" style={{ marginTop: 16 }} onClick={() => setPaso(3)}>
        Siguiente →
      </button>
    </div>,

    /* 3 — Personas */
    <div key="3">
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>Tu gremio</h2>
      <p className="subtitulo" style={{ margin: '6px 0 18px' }}>
        ¿Con quién quieres mantener contacto? Te avisaremos cuando lleves demasiado tiempo sin
        platicar con alguien.
      </p>
      <div className="fila">
        <input
          className="crece"
          value={nuevaPersona}
          onChange={(e) => setNuevaPersona(e.target.value)}
          placeholder="Nombre (ej. Mamá, Carlos…)"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && nuevaPersona.trim()) {
              setPersonas([...personas, { nombre: nuevaPersona.trim(), frecuenciaDias: 14 }])
              setNuevaPersona('')
            }
          }}
        />
        <button
          className="btn btn-secundario"
          disabled={!nuevaPersona.trim()}
          onClick={() => {
            setPersonas([...personas, { nombre: nuevaPersona.trim(), frecuenciaDias: 14 }])
            setNuevaPersona('')
          }}
        >
          +
        </button>
      </div>
      <div style={{ marginTop: 14 }}>
        {personas.map((p, i) => (
          <div key={i} className="tarjeta fila">
            <span style={{ fontSize: 20 }}>👤</span>
            <span className="crece" style={{ fontWeight: 600 }}>
              {p.nombre}
            </span>
            <select
              style={{ width: 'auto' }}
              value={p.frecuenciaDias}
              onChange={(e) => {
                const copia = [...personas]
                copia[i] = { ...p, frecuenciaDias: Number(e.target.value) }
                setPersonas(copia)
              }}
            >
              {FRECUENCIAS.map((f) => (
                <option key={f.dias} value={f.dias}>
                  {f.texto}
                </option>
              ))}
            </select>
            <button onClick={() => setPersonas(personas.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primario btn-bloque" style={{ marginTop: 16 }} onClick={terminar}>
        {personas.length ? '¡Empezar la aventura! →' : 'Saltar por ahora →'}
      </button>
    </div>,
  ]

  return (
    <div className="pantalla" style={{ paddingBottom: 32 }}>
      {paso > 0 && (
        <div className="fila" style={{ marginBottom: 8 }}>
          <button className="link" onClick={() => setPaso(paso - 1)}>
            ← Atrás
          </button>
        </div>
      )}
      <div className="onboarding-pasos">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={i <= paso ? 'hecho' : ''} />
        ))}
      </div>
      {pasos[paso]}
    </div>
  )
}
