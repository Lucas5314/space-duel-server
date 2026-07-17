const { Pool } = require("pg");

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
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