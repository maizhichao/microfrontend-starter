import { combineReducers } from "redux";

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
  main
});
