"use strict";

const serverPort = 5000,
  http = require("http"),
  express = require("express"),
  app = express(),
  server = http.createServer(app),
  WebSocket = require("ws"),
  websocketServer = new WebSocket.Server({ server });

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) =>
  res.sendFile(__dirname + "/public/index.html")
);

//when a websocket connection is established
websocketServer.on("connection", (webSocketClient) => {
  //send feedback to the incoming connection
  webSocketClient.send('{ "connection" : "ok"}');

  //when a message is received
  webSocketClient.on("message", (message) => {
    websocketServer.clients.forEach((client) => {
      client.send(`{ "message" : ${message} }`);
    });
  });
});

//start the web server
server.listen(serverPort, () => {
  console.log(`Websocket server started on port ` + serverPort);
});
