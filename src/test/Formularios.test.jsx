import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Registro from '../pages/Registro.jsx'
import Contacto from '../pages/Contacto.jsx'
import DetalleProducto from '../pages/DetalleProducto.jsx'
import { buscarUsuario } from '../data/usuarios.js'

describe('<Registro />', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('al elegir una región se cargan sus comunas (renderizado según estado)', async () => {
    const usuario = userEvent.setup()
    render(<Registro />)

    await usuario.selectOptions(screen.getByLabelText('Región'), 'Región de la Araucanía')

    expect(screen.getByRole('option', { name: 'Temuco' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Chillán' })).toBeNull()
  })

  it('al cambiar de región se limpia la comuna elegida', async () => {
    const usuario = userEvent.setup()
    render(<Registro />)

    await usuario.selectOptions(screen.getByLabelText('Región'), 'Región de la Araucanía')
    await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Temuco')
    await usuario.selectOptions(screen.getByLabelText('Región'), 'Región de Ñuble')

    expect(screen.getByLabelText('Comuna')).toHaveValue('')
  })

  it('si las contraseñas no coinciden muestra el error', async () => {
    const usuario = userEvent.setup()
    render(<Registro />)

    await usuario.type(screen.getByLabelText('Contraseña'), 'abcd1')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'abcd2')
    await usuario.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(screen.getByText('Los valores de contraseña no coinciden')).toBeInTheDocument()
    expect(screen.queryByText(/Registro exitoso/)).toBeNull()
  })

  it('con datos válidos guarda al usuario, muestra el éxito y limpia el formulario', async () => {
    const usuario = userEvent.setup()
    render(<Registro />)

    await usuario.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'ana@duoc.cl')
    await usuario.type(screen.getByLabelText('Confirmar correo'), 'ana@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), 'clave1')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'clave1')
    fireEvent.change(screen.getByLabelText('Fecha de nacimiento'), { target: { value: '1995-05-10' } })
    await usuario.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(screen.getByText(/Registro exitoso/)).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('')
    expect(buscarUsuario('ana@duoc.cl', 'clave1')).toBeTruthy()
  })

  it('rechaza un código promocional que no existe', async () => {
    const usuario = userEvent.setup()
    render(<Registro />)

    await usuario.type(screen.getByLabelText('Código promocional (opcional)'), 'GRATIS100')
    await usuario.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(screen.getByText('El código no es válido')).toBeInTheDocument()
    expect(screen.getByText('La fecha de nacimiento es obligatoria')).toBeInTheDocument()
  })

  it('guarda la fecha de nacimiento y el código para calcular descuentos', async () => {
    const usuario = userEvent.setup()
    render(<Registro />)

    await usuario.type(screen.getByLabelText('Nombre completo'), 'Luis Rojas')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'luis@gmail.com')
    await usuario.type(screen.getByLabelText('Confirmar correo'), 'luis@gmail.com')
    await usuario.type(screen.getByLabelText('Contraseña'), 'clave1')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'clave1')
    fireEvent.change(screen.getByLabelText('Fecha de nacimiento'), { target: { value: '2001-07-08' } })
    await usuario.type(screen.getByLabelText('Código promocional (opcional)'), 'felices50')
    await usuario.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(buscarUsuario('luis@gmail.com', 'clave1')).toMatchObject({ fechaNacimiento: '2001-07-08', codigo: 'FELICES50' })
  })

  it('no permite registrar dos veces el mismo correo', async () => {
    const usuario = userEvent.setup()
    render(<Registro />)

    // cliente@duoc.cl es el usuario de prueba que ya viene registrado
    await usuario.type(screen.getByLabelText('Nombre completo'), 'Otra Persona')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'cliente@duoc.cl')
    await usuario.type(screen.getByLabelText('Confirmar correo'), 'cliente@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), 'clave1')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'clave1')
    fireEvent.change(screen.getByLabelText('Fecha de nacimiento'), { target: { value: '1995-05-10' } })
    await usuario.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(screen.getByText('Ya existe una cuenta con ese correo.')).toBeInTheDocument()
    expect(screen.queryByText(/Registro exitoso/)).toBeNull()
  })
})

describe('<Contacto />', () => {
  it('el error desaparece apenas se corrige el campo', async () => {
    const usuario = userEvent.setup()
    render(<Contacto />)

    await usuario.type(screen.getByLabelText('Mensaje'), 'Hola')
    await usuario.click(screen.getByRole('button', { name: 'Enviar mensaje' }))
    expect(screen.getByText('Cuéntanos un poco más (mínimo 10 caracteres)')).toBeInTheDocument()

    await usuario.type(screen.getByLabelText('Mensaje'), ', quiero cotizar una torta')
    expect(screen.queryByText('Cuéntanos un poco más (mínimo 10 caracteres)')).toBeNull()
  })

  it('con datos válidos muestra el agradecimiento', async () => {
    const usuario = userEvent.setup()
    render(<Contacto />)

    await usuario.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'ana@correo.com')
    await usuario.selectOptions(screen.getByLabelText('Asunto'), 'pedido')
    await usuario.type(screen.getByLabelText('Mensaje'), 'Quiero saber el estado de mi pedido')
    await usuario.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText('¡Gracias por tu mensaje! Te responderemos pronto.')).toBeInTheDocument()
  })
})

describe('<DetalleProducto />', () => {
  it('muestra el producto y avisa al padre al añadirlo', async () => {
    localStorage.clear()
    const usuario = userEvent.setup()
    const alAgregar = vi.fn()
    render(<DetalleProducto id="3" alAgregar={alAgregar} />)

    expect(screen.getByRole('heading', { name: 'Torta Circular de Vainilla' })).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Añadir al carrito' }))
    expect(alAgregar).toHaveBeenCalledWith(expect.objectContaining({ id: 3 }))
  })

  it('con un id que no existe muestra un aviso', () => {
    render(<DetalleProducto id="999" alAgregar={vi.fn()} />)
    expect(screen.getByText('El producto no existe.')).toBeInTheDocument()
  })
})
