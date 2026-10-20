import { useState } from 'react'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import CampoTexto from '../components/CampoTexto.jsx'
import CamposRegion from '../components/CamposRegion.jsx'
import useFormulario from '../hooks/useFormulario.js'
import { registrarUsuario } from '../data/usuarios.js'
import {
  validarNombreCompleto,
  validarCorreoPermitido,
  validarConfirmacion,
  validarContrasena,
  validarFechaNacimiento,
  validarCodigoPromocional,
} from '../utils/validaciones.js'

const INICIAL = {
  nombre: '', correo: '', confirmarCorreo: '', contrasena: '', confirmarContrasena: '',
  telefono: '', fechaNacimiento: '', codigo: '', region: '', comuna: '',
}

// El segundo parámetro "todos" permite comparar con otro campo del formulario
const VALIDADORES = {
  nombre: validarNombreCompleto,
  correo: validarCorreoPermitido,
  confirmarCorreo: (valor, todos) => validarConfirmacion(valor, todos.correo, 'correo'),
  contrasena: validarContrasena,
  confirmarContrasena: (valor, todos) => validarConfirmacion(valor, todos.contrasena, 'contraseña'),
  fechaNacimiento: (valor) => validarFechaNacimiento(valor),
  codigo: validarCodigoPromocional,
}

function Registro() {
  const form = useFormulario(INICIAL, VALIDADORES)
  // resultado: null | 'exito' | 'duplicado'
  const [resultado, setResultado] = useState(null)

  function enviar(evento) {
    evento.preventDefault()
    if (!form.validarTodo()) {
      setResultado(null)
      return
    }
    const { nombre, correo, contrasena, telefono, fechaNacimiento, codigo, region, comuna } = form.valores
    const nuevo = registrarUsuario({
      nombre: nombre.trim(), correo, contrasena, telefono, fechaNacimiento, codigo: codigo.trim().toUpperCase(), region, comuna,
    })
    setResultado(nuevo ? 'exito' : 'duplicado')
    if (nuevo) form.reiniciar()
  }

  return (
    <Container className="py-5" style={{ maxWidth: 640 }}>
      <Card className="shadow-sm border-0 p-4">
        <h1 className="text-center fs-2">Crear cuenta</h1>
        {resultado === 'exito' && <Alert variant="success">¡Registro exitoso! Ya puedes <a href="#/login">iniciar sesión</a>.</Alert>}
        {resultado === 'duplicado' && <Alert variant="danger">Ya existe una cuenta con ese correo.</Alert>}
        <Form noValidate onSubmit={enviar}>
          <CampoTexto etiqueta="Nombre completo" name="nombre" form={form} autoComplete="name" />
          <CampoTexto etiqueta="Correo electrónico" name="correo" type="email" form={form} autoComplete="email" />
          <CampoTexto etiqueta="Confirmar correo" name="confirmarCorreo" type="email" form={form} />
          <CampoTexto etiqueta="Contraseña" name="contrasena" type="password" form={form} autoComplete="new-password" />
          <CampoTexto etiqueta="Confirmar contraseña" name="confirmarContrasena" type="password" form={form} autoComplete="new-password" />
          <CampoTexto etiqueta="Teléfono (opcional)" name="telefono" type="tel" form={form} autoComplete="tel" />
          <CampoTexto etiqueta="Fecha de nacimiento" name="fechaNacimiento" type="date" form={form} autoComplete="bday" />
          <CampoTexto
            etiqueta="Código promocional (opcional)"
            name="codigo"
            form={form}
            placeholder="Ej: FELICES50"
            ayuda="Con FELICES50 tienes 10% de descuento de por vida. Si tienes 50 años o más, tu descuento es de 50%."
          />
          <CamposRegion form={form} />
          <Button type="submit" variant="chocolate" className="w-100">Registrar</Button>
        </Form>
      </Card>
    </Container>
  )
}

export default Registro
