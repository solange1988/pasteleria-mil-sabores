import { useState } from 'react'
import { Table, Button } from 'react-bootstrap'
import ListaOrdenes from './ListaOrdenes.jsx'
import { listarUsuarios } from '../data/usuarios.js'
import { ordenesDe } from '../data/ordenes.js'

// Admin → Usuarios: lista de usuarios registrados y su historial de compras
function ListaUsuarios() {
  const [seleccionado, setSeleccionado] = useState(null)

  return (
    <>
      <Table responsive hover className="align-middle bg-white">
        <thead>
          <tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Comuna</th><th>Compras</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {listarUsuarios().map((u) => (
            <tr key={u.correo}>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.telefono || '—'}</td>
              <td>{u.comuna || '—'}</td>
              <td>{ordenesDe(u.correo).length}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => setSeleccionado(u)}>
                  Historial
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {seleccionado && (
        <>
          <h3 className="fs-5 mt-4">Historial de compras de {seleccionado.nombre}</h3>
          {/* key: al cambiar de usuario se cierra la boleta que estaba abierta */}
          <ListaOrdenes key={seleccionado.correo} ordenes={ordenesDe(seleccionado.correo)} />
        </>
      )}
    </>
  )
}

export default ListaUsuarios
