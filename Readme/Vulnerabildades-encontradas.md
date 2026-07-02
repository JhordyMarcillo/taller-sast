# Reporte de Vulnerabilidades Encontradas

## Descripción

Este documento resume las vulnerabilidades identificadas durante el análisis estático de seguridad (SAST) y el análisis de dependencias (Supply Chain) realizado con Semgrep sobre el proyecto. Se identificaron vulnerabilidades tanto en dependencias de terceros como en el código fuente y en la configuración de la infraestructura. 

---

# Resumen del análisis

| Categoría | Cantidad |
|-----------|---------:|
| Vulnerabilidades Supply Chain (Undetermined) | 4 |
| Vulnerabilidades Supply Chain (High - Unreachable) | 3 |
| Hallazgos de Código (Non-blocking) | 22 |
| **Total de hallazgos** | **29** |

---

# 1. Vulnerabilidades de Dependencias (Supply Chain)

## 1.1 js-yaml - CVE-2026-53550

**Severidad:** Moderate

### Componentes afectados

- `apps/auth-service/package-lock.json`
- `apps/products/package-lock.json`

### Descripción

Las versiones afectadas de **js-yaml** presentan una vulnerabilidad de complejidad algorítmica ineficiente (*Inefficient Algorithmic Complexity*), que puede provocar un consumo excesivo de recursos al procesar entradas especialmente diseñadas.

### Impacto

- Denegación de servicio (DoS).
- Alto consumo de CPU y memoria.

### Versión corregida

- **4.2.0**

### Recomendación

Actualizar la dependencia a la versión **4.2.0** o superior. 

---

## 1.2 multer - CVE-2026-5038

**Severidad:** Moderate

### Componentes afectados

- `apps/auth-service`
- `apps/products`

### Descripción

Las versiones afectadas de **multer** presentan una vulnerabilidad relacionada con una limpieza incompleta de recursos (*Incomplete Cleanup*).

### Impacto

Puede provocar fugas de recursos o comportamientos inesperados durante el manejo de archivos.

### Versiones corregidas

- **2.2.0**
- **3.0.0-alpha.2**

### Recomendación

Actualizar la dependencia a una versión corregida. 

---

## 1.3 multer - CVE-2026-5079

**Severidad:** High

### Componentes afectados

- `apps/auth-service`
- `apps/products`

### Descripción

Multer permite un consumo descontrolado de memoria y CPU mediante nombres de campos multipart excesivamente anidados.

### Impacto

- Denegación de servicio (DoS).
- Agotamiento de memoria.
- Agotamiento de CPU.

### Versiones corregidas

- **2.2.0**
- **3.0.0-alpha.2**

### Recomendación

Actualizar inmediatamente la dependencia. 

---

## 1.4 form-data - CVE-2026-12143

**Severidad:** High

### Componentes afectados

- `apps/products`

### Descripción

La librería **form-data** es vulnerable a **CRLF Injection**, permitiendo manipular cabeceras HTTP cuando se utilizan nombres de archivos o campos provenientes de entradas no confiables.

### Impacto

- Header Injection.
- Multipart Request Smuggling.
- Manipulación de peticiones HTTP.

### Versiones corregidas

- **2.5.6**
- **3.0.5**
- **4.0.6**

### Recomendación

Actualizar la dependencia y validar cualquier entrada proporcionada por el usuario. 

---

# 2. Vulnerabilidades del Código

## 2.1 Ausencia de protección CSRF

**Archivo afectado**

- `apps/analisis-vulnerabilidades/backend/index.js`

### Descripción

La aplicación Express no implementa ningún middleware de protección contra ataques **Cross-Site Request Forgery (CSRF)**.

### Riesgo

Un atacante podría ejecutar solicitudes autenticadas en nombre de un usuario.

### Recomendaciones

- Implementar `csurf` o `csrf`.
- Utilizar tokens CSRF.
- Configurar cookies `SameSite`. 

---

## 2.2 Configuración CORS demasiado permisiva

### Descripción

La aplicación acepta solicitudes desde cualquier origen mediante:

```javascript
app.use(cors({ origin: '*' }));
```

### Riesgo

Sitios externos pueden consumir la API sin restricciones.

### Recomendación

Restringir los orígenes permitidos mediante una lista blanca de dominios confiables. 

---

## 2.3 SQL Injection

### Descripción

Se detectó la construcción dinámica de consultas SQL utilizando datos provenientes del usuario.

Ejemplo:

```javascript
const query = `SELECT * FROM products WHERE name LIKE '%${searchTerm}%'`;
```

### Impacto

- Lectura de información sensible.
- Modificación de registros.
- Eliminación de datos.
- Compromiso de la base de datos.

### Recomendación

Utilizar consultas parametrizadas:

```javascript
db.all(
    "SELECT * FROM products WHERE name LIKE ?",
    [`%${searchTerm}%`]
);
```

