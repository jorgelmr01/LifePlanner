import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db/db'
import { pushCapa, atras } from './logic/backstack'
import { actualizarBadge } from './logic/notify'
import { Onboarding } from './screens/Onboarding'
import { Today } from './screens/Today'
import { Journal } from './screens/Journal'
import { Areas, AreaDetail } from './screens/Areas'
import { People, PersonDetail } from './screens/People'
import { Goals, GoalDetail } from './screens/Goals'
import { Character } from './screens/Character'
import { Settings } from './screens/Settings'
import { Suggestions } from './screens/Suggestions'
import { RitmoDetail } from './screens/RitmoDetail'
import { WeeklyReview } from './screens/WeeklyReview'
import { Copilot } from './screens/Copilot'
import { QuickCapture } from './components/QuickCapture'
import { LevelUpOverlay, ToastHost } from './components/ui'

export type Tab = 'hoy' | 'registro' | 'areas' | 'personas' | 'personaje'

export type Vista =
  | { t: 'area'; id: string }
  | { t: 'persona'; id: string }
  | { t: 'meta'; id: string }
  | { t: 'ritmo'; id: string }
  | { t: 'metas' }
  | { t: 'sugerencias' }
  | { t: 'ajustes' }
  | { t: 'revision' }
  | { t: 'copiloto' }

export interface Nav {
  tab: (tab: Tab) => void
  abrir: (vista: Vista) => void
  volver: () => void
}

const TABS: { id: Tab; icono: string; texto: string }[] = [
  { id: 'hoy', icono: '☀️', texto: 'Hoy' },
  { id: 'registro', icono: '📖', texto: 'Registro' },
  { id: 'areas', icono: '🗺️', texto: 'Áreas' },
  { id: 'personas', icono: '👥', texto: 'Personas' },
  { id: 'personaje', icono: '🧭', texto: 'Personaje' },
]

export default function App() {
  // null = aún no hay ajustes (mostrar onboarding); undefined = IndexedDB cargando
  const ajustes = useLiveQuery(async () => (await db.ajustes.get('main')) ?? null)
  const sugerenciasPendientes = useLiveQuery(() =>
    db.sugerencias.where('estado').equals('pendiente').count(),
  )
  const [tab, setTab] = useState<Tab>('hoy')
  const [pila, setPila] = useState<Vista[]>([])
  // consumidores de historial paralelos a la pila (para cerrar programáticamente)
  const consumidores = useRef<(() => void)[]>([])

  useEffect(() => {
    document.documentElement.dataset.tema = ajustes?.tema ?? 'sistema'
  }, [ajustes?.tema])

  useEffect(() => {
    actualizarBadge(sugerenciasPendientes ?? 0)
  }, [sugerenciasPendientes])

  if (ajustes === undefined) return null // cargando IndexedDB
  if (!ajustes?.onboardingCompleto) {
    return <Onboarding onListo={() => {}} />
  }

  const nav: Nav = {
    tab: (t) => {
      // cerrar todas las vistas apiladas consumiendo su historial
      while (consumidores.current.length) consumidores.current.pop()?.()
      setPila([])
      setTab(t)
    },
    abrir: (v) => {
      setPila((p) => [...p, v])
      consumidores.current.push(
        pushCapa(() => {
          consumidores.current.pop()
          setPila((p) => p.slice(0, -1))
        }),
      )
    },
    volver: () => atras(),
  }

  const vista = pila[pila.length - 1]

  let contenido
  if (vista?.t === 'area') contenido = <AreaDetail nav={nav} id={vista.id} />
  else if (vista?.t === 'persona') contenido = <PersonDetail nav={nav} id={vista.id} />
  else if (vista?.t === 'meta') contenido = <GoalDetail nav={nav} id={vista.id} />
  else if (vista?.t === 'ritmo') contenido = <RitmoDetail nav={nav} id={vista.id} />
  else if (vista?.t === 'metas') contenido = <Goals nav={nav} />
  else if (vista?.t === 'sugerencias') contenido = <Suggestions nav={nav} />
  else if (vista?.t === 'ajustes') contenido = <Settings nav={nav} />
  else if (vista?.t === 'revision') contenido = <WeeklyReview nav={nav} />
  else if (vista?.t === 'copiloto') contenido = <Copilot nav={nav} />
  else if (tab === 'hoy') contenido = <Today nav={nav} />
  else if (tab === 'registro') contenido = <Journal />
  else if (tab === 'areas') contenido = <Areas nav={nav} />
  else if (tab === 'personas') contenido = <People nav={nav} />
  else contenido = <Character nav={nav} />

  return (
    <>
      {contenido}
      {!vista && <QuickCapture />}
      <nav className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id && !vista ? 'activo' : ''}
            onClick={() => nav.tab(t.id)}
            aria-label={t.texto}
          >
            <span className="icono">{t.icono}</span>
            {t.texto}
          </button>
        ))}
      </nav>
      <ToastHost />
      <LevelUpOverlay />
    </>
  )
}
