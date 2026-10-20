import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import CampoTexto from '../components/CampoTexto.jsx'
import CamposRegion from '../components/CamposRegion.jsx'
import ListaOrdenes from '../components/ListaOrdenes.jsx'
import useFormulario from '../hooks/useFormulario.js'
import { obtenerUsuario, actualizarUsuario } from '../data/usuarios.js'
import { ordenesDe } from '../data/ordenes.js'
import { descuentoDe, esCumpleanosDuoc } from '../utils/descuentos.js'
import { validarNombreCompleto } from '../utils/validaciones.js'

const VALIDADORES = { nombre: validarNombreCompleto }

// Perfil del usuario con sesión iniciada: editar datos, ver beneficios y compras
function Perfil({ usuario }) {
  const datos = usuario ? obtenerUsuario(usuario) : undefined

  if (!datos) {
    return (
      <Container className="py-5 text-center">
        <p>Debes iniciar sesión para ver tu perfil.</p>
        <Button href="#/login" variant="chocolate">Iniciar sesión</Button>
      </Container>
    )
  }

  return <FormularioPerfil datos={datos} />
}

function FormularioPerfil({ datos }) {
  const form = useFormulario(
    { nombre: datos.nombre, telefono: datos.telefono ?? '', region: datos.region ?? '', comuna: datos.comuna ?? '' },
    VALIDADORES,
  )
  const [guardado, setGuardado] = useState(false)
  const { porcentaje, motivo } = descuentoDe(datos)

  function guardar(evento) {
    evento.preventDefault()
    const valido = form.validarTodo()
    if (valido) actualizarUsuario(datos.correo, { ...form.valores, nombre: form.valores.nombre.trim() })
    setGuardado(valido)
  }

  return (
    <Container className="py-4">
      <h1>Mi perfil</h1>
      <Row className="g-4">
        <Col lg={5}>
          <Card className="shadow-sm border-0 p-4">
            <h2 className="fs-4">Mis datos</h2>
            {guardado && <Alert variant="success">Datos actualizados.</Alert>}
            <p className="mb-2"><strong>Correo:</strong> {datos.correo}</p>
            <Form noValidate onSubmit={guardar}>
              <CampoTexto etiqueta="Nombre completo" name="nombre" form={form} autoComplete="name" />
              <CampoTexto etiqueta="Teléfono (opcional)" name="telefono" type="tel" form={form} autoComplete="tel" />
              <CamposRegion form={form} />
              <Button type="submit" variant="chocolate">Guardar cambios</Button>
            </Form>
          </Card>
        </Col>
        <Col lg={7}>
          <Card className="shadow-sm border-0 p-4 mb-4">
            <h2 className="fs-4">Mis beneficios</h2>
            <ul className="mb-0">
              <li>{porcentaje > 0 ? `${porcentaje}% de descuento en todas tus compras (${motivo}).` : 'Sin descuento por ahora.'}</li>
              {datos.correo.endsWith('@duoc.cl') && (
                <li>
                  Torta de cumpleaños gratis el día de tu cumpleaños por ser estudiante Duoc
                  {esCumpleanosDuoc(datos) && ' — ¡hoy es tu cumpleaños!'}
                </li>
              )}
            </ul>
          </Card>
          <h2 className="fs-4">Mis compras</h2>
          <ListaOrdenes ordenes={ordenesDe(datos.correo)} />
        </Col>
      </Row>
    </Container>
  )
}

export default Perfil
