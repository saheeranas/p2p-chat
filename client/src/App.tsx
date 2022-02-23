import { Grommet } from "grommet";
import "./App.css";

import { PeerInfoProvider } from "./hooks/useChatsInfo";
import AppNavigation from "./routes/AppNavigation";

function App() {
  return (
    <Grommet plain>
      <PeerInfoProvider>
        <AppNavigation />
      </PeerInfoProvider>
    </Grommet>
  );
}

export default App;
