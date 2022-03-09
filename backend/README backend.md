<h1 align="center"> Nombre de la herramienta</h1>
<p align="center"> Logo e imagen o gif de la interfaz principal de la herramienta</p>
<p align="center"><img src="https://www.webdevelopersnotes.com/wp-content/uploads/create-a-simple-home-page.png"/></p> 

## Tabla de contenidos:
---

- [Implementación de la base de datos](#Implementación-de-la-base-de-datos)
    - [Colección Publications](#Colección-publications)
- [Implementación del Backend](#Implementación-del-backend)
    - [Common structure microservices](#Common-structure-microservices)
    - [Componente de authentication](#Componente-de-authentication)
    - [Componente de view](#Componente-de-view)
- [Microservicios](#Microservicios)
    - [Views](#Views)
    - [Websockets](#Websockets)
    - [Serializers](#Serializers)
- [Actualizaciones en cascada](#Actualizaciones-en-cascada)
- [Pruebas](#Actualizaciones-en-cascada)

## Implementación de la base de datos
---
La base de datos (BD) es una de las primeras implementaciones que se realiza. Para el desarrollo de la aplicación se utiliza
la estrategia de una base de datos en la nube, lo que permite la sincronia entre el equipo de desarrollo y la separación de
datos de prueba a los datos reales. Para esto se hace el montaje de la base de datos en la plataforma de Mongo Atlas (https://bit.ly/3E0X2m8).

En esta sección se mostrará dos ejemplos de los modelos implementados en la plataforma, en el primero de ellos el microservicio “publications”, se encuentran dos tablas (colecciones): publication y publication_user, en ellos se guardan las publicaciones que existen dentro de la plataforma, y las publicaciones favoritas de los usuarios respectivamente. En el otro caso el microservicio de “file”.

### Colección Publications

Algo importante a resaltar en los modelos de datos creados en motores de BD no relacionales, es el hecho de que existe redundancia de datos, esto supone retos durante el desarrollo que serán analizados más a fondo en la sección de actualización en cascada, a pesar de esto, da la gran ventaja de que las consultas se hacen mucho más rápidas, ya que no tiene que ir a buscar en la n cantidad de tablas de donde obtiene la información que necesita y que mostrará al usuario, adicionalmente de que en una arquitectura de microservicios tendría que ir a consumir un endpoint que le de la información que necesita, lo que aumentaría en gran manera la latencia, traduciendo en tiempos de respuesta más lentos, y que en un sistema de red social donde la consulta de datos es muy alta, no es muy recomendado.

Por esta razón, y siguiendo la idea de encontrar todo lo que se necesita en una sola consulta dentro de las colecciones en un tiempo corto. Un documento de la colección publication_user tiene los datos necesarios para mostrar al usuario en la vista de publicaciones favoritas, en el momento en que el usuario quiera ver la información completa de la publicación, el frontend lo que hace es consultarla en la colección publication.

En muchos casos también se decide separar cierta información para facilitar el filtrado de las consultas, un ejemplo de esto sería el caso de las categorías, el usuario o la comunidad en la colección de publication, optar por la solución en la que se guarda la información de estos como un atributo de tipo json en la colección, implicaría que si se quiere hacer un filtrado por alguno de estos campos, se tendría que hacer un endpoint personalizado en el que consulte todas las publicaciones existentes, y por cada una hacer un for que encuentre por ejemplo todas mis publicaciones.

## Implementación del backend
---
En esta sección veremos un breve recorrido de las implementaciones realizadas por parte de backend, las prácticas utilizadas, patrones, y decisiones de diseño a los que nos tuvimos que enfrentar. En la primera parte analizaremos una de las estrategias que utilizamos para combatir la duplicidad que se podría presentar a futuro en una arquitectura de microservicios. Dentro de esta veremos algunos de los componentes más importantes que hacen que funcionen con dinamismo los microservicios que conforman el proyecto.

Posteriormente se analizaran las implementaciones más importantes por parte de los microservicios del sistema. Y por último se hablará de uno de los mayores retos a la hora de implementar motores de base de datos no relacionales, las actualizaciones en cascada.

- code coverage percentage: ![coverage](https://img.shields.io/badge/coverage-80%25-yellowgreen)
- stable release version: ![version](https://img.shields.io/badge/version-1.2.3-blue)
- package manager release: ![gem](https://img.shields.io/badge/gem-2.2.0-blue)
- status of third-party dependencies: ![dependencies](https://img.shields.io/badge/dependencies-out%20of%20date-orange)
- static code analysis grade: ![codacy](https://img.shields.io/badge/codacy-B-green)
- [SemVer](https://semver.org/) version observance: ![semver](https://img.shields.io/badge/semver-2.0.0-blue)
- amount of [Liberapay](https://liberapay.com/) donations per week: ![receives](https://img.shields.io/badge/receives-2.00%20USD%2Fweek-yellow)
- Python package downloads: ![downloads](https://img.shields.io/badge/downloads-13k%2Fmonth-brightgreen)
- Chrome Web Store extension rating: ![rating](https://img.shields.io/badge/rating-★★★★☆-brightgreen)
- [Uptime Robot](https://uptimerobot.com) percentage: ![uptime](https://img.shields.io/badge/uptime-100%25-brightgreen)

### Common structure microservices
---
En todo proyecto de software hay algunas partes del código que se reutilizan, y si no se gestiona correctamente podría impactar en los índices de duplicidad del proyecto. Por esta razón se decide implementar una librería en el que se pueda depositar ahí todo el código que es propenso a ser utilizado por diferentes partes del software.

Para Python existe un repositorio binario gratuito en el que se puede compilar el código de esta librería, y aquí se aloja las funcionalidades comunes del proyecto. A continuación se mostrarán los componentes más importantes dentro de la librería:

### Componente de configuration
---
En este componente observamos archivos que tiene donde se maneja de manera general las respuestas que da el backend, además del manejador de excepciones que backend entrega a quien consulte sus endpoints. 

La clase Profiles nos ayuda a determinar en qué ambiente estamos y a obtener las configuraciones necesarias para  levantar el microservicio de acuerdo a las reglas definidas por ambiente. La clase de RemoteModel es la que me permite la comunicación entre microservicios, podríamos decir que esta es una de las clases más importantes dentro de la librería, ya que sin esta no habría comunicación entre los microservicios. 

Dentro de este encontramos una clase que ayuda con la entrega de la paginación de la información en los endpoints, como notamos en la figura 3, en la clase de CustomPagination hay una herencia con una de las clases de paginación del propio rest framework, con esta clase se controla la manera en cómo se entrega la información, dando un estándar a las respuestas de consulta, además de ser capaz de determinar en qué ambiente se encuentra y por tanto entregar la url de los siguientes datos de consulta o los anteriores.


Figura 3. Clases y archivos correspondientes al componente de configuration.
Elaboración propia.

### Componente de authentication
---
Como podemos observar en la figura 4, se heredan de las clases base entregadas por rest framework para el manejo de los permisos y la que ayuda a determinar si un usuario está autenticado. Esta sesión es de vital importancia para determinar qué hacer con aquellos usuarios que no están logueados, que están enviando tokens que no existen o tokens inválidos.

Figura 4. Clases correspondientes al componente de authentication.
Elaboración propia.

### Componente de view
---
Para el componente de vistas se realiza un análisis de la manera en cómo rest framework las maneja, y en base a eso se decide crear clases que solo se encarguen de un endpoint en particular, como beneficio de hacer esta personalización da la libertad de agregar estándares de respuesta, muy útiles para el manejo de la comunicación con frontend, además de si se quiere añadir a futuro componentes como auditorías a algunos de los métodos HTTP, bastaría con agregar la línea de llamado a la clase en la que se realizará la inserción de auditoría.


Figura 5. Clases correspondientes a componente de views.
Elaboración propia.

## Microservicios
---
El backend consiste de 9 microservicios, dentro de ellos hay 2 hechos en Java con el framework SpringBoot que ayuda a gestionar puntos de acceso y disponibilidad para los micros. El resto de microservicios fueron construidos en Python con la particularidad de que dos de ellos utilizan Redis por su naturaleza asíncrona (notification y chat). A continuación se mostrarán las partes más importantes del microservicio de chat, con la intención de ejemplificar cómo están construidos los demás microservicios.

Como buena práctica dentro de la documentación de Django se propone que por cada módulo que se vaya a utilizar dentro del proyecto, exista una aplicación para así organizar el código de una manera más modularizada, por tanto dentro de la arquitectura armada, se define que exista un microservicio solo para el chat, donde este tiene dos componentes, Conversation y Message, por tanto se crearon estas dos aplicaciones con Django. Las figuras que se verán dentro de esta sesión son parte del microservicio de chat.

### Views
---
Para esta sección se seleccionan sólo aquellas partes más importantes del microservicio, y una de las ellas son las views, en esta lo primero que podemos notar es que  heredan de una clase llamada ModelViewSet, que como se vio en la sesión anterior (figura 5), al heredar de esta clase ConversationsView hereda los cinco métodos Http básicos (GET, POST, PUT, PATCH, DELETE).

Como notamos dentro de la figura 6, en ConversationsView existen unos atributos claves, todos estos sirven para darle información a Rest Framework, en el caso de los dos primeros, sobre cuál es el model y el serializer por el cual va a mapear ese objeto que traiga de la BD. Con los demás atributos le indicamos temas de ordenamiento y filtrado, además de parametrizar aquellos por los cuales va a permitir hacer búsquedas.

En cuanto a los métodos, estos son endpoints adicionales a los cinco básicos que obtiene mediante la herencia, a estos métodos se les agregan decoradores que ayudan a Rest Framework determinar, qué tipo de método Http son, qué ruta deben tener, que serializer sirve para verificar o para mapear el objeto que llega o que se va a mostrar.


Figura 6. Clases parte de las vistas de chat.
Elaboración propia.

### Websockets
---
Otra de las partes importantes para este microservicio es donde se implementan los websockets, estos son creados a partir de Django Channels el cual es un proyecto que extiende el comportamiento de Django para agregar este tipo de comunicación permitiendo usar protocolos de mensajería basados en ASGI (Django Channels, 2021b). 

Aquí veremos los componentes más importantes, si desea adentrarse en términos más profundos de cómo funciona a bajo nivel diríjase a la documentación oficial https://channels.readthedocs.io/en/stable/.

Lo primero que debe conocer es que en toda aplicación que desee enviar un mensaje deberá crear una clase consumidora la cual puede heredar de AsyncConsumer o SyncConsumer según si las actividades que realizará después de recibir un evento son asincronas o sincronas (Django Channels, 2021a). Para esta explicación se usará la clase ChatConsumer la cual hereda de WebSocketConsumer, esto automáticamente le permite acceder a tres (3) métodos importantes para la gestión de la mensajeria: connect, disconnect, y receive. 

En el primero de ellos, connect, se debe sobreescribir la lógica para conectar el cliente a un grupo (room), una vez conectado, el consumidor puede procesar peticiones mediante el método receive, aquí se crea un json el cual contiene los datos que le fueron entregados y  entre ellos asigna un campo type el cual indica al consumer qué método debe realizar después, para este caso se invoca a un método llamado chat_message el cual envía el mensaje por medio del método send (note que no se debe realizar una logica para especificar que se debe hacer con los datos recibidos en la petición, porque la misma petición en el type que se mencionaba indica cual es el paso o método a seguir); el cliente que está escuchando por ese websocket y a ese room, recibe el mensaje, lo procesa y lo envía a frontend. Por último se encuentra el método disconnect que se invoca una vez la conversación ha sido cerrada o la conexión del websocket se pierde.



Figura 7. Clases correspondientes a componente asíncrono de chat .
Elaboración propia.

Si desea conocer más detalles de esta implementación puede visitar la documentación oficial de Django Channels la cual aparte de los conceptos teóricos se apoya de un tutorial para que pueda hacer su propia implementación.

### Serializers
---
Por último tenemos a el componente de los serializers, en este caso como notamos en la figura 8 hay diferentes serializer que hacen parte de la aplicación de chat, esto es debido a que los nuevos endpoints no necesitaban todos los atributos que hacen parte de el componente principal llamado ConversationSerializer. El concepto de serializer es similar al que recordamos de un DTO, un objeto que ayuda a la validación de datos en los procesos que se realizan, por esta razón es que de acuerdo a la necesidad dada en los endpoints que se crearon, se agregan nuevos serializer para que ayuden a la validación de los objetos que están enviando y realicen las correspondientes operaciones.


Figura 8. Clases serializers parte de chat.
Elaboración propia.
 	
## Actualizaciones en cascada
---
Como ya se comentó al inicio de esta sección las actualizaciones en cascada son un efecto colateral de la utilización de BD NoSQL. En las BD relacionales esto no representa una problemática para el desarrollador, ya que este tipo de BD está preparada para las problemáticas de actualizaciones y eliminaciones en otras tablas y tomar decisiones según sea el caso (nulos, cascada, restrictivo, etc), sin embargo en las BD NoSQL es responsabilidad del desarrollador garantizar consistencia de los datos en todos los lugares en que se necesite dentro de la aplicación.

Es verdad que esta problemática es mucho más crítica en sistemas como los bancarios por ejemplo, en los que los datos deben ser consistentes en todo momento, y si es que llegará haber algún tipo de inconsistencia podría significar pérdidas de dinero para la entidad. En el caso de una red social si se pierde un comentario, un me interesa o si se pierde la foto de perfil dentro de las acciones realizadas en el sistema no implicaría mayores problemáticas, pero visualmente genera un impacto poco agradable, por tanto se hace la implementación de esto de la siguiente manera:

El primero de los pasos es identificar dentro del sistema que impacto tiene el cambiar algo dentro de la colección correspondiente.
Una vez identificados los impactos dentro de las demás colecciones, se inicia el proceso de que estrategia es la más conveniente.
Para el manejo de la respuesta con el usuario en las peticiones que implica hacer actualizaciones de campos, o eliminaciones de los mismos, existen principalmente 3 estrategias:
Mantener todo en el hilo principal, lo que significa que no se le dirá al usuario la respuesta de su petición hasta que el proceso de actualización haya terminado.

Manejo de actualización y eliminación en segundo plano, en este caso, se le dará una respuesta al usuario sin importar que el proceso de actualización o eliminación no haya terminado, sin embargo se sigue manteniendo en el hilo principal, por lo que el tiempo de respuesta puede ser un poco lento. En este caso si ocurre algún error a la hora de realizar el cambio, el usuario nunca se entera.

En este caso pueden llegar a haber inconsistencias en los datos en ciertos casos (cuando dio error en alguna parte del sistema al intentar hacer este proceso), por tanto es responsabilidad del desarrollador revisar los logs e intentar solucionar el error.

La última estrategia que se presenta es la de manejar esto con un hilo diferente y adicionalmente en segundo plano, con esta obtenemos los beneficios y desventajas de la estrategia anterior, pero en este caso la respuesta es mucho mas rapida y ademas se le informa al usuario que el proceso que está realizando puede demorar un poco en verse reflejado. Esta estrategia se usa para aquellas actualizaciones que son muy complejas, y que tiene un impacto muy alto dentro de todo el sistema (actualización de la foto de perfil, por ejemplo)

Una vez identificados los impactos y la mejor estrategia, se inicia el desarrollo.

Para un mejor entendimiento de lo anterior a continuación se dará un ejemplo con diagramas y posteriormente una breve explicación del código fuente.

Uno de los casos más sencillos a revisar es el caso de las categorías. Como vemos en la figura 9, el actualizar el nombre de la categoría impacta en 2 colecciones diferentes, además de impactar la colección del microservicio de utility. 


Figura 9. Impacto de cambiar nombre de la categoría.
Elaboración propia.

La estrategia que se implementó para esta parte es la del punto 2 mostrada anteriormente, es decir que cuando llegue la petición de actualización en categorías, este actualizará el registro en su colección correspondiente y consumirá el endpoint del microservicio al que impacta y delega el proceso de actualización en cascada a este.


Figura 10. Flujo de consumo de endpoints al actualizar una categoría.
Elaboración propia.

Com se ve en la figura 10, el usuario que está usando la plataforma decide cambiar el nombre de una categoría, cuando el usuario da click en el botón actualizar, el frontend se comunica inmediatamente con el backend a través del gateway que en la figura está representado como la nube de balancing, una vez ahí se valida el usuario mediante el envío de token en la petición, se redirige al microservicio de utility, y consume el endpoint de actualización de una categoría. 

Para este caso en particular de la actualización de una categoría, se decide que solo impactaría las comunidades que han sido creadas con ese tipo, y no que impactaría en los modelos de publicaciones y oportunidades que son los otros modelos que usan este atributo. Por tanto si la categoría actualizar es de tipo comunidad, en segundo plano se procede a consumir el servicio actualización de categoría expuesto por el microservicio de usuario.