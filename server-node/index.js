/**
 * Socket.io chat server
 */
const app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});
const port = 3001;
var users = [];

app.get("/", function (req, res) {
  res.json({ message: "Hello World!" });
});

io.on("connection", function (socket) {
  socket.on("send nickname", function (name) {
    let found = users.find((e) => e.socketId === socket.id);
    if (!found) {
      users.push({ socketId: socket.id, name: name });
    }
  });

  socket.on("chat message", function (msg) {
    if (msg.trim() !== "") {
      let sender = users.find((e) => e.socketId === socket.id);
      let name = sender?.name ? sender.name : socket.id;
      let resp = { msg: msg, sender: socket.id, name: name };
      //       console.log(resp)
      //       console.log("users", users)
      //       console.log("sender", sender)
      io.emit("chat message", resp);
    }
  });
});

http.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
