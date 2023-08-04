const mysql = require("mysql");

const connection = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  port: 3306,
  database: "games-db",
});

function asyncMySQL(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results);
    });
  });
}

module.exports = asyncMySQL;
