"use strict"

import pg from "pg"
const Pool = pg.Pool
var pool = new Pool()

/**
 * Try to recconnect on db error
 */
pool.on("error", async (err, _) => {
  console.error("Unexpected error on db client", err)
})

export const DAO = {
  async query(sql, values) {
    if (pool === undefined) return undefined
    return await pool.query(sql, values)
  },

  async reconnect() {
    try {
      await pool.end()
    } catch (err) {
      console.log("Can't recconect to db: " + err)
      this.reconnect()
      return
    }
    pool = undefined
    setTimeout(() => (pool = new pg.Pool()), 1000)
  }
}

export default DAO
