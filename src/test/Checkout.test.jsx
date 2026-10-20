import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Checkout from '../pages/Checkout.jsx'
import { obtenerProducto, reiniciarProductos } from '../data/productos.js'
import { listarOrdenes } from '../data/ordenes.js'

const MOUSSE = { id: 5, nombre: 'Mousse de Chocolate', precio: 5000, imagen: '/img/logo.png', cantidad: 2 }
// El Cheesecake (id 8) parte con stock 0: sirve para simular un pago con error
const CHEESECAKE = { id: 8, nombre: 'Cheesecake Sin Azúcar', precio: 47000, imagen: '/img/logo.png', cantidad: 1 }

async function llenarFormulario(usuario) {
  await usuario.type(screen.getByLabelText('Nombre'), 'Pedro')
  await usuario.type(screen.getByLabelText('Apellidos'), 'Soto')
  await usuario.type(screen.getByLabelText('Correo'), 'pedro@gmail.com')
  await usuario.type(screen.getByLabelText('Calle'), 'Los Crisantemos 123')
  await usuario.selectOptions(screen.getByLabelText('Región'), 'Región de Ñuble')
  await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Chillán')
}

describe('<Checkout />', () => {
  beforeEach(() => {
    localStorage.clear()
    reiniciarProductos()
  })

  it('sin productos muestra el aviso y no el formulario', () => {
    render(<Checkout carrito={[]} usuario={null} alConfirmar={vi.fn()} />)
    expect(screen.getByText('No hay productos para pagar.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Pagar ahora/ })).toBeNull()
  })

  it('con sesión iniciada completa los datos del cliente registrado', () => {
    // cliente@duoc.cl es el usuario de prueba: "Cliente Demo", Santiago
    render(<Checkout carrito={[MOUSSE]} usuario="cliente@duoc.cl" alConfirmar={vi.fn()} />)
    expect(screen.getByLabelText('Nombre')).toHaveValue('Cliente')
    expect(screen.getByLabelText('Apellidos')).toHaveValue('Demo')
    expect(screen.getByLabelText('Comuna')).toHaveValue('Santiago')
  })

  it('si hay sesión iniciada, el correo viene completado', () => {
    render(<Checkout carrito={[MOUSSE]} usuario="ana@duoc.cl" alConfirmar={vi.fn()} />)
    expect(screen.getByLabelText('Correo')).toHaveValue('ana@duoc.cl')
  })

  it('al pagar con el formulario vacío muestra 6 errores y no confirma la compra', async () => {
    const usuario = userEvent.setup()
    const alConfirmar = vi.fn()
    render(<Checkout carrito={[MOUSSE]} usuario={null} alConfirmar={alConfirmar} />)

    await usuario.click(screen.getByRole('button', { name: /Pagar ahora/ }))

    expect(screen.getAllByRole('alert')).toHaveLength(6)
    expect(alConfirmar).not.toHaveBeenCalled()
  })

  it('pago correcto: muestra el resumen, vacía el carrito y descuenta el stock', async () => {
    const usuario = userEvent.setup()
    const alConfirmar = vi.fn()
    render(<Checkout carrito={[MOUSSE]} usuario={null} alConfirmar={alConfirmar} />)

    await llenarFormulario(usuario)
    await usuario.click(screen.getByRole('button', { name: /Pagar ahora/ }))

    expect(screen.getByRole('heading', { name: /Se ha realizado la compra. Nro #1001/ })).toBeInTheDocument()
    expect(screen.getByText('Total pagado: $10.000')).toBeInTheDocument()
    expect(alConfirmar).toHaveBeenCalledTimes(1)
    expect(obtenerProducto(5).stock).toBe(28) // tenía 30 y se compraron 2
    expect(listarOrdenes()).toHaveLength(1) // la boleta queda guardada para el admin
    expect(listarOrdenes()[0].cliente.correo).toBe('pedro@gmail.com')
  })

  it('pago con error por falta de stock: avisa, no confirma y permite volver a intentar', async () => {
    const usuario = userEvent.setup()
    const alConfirmar = vi.fn()
    render(<Checkout carrito={[CHEESECAKE]} usuario={null} alConfirmar={alConfirmar} />)

    await llenarFormulario(usuario)
    await usuario.click(screen.getByRole('button', { name: /Pagar ahora/ }))

    expect(screen.getByRole('heading', { name: /No se pudo realizar el pago/ })).toBeInTheDocument()
    expect(screen.getByText('Stock insuficiente para: Cheesecake Sin Azúcar')).toBeInTheDocument()
    expect(alConfirmar).not.toHaveBeenCalled()
    expect(listarOrdenes()).toHaveLength(0) // un pago fallido no crea orden

    await usuario.click(screen.getByRole('button', { name: 'Volver a realizar el pago' }))
    expect(screen.getByRole('button', { name: /Pagar ahora/ })).toBeInTheDocument()
  })
})
