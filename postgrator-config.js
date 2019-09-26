require('dotenv').config();

module.exports = {
    "migrationDirectory": "migrations",
    "driver": "pg",
    "connectionString": (process.env.NODE_ENV === 'development')
        ? process.env.TEST_DB_URL
        : process.env.DB_URL,
    "ssl": !!process.env.SSL,
}