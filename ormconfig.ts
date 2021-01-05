module.exports = {
  type: 'mysql',
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: 'comp-art',
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  cli: {
    migrationsDir: './src/database/migrations',
  },
};
