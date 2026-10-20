import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap'

// Props:
// - cantidadCarrito: número de unidades en el carrito
// - usuario: correo del usuario con sesión iniciada (o null)
// - alCerrarSesion: función que se llama al cerrar sesión
function Encabezado({ cantidadCarrito, usuario, alCerrarSesion }) {
  return (
    <Navbar expand="xl" className="barra-rosa shadow-sm" sticky="top">
      <Container>
        {/* el logo lleva al inicio */}
        <Navbar.Brand href="#/" className="d-flex align-items-center gap-2 fw-bold">
          <img src="/img/logo.png" alt="Logo Pastelería Mil Sabores" width="50" />
          Pastelería Mil Sabores
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link href="#/productos">Productos</Nav.Link>
            <Nav.Link href="#/categorias">Categorías</Nav.Link>
            <Nav.Link href="#/ofertas">Ofertas</Nav.Link>
            <Nav.Link href="#/nosotros">Nosotros</Nav.Link>
            <Nav.Link href="#/blogs">Blogs</Nav.Link>
            <Nav.Link href="#/contacto">Contacto</Nav.Link>
            <Nav.Link href="#/admin">Admin</Nav.Link>
          </Nav>
          <div className="d-flex flex-wrap flex-xl-nowrap align-items-center gap-2 py-2 py-xl-0 ms-xl-2 text-nowrap">
            {usuario ? (
              <>
                <Button href="#/perfil" variant="outline-dark" size="sm" title={usuario}>Mi perfil</Button>
                <Button variant="outline-dark" size="sm" onClick={alCerrarSesion}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button href="#/login" variant="outline-dark" size="sm">Iniciar sesión</Button>
                <Button href="#/registro" variant="dark" size="sm">Registrarse</Button>
              </>
            )}
            <Button href="#/carrito" variant="chocolate" size="sm">
              🛒 Carrito <Badge bg="light" text="dark">{cantidadCarrito}</Badge>
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Encabezado
