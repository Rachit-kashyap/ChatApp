const express = require('express');
const path = require('path');
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const db = require("./config/databaseSetUp");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const singleChat = require("./routes/socket-io");
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000
app.use(cookieParser());



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", [
    path.join(__dirname, "views/User"),
    path.join(__dirname, "views/authPages")
]);

app.use("/api/auth", authRoutes);
app.use("/user", userRoutes); 

singleChat(io); 

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = io;
