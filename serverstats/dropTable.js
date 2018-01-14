var mysql = require('mysql');

var con = mysql.createConnection({
  host: "178.62.231.46",
  port: "3306",
  user: "root",
  password: "mobiledev93",
  database: "pixel"

});

con.connect(function(err) {
  if (err) throw err;
  var sql = "DROP TABLE users";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table deleted");
  });
});