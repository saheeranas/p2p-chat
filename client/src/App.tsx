import { Grommet } from "grommet";
import "./App.css";

import { PeerInfoProvider } from "./hooks/useChatsInfo";
import AppNavigation from "./routes/AppNavigation";

// import Demo from "./Demo";

function App() {
  return (
    <Grommet plain>
      <PeerInfoProvider>
        <AppNavigation />
        {/* <Demo /> */}
      </PeerInfoProvider>
    </Grommet>
  );
}

export default App;
