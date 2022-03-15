import { useRef, useEffect } from "react";
import { Box } from "grommet";
import ChatItem from "./ChatItem";

interface ChatListPropsInterface {
  data: any;
  me: any;
}

const ChatListRTC = ({ data, me }: ChatListPropsInterface) => {
  const endRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  return (
    <Box>
      {data.map((e: any, i: number) => (
        <ChatItem
          key={e + i}
          name={e.sender !== "" ? e.sender : e.senderId}
          value={e.message}
          owner={e.senderId === me.peerId}
        />
      ))}
      <div ref={endRef} />
    </Box>
  );
};

export default ChatListRTC;
