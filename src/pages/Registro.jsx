import { useState } from 'react'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import CampoTexto from '../components/CampoTexto.jsx'
import CamposRegion from '../components/CamposRegion.jsx'
import useFormulario from '../hooks/useFormulario.js'
import {
  validarNombreCompleto,
  validarCorreoPermitido,
  validarConfirmacion,
  validarContrasena,
} from '../utils/validaciones.js'

const INICIAL = {
  nombre: '', correo: '', confirmarCorreo: '', contrasena: '', confirmarContrasena: '',
  telefono: '', region: '', comuna: '',
}

// El segundo parámetro "todos" permite comparar con otro campo del formulario
const VALIDADORES = {
  nombre: validarNombreCompleto,
  correo: validarCorreoPermitido,
  confirmarCorreo: (valor, todos) => validarConfirmacion(valor, todos.correo, 'correo'),
  contrasena: validarContrasena,
  confirmarContrasena: (valor, todos) => validarConfirmacion(valor, todos.contrasena, 'contraseña'),
}

function Registro() {
  const form = useFormulario(INICIAL, VALIDADORES)
  const [exito, setExito] = useState(false)

  function enviar(evento) {
    evento.preventDefault()
    const valido = form.validarTodo()
    setExito(valido)
    if (valido) form.reiniciar()
  }

  return (
    <Container className="py-5" style={{ maxWidth: 640 }}>
      <Card className="shadow-sm border-0 p-4">
        <h1 className="text-center fs-2">Crear cuenta</h1>
        {exito && <Alert variant="success">¡Registro exitoso! Ya puedes iniciar sesión.</Alert>}
        <Form noValidate onSubmit={enviar}>
          <CampoTexto etiqueta="Nombre completo" name="nombre" form={form} autoComplete="name" />
          <CampoTexto etiqueta="Correo electrónico" name="correo" type="email" form={form} autoComplete="email" />
          <CampoTexto etiqueta="Confirmar correo" name="confirmarCorreo" type="email" form={form} />
          <CampoTexto etiqueta="Contraseña" name="contrasena" type="password" form={form} autoComplete="new-password" />
          <CampoTexto etiqueta="Confirmar contraseña" name="confirmarContrasena" type="password" form={form} autoComplete="new-password" />
          <CampoTexto etiqueta="Teléfono (opcional)" name="telefono" type="tel" form={form} autoComplete="tel" />
          <CamposRegion form={form} />
          <Button type="submit" variant="chocolate" className="w-100">Registrar</Button>
        </Form>
      </Card>
    </Container>
  )
}

export default Registro
