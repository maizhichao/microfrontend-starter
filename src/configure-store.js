import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import rootReducers from "./reducers";

const enhancer = composeWithDevTools(applyMiddleware(thunk));
export default createStore(rootReducers, enhancer);
