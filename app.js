#!/usr/bin/env node

/**
 * Module dependencies.
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var websocket = require("ws");

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 204 is no-content, so we don't send a favicon
app.get('/favicon.ico', (req, res) => res.status(204).send());
// Every route thing below logger will be logged, so favicon and /public/* won't be logged
app.use(logger('dev'));
app.use('/', indexRouter);
var gameStatistics = require("./statisticsTracker");

/* GET home page. */
app.get('/', function(req, res) {
    res.render('splash', { totalGames: gameStatistics.gamesPlayed, peopleIngame: gameStatistics.peopleInGame, blueWins: gameStatistics.blueWins, redWins: gameStatistics.redWins });
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var debug = require('debug')('reversi:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

// eslint-disable-next-line no-undef
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

var messages = require("./public/javascripts/messages");

//--------------------vvvvv   WEBSOCKET    vvvv---------------------

const wss = new websocket.Server({ server });

var websockets = {}; //property: websocket, value: game
var connectionID = 0;
var waitingPlayer = -1;
var Match = require('./match.js');
var matches = {};
var matchCnt = 0;

wss.on('connection', function connection(ws) {
    let con = ws;
    con.id = connectionID++;
    websockets[con.id] = con;

    if (waitingPlayer === -1) {
        waitingPlayer = con;
    }else {
        let match = new Match(waitingPlayer, con);
        waitingPlayer.partner = con.id;
        waitingPlayer.match = matchCnt;
        con.partner = waitingPlayer.id;
        con.match = matchCnt;
        matches[matchCnt++] = match;
        gameStatistics.peopleInGame += 2;

        waitingPlayer.send(messages.player1);
        con.send(messages.player2);
        waitingPlayer = -1;
    }

    con.on('message', function incoming(message) {
        console.log('Message received: %s \nfrom: %s', message, con.id);
        if (!isNaN(message)){  // is just a number -> is a turn
            websockets[con.partner].send(message);
        } else if (message === 'Lost1') {
            matches[con.match].result = 2;
            gameStatistics.gamesPlayed++;
            gameStatistics.redWins++;
        } else if (message === 'Lost2') {
            matches[con.match].result = 1;
            gameStatistics.gamesPlayed++;
            gameStatistics.blueWins++;
        } else {
            console.log('unknown message');
        }
    });

    con.on('close', function closing(message) {
        if (con.id === waitingPlayer.id){
            waitingPlayer = -1;
        }else {
            gameStatistics.peopleInGame--;
        }
        console.log('Closed: %s', message);
    });
});

/*
 * regularly clean up the websockets object
 */
setInterval(function() {
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        delete websockets[i];
      }
    }
  }
}, 50000);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      // eslint-disable-next-line no-undef
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      // eslint-disable-next-line no-undef
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
