# **Guía de Configuración Backend: CapiMercado (PocketBase)**

Esta guía detalla la estructura exacta de colecciones, campos y reglas de seguridad necesarias para que el frontend de **CapiMercado** funcione de manera óptima y segura.

## **1\. Colección: users (Tipo Auth)**

PocketBase crea esta colección por defecto para manejar la autenticación. Debes asegurar los siguientes campos:

| Campo | Tipo | Requerido | Notas   |
| :---- | :---- | :---- | :---- |
| name | Text | Sí | Nombre completo para el perfil. |
| avatar | File | No | Imagen única. |
| phone | Text | No | Contacto administrativo. |

## **2\. Colección: categories**

Permite que el Bento Grid y los filtros del frontend sean dinámicos y editables desde el panel.

| Campo | Tipo | Requerido | Opciones / Notas   |
| :---- | :---- | :---- | :---- |
| name | Text | Sí | Ej: "Smartphones", "Audio". |
| span | Text | No | Clases Tailwind: col-span-2 row-span-2. |
| gradient | Text | No | Ej: from-slate-900 to-slate-700. |

## **3\. Colección: stores**

Gestiona la identidad de los negocios y el flujo de aprobación del administrador.

| Campo | Tipo | Notas   |
| :---- | :---- | :---- |
| name, slug | Text | Slug para URL: \#/stores/slug. |
| owner | Relation | Relación única con users. |
| status | Select | pending, approved, suspended. |
| whatsapp, email | Text/Email | Datos de contacto directo. |
| primaryColor | Text | Color HEX (ej: \#10b981). |

## **4\. Colección: products**

Base del inventario. El frontend depende de las relaciones para mostrar los datos expandidos.

| Campo | Tipo | Notas   |
| :---- | :---- | :---- |
| store, category | Relation | Relaciones obligatorias (Single). |
| price | Number | Precio en USDT. |
| condition | Select | new, open\_box, used. |
| images | File | Múltiples archivos (Límite 10+). |

## **Reglas de API (Seguridad)**

* **categories:** List/Search (Público), Create/Update/Delete (Solo Admin).  
* **stores:** List/Search (Público: status \= "approved"), Create (@request.auth.id \!= ""), Update (@request.auth.id \= owner).  
* **products:** List/Search (Público), Create (@request.auth.id \!= ""), Update (@request.auth.id \= store.owner).

## **Notas de Integración**

1\. Asegúrate de que la URL en **App.jsx** coincida con tu instancia de PocketBase (ej: http://localhost:8090).  
2\. Configura los permisos de archivos en PocketBase como públicos para que las imágenes de productos se visualicen sin necesidad de login.  
3\. Crea primero las categorías para que el Marketplace tenga contenido visual al iniciar.