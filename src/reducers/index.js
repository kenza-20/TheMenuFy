import { combineReducers } from "redux";
import authReducer from "./authReducer"; // ✅ Import auth reducer

const rootReducer = combineReducers({
  auth: authReducer, // ✅ Add authentication reducer
});

export default rootReducer;
