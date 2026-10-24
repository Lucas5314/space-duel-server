const { Pool } = require("pg");

const useSSL = process.env.DB_SSL === "true";

const db = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: useSSL
        ? {
            rejectUnauthorized: false
        }
        : false
});

db.connect()
    .then(() => {
        console.log("✅ PostgreSQL conectado correctamente");
    })
    .catch((err) => {
        console.error("❌ Error conectando a PostgreSQL");
        console.error(err);
    });

module.exports = db;