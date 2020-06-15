import {
  PANEL_VISIBLE,
  CURRENT_SPOT_POSITION,
  GET_SORTED_USERS_REQUEST,
  GET_SORTED_USERS_SUCCESS,
  GET_SORTED_USERS_FAILURE
} from "@/actions/dispatch-panel";

const initialState = {
  visible: false,
  currentSpot: null,
  loadingSortedUsers: true,
  sortedUsers: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PANEL_VISIBLE:
      return {
        ...state,
        visible: action.payload
      };
    case CURRENT_SPOT_POSITION:
      return {
        ...state,
        visible: true,
        currentSpot: action.payload
      };
    case GET_SORTED_USERS_REQUEST:
      return {
        ...state,
        loadingSortedUsers: true
      };
    case GET_SORTED_USERS_SUCCESS:
      return {
        ...state,
        loadingSortedUsers: false,
        sortedUsers: action.payload
      };
    case GET_SORTED_USERS_FAILURE:
      return {
        ...state,
        loadingSortedUsers: false,
        sortedUsers: []
      };
  }
  return state;
}
