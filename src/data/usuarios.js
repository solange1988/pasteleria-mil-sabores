// Usuarios registrados, guardados en localStorage.
// shortcut: la contraseña se guarda tal cual porque es una simulación sin servidor;
// cuando exista el backend, se valida y se guarda cifrada allá, nunca en el navegador.

const CLAVE = 'pms_usuarios'

// Usuario de prueba para poder iniciar sesión sin registrarse
const usuariosIniciales = [
  // nacido en 1970: tiene más de 50 años, así que recibe el 50% de descuento
  { nombre: 'Cliente Demo', correo: 'cliente@duoc.cl', contrasena: '1234', fechaNacimiento: '1970-03-15', codigo: '', telefono: '', region: 'Región Metropolitana de Santiago', comuna: 'Santiago' },
]

function leer() {
  const guardado = localStorage.getItem(CLAVE)
  return guardado ? JSON.parse(guardado) : usuariosIniciales
}

export function listarUsuarios() {
  return leer()
}

export function obtenerUsuario(correo) {
  return leer().find((u) => u.correo === correo.trim().toLowerCase())
}

// Devuelve el usuario creado, o null si el correo ya estaba registrado
export function registrarUsuario(datos) {
  const lista = leer()
  const correo = datos.correo.trim().toLowerCase()
  if (lista.some((u) => u.correo === correo)) return null
  const nuevo = { ...datos, correo }
  localStorage.setItem(CLAVE, JSON.stringify([...lista, nuevo]))
  return nuevo
}

// Perfil: actualiza los datos del usuario (el correo no se puede cambiar porque lo identifica)
export function actualizarUsuario(correo, cambios) {
  const lista = leer().map((u) => (u.correo === correo ? { ...u, ...cambios, correo: u.correo } : u))
  localStorage.setItem(CLAVE, JSON.stringify(lista))
  return lista.find((u) => u.correo === correo)
}

// Inicio de sesión: devuelve el usuario si el correo y la contraseña coinciden
export function buscarUsuario(correo, contrasena) {
  const usuario = obtenerUsuario(correo)
  return usuario && usuario.contrasena === contrasena ? usuario : undefined
}
