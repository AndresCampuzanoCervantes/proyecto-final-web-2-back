const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  dev: process.env.NODE_ENV !== "production",
  port: process.env.PORT,
  cors: process.env.CORS,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  dbDialect: process.env.DB_DIALECT,
};

module.exports = { config };
