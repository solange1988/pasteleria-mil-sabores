import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'

// Cambiar la ruta es cambiar lo que va después del "#": App escucha el evento hashchange
function irA(ruta) {
  window.location.hash = ruta
}

const MOUSSE = { id: 5, nombre: 'Mousse de Chocolate', precio: 5000, imagen: '/img/logo.png', cantidad: 2 }
const TORTA = { id: 1, nombre: 'Torta Cuadrada de Chocolate', precio: 45000, imagen: '/img/logo.png', cantidad: 1 }

describe('<App /> (navegación y estado compartido)', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = ''
    // jsdom no implementa scrollTo: se reemplaza por una función vacía (mock)
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('sin ruta muestra el Inicio con el encabezado y el pie de página', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: '50 años endulzando a Chile' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Carrito 0/ })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Pastelería Mil Sabores')
  })

  it('muestra la página que corresponde a cada ruta', async () => {
    render(<App />)
    const paginas = [
      ['#/productos', 'Nuestros Productos'],
      ['#/producto/3', 'Torta Circular de Vainilla'],
      ['#/ofertas', 'Ofertas'],
      ['#/categorias', 'Categorías'],
      ['#/categoria/Veganos', 'Veganos'],
      ['#/carrito', 'Mi Carrito de Compras'],
      ['#/registro', 'Crear cuenta'],
      ['#/contacto', 'Contáctanos'],
      ['#/nosotros', 'Sobre Nosotros'],
      ['#/blogs', 'Noticias Importantes'],
      ['#/admin', 'Panel de administración'],
    ]
    for (const [ruta, titulo] of paginas) {
      irA(ruta)
      expect(await screen.findByRole('heading', { name: titulo, level: 1 })).toBeInTheDocument()
    }
    expect(window.scrollTo).toHaveBeenCalled() // al cambiar de página vuelve arriba
  })

  it('muestra avisos en rutas sin contenido', async () => {
    render(<App />)
    irA('#/blog/1')
    expect(await screen.findByRole('heading', { name: 'El récord Guinness de 1995', level: 1 })).toBeInTheDocument()
    irA('#/blog/99')
    expect(await screen.findByText('La noticia no existe.')).toBeInTheDocument()
    irA('#/perfil')
    expect(await screen.findByText('Debes iniciar sesión para ver tu perfil.')).toBeInTheDocument()
    irA('#/checkout')
    expect(await screen.findByText('No hay productos para pagar.')).toBeInTheDocument()
    irA('#/no-existe')
    expect(await screen.findByText(/Página no encontrada/)).toBeInTheDocument()
  })

  it('agregar desde el Inicio actualiza el contador del encabezado y lo guarda en localStorage', async () => {
    const usuario = userEvent.setup()
    render(<App />)

    await usuario.click(screen.getAllByRole('button', { name: 'Añadir al carrito' })[0])

    expect(screen.getByRole('button', { name: /Carrito 1/ })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('pms_carrito'))).toHaveLength(1)
  })

  it('en el carrito se puede restar, sumar, eliminar y vaciar', async () => {
    localStorage.setItem('pms_carrito', JSON.stringify([MOUSSE, TORTA]))
    irA('#/carrito')
    const usuario = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('button', { name: /Carrito 3/ })).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Restar Mousse de Chocolate' }))
    expect(screen.getByRole('button', { name: /Carrito 2/ })).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Sumar Mousse de Chocolate' }))
    expect(screen.getByRole('button', { name: /Carrito 3/ })).toBeInTheDocument()

    await usuario.click(screen.getAllByRole('button', { name: 'Eliminar' })[1])
    expect(screen.queryByText('Torta Cuadrada de Chocolate')).toBeNull()

    await usuario.click(screen.getByRole('button', { name: 'Vaciar carrito' }))
    expect(screen.getByText('Tu carrito está vacío por el momento.')).toBeInTheDocument()
  })

  it('iniciar sesión vuelve al Inicio con Mi perfil; cerrar sesión lo revierte', async () => {
    irA('#/login')
    const usuario = userEvent.setup()
    render(<App />)
    const formulario = screen.getByLabelText('Correo').closest('form')

    await usuario.type(screen.getByLabelText('Correo'), 'cliente@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), '1234')
    await usuario.click(within(formulario).getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByRole('heading', { name: '50 años endulzando a Chile' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mi perfil' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('pms_usuario'))).toBe('cliente@duoc.cl')

    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('con sesión iniciada, pagar en #/checkout aplica el descuento y vacía el carrito', async () => {
    // cliente@duoc.cl tiene más de 50 años: 50% de descuento. Su región y comuna ya vienen completas.
    localStorage.setItem('pms_usuario', JSON.stringify('cliente@duoc.cl'))
    localStorage.setItem('pms_carrito', JSON.stringify([MOUSSE]))
    irA('#/checkout')
    const usuario = userEvent.setup()
    render(<App />)

    await usuario.type(screen.getByLabelText('Calle'), 'Los Crisantemos 123')
    await usuario.click(screen.getByRole('button', { name: 'Pagar ahora $5.000' }))

    expect(screen.getByRole('heading', { name: /Se ha realizado la compra/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Carrito 0/ })).toBeInTheDocument()
  })

  it('en Productos el filtro por categoría muestra solo esa categoría', async () => {
    irA('#/productos')
    const usuario = userEvent.setup()
    render(<App />)

    await usuario.selectOptions(screen.getByLabelText('Filtrar por categoría'), 'Sin Gluten')

    expect(screen.getAllByRole('button', { name: 'Añadir al carrito' })).toHaveLength(2)
    expect(screen.getByText('Brownie Sin Gluten')).toBeInTheDocument()
  })
})
