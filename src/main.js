console.log("UnaHur - Anti-Social net");

const express = require('express')
const swaggerUI = require('swagger-ui-express');
const swaggerDocumentation = require('../swaggerDoc.json');
const { genericMiddleware } = require("./middlewares");
const { userRoute, postRoute, tagRoute, commentRoute, archiveRoute} = require("./routes");
const path = require('path');
const { mongo, redis } = require('./config');
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(genericMiddleware.logRequest); // se utiliza para corroborar las peticiones (url, metodo y que se envia)
//app.use('/uploads', express.static(path.join(__dirname, 'uploads'))) 
// deja la carpeta uploads como estatica (permite guardar y acceder via localhost)

// Rutas
app.use("/users", userRoute);
//app.use("/comments", commentRoute) ;
//app.use('/posts', postRoute);
app.use("/tags", tagRoute);
//app.use("/archives", archiveRoute);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));

/*
como el usuario es el que crea los posts y los comments, desde esa ruta y controlador se deberia manejar 
unas rutas a los posts y comments que le pertenecen.

por ejemplo:
crear un post y en el metodo se llamaria a crearPost del controlador de post y se le enviaria
el id del usuario. Asi tambien se deberia hacer con modificar y eliminar un post de ese usuario. 
Lo mismo seria con los comments

en las rutas de posts y comments ver todos, ver por id del post o comment

en los controladores de post y comment estaria crear, modificar, eliminar, ver todos, ver por id y ver todos los de un usuario.

pasaria algo similar con archive y post
*/

app.listen(PORT, async (err) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
    try {
        // Conexión a Redis
        await redis.conectarRedis();
        // Conexión a MongoDB
        await mongo.conectarDB();
    } catch (dbError) {
        console.error(dbError.message);
        process.exit(1);
    }
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
});