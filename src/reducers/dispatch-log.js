import { LOG_VISIBLE } from "@/actions/dispatch-log";

const initialState = {
  visible: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOG_VISIBLE:
      return {
        ...state,
        visible: action.payload
      };
  }
  return state;
}
