const { Pool } = require('pg')

module.exports = new Pool({
    user: 'joao',
    password: 'classesdb',
    host: 'localhost',
    port: 5432,
    database: 'launchstoredb'
})