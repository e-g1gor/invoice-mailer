"use strict";

const DEFAULT_SCHEMA = process.env.DEFAULT_SCHEMA || "mydb";

const { Pool } = require("pg");
var pool = new Pool();

/**
 * Try to recconnect on db error
 */
pool.on("error", async (err, client) => {
  console.error("Unexpected error on db client", err);
});

const DAO = {
  async query(sql, values) {
    if (pool === undefined) return undefined;
    return await pool.query(sql, values);
  },

  async reconnect() {
    try {
      await pool.end();
    } catch (err) {
      console.log("Can't recconect to db: " + err);
      this.reconnect();
      return;
    }
    pool = undefined;
    setTimeout(() => (pool = new Pool()), 1000);
  },
};

module.exports = DAO;
