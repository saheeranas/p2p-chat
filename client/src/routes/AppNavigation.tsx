import { Routes, Route } from "react-router-dom";

import Welcome from "../pages/Welcome";
import ChatRTC from "../pages/ChatRTC";

const AppNavigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/chat" element={<ChatRTC />} />
    </Routes>
  );
};

export default AppNavigation;
