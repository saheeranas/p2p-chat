const app = require("express")();
const server = require("http").createServer(app);
const { ExpressPeerServer } = require("peer");
const cors = require("cors");

const port = process.env.PORT || 5000;

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use(cors());

app.use("/peerjs", peerServer);

server.listen(port, () => {
  console.log(`server started on ${port}`);
});

peerServer.on("connection", (client) => {
  console.log("client connected");
});
peerServer.on("disconnect", (client) => {
  console.log("client disconnected");
});
