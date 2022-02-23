// Chat using socket io

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

import { io } from "socket.io-client";

import ChatList from "../components/ChatList";

function Chat() {
  const [socket, setSocket] = useState<any>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      socket.emit("send nickname", "random_username");
    }
  }, [socket]);

  const handleSend = () => {
    socket.emit("chat message", value);
    setValue("");
  };

  return (
    <div style={{ height: "100vh" }}>
      <Main background="brand" justify="center" align="center">
        <Card width="medium" height="100vh" background="light-1" responsive>
          <CardHeader pad="medium" background="light-1">
            Saheer#GHEGSB12
          </CardHeader>
          <CardBody
            pad="small"
            background="light-3"
            fill="vertical"
            style={{ overflowY: "auto" }}
          >
            {socket ? <ChatList socket={socket} /> : <div>No Peers</div>}
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

export default Chat;
