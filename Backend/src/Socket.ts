import { Server } from "socket.io";
import { VerifyToken } from "./Helpers/verifyToken";
import { formatDateTimeToIST } from "./Helpers/TimeCovert";
import { MessageSaved } from "./Helpers/MessageSave";
import { User } from "./Entities/userEntity";
import moment from "moment";
export const socket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  let userId: string | null = null;
  const onlineUsers:any={}
  io.on("connection", (socket) => {
    console.log("socket connected");

    socket.on("Auth", async (token: any) => {
      try {
        const user = await VerifyToken(token);
        userId = user.user._id;
        socket.emit("Authenticated", user)
        onlineUsers[user.user._id] = 'online'
        io.emit('userOnline', { userId:user.user._id, status:'online'})
        
      } catch (error) {

      }
    });


    socket.on("JoinRoom", (room: any) => {
      socket.join(room);
    });

    socket.on("Message", async ({ type, content, room, sender, receiver }) => {
      const dateString = new Date().toISOString();
      const date = formatDateTimeToIST(dateString);
      const data = {
        sender,
        receiver,
        message: content,
        Time: date,
        type: type,
      };
      const response = await MessageSaved(data);
      const message = {
        sender: sender._id,
        receiver: receiver._id,
        message: content, 
        Time: date,
        type: type
      };
      io.to(room).emit("Message", message);
    });
    socket.on('typing', (data) => {
      console.log(data,'tyupinggg')
      console.log(data.room)
      socket.to(data.room).emit('typing', data);
    });
  
    socket.on('stopTyping', (data) => {
      socket.to(data.room).emit('stopTyping', data);
    });

    // socket.on('disconnect', () => {
    //   if (userId) {     
    //     const dateString = new Date().toISOString();
    //   const date = formatDateTimeToIST(dateString);
    //     io.emit('userOffline',{
    //       userId,
    //       time: date
    //     })
    //     delete onlineUsers[userId]
    //   }
    //   console.log('User disconnected');
    // });

  });
};
