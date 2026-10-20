import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Registro from '../pages/Registro.jsx'
import Contacto from '../pages/Contacto.jsx'
import DetalleProducto from '../pages/DetalleProducto.jsx'

describe('<Registro />', () => {
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

  it('con datos válidos muestra el mensaje de éxito y limpia el formulario', async () => {
    const usuario = userEvent.setup()
    render(<Registro />)

    await usuario.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'ana@duoc.cl')
    await usuario.type(screen.getByLabelText('Confirmar correo'), 'ana@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), 'clave1')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'clave1')
    await usuario.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(screen.getByText('¡Registro exitoso! Ya puedes iniciar sesión.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('')
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
