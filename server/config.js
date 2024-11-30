require("dotenv").config();

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV;
const database = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpire = process.env.JWT_EXPIRE;

const config = {
  port,
  env,
  database,
  jwtSecret,
  jwtExpire,
};

module.exports = config;
