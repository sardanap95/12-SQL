const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "sagar8856",
  database: "emp_tracker",
});
connection.connect(function (err) {
  if (err) {
    console.log("Failed to connect to database.");
  } else {
    console.log("Connected to database.");
  }
});

module.exports.connection = connection;
