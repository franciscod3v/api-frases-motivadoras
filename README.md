# API FRASES MOTIVACIONALES

Una API realizada con Express.js que almacena frases motivadoras.

Disponible en https://api-frases-motivadoras-uguj-dev.fl0.io/

## Descripción

Este proyecto fue realizado para afianzar mis conocimientos en Node.js y Express.js. Pude comprender los conceptos de middleware, cors, los metodos GET, POST, PATCH, DELETE, validación de peticiones y los modulos de Node process y crypto

## Uso

Cada frase tiene la siguiente estructura:

 {
    "id": String único,
    "frase": String,
    "autor": String,
    "anio": Integer,
    "claves": [Array de Strings]
},

La Api permite hacer peticiones GET, POST, DELETE y PATCH

En el archivo api.http hay ejemplo de peticiones

## Características

- Node.js v18
- Express.js v4.18.2
- Cors v2.8.5
- Zod: v3.22.2
- Metodos GET, POST, PATCH y DELETE
- Common JS

## Licencia

Este proyecto se distribuye bajo la MIT.

## Contacto

Puedes contactarme en franciscod3v@gmail.com.

## Estado del Proyecto

En Desarrollo / Mantenimiento Activo