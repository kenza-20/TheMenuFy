import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";  // Updated import
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "../reducers/index"; // ✅ Import your root reducer

// Create the Redux store with middleware
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)) // Enable Redux DevTools
);

export default store;
