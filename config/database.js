// ⚠️  DEMO FILE — intentional secrets for JFrog Secret Detection demo

module.exports = {
  production: {
    host: 'prod-db.internal.company.com',
    port: 5432,
    database: 'app_production',
    username: 'admin',
    password: 'Pr0d$uperSecretDB!2024',         // ⚠️  hardcoded DB password
    ssl: true
  },
  staging: {
    host: 'staging-db.internal.company.com',
    port: 5432,
    database: 'app_staging',
    username: 'staging_user',
    password: 'St@gingP@ss9876',                // ⚠️  hardcoded DB password
    ssl: false
  },
  redis: {
    host: 'redis.internal.company.com',
    port: 6379,
    password: 'RedisAuth!Token#2024'             // ⚠️  hardcoded Redis auth
  },
  mongo: {
    uri: 'mongodb+srv://admin:Mongo$ecret123@cluster0.abc123.mongodb.net/app'  // ⚠️  connection string with creds
  }
};
