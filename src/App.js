import Slot from "./components/Slot";
import store from "./redux/store";
import { Provider } from "react-redux";

import Slot2 from "./components/Slot2";

import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

let persistor = persistStore(store);

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Slot />

          {/* <Slot2 /> */}
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
