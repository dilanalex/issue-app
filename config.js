module.exports = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET || 'my-strong-jwt-secret', //lets replace this with a strong secret
  jwtExpiration: process.env.JWT_EXPIRATION || '1h', // 1 hour expiration ??
  jwtAlgorithm: process.env.JWT_ALGORITHM || 'HS256', // HMAC SHA256
  mysql: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  }
};
