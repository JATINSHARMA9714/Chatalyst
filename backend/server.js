import 'dotenv/config';

import http from 'http';

import app from './app.js';

import {Server} from 'socket.io';

import jwt from 'jsonwebtoken';

import mongoose from 'mongoose';

import projectModel from './models/projectModel.js';

import { generateResult } from './services/aiService.js';

const server = http.createServer(app);
//socket.io
const io = new Server(server,{
  cors:{
    origin: '*'
  }
});

const port = process.env.PORT || 3000;



//check if valid user is connecting to socket.io using middleware
io.use(async(socket, next) => {
  try {

    
    const token = socket.handshake.auth?.token || socket.handshake.headers['token'];
    const projectId = socket.handshake.query.projectId; // Get the projectId from the query parameters
    
    
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error('Invalid project ID'));
    }

    socket.project = await projectModel.findById(projectId); // Attach the projectId to the socket object


    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET);

    //if the token is decoded successfully, it means the user is valid

    if (!decode) {
      return next(new Error('Authentication error'));
    }
    

    socket.user = decode; // Attach the decoded user to the socket object
    next();



  } catch (error) {
    next(error);
  }
});





// check connection
io.on('connection', socket => {


  socket.roomId = socket.project._id.toString();;

  //when a user connects using socket io, this callback is executed
  console.log('a user connected');

  

  socket.join(socket.roomId); 


  socket.on('project-message',async data=>{

    const message = data.message;

    const aiIsPresentInMessage = message.includes('@ai')

    socket.broadcast.to(socket.roomId).emit('project-message',data); // Emit the message to all users in the project room

    if(aiIsPresentInMessage){
      
      const prompt = message.replace('@ai', '').trim();

      const result = await generateResult(prompt);


      io.to(socket.roomId).emit('project-message',{
        message: JSON.stringify(result),
        sender: {
          _id: "ai",
          email: 'AI'
        }
      })

    }
  
    

  })
  

  socket.on('disconnect', () => { 
    console.log('user disconnected');
    socket.leave(socket.roomId); // Leave the room when the user disconnects
  });

  
});




server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})