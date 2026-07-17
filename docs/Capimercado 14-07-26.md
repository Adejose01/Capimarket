# 🗺️ Roadmap de Refactorización y Mejoras - Rama Actual

Este documento detalla las tareas personales de refactorización, corrección de errores y mejoras de usabilidad en las que me enfocaré durante el desarrollo de esta rama.

---

## 📁 1. Arquitectura y Limpieza de Código

### ▢ Regularizar solicitudes a la base de datos (PocketBase)

* Optimizar, unificar y securizar las peticiones del lado del cliente hacia la base de datos al interactuar con:
* Aplicación para **"ALIADO"**.
* Creación de **"Nuevo Artículo"**.
* Pantalla de **"Configuración"**.


### ▢ Simplificar la lógica de precios

* Rediseñar el proceso de creación y formateo de precios en una función centralizada, pura y fácil de testear para evitar discrepancias visuales.

### ▢ Ajustar la selección de color

* Modificar el flujo de publicación y visualización de productos para remover la selección de color o relegarla a un plano completamente secundario/irrelevante si el artículo no lo requiere.

---

## 🏷️ 2. Sistema de Categorías y Tags

### ▢ Migración de Categorías tradicionales a Sistema de `#tags`

* **Problema:** El mantenimiento manual de categorías estáticas es propenso a errores y genera categorías vacías que dañan la experiencia de navegación.
* **Solución:** Reemplazar el sistema rígido por un modelo dinámico basado en etiquetas (`#tags`). Los tags se generarán orgánicamente con los productos, garantizando que no existan etiquetas vacías en la interfaz.

---

## 📦 3. Experiencia de Usuario en el Producto (Fichas y Vistas)

### ▢ Carrusel de imágenes en productos

* Implementar un componente de carrusel fluido e interactivo para visualizar las múltiples fotos de un artículo en su ficha de detalle.

### ▢ Renderizado de Markdown en descripción de productos

* Implementar un parser de `.md` para las descripciones de los productos.
* Diseñar un sistema híbrido de carga:
* **Modo Simple:** Editor de texto plano tradicional.
* **Modo Avanzado:** Editor/visualizador que interprete formato enriquecido mediante Markdown.



### ▢ Comportamiento de imágenes en `ProductView`

* Corregir el evento de clic (*tap/click*) sobre las imágenes principales del producto para que se abran limpiamente en una nueva pestaña del navegador.

### ▢ Estados de Stock explícitos

* Añadir soporte visual claro en la interfaz para mostrar las tres condiciones posibles de inventario:
* `En Stock`
* `Sin Stock`
* `No especificado`



### ▢ Optimizar `NewArticleView` (Formularios)

* Rediseñar y mejorar la usabilidad, rendimiento y estilos de las listas desplegables (dropdowns) al publicar un nuevo artículo.

---

## 🎨 4. Interfaz Global y Vistas de Redes Sociales

### ▢ Comportamiento de navegación del Logo

* Programar el logo de la cabecera principal (`Navbar`) para que, además de redirigir a la página de inicio, desplace la ventana hacia arriba de forma fluida si el usuario ya se encuentra en ella.

### ▢ Optimizar visibilidad de Instagram en `StoreView`

* Rediseñar la sección o widget de Instagram para que tenga una presencia más limpia y atractiva dentro de la vista general de la tienda.

### ▢ Rediseñar el widget de Instagram en `ArticleView`

* Solucionar los siguientes detalles visuales y de UX en la vista de artículo:
* Corregir el estilo del precio (actualmente se muestra desalineado o con formato erróneo).
* Reducir las opciones de contacto de WhatsApp a **un único botón directo**.
* Hacer que el enlace externo que redirige a la tienda del vendedor sea significativamente más claro y llamativo.



---

## 🔐 5. Autenticación y Flujos de Usuario

### ▢ Reparar la confirmación de correo

* Corregir el flujo de verificación y activación de cuentas mediante el enlace enviado por correo electrónico.

### ▢ Reparar el inicio de sesión con Google (OAuth2)

* Solucionar los errores de redirección, intercambio de tokens o registro automático al ingresar mediante Google.