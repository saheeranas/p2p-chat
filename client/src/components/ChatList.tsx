import { useState, useEffect } from "react";
import { Box } from "grommet";
import ChatItem from "./ChatItem";

interface ChatListPropsInterface {
  socket: any;
}

const ChatList = ({ socket }: ChatListPropsInterface) => {
  const [messages, setMessages] = useState<any>([]);
  useEffect(() => {
    socket.on("chat message", function (msg: string) {
      // console.log(msg);
      setMessages((prevState: any) => [...prevState, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [socket]);

  return (
    <Box>
      {messages.map((e: any, i: number) => (
        <ChatItem
          key={e + i}
          name={e.name}
          value={e.msg}
          owner={e.sender === socket.id}
        />
      ))}

      {/* <ChatItem value="How can I help you?" owner /> */}
    </Box>
  );
};

export default ChatList;
