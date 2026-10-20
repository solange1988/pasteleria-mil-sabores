import { Container, Row, Col, Card } from 'react-bootstrap'
import Catalogo from '../components/Catalogo.jsx'
import { listarProductos, listarCategorias } from '../data/productos.js'

// Sin "nombre": muestra una tarjeta por categoría.
// Con "nombre" (#/categoria/Tortas Cuadradas): muestra los productos de esa categoría.
function Categorias({ nombre, alAgregar }) {
  const productos = listarProductos()

  if (nombre) {
    return (
      <Container className="py-4">
        <a href="#/categorias">&larr; Todas las categorías</a>
        <h1 className="my-3">{nombre}</h1>
        <Catalogo productos={productos.filter((p) => p.categoria === nombre)} alAgregar={alAgregar} />
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Categorías</h1>
      <Row xs={2} md={3} lg={4} className="g-4">
        {listarCategorias().map((categoria) => {
          const deLaCategoria = productos.filter((p) => p.categoria === categoria)
          return (
            <Col key={categoria}>
              <Card
                as="a"
                href={`#/categoria/${encodeURIComponent(categoria)}`}
                className="h-100 shadow-sm border-0 text-decoration-none text-reset"
              >
                <Card.Img variant="top" src={deLaCategoria[0].imagen} alt="" className="img-producto" />
                <Card.Body className="text-center">
                  <Card.Title as="h3" className="fs-6 fw-bold">{categoria}</Card.Title>
                  <Card.Text className="small">{deLaCategoria.length} productos</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}

export default Categorias
