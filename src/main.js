console.log("UnaHur - Anti-Social net");

const express = require('express')
const swaggerUI = require('swagger-ui-express');
const swaggerDocumentation = require('../swaggerDoc.json');
const { genericMiddleware } = require("./middlewares");
const { userRoute, postRoute, tagRoute, commentRoute, archiveRoute} = require("./routes");
const path = require('path');
const { mongo } = require('./config');
const {manejoDeErroresGlobales} = require("./middlewares/genericMiddleware");
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

const cors = require('cors');

// Middleware
app.use(express.json())
app.use(genericMiddleware.logRequest); // se utiliza para corroborar las peticiones (url, metodo y que se envia)
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))) 
// deja la carpeta uploads como estatica (permite guardar y acceder via localhost)

// Rutas
app.use(cors({origin: 'http://localhost:5173'}))
app.use("/users", userRoute);
app.use("/comments", commentRoute);
app.use('/posts', postRoute);
app.use("/tags", tagRoute);
app.use("/archives", archiveRoute);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));

app.use(manejoDeErroresGlobales); // Manejo de errores globales

app.listen(PORT, async (err) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
    try {
        // Conexión a MongoDB
        await mongo.conectarDB();
    } catch (dbError) {
        console.error(dbError.message);
        process.exit(1);
    }
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
});