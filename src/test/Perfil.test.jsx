import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Perfil from '../pages/Perfil.jsx'
import Checkout from '../pages/Checkout.jsx'
import { obtenerUsuario } from '../data/usuarios.js'
import { reiniciarProductos } from '../data/productos.js'

beforeEach(() => {
  localStorage.clear()
  reiniciarProductos()
})

describe('<Perfil />', () => {
  it('sin sesión pide iniciar sesión', () => {
    render(<Perfil usuario={null} />)
    expect(screen.getByText('Debes iniciar sesión para ver tu perfil.')).toBeInTheDocument()
  })

  it('muestra los datos y los beneficios del usuario', () => {
    // cliente@duoc.cl: nacido en 1970 (más de 50 años) y con correo Duoc
    render(<Perfil usuario="cliente@duoc.cl" />)
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Cliente Demo')
    expect(screen.getByText(/50% de descuento en todas tus compras/)).toBeInTheDocument()
    expect(screen.getByText(/Torta de cumpleaños gratis/)).toBeInTheDocument()
    expect(screen.getByText('No hay órdenes registradas.')).toBeInTheDocument()
  })

  it('guarda los cambios de los datos personales', async () => {
    const usuario = userEvent.setup()
    render(<Perfil usuario="cliente@duoc.cl" />)

    await usuario.type(screen.getByLabelText('Teléfono (opcional)'), '987654321')
    await usuario.selectOptions(screen.getByLabelText('Región'), 'Región de Ñuble')
    await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Chillán')
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText('Datos actualizados.')).toBeInTheDocument()
    expect(obtenerUsuario('cliente@duoc.cl')).toMatchObject({ telefono: '987654321', comuna: 'Chillán' })
  })

  it('no guarda si el nombre queda vacío', async () => {
    const usuario = userEvent.setup()
    render(<Perfil usuario="cliente@duoc.cl" />)

    await usuario.clear(screen.getByLabelText('Nombre completo'))
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
    expect(obtenerUsuario('cliente@duoc.cl').nombre).toBe('Cliente Demo')
  })
})

describe('<Checkout /> con descuentos', () => {
  it('a un usuario mayor de 50 años le cobra la mitad', () => {
    const carrito = [{ id: 5, nombre: 'Mousse de Chocolate', precio: 5000, imagen: '/img/logo.png', cantidad: 2 }]
    render(<Checkout carrito={carrito} usuario="cliente@duoc.cl" alConfirmar={vi.fn()} />)

    expect(screen.getByText('Descuento 50% (Mayor de 50 años): −$5.000')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pagar ahora $5.000' })).toBeInTheDocument()
  })
})
