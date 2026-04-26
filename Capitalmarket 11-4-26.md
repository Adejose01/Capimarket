# Modificaciones necesarias a la db
Veo que modificaste varios campos que había añadido a las db, campos que considero necesarios para ser escalables en el futuro.

## 1 Mod a la DB
Vi que modificaste la tabla de "stores", ademas hay que hacer la implementacion de estos en la UI de la web:

- ubicacion / location: como url o como string: esto va a permitir colocar una ubicacion real que es mucho mas comodo a la hora de entender como llegar.

- Schedule u horario: Este campo lo puse para que se sepa cuando la tienda está abierta o cerrada, claro que es opcional. Se maneja en un json asi:
{
  LUNES: "06:00 - 18:00"
  MARTES: "06:00 - 18:00"
  MIERCOLES: "06:00 - 18:00"
  JUEVES: "06:00 - 18:00"
  VIERNES: "06:00 - 18:00"
  SABADO: "06:00 - 12:00"
  DOMINGO: "CERRADO"
}

esto por ahora por la dificultad de implementacion se puede quedar en blanco y opcional en la db.

- Como cobrar a futuro, habia implemenntado esto en la db:
Para ello habia incluido estos 3 campos:

 membership_type: 
 membership_expires:
 membership_status:
 
tipo/type: para determinar si esa empresa tiene membresia premiun o free, y a base de eso los privilegios en la pagina.

expiracion/expires: es para saber cuanto tiempo queda para que la membresía caduque.

status: es para saber si está activa o inactiva

Esto lo puse para un futuro, porque es mejor pensar el marco completo y luego implementarlo que tener que modificar toda la db.

## 2 productos
- A mi perspectiva el campo de "detalles de uso" no es del  todo necesario, ya que lo que va ahí se puede poner en "description". PD: acabo de ver como está implementado y no está del todo mal, por ahora se puede quedar.

- distintos precios:
base_price
current_price
on_sale
sale_ends_at

Son campos necesarios en el caso de que el dueño de la tienda quiera implementar una oferta temporal o permanente. Su implementacion no debe ser inmediata, pero esto permitira la escalabilidad en el futuro para tener una db organizada y preparada para otras funcionaidades.

base_price: seria el precio del articulo normalmente

- Falta activar la opcion listado o no, ya que un producto puede estar listado pero sin tener stock, y hay veces donde incluso si hay stock al vendedor no le interesa tenerlo publico por algun tipo de preferencia. Por eso el campo listed.

# Diseño
- La pagina principal necesita un modo oscuro, que adenas sea el default.

- A nivel de numeros se debe implementar una funcion que los separe por comas o puntos para que las cantidades grandes sean mas legibles. Ademas con cantidades contables de le suelen agregar los 00 de los decimales en la parte superior del numero.

- dentro de la pagina de panel o administrador deberia haber un boton que te lleve a la pagina principal para que el vendedor pueda ver su producto.

- Configuracion de la tienda deberia ser la primera opcion para que el vendedor se de cuenta que puede modificar sus propiedades.

- En la parte de ubicacion creo que es implementable una api de google maps para que las direcciones de coloque como especifiqué de gps y no arbitrarias, para que haya mas congruencia entre las direcciones ques e pongan y los lugares geograficos reales.

- Que no haya un convertirte en aliado, que directamente se pueda entrar en crear nueva tienda y por ahora confirmarla desde el panel. Pero que el vendedor pueda administarr su tienda antes de que la aprueben. Ademas que cuando entre pueda ver si su tienda esta verificada o no.

- Al buscar un producto (es decir que la barra de busquedas no esté en blanco) que se vaya el banner (donde actualmente está la laptop), esto tapa la vista de lo que se está buscando.

- Al darle clic que se hace grande el producto tambien podria haber un campo mas a parte de la condicion y la descripción, que se la hubicación.

# direccion

- Falta implementar la funcionalidad principal, que es que una url funcione como catalogo para una tienda. este no debería ser un simple filtro si no que lo caracterce su url. 

Asi como linktree, es conveniente que cada tienda se forme su url o que la url determine el parametro de la tienda que aparece. En todo caso lo optimo es que la url sea lo mas amigable posible para que sea elegante a la vista.

me imagino algo asi como:
https://url.com/stores/tecnovic
o si la implemetacion es muy complicada:
https://url.com/stores?=tecnovic 
(no se bien como es la sitaxis pero es lo de dar un parametro por url)

# Implementaciones considereables a "futuro"
Ademas de las que dije arriba...

- Implementar que los vendedores puedan abrir las tiendas y que estas "nazcan" verificadas, pero que solo puedan abrir 2. Luego habrá cunjunto a esto habría que desarrollar un sistema para que no halla spam en la db 

- Una vez tengamos el dominio tambien agregaré lo de contraseña olvidada.
