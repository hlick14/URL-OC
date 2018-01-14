
var WebSocketServer = require('../').Server;
var express = require('express');
var path = require('path');
var app = express();
var https = require('https');
var request = require('request');
// var mysql = require('mysql');
var session = require('express-session');

var cookieParser = require('cookie-parser');
var MemoryStore = require('memorystore')(session);
var store = new MemoryStore();
var PythonShell = require('python-shell');
var fs = require('fs');
var tesseract = require('node-tesseract');





// Stores currently connected users
var UsersArray = [];

// Stores user from pixel tracking
var pixelUserEvents = [];

// Stores websocket connection of each user
var lookup = {};


//SERVER INTERNAL DATABASE FUNCTIONS
//1. Create connection
//2. Insert row
//3. Query row
//4. Delete row

// var con = mysql.createConnection({
//   host: "178.62.231.46",
//   port: "3306",
//   user: "root",
//   password: "mobiledev93",
//   database: "pixel",
//   socketPath:'/run/mysqld/mysqld.sock'



// });
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

//User events db calls
//insert to db
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");

  // var sql = "INSERT INTO usersEvents (duuid, event,eventExectuted) VALUES ('0750ba4c-765e-41ab-b0cb-173be107e9c4', 'Registration',1)";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("1 record inserted");
  // });
// });
//end insert to db
//Query db
// con.connect(function(err) {
//   if (err) throw err;
//   con.query("SELECT * FROM usersEvents", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });
//end query db

//Delete record
// con.connect(function(err) {
//   if (err) throw err;
  // var sql = "DELETE FROM usersEvents WHERE duuid = '5ccb378c-7e09-4bc9-a367-fb64066a21bf'";
  // var sql = "DELETE FROM usersEvents ";//To Delete all records

  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Number of records deleted: " + result.affectedRows);
  // });
// });
//End delete record 


// Alter table to add 
//

// var sql = "ALTER TABLE `usersEvents` ADD UNIQUE `unique_index`(`duuid`, `event`)";//Unique constraint
//   // var sql = "ALTER TABLE usersEvents ADD  PRIMARY KEY(duuid,event);"

//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table Altered " + result);
//   });

//End alter table
//End user Events db calls

//user db calls

//insert to db
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");

//   var sql = "INSERT INTO users (id, duuid,userSessionID) VALUES ('randNum', '3ccb378c-7e09-4bc9-a367-fb64066a21bf',userSessionID)";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
//   });
// });
//end insert to db

//Query db
// con.connect(function(err) {
//   if (err) throw err;
//   con.query("SELECT * FROM users", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });
//end query db

//Delete record
// con.connect(function(err) {
//   if (err) throw err;
//TODO WRITE PING PONG METHODS TO DELETE USERS WHEN DISCONNECTED
// var sql = "DELETE FROM users ";
// con.query(sql, function (err, result) {
//   if (err)  {throw err;}
//   else {
//   console.log("Number of records deleted: " + result.affectedRows);
//   lookup = {};
// }
// });
// });
// });
//End delete record 


//end user db calls

// END OF SERVER INTERNAL DATABASE FUNCTIONS


//websocket server




var app = express()

app.use(session({ store: store, secret: '123456', key: 'sid',saveUninitialized: true,resave: true }));
app.use(express.static(path.join(__dirname, '/public')));

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(3000, () => console.log('Example app listening on port 3000!'))


const http = require('http');
const url = require('url');
const WebSocket = require('ws');


app.use(function (req, res) {
  res.send({ msg: "hello" });
});
//Check if connectio is alive
function heartbeat() {
  this.isAlive = true;
  console.log("ID is  " + this.id);
}

//End Connection live check
const server = http.createServer(app);
const wss = new WebSocket.Server({ server,clientTracking: true });

//Look up stores user id 
var id = 0;

//////////////////////////////////////////////////////////////////////
  console.log("step 1 creating the connection ");
//////////////////////////////////////////////////////////////////////

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
    ws.isAlive = true;
  ws.on('pong', heartbeat);

//////////////////////////////////////////////////////////////////////
  console.log("step 2  adding to lookup object");
