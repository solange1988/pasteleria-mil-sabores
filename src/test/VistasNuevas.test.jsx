import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Ofertas from '../pages/Ofertas.jsx'
import Categorias from '../pages/Categorias.jsx'
import Admin from '../pages/Admin.jsx'
import { crearOrden, listarOrdenes, ordenesDe } from '../data/ordenes.js'
import { registrarUsuario, buscarUsuario, listarUsuarios } from '../data/usuarios.js'

const LINEA = { id: 5, nombre: 'Mousse de Chocolate', precio: 5000, imagen: '/img/logo.png', cantidad: 2 }
const CLIENTE = { nombre: 'Cliente', apellidos: 'Demo', correo: 'cliente@duoc.cl', calle: 'Los Crisantemos 123', departamento: '', region: 'Región de Ñuble', comuna: 'Chillán' }

beforeEach(() => {
  localStorage.clear()
})

describe('<Ofertas />', () => {
  it('muestra solo los 4 productos con precio de oferta', () => {
    render(<Ofertas alAgregar={vi.fn()} />)
    expect(screen.getAllByRole('button', { name: 'Añadir al carrito' })).toHaveLength(4)
    expect(screen.getAllByText('Oferta')).toHaveLength(4)
  })
})

describe('<Categorias />', () => {
  it('sin nombre muestra una tarjeta por categoría con su cantidad de productos', () => {
    render(<Categorias alAgregar={vi.fn()} />)
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(8)
    expect(screen.getByRole('link', { name: /Tortas Cuadradas/ })).toHaveAttribute('href', '#/categoria/Tortas%20Cuadradas')
  })

  it('con un nombre muestra solo los productos de esa categoría', () => {
    render(<Categorias nombre="Veganos" alAgregar={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Veganos' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Añadir al carrito' })).toHaveLength(2)
    expect(screen.getByText('Galletas Veganas de Avena')).toBeInTheDocument()
  })
})

describe('órdenes y usuarios (data/ordenes.js, data/usuarios.js)', () => {
  it('las órdenes se numeran desde 1001 y se filtran por cliente', () => {
    crearOrden({ cliente: CLIENTE, lineas: [LINEA], total: 10000 })
    crearOrden({ cliente: { ...CLIENTE, correo: 'otra@gmail.com' }, lineas: [LINEA], total: 10000 })

    expect(listarOrdenes().map((o) => o.numero)).toEqual([1001, 1002])
    expect(ordenesDe('Cliente@duoc.cl')).toHaveLength(1)
  })

  it('registrar guarda el correo en minúsculas y no acepta duplicados', () => {
    expect(registrarUsuario({ nombre: 'Ana', correo: 'Ana@Duoc.cl', contrasena: 'clave1' }).correo).toBe('ana@duoc.cl')
    expect(registrarUsuario({ nombre: 'Ana 2', correo: 'ana@duoc.cl', contrasena: 'otra1' })).toBeNull()
    expect(listarUsuarios()).toHaveLength(2) // el usuario de prueba + Ana
  })

  it('buscarUsuario exige que la contraseña coincida', () => {
    expect(buscarUsuario('cliente@duoc.cl', '1234').nombre).toBe('Cliente Demo')
    expect(buscarUsuario('cliente@duoc.cl', '9999')).toBeUndefined()
    expect(buscarUsuario('nadie@duoc.cl', '1234')).toBeUndefined()
  })
})

describe('<Admin /> pestañas de órdenes y usuarios', () => {
  it('Órdenes: lista las compras y muestra la boleta', async () => {
    crearOrden({ cliente: CLIENTE, lineas: [LINEA], total: 10000 })
    const usuario = userEvent.setup()
    render(<Admin />)

    expect(screen.getByText(/1 órdenes · \$10\.000 vendidos/)).toBeInTheDocument()
    await usuario.click(screen.getByRole('tab', { name: 'Órdenes' }))
    await usuario.click(screen.getByRole('button', { name: 'Ver boleta' }))

    expect(screen.getByRole('heading', { name: 'Boleta #1001' })).toBeInTheDocument()
    expect(screen.getByText('Total pagado: $10.000')).toBeInTheDocument()
  })

  it('Órdenes: la boleta se puede cerrar', async () => {
    crearOrden({ cliente: CLIENTE, lineas: [LINEA], total: 10000 })
    const usuario = userEvent.setup()
    render(<Admin />)

    await usuario.click(screen.getByRole('tab', { name: 'Órdenes' }))
    await usuario.click(screen.getByRole('button', { name: 'Ver boleta' }))
    await usuario.click(screen.getByRole('button', { name: 'Cerrar boleta' }))

    expect(screen.queryByRole('heading', { name: 'Boleta #1001' })).toBeNull()
  })

  it('Productos: Restaurar productos originales deshace los cambios', async () => {
    const usuario = userEvent.setup()
    render(<Admin />)

    await usuario.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])
    expect(screen.queryByText('Torta Cuadrada de Chocolate')).toBeNull()

    await usuario.click(screen.getByRole('button', { name: 'Restaurar productos originales' }))
    expect(screen.getByText('Torta Cuadrada de Chocolate')).toBeInTheDocument()
  })

  it('Órdenes: sin compras muestra un aviso', async () => {
    const usuario = userEvent.setup()
    render(<Admin />)
    await usuario.click(screen.getByRole('tab', { name: 'Órdenes' }))
    expect(screen.getByText('No hay órdenes registradas.')).toBeInTheDocument()
  })

  it('Usuarios: muestra los registrados y el historial de compras de cada uno', async () => {
    crearOrden({ cliente: CLIENTE, lineas: [LINEA], total: 10000 })
    const usuario = userEvent.setup()
    render(<Admin />)

    await usuario.click(screen.getByRole('tab', { name: 'Usuarios' }))
    const fila = screen.getByRole('row', { name: /cliente@duoc\.cl/ })
    expect(within(fila).getByText('1')).toBeInTheDocument() // 1 compra

    await usuario.click(within(fila).getByRole('button', { name: 'Historial' }))
    expect(screen.getByRole('heading', { name: 'Historial de compras de Cliente Demo' })).toBeInTheDocument()
    expect(screen.getByText('#1001')).toBeInTheDocument()
  })
})
