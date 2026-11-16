const express = require('express');

const app = express();
const PORT = 3000;

// Middleware: permite leer el body de las peticiones como JSON (req.body)
app.use(express.json());

// "Base de datos" en memoria
const productos = [
  { id: 1, nombre: 'Café con leche', precio: 1800, categoria: 'bebida' },
  { id: 2, nombre: 'Medialuna', precio: 900, categoria: 'comida' },
  { id: 3, nombre: 'Tostado de jamón y queso', precio: 3500, categoria: 'comida' },
  { id: 4, nombre: 'Agua mineral', precio: 1200, categoria: 'bebida' }
];

// Contador para generar ids nuevos (no se reutilizan aunque se borren productos)
let siguienteId = 5;

// Devuelve un mensaje de error si los datos son inválidos, o null si están bien
function validarProducto(body) {
  const { nombre, precio, categoria } = body || {};

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return 'El nombre es obligatorio y no puede estar vacío';
  }
  // typeof 'number' rechaza precios enviados como texto ("1500")
  if (typeof precio !== 'number' || !Number.isFinite(precio) || precio <= 0) {
    return 'El precio debe ser un número mayor que cero';
  }
  if (categoria !== undefined && typeof categoria !== 'string') {
    return 'La categoría, si se envía, debe ser texto';
  }
  return null;
}

// GET / -> bienvenida
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de la Cafetería del CRUI!');
});

// GET /api/productos -> todos los productos
app.get('/api/productos', (req, res) => {
  res.status(200).json(productos);
});

// GET /api/productos/:id -> un producto
app.get('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.status(200).json(producto);
});

// POST /api/productos -> crear
app.post('/api/productos', (req, res) => {
  const error = validarProducto(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { nombre, precio, categoria } = req.body;
  const nuevo = {
    id: siguienteId++,
    nombre: nombre.trim(),
    precio,
    categoria
  };

  productos.push(nuevo);
  res.status(201).json(nuevo);
});

// PUT /api/productos/:id -> modificar
app.put('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const error = validarProducto(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { nombre, precio, categoria } = req.body;
  producto.nombre = nombre.trim();
  producto.precio = precio;
  producto.categoria = categoria !== undefined ? categoria : producto.categoria;

  res.status(200).json(producto);
});

// DELETE /api/productos/:id -> eliminar
app.delete('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const indice = productos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const [eliminado] = productos.splice(indice, 1);
  res.status(200).json(eliminado);
});

// Manejo de errores: si el JSON enviado está mal formado, responder 400
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
