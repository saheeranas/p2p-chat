import { createContext, useState, useContext, useEffect } from "react";
import Peer from "peerjs";

type userType = {
  name: string;
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
  // User initial values
  const [user, setUser] = useState<userType>({ name: "", peerId: "" });

  // Peer object 'peer'
  const [peer, setPeer] = useState<any>(null);
  useEffect(() => {
    const random_id = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substring(2, 10);
    const newPeer = new Peer(random_id, {
      host: "p2p-chat-rtc.herokuapp.com",
      // host: "localhost",
      // port: 5000,
      path: "/peerjs",
    });
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
      });

      peer.on("connection", function (a: any) {
        // console.log("Receiver initiated");
        if (!conn) {
          setConn(a);
        }
      });
    }
  }, [peer, conn]);

  // User name change handler
  const changeName = (name: string) => {
    if (name.trim() === "" || name.length > 15) {
      return;
    }
    setUser((prevState) => ({ ...prevState, name: name }));
  };

  return (
    <PeerContext.Provider value={{ peer, conn, setConn, user, changeName }}>
      {children}
    </PeerContext.Provider>
  );
};

export const usePeerInfo = () => {
  const { peer, conn, setConn, user, changeName } =
    useContext<any>(PeerContext);
  return { peer, conn, setConn, user, changeName };
};
