
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
const tesseract = require('node-tesseract');


var port = process.env.PORT || 8000;

var appDir = path.dirname(require.main.filename);

// Stores currently connected users  
var UsersArray = [];

// Stores user from pixel tracking
var pixelUserEvents = [];

// Stores websocket connection of each user
var lookup = {};

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
    var path = process.cwd();
    console.log('/../../' + __dirname );
        console.log( '/../../tmp'+ __dirname );

    fs.writeFile("tmp/../../out.txt", message, function(err) {
    if(err) {
        return console.log(err +"directoryis " +__dirname + '/../../');
    }
    else { 

    console.log("The file was saved! RUNNING SCRIPT");
    PythonShell.run('OCR1/ocr_2.py', function (err,result) {
        if (err) {
          console.log(err)
      
        }
        else {
          var options = {
                          l: 'eng'
                          // psm: 6,
                          // binary: 'OCR1/testdata'
                        };
         
            tesseract.process('tmp/script_img2.png', options, function(err, text) {
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

//
});

}); // Websocket server
///////////////////////////////////////////////////
console.log("Step 5 Query Pixel Data and insert into table");
//////////////////////////////////////////////////


///////////////////////////////////////////////////
console.log("step 6 sending message to a user");


//Check if connections are alive - if not terminate
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) { 
      console.log("id is " + ws.id);
      // ws.
      ws.id = id--;

     
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




server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});

