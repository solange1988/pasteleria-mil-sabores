// Reglas de negocio de descuentos (ERS, requisito de registro de usuario):
// - Mayores de 50 años: 50% en todos los productos.
// - Código FELICES50 al registrarse: 10% de por vida.
// - Estudiantes Duoc (correo @duoc.cl): torta de cumpleaños gratis el día de su cumpleaños.
// Los descuentos por porcentaje no se suman: se aplica el mayor.

export const CODIGO_PROMOCIONAL = 'FELICES50'
export const ID_TORTA_CUMPLEANOS = 15

// fechaNacimiento en formato 'AAAA-MM-DD'
export function calcularEdad(fechaNacimiento, hoy = new Date()) {
  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number)
  let edad = hoy.getFullYear() - anio
  const yaCumplio = hoy.getMonth() + 1 > mes || (hoy.getMonth() + 1 === mes && hoy.getDate() >= dia)
  if (!yaCumplio) edad -= 1
  return edad
}

export function descuentoDe(usuario, hoy = new Date()) {
  if (usuario?.fechaNacimiento && calcularEdad(usuario.fechaNacimiento, hoy) >= 50) {
    return { porcentaje: 50, motivo: 'Mayor de 50 años' }
  }
  if (usuario?.codigo?.trim().toUpperCase() === CODIGO_PROMOCIONAL) {
    return { porcentaje: 10, motivo: `Código ${CODIGO_PROMOCIONAL}` }
  }
  return { porcentaje: 0, motivo: '' }
}

export function esCumpleanosDuoc(usuario, hoy = new Date()) {
  if (!usuario?.fechaNacimiento || !usuario.correo.endsWith('@duoc.cl')) return false
  const [, mes, dia] = usuario.fechaNacimiento.split('-').map(Number)
  return hoy.getMonth() + 1 === mes && hoy.getDate() === dia
}

// Totales del checkout. Primero se descuenta una torta de cumpleaños de regalo (si corresponde),
// y al resto se le aplica el porcentaje de descuento del usuario.
export function calcularTotales(carrito, usuario, hoy = new Date()) {
  const subtotal = carrito.reduce((suma, linea) => suma + linea.precio * linea.cantidad, 0)
  const torta = carrito.find((linea) => linea.id === ID_TORTA_CUMPLEANOS)
  const regalo = torta && esCumpleanosDuoc(usuario, hoy) ? torta.precio : 0
  const { porcentaje, motivo } = descuentoDe(usuario, hoy)
  const descuento = Math.round(((subtotal - regalo) * porcentaje) / 100)
  return { subtotal, regalo, porcentaje, motivo, descuento, total: subtotal - regalo - descuento }
}
