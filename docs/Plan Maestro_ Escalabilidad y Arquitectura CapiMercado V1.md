# **Plan Maestro: Escalabilidad y Arquitectura CapiMercado**

Este documento consolida la estrategia técnica para transformar **CapiMercado** de un prototipo funcional a una plataforma de tecnología de lujo preparada para escalar, manejar contenido multimedia pesado y ofrecer una experiencia de usuario premium.

## **1\. Nuevas Dependencias Críticas**

Para implementar navegación real, estado global y notificaciones profesionales, es necesario instalar estos paquetes:

`npm install react-router-dom zustand sonner`

## **2\. Estructura de Carpetas Profesional**

Divide el código actual para que el mantenimiento sea sencillo. Esta es la estructura recomendada para src/:

* **components/**: Piezas reutilizables (Botones, Cards, Navbar).  
* **pages/**: Vistas principales (Marketplace, Panel de Vendedor, Auth).  
* **store/**: Lógica de estado global (Sesión de usuario con Zustand).  
* **lib/**: Configuraciones externas (Instancia de PocketBase, utilidades de formato).  
* **hooks/**: Lógica personalizada (ej: useInventory.js).

## **3\. Implementación de Skeleton Loaders**

Para mejorar la percepción de velocidad, usa este componente mientras los datos se cargan desde PocketBase:

`// src/components/ProductSkeleton.jsx`  
`export default function ProductSkeleton() {`  
  `return (`  
    `<div className="bg-white p-5 rounded-3xl border border-slate-100 animate-pulse">`  
      `<div className="w-full aspect-square bg-slate-200 rounded-2xl" />`  
      `<div className="h-4 bg-slate-200 rounded-full w-3/4 mt-4" />`  
      `<div className="h-6 bg-slate-200 rounded-full w-1/2 mt-2" />`  
    `</div>`  
  `);`  
`}`

## **4\. Estrategia Multimedia (Fotos 4K y Video)**

Para evitar saturar el servidor y asegurar que las tiendas se vean perfectas, implementa lo siguiente:

| Acción | Beneficio |
| :---- | :---- |
| Almacenamiento S3 (Backblaze/R2) | Carga ultra rápida de videos y fotos sin usar espacio del servidor local. |
| Compresión en Cliente | Uso de librerías para reducir el peso de fotos antes de subirlas a PocketBase. |

## **5\. Roadmap de Ejecución**

1. **Fase 1:** Modularizar el archivo App.jsx actual en páginas individuales.  
2. **Fase 2:** Migrar el login y la sesión a un useAuthStore centralizado.  
3. **Fase 3:** Reemplazar alert() por notificaciones sonner para feedback visual premium.  
4. **Fase 4:** Conectar PocketBase con un bucket S3 para contenido multimedia.