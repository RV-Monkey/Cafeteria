# Mini API de la Cafetería del CRUI

API REST hecha con Node.js y Express para consultar y administrar los productos del menú de la cafetería. Los datos se guardan en un array en memoria, por lo que los cambios se pierden al reiniciar el servidor.


## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- npm (se instala junto con Node.js)

## Instalación

```bash
git clone <https://github.com/RV-Monkey/xdd-testing.git>
cd <API>
npm install
```

## Ejecución

```bash
npm start
```

El servidor queda escuchando en `http://localhost:3000`.

Para detenerlo, presioná `Ctrl + C` en la terminal.

## Rutas

| Método | Ruta                  | Descripción                       | Respuestas        |
|--------|-----------------------|-----------------------------------|-------------------|
| GET    | `/`                   | Mensaje de bienvenida             | 200               |
| GET    | `/api/productos`      | Lista todos los productos         | 200               |
| GET    | `/api/productos/:id`  | Busca un producto por su ID       | 200, 404          |
| POST   | `/api/productos`      | Crea un producto nuevo            | 201, 400          |
| PUT    | `/api/productos/:id`  | Modifica un producto existente    | 200, 400, 404     |
| DELETE | `/api/productos/:id`  | Elimina un producto               | 200, 404          |

## Formato de un producto

```json
{
  "id": 1,
  "nombre": "Café con leche",
  "precio": 1800,
  "categoria": "bebida"
}
```

### Validaciones

- `nombre`: obligatorio, texto no vacío.
- `precio`: obligatorio, número mayor que cero (no se acepta texto).
- `categoria`: opcional, texto.
- El `id` lo genera el servidor.

## Ejemplo de uso

Crear un producto:

```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Submarino", "precio": 2500, "categoria": "bebida"}'
```

## Pruebas

El archivo `pruebas.http` contiene las peticiones para probar todas las rutas con la extensión REST Client de VS Code. 
