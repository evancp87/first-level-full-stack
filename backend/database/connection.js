const mysql = require("mysql");

const connection = mysql.createConnection({
  // user: "root",
  // password: "",
  // host: "localhost",
  // port: 3306,
  // database: "games-db",
  user: "sql8640488",
  password: "QetzYuTDvf",
  host: "sql8.freemysqlhosting.net",
  port: 3306,
  database: "sql8640488",
});

function asyncMySQL(query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results);
    });
  });
}

module.exports = asyncMySQL;
