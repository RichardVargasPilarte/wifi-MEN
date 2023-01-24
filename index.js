const express = require('express'); // import express
const path = require('path');
const morgan = require('morgan');

require('dotenv').config();

const cors = require('cors');

const { dbConnection } = require('./database/config'); // import dbConnection from config.js

// Crear server de express
const app = express(); // create an instance of express

// Configuración de morgan
app.use(morgan('dev'));

// Configuración de CORS
app.use(cors()); // enable cors

// Lectura y parseo del body
app.use(express.json()); // enable json

// Base de datos
dbConnection(); // connect to database

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

app.listen(process.env.PORT, () => {
    console.log('listening on port: ' + process.env.PORT);    // listen process.env.PORT
});