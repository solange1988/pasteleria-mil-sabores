import { describe, it, expect } from 'vitest'
import {
  validarCorreoPermitido,
  validarContrasena,
  validarConfirmacion,
  validarNombre,
  validarMensaje,
  validarNumeroPositivo,
  validarNombreCompleto,
  validarCorreo,
  validarRequerido,
} from '../utils/validaciones.js'

describe('validarCorreoPermitido', () => {
  it('acepta correos @duoc.cl, @profesor.duoc.cl y @gmail.com', () => {
    expect(validarCorreoPermitido('ana@duoc.cl').valido).toBe(true)
    expect(validarCorreoPermitido('profe@profesor.duoc.cl').valido).toBe(true)
    expect(validarCorreoPermitido('ana@gmail.com').valido).toBe(true)
  })

  it('rechaza otros dominios con un mensaje claro', () => {
    const resultado = validarCorreoPermitido('ana@hotmail.com')
    expect(resultado.valido).toBe(false)
    expect(resultado.mensaje).toContain('@duoc.cl')
  })

  it('rechaza el correo vacío', () => {
    expect(validarCorreoPermitido('   ')).toEqual({ valido: false, mensaje: 'El correo es obligatorio' })
  })
})

describe('validarContrasena', () => {
  it('acepta entre 4 y 10 caracteres (casos límite)', () => {
    expect(validarContrasena('1234').valido).toBe(true)
    expect(validarContrasena('1234567890').valido).toBe(true)
  })

  it('rechaza 3 y 11 caracteres', () => {
    expect(validarContrasena('123').valido).toBe(false)
    expect(validarContrasena('12345678901').valido).toBe(false)
  })
})

describe('validarConfirmacion', () => {
  it('falla si los valores no coinciden', () => {
    expect(validarConfirmacion('abcd', 'abce', 'contraseña').valido).toBe(false)
  })

  it('pasa si coinciden', () => {
    expect(validarConfirmacion('ana@duoc.cl', 'ana@duoc.cl', 'correo').valido).toBe(true)
  })
})

describe('validaciones de contacto', () => {
  it('el nombre solo admite letras y espacios', () => {
    expect(validarNombre('María José').valido).toBe(true)
    expect(validarNombre('Ana123').valido).toBe(false)
  })

  it('el mensaje necesita al menos 10 caracteres', () => {
    expect(validarMensaje('Hola').valido).toBe(false)
    expect(validarMensaje('Quiero cotizar una torta').valido).toBe(true)
  })
})

describe('validarNumeroPositivo', () => {
  it('rechaza negativos, decimales y texto', () => {
    expect(validarNumeroPositivo('-1').valido).toBe(false)
    expect(validarNumeroPositivo('2.5').valido).toBe(false)
    expect(validarNumeroPositivo('abc').valido).toBe(false)
    expect(validarNumeroPositivo('0').valido).toBe(true)
  })
})

describe('otras validaciones', () => {
  it('nombre completo: obligatorio y máximo 50 caracteres', () => {
    expect(validarNombreCompleto('').valido).toBe(false)
    expect(validarNombreCompleto('a'.repeat(51)).mensaje).toBe('Máximo 50 caracteres')
    expect(validarNombreCompleto('Ana Pérez').valido).toBe(true)
  })

  it('correo general: acepta cualquier dominio con formato válido', () => {
    expect(validarCorreo('').valido).toBe(false)
    expect(validarCorreo('ana@correo').valido).toBe(false)
    expect(validarCorreo('ana@empresa.com').valido).toBe(true)
  })

  it('correo permitido: máximo 100 caracteres', () => {
    expect(validarCorreoPermitido('a'.repeat(95) + '@duoc.cl').mensaje).toBe('Máximo 100 caracteres')
  })

  it('campo requerido: no acepta solo espacios', () => {
    expect(validarRequerido('   ').valido).toBe(false)
    expect(validarRequerido('Los Crisantemos 123').valido).toBe(true)
  })

  it('mensaje: máximo 500 caracteres', () => {
    expect(validarMensaje('a'.repeat(501)).valido).toBe(false)
  })
})
