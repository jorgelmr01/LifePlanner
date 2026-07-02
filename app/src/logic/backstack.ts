// Integra las capas de UI (vistas apiladas y bottom sheets) con la history API:
// el botón atrás de Android y el gesto de iOS cierran la capa superior en lugar
// de sacar al usuario de la app.
//
// Sutileza importante: `history.back()` es asíncrono. Si una capa se consume y
// otra se abre en el mismo tick (ej. menú de captura → sub-hoja), el popstate
// pendiente llegaría después del pushState nuevo y cerraría la capa equivocada.
// Por eso los push se difieren mientras haya backs programáticos en vuelo.

interface Capa {
  id: number
  cerrar: () => void
  activa: boolean
}

const pila: Capa[] = []
const diferidas: Capa[] = []
let backsPendientes = 0
let siguienteId = 1
let instalado = false

function instalar() {
  if (instalado || typeof window === 'undefined') return
  instalado = true
  window.addEventListener('popstate', () => {
    if (backsPendientes > 0) {
      // popstate de un back programático (capa ya consumida): no cerrar nada
      backsPendientes--
      if (backsPendientes === 0) {
        while (diferidas.length) {
          const capa = diferidas.shift()!
          pila.push(capa)
          history.pushState({ capa: capa.id }, '')
        }
      }
      return
    }
    const capa = pila.pop()
    if (capa?.activa) {
      capa.activa = false
      capa.cerrar()
    }
  })
}

/**
 * Registra una capa cerrable con "atrás". Devuelve `consumir()`: llámala cuando
 * la capa se cierre por UI (guardar, tocar el velo) para retirar la entrada de
 * historial sin volver a invocar `cerrar`.
 */
export function pushCapa(cerrar: () => void): () => void {
  instalar()
  const capa: Capa = { id: siguienteId++, cerrar, activa: true }
  if (backsPendientes > 0) {
    diferidas.push(capa)
  } else {
    pila.push(capa)
    history.pushState({ capa: capa.id }, '')
  }
  return () => {
    if (!capa.activa) return
    capa.activa = false
    const di = diferidas.indexOf(capa)
    if (di >= 0) {
      // nunca llegó al historial: basta con retirarla
      diferidas.splice(di, 1)
      return
    }
    const i = pila.indexOf(capa)
    if (i >= 0) pila.splice(i, 1)
    backsPendientes++
    history.back()
  }
}

/** Cierra la capa superior (equivale a presionar atrás) */
export function atras() {
  history.back()
}
