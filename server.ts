import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import path from "node:path";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  connectionStateRecovery: {},
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

const port = 3001;

io.on("connection", function (socket) {
  socket.on("send-location", function (data) {
    io.emit("recieve-location", { id: socket.id, ...data });
  });
  socket.on("disconnect", function () {
    io.emit("user-disconneted", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