//////////////////////////////////////////////////////////////////////

  ws.id = id++;
   //adding websocket connection to look up object array with id of the socket
   lookup[ws.id] = ws;
   ws.on('message', function incoming(message) {
    // console.log('received: %s', message);

    fs.writeFile("OCR1/out.txt", message, function(err) {
    if(err) {
        return console.log(err);
    }
    else { 

    console.log("The file was saved! RUNNING SCRIPT");
    PythonShell.run('OCR1/ocr_2.py', function (err,result) {
        if (err) {
          console.log(err)
      
        }
        else {
          var options = {
                          l: 'eng',
                          // psm: 6,
                          // binary: '/OCR1/testdata'
                        };
         
            tesseract.process(__dirname + '/OCR1/script_img2.png', options, function(err, text) {
            if(err) {
              console.error("ERR"+err);
            } else {
              console.log(result);
              console.log("text is " + text);
              ws.send(text);
            }
          });
             }

      });
   


}

}); 

    
//////////////////////////////////////////////////////////////////////
   console.log("step 3 adding new user on connection to the socket  " );
//////////////////////////////////////////////////////////////////////
  // var sql = "INSERT INTO users (duuid,userSessionID) VALUES ('"+message+"','"+ (Object.keys(lookup).length)+"')";
  if(message == "pong") {   }
else {
  ws.duuid = message;
console.log("got message");
     // pyshell.send(ws.duuid);



//       pyshell.on('message', function (message) {
//   // received a message sent from the Python script (a simple "print" statement)
//   console.log("Returned url is " + message);
// });

// // end the input stream and allow the process to exit
// pyshell.end(function (err) {
//   if (err) throw err;
//   console.log('finished');
// });
// var lovelyBase = ""






// var options = {
//   mode: 'json',
//   args: message
// };

// PythonShell.run('ocr_2', options, function (err, results) {
//   if (err) throw err;
//   // results is an array consisting of messages collected during execution
//   console.log('results: %j', results);
// });


}


//////////////////////////////////////////////////////////////////////
   console.log("step 4 querying the result from  user table ");
//////////////////////////////////////////////////////////////////////


  });// End On message
   //Todo 
   //On close remove this user from lookup table and db table
//Closing connection
ws.on('close', function close() {
  console.log('disconnected' + this.id);
  // var sql = "DELETE FROM users where userSessionID ="+this.id+"";
  // con.query(sql, function (err, result) {
  //       if (err)  {throw err;}
  //       else {
  //       console.log("Number of records deleted: " + result.affectedRows);
  //       lookup = {};
  //     }
  //     });
  //   });
//
});

}); // Websocket server
///////////////////////////////////////////////////
console.log("Step 5 Query Pixel Data and insert into table");
//////////////////////////////////////////////////

//todo
//1. Get current date and time
//2. Go back 30 minutes and store in var
//3. Pass the var into the url
// var requestLoop = setInterval(function(){
//   var currentdate = new Date(); 


// var datetime = "Last Sync: " + currentdate.getDate() + "/"
//                 + (currentdate.getMonth())  + "/" 
//                 + currentdate.getFullYear() + " @ "  
//                 + currentdate.getHours() + ":"  
//                 + currentdate.getMinutes() + ":" 
//                 + currentdate.getSeconds();
//                 console.log("Current date " + currentdate.getFullYear()+"-"+(currentdate.getMonth()+1)+"-"+(currentdate.getDate()-1));
//   request({
//       url: "http://yogitrack.azurewebsites.net/jetpixel/getevents.php?startdate="+currentdate.getFullYear()+"-"+(currentdate.getMonth()+1)+"-"+(currentdate.getDate()-1)+"%2020:00",
//       method: "GET",
//       timeout: 10000,
//       followRedirect: true,
//       maxRedirects: 10
//   },function(error, response, body){
//       if(!error && response.statusCode == 200){
//           console.log('Pixel sucess!');
//         var json =  JSON.parse(body);

//         var string2=JSON.stringify(json);
//         var jsonobj =  JSON.parse(string2);


//         for(var i =0; i < jsonobj.length; i++){

