import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Admin from '../pages/Admin.jsx'
import { reiniciarProductos, listarProductos } from '../data/productos.js'

describe('<Admin /> (CRUD de productos)', () => {
  beforeEach(() => {
    localStorage.clear()
    reiniciarProductos()
  })

  it('lista los 16 productos y marca los de stock crítico', () => {
    render(<Admin />)
    // 1 fila de encabezado + 16 productos
    expect(screen.getAllByRole('row')).toHaveLength(17)
    expect(screen.getByText('4 con stock crítico (≤ 5)')).toBeInTheDocument()
  })

  it('crear con el formulario vacío muestra errores y no agrega nada', async () => {
    const usuario = userEvent.setup()
    render(<Admin />)

    await usuario.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getAllByRole('alert')).toHaveLength(4) // nombre, categoría, precio, stock
    expect(listarProductos()).toHaveLength(16)
  })

  it('crea un producto nuevo y aparece en la tabla', async () => {
    const usuario = userEvent.setup()
    render(<Admin />)

    await usuario.type(screen.getByLabelText('Nombre'), 'Kuchen de Nuez')
    await usuario.type(screen.getByLabelText('Categoría'), 'Pastelería Tradicional')
    await usuario.type(screen.getByLabelText('Precio'), '8000')
    await usuario.type(screen.getByLabelText('Stock'), '12')
    await usuario.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByText('Kuchen de Nuez')).toBeInTheDocument()
    expect(listarProductos()).toHaveLength(17)
  })

  it('edita el precio de un producto', async () => {
    const usuario = userEvent.setup()
    render(<Admin />)

    await usuario.click(screen.getAllByRole('button', { name: 'Editar' })[0])
    expect(screen.getByRole('heading', { name: 'Editar producto #1' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue('Torta Cuadrada de Chocolate')

    await usuario.clear(screen.getByLabelText('Precio'))
    await usuario.type(screen.getByLabelText('Precio'), '49000')
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText('$49.000')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nuevo producto' })).toBeInTheDocument()
  })

  it('elimina un producto de la tabla', async () => {
    const usuario = userEvent.setup()
    render(<Admin />)

    await usuario.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    expect(screen.queryByText('Torta Cuadrada de Chocolate')).toBeNull()
    expect(listarProductos()).toHaveLength(15)
  })
})
