
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "178.62.231.46",
  port: "3306",
  user: "root",
  password: "mobiledev93",
     database: "pixel",
       socketPath:'/run/mysqld/mysqld.sock'

  //todo create config file to read these values from

});

con.connect(function(err) {
  // if (err) throw err;
  console.log("Connected!");
     var table2Sql = "CREATE TABLE users ( duuid VARCHAR(255),userSessionID VARCHAR(255))";

  // var table1Sql = "CREATE TABLE usersEvents (duuid VARCHAR(255), event VARCHAR(255),eventExectuted TINYINT (1))";
  con.query(table2Sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  // });

  //  var table2Sql = "CREATE TABLE users ( duuid VARCHAR(255),userSessionID VARCHAR(255))";
  // con.query(table2Sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table created");
  });
});