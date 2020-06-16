import _ from "lodash";

export const PANEL_VISIBLE = "leopard/panel/PANEL_VISIBLE";
export function setVisible(status) {
  return {
    type: PANEL_VISIBLE,
    payload: status
  };
}

export const CURRENT_SPOT_POSITION = "leopard/panel/CURRENT_SPOT_POSITION";
export function setCurrentSpot(position) {
  return {
    type: CURRENT_SPOT_POSITION,
    payload: position
  };
}

async function getSortedItems(currentSpot, userPosition, users) {
  return new Promise((resolve, reject) => {
    AMap.plugin("AMap.Driving", async () => {
      const driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME
      });
      const promises = Object.entries(userPosition).map(([key, p]) => {
        return new Promise((rs, rj) => {
          driving.search(p, currentSpot, (status, result) => {
            if (status === "complete") {
              const route = result.routes[0];
              rs([
                key,
                Math.round(route.time / 60),
                Math.round(route.distance / 1000)
              ]);
            } else {
              rj("Failed to load map routes");
            }
          });
        });
      });
      try {
        const allRes = await Promise.all(promises);
        resolve(_.sortBy(allRes, item => item[1]));
      } catch (e) {
        console.error("Failed to load map routes: " + e);
        resolve([]);
      }
    });
  });
}

export const GET_SORTED_USERS_REQUEST =
  "leopard/panel/GET_SORTED_USERS_REQUEST";
export const GET_SORTED_USERS_SUCCESS =
  "leopard/panel/GET_SORTED_USERS_SUCCESS";
export const GET_SORTED_USERS_FAILURE =
  "leopard/panel/GET_SORTED_USERS_FAILURE";
export function getSortedUsers(currentSpot, userPosition, users) {
  return async dispatch => {
    try {
      dispatch({
        type: GET_SORTED_USERS_REQUEST
      });
      const payload = await getSortedItems(currentSpot, userPosition, users);
      dispatch({
        type: GET_SORTED_USERS_SUCCESS,
        payload
      });
    } catch (e) {
      dispatch({
        type: GET_SORTED_USERS_FAILURE
      });
    }
  };
}
