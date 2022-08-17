const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.envs/.env.${ENV}`, //was here anyway
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

// if (!process.env.PGDATABASE) {
//   throw new Error("PGDATABASE not set"); // was here anyway
// }

module.exports = new Pool(config); // was here anyway wihout config added
