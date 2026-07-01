const http = require("http");
const express = require('express');
const { Server } = require("socket.io");
const { setIO } = require("./sockets/socket");
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST","PATCH","DELETE"]

  }
  
});
setIO(io);
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes=require('./routes/notificationRoutes');

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use("/api/notifications", notificationRoutes);
app.get('/', (req, res) => {
  res.send("server is running...");
}); 

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  io.on("connection",(socket)=>{
    console.log("A user connected :",socket.id);
    socket.on ("disconnect",()=>{
      console.log("user disconnected :",socket.id);
    });
    socket.on("join_room", (userId) => {

    socket.join(`user_${userId}`);

    console.log(`User ${userId} joined room user_${userId}`);

});
  });
}  );


