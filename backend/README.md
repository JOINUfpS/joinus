# Tabla de contenidos:
 
- [Implementación de la base de datos](#Implementación-de-la-base-de-datos)
    - [Colección Publications](#Colección-publications)
- [Implementación del Backend](#Implementación-del-backend)
    - [Common structure microservices](#Common-structure-microservices)
        - [Componente de configuration(#Componente-de-configuration) 
        - [Componente de authentication](#Componente-de-authentication)
        - [Componente de view](#Componente-de-view)
- [Microservicios](#Microservicios)
    - [Views](#Views)
    - [Websockets](#Websockets)
    - [Serializers](#Serializers)
- [Actualizaciones en cascada](#Actualizaciones-en-cascada)
- [Pruebas](#Pruebas)
- [Configuración de ambientes](#Configuración-de-ambientes)
 
## Implementación de la base de datos
 
La base de datos (BD) es una de las primeras implementaciones que se realizan. Para el desarrollo de la aplicación se utiliza
la estrategia de una base de datos en la nube, lo que permite la sincronía entre el equipo de desarrollo y la separación de
datos de prueba a los datos reales. Para esto se hace el montaje de la base de datos en la plataforma de Mongo Atlas (https://bit.ly/3E0X2m8).
 
En esta sección se mostrará dos ejemplos de los modelos implementados en la plataforma, en el primero de ellos el microservicio “publications”, se encuentran dos tablas (colecciones): publication y publication_user, en ellos se guardan las publicaciones que existen dentro de la plataforma, y las publicaciones favoritas de los usuarios respectivamente. En el otro caso el microservicio de “file”.
 
### Colección Publications
 
Algo importante a resaltar en los modelos de datos creados en motores de BD no relacionales, es el hecho de que existe redundancia de datos, esto supone retos durante el desarrollo que serán analizados más a fondo en la sección de actualización en cascada, a pesar de esto, da la gran ventaja de que las consultas se hacen mucho más rápidas, ya que no tiene que ir a buscar en la n cantidad de tablas de donde obtiene la información que necesita y que mostrará al usuario, adicionalmente de que en una arquitectura de microservicios tendría que ir a consumir un endpoint que le de la información que necesita, lo que aumentaría en gran manera la latencia, traduciendo en tiempos de respuesta más lentos, y que en un sistema de red social donde la consulta de datos es muy alta, no es muy recomendado.
 
Por esta razón, y siguiendo la idea de encontrar todo lo que se necesita en una sola consulta dentro de las colecciones en un tiempo corto. Un documento de la colección publication_user tiene los datos necesarios para mostrar al usuario en la vista de publicaciones favoritas, en el momento en que el usuario quiera ver la información completa de la publicación, el frontend lo que hace es consultarla en la colección publication.
 
En muchos casos también se decide separar cierta información para facilitar el filtrado de las consultas, un ejemplo de esto sería el caso de las categorías, el usuario o la comunidad en la colección de publication, optar por la solución en la que se guarda la información de estos como un atributo de tipo json en la colección, implicaría que si se quiere hacer un filtrado por alguno de estos campos, se tendría que hacer un endpoint personalizado en el que consulte todas las publicaciones existentes, y por cada una hacer un for que encuentre por ejemplo todas mis publicaciones.
 
## Implementación del backend
 
En esta sección veremos un breve recorrido de las implementaciones realizadas por parte de backend, las prácticas utilizadas, patrones, y decisiones de diseño entre otros. En la primera parte se analiza una de las estrategias que se utilizó para combatir la duplicidad que se puede presentar a futuro en una arquitectura de microservicios.
 
Posteriormente se analizaran las implementaciones importantes por parte de los microservicios del sistema. Y por último se hablará de uno de los mayores retos a la hora de implementar motores de base de datos no relacionales, las actualizaciones en cascada.
 
Este es el listado de tecnologías y herramientas utilizadas para el desarrollo del proyecto en la capa de backend:
 
- Python ![coverage](https://img.shields.io/badge/version-3.7-yellow)
- Rest Framework ![version](https://img.shields.io/badge/version-3.11.1-blue)
- Java ![gem](https://img.shields.io/badge/version-8-red)
- Docker ![codacy](https://img.shields.io/badge/version-20.10-blue)
 
### Common structure microservices
---
En todo proyecto de software hay algunas partes del código que se reutilizan, y si no se gestiona correctamente podría impactar en los índices de duplicidad del proyecto. Por esta razón se decide implementar una librería en el que se pueda depositar ahí todo el código que es propenso a ser utilizado por diferentes partes del software.
 
Para Python existe un repositorio binario gratuito en el que se puede compilar el código de esta librería, y aquí se aloja las funcionalidades comunes del proyecto. El repositorio de binarios se llama pypi, y para hacer la instalación de la librería solo basta con hacer:
 
<p align="center"><i>pip install common-structure-microservices</i></p>
 
La idea principal de este proyecto es que se deposite allí todo el codigo que puede ser usado como constante, o que es utilizado en diferentes lugares dentro del microservicio, o los microservicios que hacen parte de la aplicación. Si decide que existe un nuevo código que debería ir y no está, dentro del repositorio de common_microservices están las instrucciones para desplegar los cambios.
 
Una vez se suban los cambios al repositorios de binarios (pypi), se recomienda que se esperen unos 10 minutos para que se complete el proceso de despliegue del repositorio en esta plataforma. Posteriormente se hace necesario que se haga el proceso de reinicio (stop y start) en los dockers que están involucrados en el cambio. Recordar que cualquier cambio vital que se haga en este repositorio puede llegar afectar el correcto funcionamiento de toda la aplicación.
 
### Componente de configuration

En este componente observamos archivos que tiene donde se maneja de manera general las respuestas que da el backend, además del manejador de excepciones que backend entrega a quien consulte sus endpoints.
 
La clase Profiles nos ayuda a determinar en qué ambiente estamos y a obtener las configuraciones necesarias para  levantar el microservicio de acuerdo a las reglas definidas por ambiente. La clase de RemoteModel es la que me permite la comunicación entre microservicios, podríamos decir que esta es una de las clases más importantes dentro de la librería, ya que sin esta no habría comunicación entre los microservicios.
 
Dentro de este encontramos una clase que ayuda con la entrega de la paginación de la información en los endpoints, por ejemplo, en la clase de CustomPagination hay una herencia con una de las clases de paginación del propio rest framework, con esta clase se controla la manera en cómo se entrega la información, dando un estándar a las respuestas de consulta, además de ser capaz de determinar en qué ambiente se encuentra y por tanto entregar la url de los siguientes datos de consulta o los anteriores.
 
### Componente de authentication
 
En este componente, se heredan de las clases base entregadas por rest framework para el manejo de los permisos y la que ayuda a determinar si un usuario está autenticado. Esta sesión es de vital importancia para determinar qué hacer con aquellos usuarios que no están logueados, que están enviando tokens que no existen o tokens inválidos.
 
### Componente de view
 
Para el componente de vistas se realiza un análisis de la manera en cómo rest framework las maneja, y en base a eso se decide crear clases que solo se encarguen de un endpoint en particular, como beneficio de hacer esta personalización da la libertad de agregar estándares de respuesta, muy útiles para el manejo de la comunicación con frontend, además de si se quiere añadir a futuro componentes como auditorías a algunos de los métodos HTTP, bastaría con agregar la línea de llamado a la clase en la que se realizará la inserción de auditoría.
 
## Microservicios
 
El backend consiste de 9 microservicios, dentro de ellos hay 2 hechos en Java con el framework SpringBoot que ayuda a gestionar puntos de acceso y disponibilidad para los micros. El resto de microservicios fueron construidos en Python con la particularidad de que dos de ellos utilizan Redis por su naturaleza asíncrona (notification y chat).
 
Como buena práctica dentro de la documentación de Django se propone que por cada módulo que se vaya a utilizar dentro del proyecto, exista una aplicación para así organizar el código de una manera más modularizada, por tanto dentro de la arquitectura armada, se define que exista un microservicio solo para el chat, por ejemplo.
 
### Views
 
Para esta sección se seleccionan sólo aquellas partes más importantes del microservicio, y una de las ellas son las views, en esta lo primero que podemos decir es que  heredan de una clase llamada ModelViewSet, al heredar de esta clase ConversationsView hereda los cinco métodos Http básicos (GET, POST, PUT, PATCH, DELETE).
 
Dentro de las clases viewa del microservicio de chat existen unos atributos claves, los cuales sirven para darle información a Rest Framework, sobre cuál es el model y el serializer por el cual va a mapear ese objeto que traiga de la BD o por qué atributos deberá hacer el ordenamiento y filtrado, además de parametrizar aquellos por los cuales va a permitir hacer búsquedas.
 
En cuanto a los métodos, existentes dentro de las views, son endpoints adicionales a los cinco básicos que obtiene mediante la herencia, a estos métodos se les agregan decoradores que ayudan a Rest Framework determinar, qué tipo de método Http son, qué ruta deben tener, que serializer sirve para verificar o para mapear el objeto que llega o que se va a mostrar.
 
### Websockets
 
Otra de las partes importantes para este microservicio es donde se implementan los websockets, estos son creados a partir de Django Channels el cual es un proyecto que extiende el comportamiento de Django para agregar este tipo de comunicación permitiendo usar protocolos de mensajería basados en ASGI (Django Channels, 2021b).
 
Aquí veremos los componentes más importantes, si desea adentrarse en términos más profundos de cómo funciona a bajo nivel diríjase a la documentación oficial https://channels.readthedocs.io/en/stable/.
 
Lo primero que debe conocer es que en toda aplicación que desee enviar un mensaje deberá crear una clase consumidora la cual puede heredar de AsyncConsumer o SyncConsumer según si las actividades que realizará después de recibir un evento son asincronas o sincronas (Django Channels, 2021a). Para esta explicación se usará la clase ChatConsumer la cual hereda de WebSocketConsumer, esto automáticamente le permite acceder a tres (3) métodos importantes para la gestión de la mensajeria: connect, disconnect, y receive.
 
En el primero de ellos, connect, se debe sobreescribir la lógica para conectar el cliente a un grupo (room), una vez conectado, el consumidor puede procesar peticiones mediante el método receive, aquí se crea un json el cual contiene los datos que le fueron entregados y  entre ellos asigna un campo type el cual indica al consumer qué método debe realizar después, para este caso se invoca a un método llamado chat_message el cual envía el mensaje por medio del método send (note que no se debe realizar una logica para especificar que se debe hacer con los datos recibidos en la petición, porque la misma petición en el type que se mencionaba indica cual es el paso o método a seguir); el cliente que está escuchando por ese websocket y a ese room, recibe el mensaje, lo procesa y lo envía a frontend. Por último se encuentra el método disconnect que se invoca una vez la conversación ha sido cerrada o la conexión del websocket se pierde.
 
<p align="center"><img src="../images/Asincrono%20de%20chat.png"/></p>
<p align="center"><i>Figura 1.  Clases correspondientes a componente asíncrono de chat. <br>
Fuente: Elaboración propia</i></p>
 
### Serializers
 
Por último tenemos a el componente de los serializers, en este caso hay diferentes serializer que hacen parte de la aplicación de chat, esto es debido a que los nuevos endpoints no necesitaban todos los atributos que hacen parte del componente principal. El concepto de serializer es similar al que recordamos de un DTO, un objeto que ayuda a la validación de datos en los procesos que se realizan, por esta razón es que de acuerdo a la necesidad dada en los endpoints que se crearon, se agregan nuevos serializer para que ayuden a la validación de los objetos que están enviando y realicen las correspondientes operaciones.
 
## Actualizaciones en cascada
 
Como ya se comentó al inicio de esta sección las actualizaciones en cascada son un efecto colateral de la utilización de BD NoSQL. En las BD relacionales esto no representa una problemática para el desarrollador, ya que este tipo de BD está preparada para las problemáticas de actualizaciones y eliminaciones en otras tablas y tomar decisiones según sea el caso (nulos, cascada, restrictivo, etc), sin embargo en las BD NoSQL es responsabilidad del desarrollador garantizar consistencia de los datos en todos los lugares en que se necesite dentro de la aplicación.
 
Es verdad que esta problemática es mucho más crítica en sistemas como los bancarios por ejemplo, en los que los datos deben ser consistentes en todo momento, y si es que llegará haber algún tipo de inconsistencia podría significar pérdidas de dinero para la entidad. En el caso de una red social si se pierde un comentario, un me interesa o si se pierde la foto de perfil dentro de las acciones realizadas en el sistema no implicaría mayores problemáticas, pero visualmente genera un impacto poco agradable, por tanto se hace la implementación de esto de la siguiente manera:
 
1. Identificar dentro del sistema que impacto tiene el cambiar algo dentro de la colección correspondiente.
 
2. Una vez identificados los impactos dentro de las demás colecciones, se inicia el proceso de que estrategia es la más conveniente.
Para el manejo de la respuesta con el usuario en las peticiones que implica hacer actualizaciones de campos, o eliminaciones de los mismos, existen principalmente 3 estrategias:
 
    2.1. Mantener todo en el hilo principal, lo que significa que no se le dirá al usuario la respuesta de su petición hasta que el proceso de actualización haya terminado.
 
    2.2. Manejo de actualización y eliminación en segundo plano, en este caso, se le dará una respuesta al usuario sin importar que el proceso de actualización o eliminación no haya terminado, sin embargo se sigue manteniendo en el hilo principal, por lo que el tiempo de respuesta puede ser un poco lento. En este caso si ocurre algún error a la hora de realizar el cambio, el usuario nunca se entera.
 
    En este caso pueden llegar a haber inconsistencias en los datos en ciertos casos (cuando dio error en alguna parte del sistema al intentar hacer este proceso), por tanto es responsabilidad del desarrollador revisar los logs e intentar solucionar el error.
 
    2.3. La última estrategia que se presenta es la de manejar esto con un hilo diferente y adicionalmente en segundo plano, con esta obtenemos los beneficios y desventajas de la estrategia anterior, pero en este caso la respuesta es mucho mas rapida y ademas se le informa al usuario que el proceso que está realizando puede demorar un poco en verse reflejado. Esta estrategia se usa para aquellas actualizaciones que son muy complejas, y que tiene un impacto muy alto dentro de todo el sistema (actualización de la foto de perfil, por ejemplo)
 
3. Una vez identificados los impactos y la mejor estrategia, se inicia el desarrollo.
 
 
La estrategia que se implementó para esta parte es la del punto 2 mostrada anteriormente, es decir que cuando llegue la petición de actualización en categorías, este actualizará el registro en su colección correspondiente y consumirá el endpoint del microservicio al que impacta y delega el proceso de actualización en cascada a este.
 
## Pruebas
 
Dentro de los microservicios se realizan pruebas unitarias y de integración. Las pruebas no tienen ninguna condición en particular para que corran, simplemente corriendo el comando correspondiente a correr las pruebas servirá (python manage.py test), sin embargo se recomienda que antes de ejecutar las pruebas se cambie la base de datos que está configurada en el archivo de settings, ya que el no hacer esto implica que los datos dentro de esta base de datos que está configurada serán eliminados. De paso recomiendo que si sabe configurar una base de datos que se use solo para las pruebas, y la otra para usarse durante el desarrollo sería la solución más apropiada.
 
## Configuración de ambientes
 
El proyecto en backend conformado por todo los microservicios que hacen parte de él, tienen una configuración de ambientes que sirve para determinar en que ambiente y además de que configuraciones en particular se necesitan de acuerdo al ambiente que se decide desplegar el proyecto. Como vemos en la imagen, estos son los archivos involucrados o encargados de determinar en qué ambiente va a correr el proyecto.
 
El archivo settings.py es el encargado de cargar todas las configuraciones dentro de la aplicación, en este caso de leer el archivo profiles.py quien es el encargado de determinar sobre qué ambiente se corre la aplicación.
 
<p align="center"><img src="../images/Determinar%20ambiente.png"/></p>
<p align="center"><i>Figura 2.  Clases involucradas en determinar en que ambiente se levanta la aplicación. <br>
Fuente: Elaboración propia</i></p>
 
También existe dentro de cada microservicio una carpeta oculta en la que existen archivos de los diferentes ambientes que están disponibles, es decir, existe un archivo con todas las constantes correspondientes a ese ambiente, como vemos en la figura 2, para el caso del microservicio de usuarios existe el ambiente en local (asn_user_loc.yml), por tanto, si se quiere crear un nuevo ambiente en el cual correr la aplicación, basta con crear un archivo con la siguiente estructura para el nombre:
 
<p align="center">nombre_microservicio_nombre_ambiente.yml</p>
 
Una vez definidas las constantes y determinado el nombre del nuevo ambiente, solo basta con cambiar el perfil activo que estamos usando actualmente el en archivo profile.yml