//         var sql4 = "INSERT IGNORE  INTO usersEvents (duuid, event,eventExectuted) VALUES ('"+jsonobj[i].DeviceId+"', '"+jsonobj[i].Event+"',0)";
//         con.query(sql4, function (err, result) {
//         if (err) { 
//         console.log('error' + err);

//         throw err;
//           }else{
//                     // console.log("Success");// 

//           }
//       });
//       }
//     }
//   });
// }, 30000);


///////////////////////////////////////////////////
console.log("step 6 sending message to a user");

///////////////////////////////////////////////////
// 30 sec req to db
// var userQueryOnTime = setInterval(function(){

//   con.query("SELECT * FROM usersEvents", function (err, result, fields) {
//     if (err) {
//       console.log(err);
//       throw err;
//     }

//     else {
//       pixelUserEvents = [];
//       if (result.length >0) {
//         var string=JSON.stringify(result);
//         var json =  JSON.parse(string);

//         for(var i =0; i< json.length; i++){
//       // console.log('>> pixel user.duuid: ', json[i].duuid);

//       pixelUserEvents.push(json[i]);

//                      }
//                  }
//             }
//         });
// }, 15000);

//Loop Through all connected users and check if any of them are on the list of pixel events. Temp user is a duuid

// var completeEvent = setInterval(function(){
//   wss.clients.forEach(function each(ws) {
// // for (var z =0; z< UsersArray.length;z++){

//   //Check if temp user is on the list - loop  through pixel users duuids 
//   for(var y=0; y <pixelUserEvents.length;y++) {

//     console.log("DUUID IS" + ws.duuid);
//       if(ws.duuid ==pixelUserEvents[y].duuid  ) {
//         if(pixelUserEvents[y].eventExectuted == 0) {


//         lookup[ws.id].send("your event  is " + pixelUserEvents[y].event);
//         pixelUserEvents[y].eventExectuted= 1;
//   //         con.connect(function(err) {
//   // if (err) throw err;
//         var sql = "UPDATE usersEvents SET eventExectuted = '1' WHERE duuid = '"+
//         pixelUserEvents[y].duuid+"'and event ='"+pixelUserEvents[y].event+"'";
//         con.query(sql, function (err, result) {
//           if (err) throw err;
//           console.log(result.affectedRows + " record(s) updated");
//            });
// // });

//           }//end if event is 0
//            }//end if duuid match
//           } //

//       });


// }, 30000); 

//Check if connections are alive - if not terminate
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) { 
      console.log("id is " + ws.id);
      // ws.
      ws.id = id--;

      // var sql = "DELETE FROM users where userSessionID ="+ws.id+"";

      // con.query(sql, function (err, result) {
      //   if (err)  {throw err;}
      //   else {
      //   console.log("Number of records deleted: " + result.affectedRows);
        lookup = [];
      // }
      // });
      return ws.terminate();

}
else {
    ws.isAlive = false;
    ws.ping('', false, true);
  }
  });
}, 10000);

//End check of current connections



///////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
// var requestLoop = setInterval(function(){
//  var sql = "DELETE FROM usersEvents WHERE eventExectuted = 1";
//   con.query(sql, function (err, result) {
//     if (err) { throw err;
//     }
//     else {
//     console.log("Number of records deleted: " + result.affectedRows);
//       }
//   });


// }, 20000);


server.listen(6060||process.env.PORT, function listening() {
  console.log('Listening on %d', server.address().port);
});



// //end web socket methods

   //Cron Jobs
// var CronJob = require('cron').CronJob;
// var job = new CronJob('00 00 16 * * 1-7', function() {
//   console.log("step 7 Clear records already exectuted - Done with cron ");

//  var sql = "DELETE FROM usersEvents WHERE eventExectuted = 1";
//   con.query(sql, function (err, result) {
//     if (err) { throw err;
//     }
//     else {
//     console.log("Number of records deleted: " + result.affectedRows);
//       }
//   });

//   }, function () {
//     /* This function is executed when the job stops */
//     //Todo call php with duuid and events executed
//   },
//   true, 
//   'Europe/London' 
// );

//end cron jobs
//