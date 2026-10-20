import { useState } from 'react'
import { Table, Button, Card, Alert } from 'react-bootstrap'
import TablaCarrito from './TablaCarrito.jsx'
import formatearPrecio from '../utils/formato.js'

// Tabla de órdenes con su boleta. Se usa en Admin → Órdenes y en el historial de un usuario.
function ListaOrdenes({ ordenes }) {
  const [boleta, setBoleta] = useState(null)

  if (ordenes.length === 0) {
    return <Alert variant="info">No hay órdenes registradas.</Alert>
  }

  return (
    <>
      <Table responsive hover className="align-middle bg-white">
        <thead>
          <tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.numero}>
              <td>#{orden.numero}</td>
              <td>{new Date(orden.fecha).toLocaleDateString('es-CL')}</td>
              <td>{orden.cliente.nombre} {orden.cliente.apellidos}</td>
              <td>{formatearPrecio(orden.total)}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => setBoleta(orden)}>
                  Ver boleta
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {boleta && (
        <Card body className="shadow-sm border-0">
          <h3 className="fs-5">Boleta #{boleta.numero}</h3>
          <p className="mb-1">
            <strong>Cliente:</strong> {boleta.cliente.nombre} {boleta.cliente.apellidos} ({boleta.cliente.correo})
          </p>
          <p>
            <strong>Dirección:</strong> {boleta.cliente.calle}{boleta.cliente.departamento && ` ${boleta.cliente.departamento}`}, {boleta.cliente.comuna}, {boleta.cliente.region}
          </p>
          <TablaCarrito carrito={boleta.lineas} />
          <p className="fs-5 fw-bold text-end">Total pagado: {formatearPrecio(boleta.total)}</p>
          <Button size="sm" variant="secondary" onClick={() => setBoleta(null)}>Cerrar boleta</Button>
        </Card>
      )}
    </>
  )
}

export default ListaOrdenes
