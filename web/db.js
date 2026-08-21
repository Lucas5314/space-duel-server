// ===========================
// CONEXIÓN A POSTGRESQL
// ===========================

const { Pool } = require("pg");


// Crear conexión

const db = new Pool({

    host: "localhost",

    port: 5432,

    database: "spacetip",

    user: "postgres",

    password: "postgres"

});


// Verificar conexión

db.connect()

.then(() => {

    console.log("✅ PostgreSQL conectado correctamente");

})

.catch((err) => {

    console.error("❌ Error conectando a PostgreSQL");

    console.error(err);

});


// Exportar conexión

module.exports = db;