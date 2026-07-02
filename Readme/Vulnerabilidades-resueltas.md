
# README - Vulnerabilidades Corregidas

## Resumen

Se corrigieron las vulnerabilidades principales detectadas en el backend Express:

- CSRF ausente
- CORS permisivo
- SQL Injection
- Log Injection
- Command Injection

El código fue actualizado para usar controles de seguridad más adecuados y reducir la superficie de ataque.

---

## Correcciones aplicadas

| Vulnerabilidad | Estado | Solución aplicada |
|---|---|---|
| CSRF | Corregida | Se agregó `cookie-parser` y `csurf` |
| CORS permisivo | Corregida | Se reemplazó `origin: '*'` por un origen específico |
| SQL Injection | Corregida | Se usaron consultas parametrizadas |
| Log Injection | Corregida | Se eliminaron logs con datos del usuario |
| Command Injection | Corregida | Se eliminó la ruta `/api/exec` |

---

## Cambios realizados

### 1. Protección CSRF

Se agregó protección CSRF para rutas sensibles como:

- `POST`
- `PUT`
- `DELETE`

const csrfProtection = csrf({ cookie: true });


También se creó una ruta para que el frontend obtenga el token CSRF:

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

---

### 2. CORS restringido

Antes la API aceptaba solicitudes desde cualquier origen:


app.use(cors({ origin: '*' }));

Ahora solo acepta solicitudes desde un origen definido:

app.use(cors({ origin: 'http://localhost:3000' }));

> En producción, este valor debe cambiarse por el dominio real del frontend.

---

### 3. SQL Injection mitigado

Se reemplazaron consultas SQL construidas por concatenación de texto por consultas parametrizadas.

Ejemplo seguro:

const query = 'SELECT * FROM products WHERE name LIKE ?';

db.all(query, [`%${searchTerm}%`], (err, rows) => {
  if (err) return res.status(500).json({ error: err.message });
  res.json(rows);
});

Esto evita que entradas maliciosas alteren la consulta SQL.

---

### 4. Log Injection mitigado

Se eliminaron los `console.log()` que imprimían consultas generadas con datos del usuario.

Antes:

console.log('[SQLi Products]', query);

Ahora ya no se registra información construida con entrada no confiable.

---

### 5. Command Injection eliminado

Se eliminó completamente la ruta vulnerable:

/api/exec

Antes esta ruta permitía ejecutar comandos enviados por el usuario mediante `child_process.exec`.

Al eliminarla, se evita que un atacante pueda ejecutar comandos arbitrarios en el servidor.

---

## Dependencias agregadas

Para la protección CSRF se agregaron las siguientes dependencias:

npm install cookie-parser csurf

---

## Rutas protegidas con CSRF

Las siguientes rutas ahora requieren token CSRF:

POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

---

## Conclusión

El backend fue corregido frente a las vulnerabilidades bloqueantes detectadas.

Las principales mejoras fueron:

- Protección contra CSRF.
- Restricción de CORS.
- Uso de consultas SQL parametrizadas.
- Eliminación de logs inseguros.
- Eliminación de ejecución de comandos del sistema.

Con estos cambios, la aplicación reduce significativamente el riesgo de explotación en el backend.