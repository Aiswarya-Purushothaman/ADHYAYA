import io from 'socket.io-client';
import { createContext, useContext, useEffect, useState } from 'react';

const socket = io('http://localhost:5000');

interface OnlineUsersContextType {
  onlineUsers: { [key: string]: {status:string,lastSeen?:string} };
  setOnlineUsers: React.Dispatch<React.SetStateAction<{ [key: string]:{status:string,lastSeen?:string}}>>;
}

const OnlineUsersContext = createContext<OnlineUsersContextType | undefined>(undefined);

export const OnlineUsersProvider: React.FC<any> = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: { status: string; lastSeen?: string } }>({});

  useEffect(() => {

    socket.on('userOnline', (data) => {
      setOnlineUsers(prev => ({ ...prev, [data.userId]: {status:'online'}}));
    });
    socket.on("userOffline", (data) => {
      console.log('useroffline')
      setOnlineUsers((prev) => ({
        ...prev,
        [data.userId]: { status: 'offline', lastSeen: 'this is time' }
      }))
    })
    return () => {
      socket.off('userOnline')
    };
  }, [setOnlineUsers])
  return (
    <OnlineUsersContext.Provider value={{ onlineUsers, setOnlineUsers }}>
      {children}
    </OnlineUsersContext.Provider>
  );
};

export const useOnlineUsers = () => {
  const context = useContext(OnlineUsersContext);
  if (context === undefined) {
    throw new Error('useOnlineUsers must be used within an OnlineUsersProvider');
  }
  return context;
};
