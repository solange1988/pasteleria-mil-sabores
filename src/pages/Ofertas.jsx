import { Container } from 'react-bootstrap'
import Catalogo from '../components/Catalogo.jsx'
import { listarProductos } from '../data/productos.js'

// Productos que tienen precio de oferta
function Ofertas({ alAgregar }) {
  const ofertas = listarProductos().filter((p) => p.precioOferta)

  return (
    <Container className="py-4">
      <h1 className="text-center">Ofertas</h1>
      <p className="text-center mb-4">Precios especiales por nuestro 50° aniversario.</p>
      <Catalogo productos={ofertas} alAgregar={alAgregar} />
    </Container>
  )
}

export default Ofertas
