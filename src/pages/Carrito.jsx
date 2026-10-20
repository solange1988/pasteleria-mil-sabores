import { Container, Button } from 'react-bootstrap'
import TablaCarrito from '../components/TablaCarrito.jsx'
import { calcularTotal } from '../utils/carrito.js'
import formatearPrecio from '../utils/formato.js'

function Carrito({ carrito, alCambiarCantidad, alQuitar, alVaciar }) {
  if (carrito.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h1>Mi Carrito de Compras</h1>
        <p>Tu carrito está vacío por el momento.</p>
        <Button href="#/productos" variant="chocolate">Ver productos</Button>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Mi Carrito de Compras</h1>
      <TablaCarrito carrito={carrito} alCambiarCantidad={alCambiarCantidad} alQuitar={alQuitar} />
      <div className="d-flex flex-wrap justify-content-end align-items-center gap-3">
        <span className="fs-4 fw-bold">Total: {formatearPrecio(calcularTotal(carrito))}</span>
        <Button variant="secondary" onClick={alVaciar}>Vaciar carrito</Button>
        <Button href="#/checkout" variant="success">Comprar ahora</Button>
      </div>
    </Container>
  )
}

export default Carrito
