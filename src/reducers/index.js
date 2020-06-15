import { combineReducers } from "redux";
import dispatchPanel from "./dispatch-panel";
import dispatchLog from "./dispatch-log";

import { INITIALIZED } from "@/actions/main";

const initialState = {
  initialized: false
};

function main(state = initialState, action) {
  switch (action.type) {
    case INITIALIZED:
      return {
        ...state,
        initialized: true
      };
  }
  return state;
}

export default combineReducers({
  main,
  dispatchPanel,
  dispatchLog
});
