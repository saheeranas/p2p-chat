import { Box } from "grommet";
import ChatItem from "./ChatItem";

interface ChatListPropsInterface {
  data: any;
  me: any;
}

const ChatListRTC = ({ data, me }: ChatListPropsInterface) => {
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
    </Box>
  );
};

export default ChatListRTC;
