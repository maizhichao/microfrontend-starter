import { service as popService } from "@se/pop";

export const GET_ALL_USERS_REQUEST = "leopard/main/GET_ALL_USERS_REQUEST";
export const GET_ALL_USERS_SUCCESS = "leopard/main/GET_ALL_USERS_SUCCESS";
export const GET_ALL_USERS_FAILURE = "leopard/main/GET_ALL_USERS_FAILURE";
export function getAllUsers() {
  return async dispatch => {
    dispatch({
      type: GET_ALL_USERS_REQUEST
    });
    const payload = await new Promise(resolve => {
      setTimeout(
        () =>
          resolve({
            111: { name: "Alex", tel: "123456789", status: "待工中" },
            222: { name: "Bean", tel: "123456789", status: "巡检中" },
            333: { name: "Javis", tel: "123456789", status: "前往抢修" }
          }),
        3000
      );
    });
    dispatch({
      type: GET_ALL_USERS_SUCCESS,
      payload
    });
  };
}

export const GET_ALL_POSITION_REQUEST = "leopard/main/GET_ALL_POSITION_REQUEST";
export const GET_ALL_POSITION_SUCCESS = "leopard/main/GET_ALL_POSITION_SUCCESS";
export const GET_ALL_POSITION_FAILURE = "leopard/main/GET_ALL_POSITION_FAILURE";
export function getAllUserPosition() {
  return async dispatch => {
    dispatch({
      type: GET_ALL_POSITION_REQUEST
    });
    const payload = await new Promise(resolve => {
      setTimeout(
        () =>
          resolve({
            111: [116.398506, 39.910148],
            222: [116.359281, 39.933121],
            333: [116.426058, 39.876366]
          }),
        2000
      );
    });
    dispatch({
      type: GET_ALL_POSITION_SUCCESS,
      payload
    });
  };
}

export const GET_ALL_SPOTS_REQUEST = "leopard/main/GET_ALL_SPOTS_REQUEST";
export const GET_ALL_SPOTS_SUCCESS = "leopard/main/GET_ALL_SPOTS_SUCCESS";
export const GET_ALL_SPOTS_FAILURE = "leopard/main/GET_ALL_SPOTS_FAILURE";
export function getAllBuildings(customerId) {
  return async dispatch => {
    const url = `/inspectionprogram/buildings/${customerId}`;
    dispatch({
      type: GET_ALL_SPOTS_REQUEST
    });
    const payload = await popService({ url, method: "get" });
    dispatch({
      type: GET_ALL_SPOTS_SUCCESS,
      payload
    });
  };
}

export const SPOT_SELECTED = "leopard/main/SPOT_SELECTED";
export function selectSpot(spot) {
  return {
    type: SPOT_SELECTED,
    payload: spot
  };
}
