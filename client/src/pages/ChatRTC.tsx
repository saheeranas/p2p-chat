import { useState, useEffect } from "react";
import {
  Main,
  TextInput,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Box,
} from "grommet";
import { useNavigate } from "react-router-dom";

import { usePeerInfo } from "../hooks/useChatsInfo";
import ChatListRTC from "../components/ChatListRTC";

type chatHistoryType = {
  senderId: string;
  sender: string;
  message: string;
};

const intialValues = { msg: "" };

function ChatRTC() {
  let navigate = useNavigate();
  const { peer, conn, user } = usePeerInfo();
  const [value, setValue] = useState(intialValues);

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

  const handleSend = (values: any) => {
    if (conn && value.msg.trim() !== "") {
      conn.send({ senderId: peer._id, sender: user.name, message: values.msg });
      handleChatHistory(values.msg);
    }
    setValue(intialValues);
  };

  return (
    <div style={{ height: "100vh" }}>
      <Main background="brand" justify="start" align="center">
        <Card width="medium" height="95%" background="light-1" responsive>
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
            <Form
              value={value}
              onChange={(nextValue) => setValue(nextValue)}
              onReset={() => setValue(intialValues)}
              onSubmit={({ value }) => handleSend(value)}
              style={{ width: "100%" }}
            >
              <Box direction="row" gap="small" justify="between">
                <TextInput id="msg" name="msg" placeholder="type here" />
                <Button primary type="submit" label="Send" alignSelf="end" />
              </Box>
            </Form>
          </CardFooter>
        </Card>
      </Main>
    </div>
  );
}

export default ChatRTC;
