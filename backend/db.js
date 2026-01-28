const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "diemdanh",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = db;
