const Pool = require("pg").Pool;
require("dotenv").config();

// Support both PG* (Neon) and DB_* naming conventions
const pool = new Pool({
  user: process.env.PGUSER || process.env.DB_USER,
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
  host: process.env.PGHOST || process.env.DB_HOST,
  port: process.env.PGPORT || process.env.DB_PORT || 5432,
  database: process.env.PGDATABASE || process.env.DB_NAME,
  ssl: (process.env.PGSSLMODE === 'require' || process.env.DB_SSL === 'true') ? {
    require: true,
    rejectUnauthorized: false
  } : false,
});

module.exports = pool;