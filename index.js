// Imports
const { router } = require('./routes')
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const { tryDatabaseConnection } = require('./database/connection');
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(router);

(tryDatabaseConnection)();

app.listen(PORT, () => {
  console.log(`Projeto integrador funcionando e ouvindo na porta ${PORT}`)
});
