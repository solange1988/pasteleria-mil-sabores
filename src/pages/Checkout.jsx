import { useState } from 'react'
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import CampoTexto from '../components/CampoTexto.jsx'
import CamposRegion from '../components/CamposRegion.jsx'
import TablaCarrito from '../components/TablaCarrito.jsx'
import useFormulario from '../hooks/useFormulario.js'
import { obtenerProducto, actualizarProducto } from '../data/productos.js'
import { calcularTotal } from '../utils/carrito.js'
import formatearPrecio from '../utils/formato.js'
import { validarNombre, validarCorreo, validarRequerido } from '../utils/validaciones.js'

const VALIDADORES = {
  nombre: validarNombre,
  apellidos: validarNombre,
  correo: validarCorreo,
  calle: validarRequerido,
  region: validarRequerido,
  comuna: validarRequerido,
}

// Simulación del pago: falla si algún producto no tiene stock suficiente
function productosSinStock(carrito) {
  return carrito.filter((linea) => (obtenerProducto(linea.id)?.stock ?? 0) < linea.cantidad)
}

function Checkout({ carrito, usuario, alConfirmar }) {
  const form = useFormulario(
    { nombre: '', apellidos: '', correo: usuario ?? '', calle: '', departamento: '', region: '', comuna: '', indicaciones: '' },
    VALIDADORES,
  )
  // resultado: null (llenando el formulario) | { exito, numero, lineas, total, faltantes }
  const [resultado, setResultado] = useState(null)
  const total = calcularTotal(carrito)

  function pagar(evento) {
    evento.preventDefault()
    if (!form.validarTodo()) return

    const faltantes = productosSinStock(carrito)
    const numero = Date.now().toString().slice(-8)
    if (faltantes.length > 0) {
      setResultado({ exito: false, numero, lineas: carrito, total, faltantes })
      return
    }
    // pago correcto: descuenta stock y vacía el carrito
    carrito.forEach((linea) => {
      actualizarProducto(linea.id, { stock: obtenerProducto(linea.id).stock - linea.cantidad })
    })
    setResultado({ exito: true, numero, lineas: carrito, total, faltantes: [] })
    alConfirmar()
  }

  if (resultado) {
    const { valores } = form
    return (
      <Container className="py-5" style={{ maxWidth: 820 }}>
        <Card className="shadow-sm border-0 p-4">
          {resultado.exito ? (
            <h1 className="fs-3 text-success">✔ Se ha realizado la compra. Nro #{resultado.numero}</h1>
          ) : (
            <>
              <h1 className="fs-3 text-danger">✖ No se pudo realizar el pago. Nro #{resultado.numero}</h1>
              <Alert variant="danger">
                Stock insuficiente para: {resultado.faltantes.map((l) => l.nombre).join(', ')}
              </Alert>
              <Button variant="success" className="mb-3" onClick={() => setResultado(null)}>
                Volver a realizar el pago
              </Button>
            </>
          )}
          <p className="mb-1"><strong>Cliente:</strong> {valores.nombre} {valores.apellidos} ({valores.correo})</p>
          <p><strong>Dirección:</strong> {valores.calle} {valores.departamento}, {valores.comuna}, {valores.region}</p>
          <TablaCarrito carrito={resultado.lineas} />
          <p className="fs-4 text-center fw-bold">
            {resultado.exito ? 'Total pagado' : 'Total a pagar'}: {formatearPrecio(resultado.total)}
          </p>
          {resultado.exito && <Button href="#/productos" variant="chocolate">Seguir comprando</Button>}
        </Card>
      </Container>
    )
  }

  if (carrito.length === 0) {
    return (
      <Container className="py-5 text-center">
        <p>No hay productos para pagar.</p>
        <Button href="#/productos" variant="chocolate">Ver productos</Button>
      </Container>
    )
  }

  return (
    <Container className="py-5" style={{ maxWidth: 820 }}>
      <Card className="shadow-sm border-0 p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h1 className="fs-3 mb-0">Carrito de compra</h1>
          <span className="badge bg-primary fs-6">Total a pagar: {formatearPrecio(total)}</span>
        </div>
        <TablaCarrito carrito={carrito} />

        <Form noValidate onSubmit={pagar}>
          <h2 className="fs-4 mt-3">Información del cliente</h2>
          <Row>
            <Col sm={6}><CampoTexto etiqueta="Nombre" name="nombre" form={form} autoComplete="given-name" /></Col>
            <Col sm={6}><CampoTexto etiqueta="Apellidos" name="apellidos" form={form} autoComplete="family-name" /></Col>
          </Row>
          <CampoTexto etiqueta="Correo" name="correo" type="email" form={form} autoComplete="email" />

          <h2 className="fs-4 mt-3">Dirección de entrega</h2>
          <Row>
            <Col sm={8}><CampoTexto etiqueta="Calle" name="calle" form={form} autoComplete="street-address" /></Col>
            <Col sm={4}><CampoTexto etiqueta="Departamento (opcional)" name="departamento" form={form} placeholder="Ej: 603" /></Col>
          </Row>
          <CamposRegion form={form} />
          <CampoTexto
            etiqueta="Indicaciones para la entrega (opcional)"
            name="indicaciones"
            as="textarea"
            rows={3}
            form={form}
            placeholder="Ej: Entre calles, color del edificio, no tiene timbre."
          />
          <div className="text-end">
            <Button type="submit" variant="success" size="lg">Pagar ahora {formatearPrecio(total)}</Button>
          </div>
        </Form>
      </Card>
    </Container>
  )
}

export default Checkout
