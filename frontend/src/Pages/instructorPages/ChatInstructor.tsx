import React, { useEffect, useState, useRef } from "react";
import { socket } from "../../utils/SocketClient/socketClient";
import Cookies from "js-cookie";
import Picker, { EmojiClickData } from "emoji-picker-react";
import Header from "./instHeader";
import "../../style/chat.css";
// import { useSelector } from "react-redux";
import { fetchMyStudents, fetchMessages, deleteInsturctorChat } from "../../utils/Axios/api";
import { User } from "../../utils/types";
import { useError } from "./InstErrorBoundary";
import Axios from "axios";
import { FaCamera, FaVideo } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import { useOnlineUsers } from "../../helpers/chatContext";
// interface Instructor {
//   name: string;
//   photo: string;
// }

const ChatInstructor = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<any>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null | any>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showMediaOptions, setShowMediaOptions] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference for the hidden file input
  // const { instructorInfo } = useSelector((state: any) => state.instructorAuth);
  const [sender, setSender] = useState<any>();
  // const SenderId = instructorInfo?._id;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [showMenu, setShowMenu] = useState(false);
  // const [onlineUsers, setOnlineUsers] = useState<any>({});
  const [typingStatus, setTypingStatus] = useState<any>({});
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  // const [offlineTimes, setOfflineTimes] = useState<{ [key: string]: string }>({});
  const {onlineUsers} = useOnlineUsers()
  const throwError = useError();

  const handleDeleteClick = (ChatId: string) => {
    console.log(ChatId, "Hi");
    setSelectedChatId(ChatId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedChatId(null);
  };

  const handleDeleteChat = async () => {
    if (selectedChatId) {
      try {
        console.log(selectedChatId,"selectedChatId");
        
       const response= await deleteInsturctorChat({ ChatId: selectedChatId });
       console.log(response.data,"999999");
       
        toast.success("Chat deleted ")
        setMessages((prevMessages: any[]) => prevMessages.filter((message) => 
          message._id !== selectedChatId
      ));
      } catch (error: any) {
        const message = error?.response?.data?.message;
        console.log(error, "error");
        throwError(message);
      } finally {
        handleCloseModal();
      }
    }
  };
  

  useEffect(() => {
    const Students = async () => {
      try {
        const response = await fetchMyStudents();
        if (response?.data) {
          setUsers(response?.data);
          setCurrentUser(response?.data[0]);
        }
      } catch (error: any) {
        const message = error?.response?.data?.message;
        console.log(error, "erorrorororr");
        throwError(message);
      }
    };
    Students();
  }, []);

  useEffect(() => {
    const Messages = async () => {
      try {
        const receiverId = currentUser?._id;
        if (receiverId) {
          const response = await fetchMessages({ receiverId: receiverId });
          console.log(response.data, "response.data");
          setMessages(response?.data);
        }
      } catch (error: any) {
        const message = error?.response?.data?.message;
        console.log(error, "erorrorororr");

        throwError(message);
      }
    };
    console.log(messages, "messages");
    Messages();
  }, [currentUser]);

  useEffect(() => {
    const Token = Cookies.get("InstructorAccessToken");
  
    socket.emit("Auth", Token);
  
    socket.on("Authenticated", async (user: any) => {
      setSender(user.user);
  
      // Join rooms only after setting sender
      users?.forEach((student: any) => {
        const room = `room-${student?._id}-${user.user._id}`;
        socket.emit("JoinRoom", room);
      });
      // socket.on("userOnline",(data)=>{
      //   console.log(data, "online dataaaa");
      //   setOnlineUsers((prev: any) => ({ ...prev,[data.userId]: "online"}));
      // });
  
      // socket.on("userOffline", (data)=>{
      //   setOnlineUsers((prev: any) => ({ ...prev, [data.userId]: "offline" }));
      //   setOfflineTimes((prevTimes) => ({ ...prevTimes, [data.userId]: data.time }));
      // });
    });
  
    socket.on("Message", async (message) => {
      console.log(message, " message in student");
      setMessages((prevMessages: any) => {
        const newMessage = {
          message: message.message,
          sender: message.sender === sender?._id,
          time: message.Time,
          type: message.type,
        };
        return [...(prevMessages || []), newMessage];
      });
      console.log(message, "message in instructor chat");
    });
  

  
    socket.on("typing", (data: { userId: string }) => {
      console.log("typinggggg");
      setTypingStatus((prevStatus: any) => ({
        ...prevStatus,
        [data.userId]: true,
      }));
    });
  
    socket.on("stopTyping", (data: { userId: string }) => {
      setTypingStatus((prevStatus: any) => ({
        ...prevStatus,
        [data.userId]: false,
      }));
    });
 
  
    return () => {
    
      socket.off("Auth");
      socket.off("Message");
      socket.off("userOnline");
      
    };
  }, [currentUser, socket,setMessages,users,onlineUsers]);
     console.log(onlineUsers)  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const room = `room-${currentUser?._id}-${sender?._id}`;
      socket.emit("Message", {
        type: "text",
        content: currentMessage,
        room: room,
        sender: sender,
        receiver: currentUser,
      });
      setCurrentMessage("");
    }
  };

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prev) => [...prev, event.data]);
          }
        };
        recorder.start();
        setMediaRecorder(recorder);
        setAudioStream(stream);
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      }
    }
  };

  useEffect(() => {
    if (!isRecording && audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
      handleFileUpload(audioBlob, "audio");
      setAudioChunks([]);
    }
  }, [isRecording, audioChunks]);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement> | Blob,
    type: string
  ) => {
    let file: File | Blob | undefined;

    if (event instanceof Blob) {
      file = event;
    } else {
      file = event.target.files?.[0];
    }
    if (file) {
      console.log(file, "filefile");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ADHYAYA");

      Axios.post("https://api.cloudinary.com/v1_1/dixhsgyfj/upload", formData)
        .then((response) => {
          const url = response.data.url;
          console.log(url, "url");
          const room = `room-${currentUser?._id}-${sender?._id}`;
          socket.emit("Message", {
            type,
            content: url,
            room: room,
            sender: sender,
            receiver: currentUser,
          });
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setCurrentMessage(currentMessage + emojiObject.emoji);
  };

  const handleTyping = (e: any) => {
    setCurrentMessage(e.target.value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const room = `room-${currentUser?._id}-${sender?._id}`;
    socket.emit("typing", { userId: currentUser?._id, room: room });
    console.log(currentUser, "current studetn");
    setTypingTimeout(
      setTimeout(() => {
        socket.emit("stopTyping", {
          userId: currentUser?._id,
          room: room,
        });
      }, 2000)
    );
  };      

  return (
    <>
      <Header />
      <div className="flex h-screen  border">
        <div className="col-span-1 p-2 w-1/3  bg-gradient-to-br from-red-600 to-pink-500 overflow-y-auto chat">
          {users.map((user: any, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer border-b bg-white rounded-lg mb-1 hover:bg-gray-200 flex items-center"
              onClick={() => setCurrentUser(user)}
            >
              <img
                src={user?.profileImage}
                alt={user.name}
                className="w-10 h-10 rounded-full mr-2"
              />
              <span>{user.name}</span>
              {onlineUsers[user?._id]?.status === "online" ? (
                <span className=" top-0 right-0 w-3 h-3 bg-green-700 rounded-full border-2 border-white"></span>
              ):(
                <span>Last seen: {onlineUsers[user?._id]?.lastSeen ? onlineUsers[user?._id]?.lastSeen : 'N/A'}</span>
              )}   
              {/* {typingStatus[sender?._id]  && (
                <span className="text-sm text-gray-500 ml-2">
                  Typing...
                </span>
              )} */}
            </div>
          ))}
        </div>
        <div className="flex flex-col w-full">
          {currentUser && (
            <div className="flex p-5 justify-start items-start border-2 pb-2 mb-2 h-20 shadow-sm border-zinc-100">
              <img
                src={currentUser?.profileImage}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full mr-2"
              />
              <span className="text-xl">{currentUser.name}</span>
              {typingStatus[sender?._id] && (
                <span className="text-sm text-gray-500 ml-2 mt-2">
                  Typing...
                </span>
              )}
            </div>
          )}

          <div className=" flex-1 flex-col h-full  justify-end w-full   bg-white overflow-y-auto">
            {messages.length ? ( 
              messages.map((msg: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex p-1 mb-2 ${
                    msg.sender ? "justify-end" : "justify-start"
                  } items-center gap-1`}
                >
                  {msg.sender ? (
                    <div className="flex gap-2 relative">
                      <div
                        className={`inline-block px-2 py-1 rounded-lg shadow-md bg-lime-200 relative flex-col`}
                      >
                        {msg?.type === "text" && <span>{msg?.message}</span>}
                        {msg.type === "image" && (
                          <img
                            src={msg.message}
                            alt="Sent image"
                            className="w-40 h-40 object-cover rounded"
                          />
                        )}
                        {msg.type === "video" && (
                          <video controls className="w-40 h-40 rounded">
                            <source src={msg.message} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {msg.type === "audio" && (
                          <audio controls className="w-40">
                            <source src={msg.message} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        )}
                        <span className="text-xs text-gray-500 ml-2">
                          {msg?.time}
                        </span>
                        {msg?.sender && (
                          <>
                            <button
                              className="absolute top-0 right-0 mt-1 text-xl  text-gray-600 focus:outline-none"
                              onClick={() => setShowMenu(msg._id)}
                            >
                              &#x22EE;
                            </button>
                            {showMenu === msg._id && (
                              <div className="absolute right-0 mt-6 w-24 bg-white rounded-md shadow-lg z-10">
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                                  onClick={() => handleDeleteClick(msg._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <img
                        src={currentUser?.profileImage}
                        className="w-5 h-5 rounded-full bg-black border-2 border-zinc-400"
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className="flex gap-2 relative">
                      <img
                        src={currentUser?.profileImage}
                        className="w-5 h-5 rounded-full bg-black border-2 border-zinc-400"
                      />
                      <div
                        className={`inline-block px-2 py-1 rounded-lg shadow-md bg-lime-200 relative flex-col`}
                      >
                        <span>{msg?.message}</span>
                        {msg?.sender && (
                          <>
                            <button
                              className="absolute top-0 right-0 mt-1 p-5 text-gray-600 focus:outline-none"
                              onClick={() => setShowMenu(msg._id)}
                            >
                              &#x22EE;
                            </button>
                            {showMenu === msg._id && (
                              <div className="absolute right-0 mt-6 w-24 bg-white rounded-md shadow-lg z-10">
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                                  onClick={() => handleDeleteClick(msg._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </>
                        )}
                        <span className="text-xs text-gray-500 ml-2">
                          {msg?.time}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="justify-center items-center flex text-black">
                <h1>No messages</h1>
              </div>
            )}
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-14 right-4 z-10 bg-white shadow-lg rounded">
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="text-red-500 p-1 float-right"
              >
                ✕
              </button>
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}

          {showMediaOptions && (
            <div className="flex justify-between items-center absolute bottom-16 right-4 z-10 bg-white shadow-lg rounded p-1 gap-5">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "image")}
                className="hidden  border"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className=" flex text-center p-1  cursor-pointer transition-transform duration-300 hover:scale-110"
              >
                <FaCamera />
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileUpload(e, "audio")}
                className="hidden"
                id="audio-upload"
              />
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="flex text-center p-1   cursor-pointer transition-transform duration-300 hover:scale-110"
              >
                <span className="text-sm font-semibold flex items-center">
                  {isRecording && <span className="text-red-500 mr-1">🔴</span>}
                  <FontAwesomeIcon icon={faMicrophone} />
                </span>
              </button>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, "video")}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="flex text-center  p-1 cursor-pointer transition-transform duration-300 hover:scale-110"
              >
                <FaVideo />
              </label>
              <button
                onClick={() => setShowMediaOptions(false)}
                className="block w-full text-sm font-semibold p-2 text-zinc-600 mt-2  border-red-300 rounded"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="bottom-0 left-0 right-0 p-4 bg-pink-50 flex items-center mb-14">
            <input
              type="text"
              value={currentMessage}
              onChange={handleTyping}
              placeholder="Type a message"
              className="flex-1 p-2 border border-red-300 rounded mr-2 focus:outline-none"
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 bg-white rounded-full mr-2 transition-transform duration-300 hover:scale-110"
            >
              😊
            </button>
            <button
              onClick={() => setShowMediaOptions(!showMediaOptions)}
              className="p-2 bg-white rounded-full mr-2 transition-transform duration-300 hover:scale-110"
            >
              📎
            </button>
            <button
              onClick={handleSendMessage}
              className="p-2 bg-gradient-to-br from-red-600 to-pink-500 text-white rounded transition-transform duration-300 hover:scale-110"
            >
              Send
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFileUpload(e, "image")}
            />
          </div>
        </div>
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">{"Delete chat"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this Chat? This action cannot be
              undone & Message will be deleted from both Sides.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteChat} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ChatInstructor;
