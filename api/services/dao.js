'use strict'

const DEFAULT_SCHEMA = process.env.DEFAULT_SCHEMA || "mydb"

const { Pool } = require('pg')
var pool = new Pool()

/**
 * Shutdown server on db error
 */
pool.on('error', async (err, client) => {
  console.error('Unexpected error on db client', err)
  await pool.end()
  pool = undefined
  setTimeout(() => pool = new Pool(), 1000)
})

class DAO {

  static async test() {
    let res = await pool
      .query(`SELECT * FROM ${DEFAULT_SCHEMA}.customers WHERE email = $1`, ["johnsmith@example.com"])
    console.log('customer:', res.rows[0])
  }

  static get pool() {
    return pool
  }

  static async query(sql, values) {
    if (pool === undefined) return undefined
    return await pool.query(sql, values)
  }
}

module.exports = DAO
