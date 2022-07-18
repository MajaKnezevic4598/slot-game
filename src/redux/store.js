import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";
import gameReducer from "./game/gameReducer";

import storage from "redux-persist/lib/storage";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// import booksReducer from "./books/booksListReducer";
// import readingCardReducer from "./readingCard/readingCardReducer";

// const rootReducer = combineReducers({
//   books: booksReducer,
//   card: readingCardReducer,
// });

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, gameReducer);

// const store = configureStore({
//   reducer: persistedReducer,
// });

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export default store;
