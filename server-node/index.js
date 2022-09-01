const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const { ExpressPeerServer } = require("peer");
const cors = require("cors");
// var Turn = require('node-turn');

const port = process.env.PORT || 5000;

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use(cors());

app.use(express.static(path.join(__dirname, "dist_client")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "dist_client", "index.html"));
});

// turn server
// var turn_server = new Turn({ 
//   authMech: 'none', 
// });

app.use("/peerjs", peerServer);

server.listen(port, () => {
//   console.log(`server started on ${port}`);
});

peerServer.on("connection", (client) => {
//   console.log("client connected");
});
peerServer.on("disconnect", (client) => {
//   console.log("client disconnected");
});
