// 45000 -> "$45.000"
function formatearPrecio(valor) {
  return valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
}

export default formatearPrecio
