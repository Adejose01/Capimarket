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

## Centralizar logica interna de las llamadas a db
* Hay un error estructural, y es que las peticiones a la db se estan haciendo directamente desde el mismo archivo donde se construye, inflando las lineas de codigoo por archivo. Por lo tanto hay que pasar la logica de las llamadas de la db para archivos .js para ser citados como librerias.


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

---

## 6. Experiencia de vendedor

### - Arreglar la posibilidad de delistar un elemento
* hay que arreglar la posibilidad de quitar un elemento del catalogo.

### Hacer los ajustes propios de la interfaz con los cambios en la db
* Despues de arreglar las categorias para que sean tags, habrá que colocar un campo donde se pueda colocar los tags y cuando se vaya escribiendo vayan apareciendo los disponibles.

### Arreglar la visualizacion de los elementos en lista "listed"
* La propiedad "listed" existe dentro de la db, pero esta no esta implementada para ser manejada por medio del panel del vendedor. El vendedor debe tener la posibilidad de subir elementos y no listarlos.

* Ademas dentro de la pestaña de "Mi Inventario" debe ser posible ver en la tarjeta del elemento si este está listado o no.

* Tambien se puede considerar en agregar una listview donde se vean mejor las propiedades de los productos sin necesariamente tener que abrir la tarjeta.

### Agregar una vista del producto en onclick para el panel de "mi inventario"
* Al modificar los productos Hace falta salir al menú principal para ver el resultdo de como quedó la modificacion o como lo verá el comprador. Esto es facilmente arreglable haciendo que la propiedad onclick de las tarjetas sea la de visualizar como sera la tarjeta para los clientes.

### Corregir que las categorias/tags esten agregadas al abrir la configuracion de la store
* Cuando se va a modificar la tienda hay propiedades de esta que no aparecen seleccionadas o que no heredan la configuracion previa de la db para que el vendedor este conciente de cual es la configuracion ya selaccionada.
