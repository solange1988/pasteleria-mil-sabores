import { useState } from 'react'
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import CampoTexto from '../components/CampoTexto.jsx'
import CamposRegion from '../components/CamposRegion.jsx'
import TablaCarrito from '../components/TablaCarrito.jsx'
import useFormulario from '../hooks/useFormulario.js'
import { obtenerProducto, actualizarProducto } from '../data/productos.js'
import { crearOrden } from '../data/ordenes.js'
import { obtenerUsuario } from '../data/usuarios.js'
import { calcularTotales } from '../utils/descuentos.js'
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

// Muestra el subtotal y los descuentos aplicados (solo si hay alguno)
function DetalleDescuentos({ totales }) {
  if (totales.regalo === 0 && totales.descuento === 0) return null
  return (
    <div className="text-end mb-3">
      <div>Subtotal: {formatearPrecio(totales.subtotal)}</div>
      {totales.regalo > 0 && (
        <div className="text-success">¡Feliz cumpleaños! Torta de regalo por ser estudiante Duoc: −{formatearPrecio(totales.regalo)}</div>
      )}
      {totales.descuento > 0 && (
        <div className="text-success">Descuento {totales.porcentaje}% ({totales.motivo}): −{formatearPrecio(totales.descuento)}</div>
      )}
    </div>
  )
}

function Checkout({ carrito, usuario, alConfirmar }) {
  // Si hay sesión iniciada, los datos del cliente se completan solos
  const cliente = usuario ? obtenerUsuario(usuario) : undefined
  const [nombre = '', ...apellidos] = (cliente?.nombre ?? '').split(' ')
  const form = useFormulario(
    {
      nombre, apellidos: apellidos.join(' '), correo: usuario ?? '', calle: '', departamento: '',
      region: cliente?.region ?? '', comuna: cliente?.comuna ?? '', indicaciones: '',
    },
    VALIDADORES,
  )
  // resultado: null (llenando el formulario) | { exito, numero?, lineas, totales, faltantes }
  const [resultado, setResultado] = useState(null)
  // Los descuentos dependen del usuario con sesión iniciada (edad, código, cumpleaños)
  const totales = calcularTotales(carrito, cliente)
  const { total } = totales

  function pagar(evento) {
    evento.preventDefault()
    if (!form.validarTodo()) return

    const faltantes = productosSinStock(carrito)
    if (faltantes.length > 0) {
      setResultado({ exito: false, lineas: carrito, totales, faltantes })
      return
    }
    // pago correcto: descuenta stock y vacía el carrito
    carrito.forEach((linea) => {
      actualizarProducto(linea.id, { stock: obtenerProducto(linea.id).stock - linea.cantidad })
    })
    // la compra queda guardada como orden (boleta) para el panel de administración
    const orden = crearOrden({ cliente: form.valores, lineas: carrito, total })
    setResultado({ exito: true, numero: orden.numero, lineas: carrito, totales, faltantes: [] })
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
              <h1 className="fs-3 text-danger">✖ No se pudo realizar el pago</h1>
              <Alert variant="danger">
                Stock insuficiente para: {resultado.faltantes.map((l) => l.nombre).join(', ')}
              </Alert>
              <Button variant="success" className="mb-3" onClick={() => setResultado(null)}>
                Volver a realizar el pago
              </Button>
            </>
          )}
          <p className="mb-1"><strong>Cliente:</strong> {valores.nombre} {valores.apellidos} ({valores.correo})</p>
          <p><strong>Dirección:</strong> {valores.calle}{valores.departamento && ` ${valores.departamento}`}, {valores.comuna}, {valores.region}</p>
          <TablaCarrito carrito={resultado.lineas} />
          <DetalleDescuentos totales={resultado.totales} />
          <p className="fs-4 text-center fw-bold">
            {resultado.exito ? 'Total pagado' : 'Total a pagar'}: {formatearPrecio(resultado.totales.total)}
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
        <DetalleDescuentos totales={totales} />

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
