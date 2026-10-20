import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Carrito from '../pages/Carrito.jsx'
import Encabezado from '../components/Encabezado.jsx'

const CARRITO = [
  { id: 5, nombre: 'Mousse de Chocolate', precio: 5000, imagen: '/img/logo.png', cantidad: 2 },
  { id: 1, nombre: 'Torta Cuadrada de Chocolate', precio: 45000, imagen: '/img/logo.png', cantidad: 1 },
]

function renderCarrito(carrito, props = {}) {
  return render(
    <Carrito carrito={carrito} alCambiarCantidad={vi.fn()} alQuitar={vi.fn()} alVaciar={vi.fn()} {...props} />,
  )
}

describe('<Carrito />', () => {
  it('vacío: muestra el mensaje y no la tabla', () => {
    renderCarrito([])
    expect(screen.getByText('Tu carrito está vacío por el momento.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('muestra una fila por producto y el total', () => {
    renderCarrito(CARRITO)
    // 1 fila de encabezado + 2 productos
    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.getByText('Total: $55.000')).toBeInTheDocument()
  })

  it('el botón + pide la cantidad siguiente; Eliminar y Vaciar avisan al padre', async () => {
    const usuario = userEvent.setup()
    const alCambiarCantidad = vi.fn()
    const alQuitar = vi.fn()
    const alVaciar = vi.fn()
    renderCarrito(CARRITO, { alCambiarCantidad, alQuitar, alVaciar })

    await usuario.click(screen.getByRole('button', { name: 'Sumar Mousse de Chocolate' }))
    await usuario.click(screen.getAllByRole('button', { name: 'Eliminar' })[1])
    await usuario.click(screen.getByRole('button', { name: 'Vaciar carrito' }))

    expect(alCambiarCantidad).toHaveBeenCalledWith(5, 3)
    expect(alQuitar).toHaveBeenCalledWith(1)
    expect(alVaciar).toHaveBeenCalledTimes(1)
  })
})

describe('<Encabezado />', () => {
  it('muestra la cantidad del carrito y los botones de sesión', () => {
    render(<Encabezado cantidadCarrito={3} usuario={null} alCerrarSesion={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Carrito 3/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('con sesión iniciada saluda al usuario y permite cerrar sesión', async () => {
    const usuario = userEvent.setup()
    const alCerrarSesion = vi.fn()
    render(<Encabezado cantidadCarrito={0} usuario="ana@duoc.cl" alCerrarSesion={alCerrarSesion} />)

    expect(screen.getByText('Hola, ana@duoc.cl')).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(alCerrarSesion).toHaveBeenCalledTimes(1)
  })
})
