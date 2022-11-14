import { createContext, useState, useContext, useEffect } from "react";
import Peer from "peerjs";

import {
  storeToLocal,
  readFromLocal,
  deleteFromLocal,
} from "../utils/localStorage";

type userType = {
  name?: string;
  peerId: string;
};

type peerType = {
  peer: any;
  conn: any;
  setConn: any;
  user: userType | null;
  changeName: (name: string) => void;
};

const PeerContext = createContext<peerType | null>(null);

export const PeerInfoProvider = ({ children }: any) => {
  // Error state
  const [error, setError] = useState(null);
  useEffect(() => {
    let timeout = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  // User initial values
  const [user, setUser] = useState<userType>({ name: "", peerId: "" });
  useEffect(() => {
    let name = readFromLocal("name") || "";
    changeName(name);
  }, []);

  // Peer object 'peer'
  const [peer, setPeer] = useState<any>(null);

  useEffect(() => {
    // Unique Id generation
    const random_id = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substring(0, 6);

    // Check if already exists. if no, store id to localStorage
    let myOldId = readFromLocal("myId");
    let myId = myOldId || random_id;
    if (!myOldId) {
      storeToLocal("myId", random_id);
    }

    let config: {
      host: string | undefined;
      path: string;
      port?: number;
      config?: any;
    } = {
      host: process.env.REACT_APP_HOST,
      path: "/peerjs",
      config: {
        iceServers: [
          {
            urls: "stun:openrelay.metered.ca:80",
          },
          // {
          //   urls: "turn:openrelay.metered.ca:80",
          //   username: "openrelayproject",
          //   credential: "openrelayproject",
          // },
          {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
          // {
          //   urls: "turn:openrelay.metered.ca:443?transport=tcp",
          //   username: "openrelayproject",
          //   credential: "openrelayproject",
          // },
        ],
      },
    };

    if (Boolean(parseInt(`${process.env.REACT_APP_PORT}`))) {
      config["port"] = parseInt(`${process.env.REACT_APP_PORT}`);
    }

    const newPeer = new Peer(myId, config);
    setPeer(newPeer);

    return () => {
      newPeer.disconnect();
    };
  }, [setPeer]);

  // Connection object 'conn'
  const [conn, setConn] = useState<any>(null);
  useEffect(() => {
    if (peer) {
      peer.on("open", (id: any) => {
        // console.log("My peer ID is: " + id);
        setUser((prevState) => ({ ...prevState, peerId: id }));

        let oldDestId = readFromLocal("destId");
        if (oldDestId && !conn) {
          // console.log("destId in local exists", oldDestId);
          const newConn = peer.connect(oldDestId, {
            serialization: "json",
          });
          setConn(newConn);
        }
      });

      peer.on("connection", function (a: any) {
        // console.log("Receiver initiated", a);
        if (!conn) {
          setConn(a);
          storeToLocal("destId", a.peer);
        }
      });

      peer.on("error", function (err: any) {
        setError(err?.type);
        // console.log("Peer error");
      });

      peer.on("close", function () {
        // console.log("Peer closed");
      });

      peer.on("disconnected", function () {
        // peer.reconnect();
        // console.log("Peer disconnected");
      });
    }
  }, [peer, conn]);

  useEffect(() => {
    if (conn) {
      conn.on("close", () => {
        // console.log("data connection closed");
        deleteFromLocal("destId");
      });
    }
  }, [conn]);

  // User name change handler
  const changeName = (name: string = "") => {
    if (name.length > 15) {
      return;
    }

    setUser((prevState) => ({ ...prevState, name: name }));
    storeToLocal("name", name.trim());
  };

  return (
    <PeerContext.Provider value={{ peer, conn, setConn, user, changeName }}>
      {children}
      {error && (
        <div
          id="error"
          style={{
            background: "#bf3b3b",
            color: "white",
            fontSize: 12,
            position: "absolute",
            zIndex: 2,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "auto",
            textAlign: "center",
            padding: "5px 12px",
          }}
        >
          Error: {error}
        </div>
      )}
    </PeerContext.Provider>
  );
};

export const usePeerInfo = () => {
  const { peer, conn, setConn, user, changeName } =
    useContext<any>(PeerContext);
  return { peer, conn, setConn, user, changeName };
};
