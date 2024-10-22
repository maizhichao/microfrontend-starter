import { combineReducers } from "redux";
import dispatchPanel from "./dispatch-panel";
import dispatchLog from "./dispatch-log";

import {
  GET_ALL_POSITION_REQUEST,
  GET_ALL_POSITION_SUCCESS,
  GET_ALL_POSITION_FAILURE,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
  GET_ALL_SPOTS_REQUEST,
  GET_ALL_SPOTS_SUCCESS,
  GET_ALL_SPOTS_FAILURE,
  SPOT_SELECTED
} from "@/actions/main";

const initialState = {
  initialized: false,
  userPosition: null,
  users: null,
  loadingSpots: true,
  spots: [],
  selectedSpot: null
};

function main(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_POSITION_REQUEST:
      return {
        ...state,
        initialized: false
      };
    case GET_ALL_POSITION_SUCCESS:
      return {
        ...state,
        initialized: true,
        userPosition: action.payload
      };
    case GET_ALL_POSITION_FAILURE:
      return state;
    case GET_ALL_USERS_REQUEST:
      return state;
    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload
      };
    case GET_ALL_USERS_FAILURE:
      return state;
    case GET_ALL_SPOTS_REQUEST:
      return {
        ...state,
        loadingSpots: true,
        spots: []
      };
    case GET_ALL_SPOTS_SUCCESS:
      return {
        ...state,
        loadingSpots: false,
        spots: action.payload
      };
    case GET_ALL_SPOTS_FAILURE:
      return {
        ...state,
        loadingSpots: false
      };
    case SPOT_SELECTED:
      return {
        ...state,
        selectedSpot: action.payload
      };
    default:
      return state;
  }
}

export default combineReducers({
  main,
  dispatchPanel,
  dispatchLog
});
