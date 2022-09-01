import React, { useState, useEffect } from "react";
import { Main, Box, Text, Form, FormField, TextInput, Button } from "grommet";
import { useNavigate } from "react-router-dom";

import { usePeerInfo } from "../hooks/useChatsInfo";
import { storeToLocal } from "../utils/localStorage";

const intialValues = { destId: "" };

function Welcome() {
  let navigate = useNavigate();

  const { peer, conn, setConn, user, changeName } = usePeerInfo();
  const [value, setValue] = useState(intialValues);

  // If connected, navigate to chat screen
  useEffect(() => {
    if (conn) {
      conn.on("open", function () {
        navigate("./chat", { replace: false });
      });
    }
  }, [conn, navigate]);

  const handleNameInput = (val: string) => {
    changeName(val);
  };

  const handleSubmitConnectForm = async (values: any) => {
    if (!peer || values.destId.trim() === "") {
      return false;
    }

    try {
      const newConn = peer.connect(values.destId, {
        serialization: "json",
      });
      setConn(newConn);
      storeToLocal("destId", values.destId);
    } catch (error) {
      // console.warn(error);
    }
  };

  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      <Main pad="large" background="brand" justify="center" align="center">
        <Box
          width="medium"
          background="light-1"
          pad="medium"
          height={{ min: "auto" }}
        >
          <Box
            pad="small"
            margin={{ bottom: "small" }}
            direction="row"
            justify="between"
          >
            <Text>Your ID</Text>
            <Text weight="bold">{peer?._id || "0000"}</Text>
          </Box>
          <Box>
            <FormField
              label="Your Name"
              contentProps={{
                margin: { horizontal: "small", vertical: "xsmall" },
              }}
            >
              <TextInput
                value={user.name}
                placeholder="Nick name"
                id="name"
                name="name"
                onChange={(event) => handleNameInput(event.target.value)}
              />
            </FormField>
          </Box>

          <Form
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            onReset={() => setValue(intialValues)}
            onSubmit={({ value }) => handleSubmitConnectForm(value)}
          >
            <FormField
              label="Your friend's ID"
              contentProps={{
                margin: { horizontal: "small", vertical: "xsmall" },
              }}
            >
              <TextInput
                placeholder="Type friend's ID here"
                id="destId"
                name="destId"
              />
            </FormField>
            <Box direction="row" gap="medium" pad="small" justify="center">
              <Button type="submit" primary label="Connect" />
              <Button type="reset" label="Reset" />
            </Box>
          </Form>
        </Box>
      </Main>
    </div>
  );
}

export default Welcome;
