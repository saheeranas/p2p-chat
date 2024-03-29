import { useState, useEffect } from "react";
import {
  Main,
  TextArea,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Box,
  Text,
} from "grommet";
import { useNavigate } from "react-router-dom";

import { usePeerInfo } from "../hooks/useChatsInfo";
import useWindowDimensions from "../hooks/useWindowDimensions";
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
  const { height } = useWindowDimensions();
  const [value, setValue] = useState(intialValues);

  const [chatHistory, setChatHistory] = useState<chatHistoryType[]>([]);

  useEffect(() => {
    if (!conn) {
      return navigate("/");
    }
  }, [conn, navigate]);

  const handleChatHistory = (message: string | chatHistoryType) => {
    let temp =
      typeof message === "string"
        ? { senderId: peer._id, sender: user.name, message }
        : message;
    setChatHistory((prevState) => [...prevState, temp]);
  };

  useEffect(() => {
    if (conn) {
      conn.on("data", function (data: any) {
        // console.log(data);
        handleChatHistory({
          senderId: data.senderId,
          sender: data.sender,
          message: data.message,
        });
      });

      conn.on("close", () => {
        navigate("/");
      });
    }
  }, [conn, navigate]);

  const handleSend = (values: any) => {
    if (conn && value.msg.trim() !== "") {
      conn.send({ senderId: peer._id, sender: user.name, message: values.msg });
      handleChatHistory(values.msg);
    }
    setValue(intialValues);
  };

  const onPressEnter = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      handleSend(value);
    }
  };

  const handleDisconnect = () => {
    conn.close();
  };

  return (
    <div style={{ height }}>
      <Main background="brand" justify="start" align="center">
        <Card width="medium" fill="vertical" background="light-1" responsive>
          <CardHeader pad="medium" background="light-1">
            <Text>{conn?.peer ? conn.peer : ""}</Text>
            <Button
              secondary
              plain
              label="Disconnect"
              onClick={handleDisconnect}
              size="small"
            />
          </CardHeader>
          <CardBody
            pad="small"
            background="light-3"
            fill="vertical"
            style={{
              overflowY: "auto",
              scrollbarWidth: "thin",
              marginRight: "-10px",
            }}
          >
            {chatHistory ? (
              <ChatListRTC data={chatHistory} me={user} />
            ) : (
              <div>No Peers</div>
            )}
          </CardBody>
          <CardFooter
            pad={{ horizontal: "medium", vertical: "small" }}
            background="light-1"
          >
            <Form
              value={value}
              onChange={(nextValue) => setValue(nextValue)}
              onReset={() => setValue(intialValues)}
              onSubmit={({ value }) => handleSend(value)}
              style={{ width: "100%" }}
            >
              <Box
                direction="row"
                gap="small"
                justify="between"
                align="center"
                height="50px"
              >
                <TextArea
                  id="msg"
                  name="msg"
                  placeholder="type here"
                  resize={false}
                  size="medium"
                  fill
                  onKeyDown={onPressEnter}
                />
                <Button
                  primary
                  type="submit"
                  label="Send"
                  fill="vertical"
                  size="medium"
                />
              </Box>
            </Form>
          </CardFooter>
        </Card>
      </Main>
    </div>
  );
}

export default ChatRTC;
