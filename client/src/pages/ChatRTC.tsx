import { useState, useEffect } from "react";
import {
  Main,
  TextInput,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "grommet";
import { useNavigate } from "react-router-dom";

import { usePeerInfo } from "../hooks/useChatsInfo";

import ChatListRTC from "../components/ChatListRTC";

type chatHistoryType = {
  senderId: string;
  sender: string;
  message: string;
};

function ChatRTC() {
  let navigate = useNavigate();
  const { peer, conn, user } = usePeerInfo();
  const [value, setValue] = useState("");

  const [chatHistory, setChatHistory] = useState<chatHistoryType[]>([]);

  useEffect(() => {
    if (!conn) {
      return navigate("/");
    }
  }, [conn, navigate]);

  useEffect(() => {
    if (conn) {
      conn.on("data", function (data: any) {
        // console.log("Received", data);
        handleChatHistory({
          senderId: data.senderId,
          sender: data.sender,
          message: data.message,
        });
      });
    }
  }, [conn]);

  const handleChatHistory = (message: string | chatHistoryType) => {
    let temp =
      typeof message === "string"
        ? { senderId: peer._id, sender: user.name, message }
        : message;
    setChatHistory((prevState) => [...prevState, temp]);
  };

  const handleSend = () => {
    if (conn && value.trim() !== "") {
      conn.send({ senderId: peer._id, sender: user.name, message: value });
      handleChatHistory(value);
    }
    setValue("");
  };

  return (
    <div style={{ height: "100vh" }}>
      <Main background="brand" justify="center" align="center">
        <Card width="medium" height="100vh" background="light-1" responsive>
          <CardHeader pad="medium" background="light-1">
            {conn.peer ? conn.peer : ""}
          </CardHeader>
          <CardBody
            pad="small"
            background="light-3"
            fill="vertical"
            style={{ overflowY: "auto" }}
          >
            {chatHistory ? (
              <ChatListRTC data={chatHistory} me={user} />
            ) : (
              <div>No Peers</div>
            )}
          </CardBody>
          <CardFooter pad="medium" background="light-1">
            <TextInput
              placeholder="type here"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
            <Button primary label="Send" onClick={handleSend} />
          </CardFooter>
        </Card>
      </Main>
    </div>
  );
}

export default ChatRTC;
