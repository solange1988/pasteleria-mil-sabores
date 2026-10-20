import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../pages/Login.jsx'
import { registrarUsuario } from '../data/usuarios.js'

describe('<Login />', () => {
  // Cada prueba parte con un usuario registrado: ana@duoc.cl / clave123
  beforeEach(() => {
    localStorage.clear()
    registrarUsuario({ nombre: 'Ana Pérez', correo: 'ana@duoc.cl', contrasena: 'clave123' })
  })

  it('no muestra errores al cargar', () => {
    render(<Login alIniciarSesion={vi.fn()} />)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('el estado del campo cambia cuando el usuario escribe', async () => {
    const usuario = userEvent.setup()
    render(<Login alIniciarSesion={vi.fn()} />)

    await usuario.type(screen.getByLabelText('Correo'), 'ana@duoc.cl')

    expect(screen.getByLabelText('Correo')).toHaveValue('ana@duoc.cl')
  })

  it('al enviar vacío muestra dos errores y NO inicia sesión', async () => {
    const usuario = userEvent.setup()
    const alIniciarSesion = vi.fn()
    render(<Login alIniciarSesion={alIniciarSesion} />)

    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getAllByRole('alert')).toHaveLength(2)
    expect(alIniciarSesion).not.toHaveBeenCalled()
  })

  it('con un dominio no permitido muestra el error del correo', async () => {
    const usuario = userEvent.setup()
    render(<Login alIniciarSesion={vi.fn()} />)

    await usuario.type(screen.getByLabelText('Correo'), 'ana@hotmail.com')
    await usuario.type(screen.getByLabelText('Contraseña'), '1234')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Solo se aceptan correos')
  })

  it('con una contraseña incorrecta avisa y NO inicia sesión', async () => {
    const usuario = userEvent.setup()
    const alIniciarSesion = vi.fn()
    render(<Login alIniciarSesion={alIniciarSesion} />)

    await usuario.type(screen.getByLabelText('Correo'), 'ana@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), 'otra123')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument()
    expect(alIniciarSesion).not.toHaveBeenCalled()
  })

  it('con un usuario registrado llama a alIniciarSesion con el correo', async () => {
    const usuario = userEvent.setup()
    const alIniciarSesion = vi.fn()
    render(<Login alIniciarSesion={alIniciarSesion} />)

    await usuario.type(screen.getByLabelText('Correo'), 'ana@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), 'clave123')
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(alIniciarSesion).toHaveBeenCalledWith('ana@duoc.cl')
    expect(screen.queryByRole('alert')).toBeNull()
  })
})
