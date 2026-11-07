const { Pool } = require("pg");

const useSSL = process.env.DB_SSL === "true";

const dbUrl = new URL(process.env.DATABASE_URL);

console.log("DATABASE HOST:", dbUrl.hostname);
console.log("DATABASE USER:", decodeURIComponent(dbUrl.username));
console.log("DATABASE PORT:", dbUrl.port);

const db = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: useSSL
        ? {
            rejectUnauthorized: false
        }
        : false
});

db.connect()
    .then((client) => {
        console.log("✅ PostgreSQL conectado correctamente");
        client.release();
    })
    .catch((err) => {
        console.error("❌ Error conectando a PostgreSQL:", err.message);
    });

module.exports = db;