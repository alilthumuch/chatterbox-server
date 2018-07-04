/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
//var data = {results: ['{"username":"Jono","text":"Do my bidding!"}']};
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var data = {
  results: [
    {
      username: 'bob',
      text: 'hi frank',
      roomname: 'the interwebs',
      createdAt: '2018-07-02T18:32:45.273Z',
      updatedAt: '2018-07-02T18:32:45.273Z',
      objectId: 1,
    },
    // {
    //   username: 'frank',
    //   text: 'hi bob',
    //   roomname: 'the interwebs',
    //   createdAt: '2018-06-02T18:32:45.273Z',
    //   updatedAt: '2018-06-02T18:32:45.273Z'
    // },
    // {
    //   username: 'joe',
    //   text: 'hi joe',
    //   roomname: 'the interwebs',
    //   createdAt: '2018-05-02T18:32:45.273Z',
    //   updatedAt: '2018-05-02T18:32:45.273Z'
    // }
  ]
};
var requestHandler = function(request, response) {
  const fs = require('fs');
  var headers = defaultCorsHeaders;
  if (request.method === 'GET' && (request.url === '/' || request.url.includes('username'))) {
    fs.readFile('./client/index.html', 'utf8', (err, data) => {
      console.log(data, 'DATAAAAAAAAAAAAAAAAAAAAAAA');

      if (err) {
        return console.log(err);
      } else {
        headers['Content-Type'] = 'text/html';
      
        response.writeHead(200, headers);
        response.write(data);
      }
      response.end();
    });
  }

  if (request.method === 'GET' && (request.url === '/styles/styles.css')) {
    fs.readFile('./client/styles/styles.css', 'utf8', (err, data) => {
      console.log(data, 'DATAAAAAAAAAAAAAAAAAAAAAAA');
      if (err) {
        return console.log(err);
      } else {
        headers['Content-Type'] = 'text/css';
      
        response.writeHead(200, headers);
        response.write(data);
      }
      response.end();
    });
  }

  if (request.method === 'GET' && (request.url === '/bower_components/jquery/dist/jquery.js')) {
    fs.readFile('./client/bower_components/jquery/dist/jquery.js', 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      } else {
        headers['Content-Type'] = 'application/json';
      
        response.writeHead(200, headers);
        response.write(data);
      }
      response.end();
    });
  }

  if (request.method === 'GET' && (request.url === '/scripts/app.js')) {
    fs.readFile('./client/scripts/app.js', 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      } else {
        headers['Content-Type'] = 'application/json';
      
        response.writeHead(200, headers);
        response.write(data);
      }
      response.end();
    });
  }

  if (request.method === 'GET' && (request.url === '/images/spiffygif_46x46.gif')) {
    fs.readFile('./client/images/spiffygif_46x46.gif', 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      } else {
        headers['Content-Type'] = 'image';
      
        response.writeHead(200, headers);
        response.write(data);
      }
      response.end();
    });
  }
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
 
 
  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  //console.log(request.url.includes('/classes/messages'));
  // The outgoing status.
  // var statusCode = 200;
  // console.log(request , "Request=====================")
  if (request.url.includes('/classes/messages')) {
    if (request.method === 'GET') {
      response.writeHead(200, headers);
      response.end(JSON.stringify(data));
    } else if (request.method === 'POST') {
      let msg = '';
      request.on('data', function (chunk) {
        console.log(data, 'DATA======');
        msg += chunk;
      });
      request.on('end', function() {
        msg = JSON.parse(msg);
        console.log(msg, 'MESSAGE=============');
        msg.objectId = data.results.length;
        data.results.push(msg);
        console.log(data, 'DATA===============');
        response.writeHead(201, headers);
        response.end(JSON.stringify(data));
      });
   
    } else if (request.method === 'OPTIONS') {
      response.writeHead(200, headers);
      response.end(JSON.stringify(data));
    } else {
      response.writeHead(404, headers);
      response.end();
    }
  } //else {
  //   response.writeHead(404, headers);
  //   response.end();
  // }

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //response.end('Hello, World!');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


exports.requestHandler = requestHandler;
//exports.defaultCorsHeaders = defaultCorsHeaders;
