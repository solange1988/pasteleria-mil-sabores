// Órdenes de compra (boletas) guardadas en localStorage.
// Cada orden: { numero, fecha, cliente: {nombre, apellidos, correo, calle, ...}, lineas, total }

const CLAVE = 'pms_ordenes'

function leer() {
  return JSON.parse(localStorage.getItem(CLAVE) ?? '[]')
}

export function listarOrdenes() {
  return leer()
}

// Las órdenes nunca se borran, así que el largo de la lista sirve para numerarlas
export function crearOrden({ cliente, lineas, total }) {
  const lista = leer()
  const orden = { numero: 1001 + lista.length, fecha: new Date().toISOString(), cliente, lineas, total }
  localStorage.setItem(CLAVE, JSON.stringify([...lista, orden]))
  return orden
}

// Historial de compras de un cliente
export function ordenesDe(correo) {
  return leer().filter((orden) => orden.cliente.correo.trim().toLowerCase() === correo.trim().toLowerCase())
}
