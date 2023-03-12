import { configureStore } from '@reduxjs/toolkit'
import counterReducer from "./counterSlice";
import collectionReducer from "./collectionSlice";

// 各sliceのreducerをアサインする。
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    collection: collectionReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch