import { describe, it, expect } from 'vitest'
import { calcularEdad, descuentoDe, esCumpleanosDuoc, calcularTotales } from '../utils/descuentos.js'
import { validarFechaNacimiento, validarCodigoPromocional } from '../utils/validaciones.js'

// Fecha fija para que las pruebas den lo mismo cualquier día: 20 de octubre de 2026
const HOY = new Date(2026, 9, 20)

const TORTA_CUMPLE = { id: 15, nombre: 'Torta Especial de Cumpleaños', precio: 55000, imagen: '', cantidad: 1 }
const MOUSSE = { id: 5, nombre: 'Mousse de Chocolate', precio: 5000, imagen: '', cantidad: 2 }

describe('calcularEdad', () => {
  it('cuenta los años cumplidos, no solo la diferencia de años', () => {
    expect(calcularEdad('1976-10-20', HOY)).toBe(50) // cumple hoy
    expect(calcularEdad('1976-10-21', HOY)).toBe(49) // cumple mañana
  })
})

describe('descuentoDe (reglas de negocio del ERS)', () => {
  it('mayores de 50 años: 50%', () => {
    expect(descuentoDe({ fechaNacimiento: '1970-03-15' }, HOY)).toEqual({ porcentaje: 50, motivo: 'Mayor de 50 años' })
  })

  it('caso límite: con 50 años recién cumplidos ya tiene el 50%; con 49 no', () => {
    expect(descuentoDe({ fechaNacimiento: '1976-10-20' }, HOY).porcentaje).toBe(50)
    expect(descuentoDe({ fechaNacimiento: '1976-10-21' }, HOY).porcentaje).toBe(0)
  })

  it('código FELICES50: 10% (sin importar mayúsculas)', () => {
    expect(descuentoDe({ fechaNacimiento: '2000-01-01', codigo: 'felices50' }, HOY).porcentaje).toBe(10)
  })

  it('no se suman: con más de 50 años y el código se aplica solo el mayor (50%)', () => {
    expect(descuentoDe({ fechaNacimiento: '1970-03-15', codigo: 'FELICES50' }, HOY).porcentaje).toBe(50)
  })

  it('sin usuario o sin beneficios: 0%', () => {
    expect(descuentoDe(undefined, HOY).porcentaje).toBe(0)
    expect(descuentoDe({ fechaNacimiento: '2000-01-01', codigo: '' }, HOY).porcentaje).toBe(0)
  })
})

describe('esCumpleanosDuoc', () => {
  it('solo es verdadero para correos @duoc.cl y el día exacto del cumpleaños', () => {
    expect(esCumpleanosDuoc({ correo: 'ana@duoc.cl', fechaNacimiento: '2004-10-20' }, HOY)).toBe(true)
    expect(esCumpleanosDuoc({ correo: 'ana@duoc.cl', fechaNacimiento: '2004-10-21' }, HOY)).toBe(false)
    expect(esCumpleanosDuoc({ correo: 'ana@gmail.com', fechaNacimiento: '2004-10-20' }, HOY)).toBe(false)
  })
})

describe('calcularTotales', () => {
  it('sin sesión: el total es el subtotal', () => {
    expect(calcularTotales([MOUSSE], undefined, HOY)).toMatchObject({ subtotal: 10000, descuento: 0, regalo: 0, total: 10000 })
  })

  it('estudiante Duoc de cumpleaños con código: la torta es gratis y el 10% se aplica al resto', () => {
    const ana = { correo: 'ana@duoc.cl', fechaNacimiento: '2004-10-20', codigo: 'FELICES50' }
    const totales = calcularTotales([TORTA_CUMPLE, MOUSSE], ana, HOY)
    expect(totales.regalo).toBe(55000)
    expect(totales.descuento).toBe(1000) // 10% de los $10.000 del mousse
    expect(totales.total).toBe(9000)
  })
})

describe('validaciones del registro', () => {
  it('fecha de nacimiento: obligatoria y no puede ser futura', () => {
    expect(validarFechaNacimiento('', HOY).valido).toBe(false)
    expect(validarFechaNacimiento('2030-01-01', HOY).valido).toBe(false)
    expect(validarFechaNacimiento('1995-05-10', HOY).valido).toBe(true)
  })

  it('código promocional: vacío o FELICES50', () => {
    expect(validarCodigoPromocional('').valido).toBe(true)
    expect(validarCodigoPromocional('felices50').valido).toBe(true)
    expect(validarCodigoPromocional('GRATIS100').mensaje).toBe('El código no es válido')
  })
})
