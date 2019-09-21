const {Pool} = require('pg')

const pool = new Pool({
  database: 'adc_hapi',
  host: '127.0.0.1',
  user: 'postgres',
  password: '123456',
  max: 10,
  connectionTimeoutMillis: 2000
})

module.exports = pool
