import { useState, useEffect } from 'react'
import Encabezado from './components/Encabezado.jsx'
import PiePagina from './components/PiePagina.jsx'
import Inicio from './pages/Inicio.jsx'
import Productos from './pages/Productos.jsx'
import DetalleProducto from './pages/DetalleProducto.jsx'
import Carrito from './pages/Carrito.jsx'
import Checkout from './pages/Checkout.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import Contacto from './pages/Contacto.jsx'
import Nosotros from './pages/Nosotros.jsx'
import Blogs from './pages/Blogs.jsx'
import BlogDetalle from './pages/BlogDetalle.jsx'
import Admin from './pages/Admin.jsx'
import Ofertas from './pages/Ofertas.jsx'
import Categorias from './pages/Categorias.jsx'
import Perfil from './pages/Perfil.jsx'
import { agregarAlCarrito, cambiarCantidad, quitarDelCarrito, contarUnidades } from './utils/carrito.js'

// Navegación: la página actual sale de la URL después del "#", por ejemplo #/producto/3.
// El botón "atrás" del navegador funciona porque cada página tiene su propia URL.
function useRuta() {
  const leerRuta = () => window.location.hash.slice(1) || '/'
  const [ruta, setRuta] = useState(leerRuta)

  useEffect(() => {
    const alCambiar = () => {
      setRuta(leerRuta())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  return ruta
}

// Lee un valor guardado en localStorage (o usa el valor inicial)
function leerGuardado(clave, inicial) {
  const guardado = localStorage.getItem(clave)
  return guardado ? JSON.parse(guardado) : inicial
}

function App() {
  const ruta = useRuta()
  // El estado compartido vive aquí y baja a las páginas por props
  const [carrito, setCarrito] = useState(() => leerGuardado('pms_carrito', []))
  const [usuario, setUsuario] = useState(() => leerGuardado('pms_usuario', null))

  // Persistencia: cada vez que cambia el carrito o el usuario se guarda en localStorage
  useEffect(() => localStorage.setItem('pms_carrito', JSON.stringify(carrito)), [carrito])
  useEffect(() => localStorage.setItem('pms_usuario', JSON.stringify(usuario)), [usuario])

  const agregar = (producto) => setCarrito((c) => agregarAlCarrito(c, producto))

  function iniciarSesion(correo) {
    setUsuario(correo)
    window.location.hash = '#/'
  }

  // "#/producto/3" -> seccion = "producto", id = "3"
  const [, seccion, id] = ruta.split('/')

  function paginaActual() {
    switch (seccion) {
      case '': return <Inicio alAgregar={agregar} />
      case 'productos': return <Productos alAgregar={agregar} />
      case 'producto': return <DetalleProducto id={id} alAgregar={agregar} />
      case 'ofertas': return <Ofertas alAgregar={agregar} />
      case 'categorias': return <Categorias alAgregar={agregar} />
      case 'categoria': return <Categorias nombre={id && decodeURIComponent(id)} alAgregar={agregar} />
      case 'carrito':
        return (
          <Carrito
            carrito={carrito}
            alCambiarCantidad={(idProducto, cantidad) => setCarrito((c) => cambiarCantidad(c, idProducto, cantidad))}
            alQuitar={(idProducto) => setCarrito((c) => quitarDelCarrito(c, idProducto))}
            alVaciar={() => setCarrito([])}
          />
        )
      case 'checkout': return <Checkout carrito={carrito} usuario={usuario} alConfirmar={() => setCarrito([])} />
      case 'login': return <Login alIniciarSesion={iniciarSesion} />
      case 'registro': return <Registro />
      case 'perfil': return <Perfil usuario={usuario} />
      case 'contacto': return <Contacto />
      case 'nosotros': return <Nosotros />
      case 'blogs': return <Blogs />
      case 'blog': return <BlogDetalle id={id} />
      case 'admin': return <Admin />
      default: return <p className="text-center py-5">Página no encontrada. <a href="#/">Volver al inicio</a></p>
    }
  }

  return (
    <>
      <Encabezado cantidadCarrito={contarUnidades(carrito)} usuario={usuario} alCerrarSesion={() => setUsuario(null)} />
      <main>{paginaActual()}</main>
      <PiePagina />
    </>
  )
}

export default App
