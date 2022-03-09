<h1 align="center">Joinus</h1>
<p align="center"><img src="https://studentsprojects.cloud.ufps.edu.co/asn_balancing/api_gateway/asn_file/files/api/file/get_object/3c9cdf6f-93b2-4872-8ca3-21d58b3fbea1/"/></p> 

## Tabla de contenidos:
---

- [¿Que es joinus?](#¿Que-es-joinus?)
    - [Nombre: Unidos por el saber](#Nombre:-Unidos-por-el-saber)
    - [Logo: Una unión interdisciplinaria](#Logo:-Una-unión-interdisciplinaria)
- [Arquitectura y tecnologías](#Arquitectura-y-tecnologías)
    - [Arquitectura](#Arquitectura)
    - [Tecnologías](#Tecnologías)

## ¿Que es joinus?
---
Joinus pretende ser una plataforma de Red Social Académica abierta para todos los miembros de la UFPS, por medio de la cual a través de distintas formas puedan compartir el conocimiento interno de cada uno, subiendo proyectos académicos en los cuales ha trabajado o presentado.

Joinus permite la comunicación sin barreras o fronteras entre estudiantes o profesores de distintas áreas académicas, al igual que crear comunidades de aprendizaje o llevar nuestros grupos de la presencia física a la presencia virtual, mostrando estos a muchas más personas que puedan llegar a estar interesadas en unirse y aportar mayor conocimiento.

Las oportunidades de poner nuestros conocimientos en práctica puede estar al alcance de un click, si tenemos la voluntad de ser participes en algún proyecto que necesite apoyo, y tal vez este pueda contribuir al postulante con un valor económico o de otro aspecto.

Para una presentación acerca de la solución tecnológica creada se ha dispuesto un canal en la red social YouTube, https://bit.ly/3o5eMb3, en donde se da respuesta a preguntas cómo ¿Qué es Joinus?, ¿Por qué Joinus?, ¿Para que Joinus?, y además un breve recorrido por la misma, para verlo

### Nombre: Unidos por el saber
---

Lo primero que conocemos de un producto es su nombre, y este al igual que veremos con el logo debe transmitir lo que el producto o servicio ha de ofrecer. Este producto es una innovación tecnológica para la UFPS y está dirigido para los miembros de la UFPS, por tanto con el nombre queremos mostrar que este proyecto quiere reavivar el aspecto colaborativo entre los estudiantes, despejando cualquier frontera o barrera que se lo impida, por esta razón y para promover la unión entre toda la UFPS (nosotros) se decidió llamarla: JOINUS.

### Logo: Una unión interdisciplinaria
---
Joinus es sin lugar a dudas un esfuerzo porque las diferentes disciplinas y áreas del saber puedan trabajar de la mano, contribuyendo entre ellos, liberando el conocimiento implícito que cada quien lleva en sí, o dentro de sus aulas de clase por ejemplo, para convertirlo en algo explícito y que se pueda propagar en otros lugares. Fabuloso podría ser que un proyecto creado desde una carrera de ingeniería pueda impactar en otros estudiantes, y estos a su vez aporten valor y evolucione nuestro proyecto llevándolo a otro nivel.

En la larga búsqueda hacia el logo ideal, encontramos que el símbolo de infinito contiene lo que queríamos representar, lo vimos como dos caminos que en un punto se unen y que después ya no podemos saber con ciencia cierta donde inician o terminan, sin embargo logran verse cómo uno solo. Pero faltaba algo que le diera un aspecto humano, y es allí donde con cuatro manos logramos reflejar la unión entre dos cosas distintas que se unen formando una fuente “infinita” de conocimiento.

## Arquitectura y tecnologías
---
El objetivo de esta sección es mostrar brevemente la arquitectura del proyecto y el listado de tecnologías utilizadas en el mismo.

### Arquitectura
---

<h3 align="center"><strong>Capa de Frontend</strong></h3>

La plataforma esta conformada principalmente por dos capas, llamadas backend y frontend, para esta última se usa el framework angular, el cual tiene una arquitectura que se describe a continuación, la cual es la arquitectura recomendada por la documentación oficial de angular.

<p align="center"><img src="https://studentsprojects.cloud.ufps.edu.co/asn_balancing/api_gateway/asn_file/files/api/file/get_object/e5144df8-e7e3-4fb1-a4d4-449cb028a838/"/></p>
<p align="center"><i>Figura 1. Arquitectura de un proyecto en angular. <br>
Fuente: Elaboración angular.io (Angular, 2021)</i></p>

Iniciaremos con un breve y conciso resumen de la arquitectura angular, y a continuación seguiremos detallando cada uno de los componentes de la misma, mostrados gráficamente en la figura 1.

En esta arquitectura se generan templates con HTML y se controlan mediante lógica creada en los componentes, los cuales se exportan como clases. Así mismo, se agrega lógica en los servicios para conectar con el backend. Son estos los que consumen la API REST expuesta; y finalmente se “encapsulan” los componentes y servicios en módulos o NgModules.
Como podemos apreciar en la figura 1, hay diferentes términos que son importantes en esta arquitectura.

En conclusión podemos decir que Angular cuando inicia hace un análisis de sus componentes, módulos, directivas y servicios, y renderiza los templates reflejando la lógica que se haya definido en cada uno de estos, una vez cargada toda la aplicación, angular está en constante data-binding, con la intención de mostrar información real al usuario, además de agregar aspectos de usabilidad al usuario final.

<h3 align="center"><strong>Capa de Backend</strong></h3>

Para la capa de backend se utilizan principalmente dos frameworks, a saber, spring boot y rest framework, a continuación se describe con más detalle la arquitectura correspondiente a esta capa:

<p align="center"><img src="https://studentsprojects.cloud.ufps.edu.co/asn_balancing/api_gateway/asn_file/files/api/file/get_object/a7bc062a-36ff-442c-b336-cd1f99584cf8/"/></p>
<p align="center"><i>Figura 2. Arquitectura de backend. <br>
Fuente: Elaboración propia (2021)</i></p>

Cómo se logra apreciar en la imagen, la capa de backend está conformado principalmente por tres niveles importantes, a saber:

<strong>Nivel del api gateway:</strong> Este cumple las veces de una puerta de acceso, que verifica que el usuario esta intentando ingresar de manera correcta a la plataforma, es decir, este evalúa las condiciones del token que viaja en la petición, y de acuerdo a lo que el usuario haya solicitado, este api gateway redirecciona hacia el microservicio correspondiente.

<strong>Nivel de microservicios:</strong> Aquí es donde están ubicados los microservicios que hacen parte de este proyecto. Entre los microservicios se entabla comunicación según corresponda el caso, de la misma manera la comunicación puede ser bidireccional, o en un solo sentido, el lenguaje para la comunicación entre los mismos es mediante Json.

<strong>Nivel de base de datos:</strong> En este nivel se encuentran las bases de datos correspondientes a cada uno de los microservicios, cada microservicio que existe tiene de manera independiente una base de datos asociada.

### Tecnologías
---

<h3>Tecnologías base de datos</h3>

- Mongodb ![coverage](https://img.shields.io/badge/version-4.0.8-yellowgreen)

<h3>Tecnologías backend</h3>

- Python ![coverage](https://img.shields.io/badge/version-3.7-yellow)
- Rest Framework ![version](https://img.shields.io/badge/version-3.11.1-blue)
- Java ![gem](https://img.shields.io/badge/version-8-red)
- Docker ![codacy](https://img.shields.io/badge/version-20.10-blue)


<h3>Tecnologías frontend</h3>

- Angular CLI ![version](https://img.shields.io/badge/version-10.1.3-red)
- Node ![version](https://img.shields.io/badge/version-14.5.5-green)
- Typescript ![version](https://img.shields.io/badge/version-4.0.3-blue)
- Bootstrap ![version](https://img.shields.io/badge/version-5.1.3-blueviolet)
- Primeng ![version](https://img.shields.io/badge/version-13.2.1-red)
