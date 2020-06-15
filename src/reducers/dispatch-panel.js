import { PANEL_VISIBLE } from "@/actions/dispatch-panel";

const initialState = {
  visible: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PANEL_VISIBLE:
      return {
        ...state,
        visible: action.payload
      };
  }
  return state;
}
