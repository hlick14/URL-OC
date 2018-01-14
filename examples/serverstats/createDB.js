var mysql = require('mysql');

var con = mysql.createConnection({
  host: "178.62.231.46",
  port: "3306",
  user: "root",
  password: "mobiledev93",
  socketPath:'/run/mysqld/mysqld.sock'

});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE pixel", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});