**Archivos afectados**

- Búsqueda de categorías.
- Búsqueda de productos.

---

## 2.4 Command Injection

### Descripción

Se identificó la ejecución directa de comandos del sistema mediante:

```javascript
exec(cmd);
```

donde `cmd` proviene directamente de la solicitud del usuario.

### Impacto

Un atacante podría ejecutar comandos arbitrarios sobre el servidor.

### Recomendación

- Evitar ejecutar comandos proporcionados por el usuario.
- Implementar listas blancas de comandos permitidos.
- Validar y sanitizar estrictamente las entradas. 

---

## 2.5 Log Injection

### Descripción

Se detectó el registro de datos controlados por el usuario utilizando `console.log()`.

### Impacto

- Falsificación de registros.
- Inserción de contenido malicioso en los logs.

### Recomendación

Sanitizar la información antes de registrarla y utilizar un framework de logging seguro.

---

## 2.6 Recursos externos sin Subresource Integrity (SRI)

### Descripción

Los recursos Bootstrap cargados desde CDN no utilizan el atributo `integrity`.

### Riesgo

Si el CDN es comprometido, el navegador ejecutará contenido alterado.

### Recomendación

Agregar los atributos:

- `integrity`
- `crossorigin`

a todos los recursos externos.

---

# 3. Vulnerabilidades en Contenedores

## Ejecución como usuario root

### Archivos afectados

- `apps/auth-service/Dockerfile`
- `apps/frontend/Dockerfile`
- `apps/products/Dockerfile`

### Descripción

Los contenedores se ejecutan como usuario **root**, aumentando el impacto potencial de un compromiso.
# Reporte de Vulnerabilidades Encontradas

## Descripción

Este documento resume las vulnerabilidades identificadas durante el análisis estático de seguridad (SAST) y el análisis de dependencias (Supply Chain) realizado con Semgrep sobre el proyecto. Se identificaron vulnerabilidades tanto en dependencias de terceros como en el código fuente y en la configuración de la infraestructura. 

---

# Resumen del análisis

| Categoría | Cantidad |
|-----------|---------:|
| Vulnerabilidades Supply Chain (Undetermined) | 4 |
| Vulnerabilidades Supply Chain (High - Unreachable) | 3 |
| Hallazgos de Código (Non-blocking) | 22 |
| **Total de hallazgos** | **29** |

---

# 1. Vulnerabilidades de Dependencias (Supply Chain)

## 1.1 js-yaml - CVE-2026-53550

**Severidad:** Moderate

### Componentes afectados

- `apps/auth-service/package-lock.json`
- `apps/products/package-lock.json`

### Descripción

Las versiones afectadas de **js-yaml** presentan una vulnerabilidad de complejidad algorítmica ineficiente (*Inefficient Algorithmic Complexity*), que puede provocar un consumo excesivo de recursos al procesar entradas especialmente diseñadas.

### Impacto

- Denegación de servicio (DoS).
- Alto consumo de CPU y memoria.

### Versión corregida

- **4.2.0**

### Recomendación

Actualizar la dependencia a la versión **4.2.0** o superior. 

---

## 1.2 multer - CVE-2026-5038

**Severidad:** Moderate

### Componentes afectados

- `apps/auth-service`
- `apps/products`

### Descripción

Las versiones afectadas de **multer** presentan una vulnerabilidad relacionada con una limpieza incompleta de recursos (*Incomplete Cleanup*).

### Impacto

Puede provocar fugas de recursos o comportamientos inesperados durante el manejo de archivos.

### Versiones corregidas

- **2.2.0**
- **3.0.0-alpha.2**

### Recomendación

Actualizar la dependencia a una versión corregida. 

---

## 1.3 multer - CVE-2026-5079

**Severidad:** High

### Componentes afectados

- `apps/auth-service`
- `apps/products`

### Descripción

Multer permite un consumo descontrolado de memoria y CPU mediante nombres de campos multipart excesivamente anidados.

### Impacto

- Denegación de servicio (DoS).
- Agotamiento de memoria.
- Agotamiento de CPU.

### Versiones corregidas

- **2.2.0**
- **3.0.0-alpha.2**

### Recomendación

Actualizar inmediatamente la dependencia. 

---

## 1.4 form-data - CVE-2026-12143

**Severidad:** High

### Componentes afectados

- `apps/products`

### Descripción

La librería **form-data** es vulnerable a **CRLF Injection**, permitiendo manipular cabeceras HTTP cuando se utilizan nombres de archivos o campos provenientes de entradas no confiables.

### Impacto

- Header Injection.
- Multipart Request Smuggling.
- Manipulación de peticiones HTTP.

### Versiones corregidas

- **2.5.6**
- **3.0.5**
- **4.0.6**

### Recomendación

Actualizar la dependencia y validar cualquier entrada proporcionada por el usuario.

