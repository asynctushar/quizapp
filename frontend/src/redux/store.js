import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import userReducer from "./slices/userSlice";
import testReducer from "./slices/testSlice";
import examReducer from "./slices/examSlice";

const reducer = {
	appState: appReducer,
	userState: userReducer,
	testState: testReducer,
	examState: examReducer,
};

const store = configureStore({
	reducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
