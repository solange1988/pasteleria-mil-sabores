import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Table, Badge, Tabs, Tab } from 'react-bootstrap'
import CampoTexto from '../components/CampoTexto.jsx'
import ListaOrdenes from '../components/ListaOrdenes.jsx'
import ListaUsuarios from '../components/ListaUsuarios.jsx'
import { listarOrdenes } from '../data/ordenes.js'
import { listarUsuarios } from '../data/usuarios.js'
import useFormulario from '../hooks/useFormulario.js'
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  reiniciarProductos,
} from '../data/productos.js'
import formatearPrecio from '../utils/formato.js'
import { validarRequerido, validarNumeroPositivo } from '../utils/validaciones.js'

const VACIO = { nombre: '', categoria: '', precio: '', stock: '', imagen: '/img/logo.png', descripcion: '' }
const VALIDADORES = {
  nombre: validarRequerido,
  categoria: validarRequerido,
  precio: validarNumeroPositivo,
  stock: validarNumeroPositivo,
  imagen: validarRequerido,
}
const STOCK_CRITICO = 5

// Panel de administración: CRUD de productos usando data/productos.js
function Admin() {
  const [productos, setProductos] = useState(listarProductos)
  const [editandoId, setEditandoId] = useState(null)
  const form = useFormulario(VACIO, VALIDADORES)

  const refrescar = () => setProductos(listarProductos())

  function guardar(evento) {
    evento.preventDefault()
    if (!form.validarTodo()) return
    const datos = { ...form.valores, precio: Number(form.valores.precio), stock: Number(form.valores.stock) }
    if (editandoId) actualizarProducto(editandoId, datos)
    else crearProducto(datos)
    cancelar()
    refrescar()
  }

  function editar(producto) {
    setEditandoId(producto.id)
    form.reiniciar({ ...VACIO, ...producto, precio: String(producto.precio), stock: String(producto.stock) })
  }

  function cancelar() {
    setEditandoId(null)
    form.reiniciar()
  }

  function eliminar(id) {
    eliminarProducto(id)
    if (id === editandoId) cancelar()
    refrescar()
  }

  const criticos = productos.filter((p) => p.stock <= STOCK_CRITICO).length
  const ordenes = listarOrdenes()
  const totalVendido = ordenes.reduce((suma, orden) => suma + orden.total, 0)

  return (
    <Container fluid="lg" className="py-4">
      <h1>Panel de administración</h1>
      {/* Reporte rápido */}
      <p>
        {productos.length} productos · <Badge bg="warning" text="dark">{criticos} con stock crítico (≤ {STOCK_CRITICO})</Badge>
        {' '}· {ordenes.length} órdenes · {formatearPrecio(totalVendido)} vendidos · {listarUsuarios().length} usuarios
      </p>

      {/* unmountOnExit: solo se dibuja la pestaña abierta */}
      <Tabs defaultActiveKey="productos" mountOnEnter unmountOnExit className="mb-3">
        <Tab eventKey="productos" title="Productos">
          <Row className="g-4">
            <Col lg={4}>
              <Card className="shadow-sm border-0 p-3">
                <h2 className="fs-4">{editandoId ? `Editar producto #${editandoId}` : 'Nuevo producto'}</h2>
                <Form noValidate onSubmit={guardar}>
                  <CampoTexto etiqueta="Nombre" name="nombre" form={form} />
                  <CampoTexto etiqueta="Categoría" name="categoria" form={form} />
                  <CampoTexto etiqueta="Precio" name="precio" type="number" min="0" form={form} />
                  <CampoTexto etiqueta="Stock" name="stock" type="number" min="0" form={form} />
                  <CampoTexto etiqueta="Imagen (ruta)" name="imagen" form={form} />
                  <CampoTexto etiqueta="Descripción" name="descripcion" as="textarea" rows={3} form={form} />
                  <div className="d-flex gap-2">
                    <Button type="submit" variant="chocolate">{editandoId ? 'Guardar cambios' : 'Crear producto'}</Button>
                    {editandoId && <Button variant="secondary" onClick={cancelar}>Cancelar</Button>}
                  </div>
                </Form>
              </Card>
            </Col>

            <Col lg={8}>
              <Table responsive hover className="align-middle bg-white">
                <thead>
                  <tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id} className={p.stock <= STOCK_CRITICO ? 'table-warning' : ''}>
                      <td>{p.id}</td>
                      <td>{p.nombre}</td>
                      <td>{p.categoria}</td>
                      <td>{formatearPrecio(p.precio)}</td>
                      <td>{p.stock}</td>
                      <td className="text-nowrap">
                        <Button size="sm" variant="outline-primary" className="me-1" onClick={() => editar(p)}>Editar</Button>
                        <Button size="sm" variant="outline-danger" onClick={() => eliminar(p.id)}>Eliminar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="outline-secondary" size="sm" onClick={() => { reiniciarProductos(); cancelar(); refrescar() }}>
                Restaurar productos originales
              </Button>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="ordenes" title="Órdenes">
          <ListaOrdenes ordenes={ordenes} />
        </Tab>
        <Tab eventKey="usuarios" title="Usuarios">
          <ListaUsuarios />
        </Tab>
      </Tabs>
    </Container>
  )
}

export default Admin