---

# 2. Vulnerabilidades del Código

## 2.1 Ausencia de protección CSRF

**Archivo afectado**

- `apps/analisis-vulnerabilidades/backend/index.js`

### Descripción

La aplicación Express no implementa ningún middleware de protección contra ataques **Cross-Site Request Forgery (CSRF)**.

### Riesgo

Un atacante podría ejecutar solicitudes autenticadas en nombre de un usuario.

### Recomendaciones

- Implementar `csurf` o `csrf`.
- Utilizar tokens CSRF.
- Configurar cookies `SameSite`. 

---

## 2.2 Configuración CORS demasiado permisiva

### Descripción

La aplicación acepta solicitudes desde cualquier origen mediante:

```javascript
app.use(cors({ origin: '*' }));
```

### Riesgo

Sitios externos pueden consumir la API sin restricciones.

### Recomendación

Restringir los orígenes permitidos mediante una lista blanca de dominios confiables.

---

## 2.3 SQL Injection

### Descripción

Se detectó la construcción dinámica de consultas SQL utilizando datos provenientes del usuario.

Ejemplo:

```javascript
const query = `SELECT * FROM products WHERE name LIKE '%${searchTerm}%'`;
```

### Impacto

- Lectura de información sensible.
- Modificación de registros.
- Eliminación de datos.
- Compromiso de la base de datos.

### Recomendación

Utilizar consultas parametrizadas:

```javascript
db.all(
    "SELECT * FROM products WHERE name LIKE ?",
    [`%${searchTerm}%`]
);
```

**Archivos afectados**

- Búsqueda de categorías.
- Búsqueda de productos. 

---

## 2.4 Command Injection

### Descripción

Se identificó la ejecución directa de comandos del sistema mediante:

```javascript
exec(cmd);
```

donde `cmd` proviene directamente de la solicitud del usuario.

### Impacto

Un atacante podría ejecutar comandos arbitrarios sobre el servidor.

### Recomendación

- Evitar ejecutar comandos proporcionados por el usuario.
- Implementar listas blancas de comandos permitidos.
- Validar y sanitizar estrictamente las entradas. 

---

## 2.5 Log Injection

### Descripción

Se detectó el registro de datos controlados por el usuario utilizando `console.log()`.

### Impacto

- Falsificación de registros.
- Inserción de contenido malicioso en los logs.

### Recomendación

Sanitizar la información antes de registrarla y utilizar un framework de logging seguro.

---

## 2.6 Recursos externos sin Subresource Integrity (SRI)

### Descripción

Los recursos Bootstrap cargados desde CDN no utilizan el atributo `integrity`.

### Riesgo

Si el CDN es comprometido, el navegador ejecutará contenido alterado.

### Recomendación

Agregar los atributos:

- `integrity`
- `crossorigin`

a todos los recursos externos.

---

# 3. Vulnerabilidades en Contenedores

## Ejecución como usuario root

### Archivos afectados

- `apps/auth-service/Dockerfile`
- `apps/frontend/Dockerfile`
- `apps/products/Dockerfile`

### Descripción

Los contenedores se ejecutan como usuario **root**, aumentando el impacto potencial de un compromiso.

### Recomendación

Agregar un usuario no privilegiado:

```dockerfile
USER non-root
```

antes del comando `CMD`.

---

# 4. Configuración insegura de Nginx

### Descripción

Se detectó una posible vulnerabilidad de **H2C Smuggling** debido al reenvío de las cabeceras `Upgrade`.

### Riesgo

Podría permitir eludir controles implementados por el proxy inverso.

### Recomendación

- Permitir únicamente conexiones WebSocket cuando sean necesarias.
- Evitar reenviar cabeceras `Upgrade` si no son requeridas.

---

# 5. Configuración insegura de Docker Compose

## Servicios afectados

- `auth-db`
- `product-db`

### Hallazgos

- No utilizan `no-new-privileges:true`.
- El sistema de archivos raíz permanece escribible.

### Riesgo

- Escalamiento de privilegios.
- Persistencia de malware.
- Modificación del sistema de archivos del contenedor.

### Recomendación

Agregar:

```yaml
security_opt:
  - no-new-privileges:true

read_only: true
```

cuando sea compatible con el servicio.
---

# Conclusión

El análisis identificó **29 hallazgos**, incluyendo vulnerabilidades críticas como **SQL Injection** y **Command Injection**, así como vulnerabilidades de alta severidad en dependencias (`multer` y `form-data`). Además, se detectaron debilidades en la configuración de contenedores, Docker Compose, Nginx y políticas de seguridad de la aplicación que incrementan la superficie de ataque. Se recomienda priorizar la corrección de las vulnerabilidades críticas y de alta severidad, seguida de la implementación de buenas prácticas de seguridad para fortalecer la infraestructura y el código del proyecto.
