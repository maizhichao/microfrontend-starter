import React from "react";
import ReactDOM from "react-dom";
import Spot from "@/components/dispatch-center/spot";

let dispatchMap = null;

export function initializeMap(center) {
  dispatchMap = new AMap.Map("_dispatch_map", {
    zoom: 13,
    center: center,
    resizeEnable: true
  });
  const scale = new AMap.Scale();
  const toolbar = new AMap.ToolBar({
    position: "RB",
    liteStyle: true
  });
  dispatchMap.addControl(scale);
  dispatchMap.addControl(toolbar);

  dispatchMap.on("click", e => {
    console.log([e.lnglat.getLng(), e.lnglat.getLat()]);
  });
  return dispatchMap;
}

export function destroyMap() {
  if (dispatchMap) {
    dispatchMap.destroy();
  }
}

export function getDispatchMap() {
  return dispatchMap;
}

export function removeItem(item) {
  dispatchMap.remove(item);
}

export function drawRoute(startPosition, currentSpot) {
  return new Promise((resolve, reject) => {
    const driving = new AMap.Driving({
      policy: AMap.DrivingPolicy.LEAST_TIME
    });
    driving.search(startPosition, currentSpot, function (status, result) {
      if (status === "complete") {
        if (result.routes && result.routes.length) {
          const path = parseRouteToPath(result.routes[0]);
          const routeLine = new AMap.Polyline({
            path: path,
            isOutline: true,
            outlineColor: "#ffeeee",
            borderWeight: 2,
            strokeWeight: 5,
            strokeColor: "#0091ff",
            lineJoin: "round"
          });
          routeLine.setMap(dispatchMap);
          resolve(routeLine);
        }
      } else {
        resolve(null);
      }
    });
  });
}

export function generateMarkers(users, userPosition) {
  return Object.values(userPosition).map(p => {
    return new AMap.Marker({
      icon:
        "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
      position: p,
      map: dispatchMap
    });
  });
}

function getPopupContainer() {
  const popupContainer = document.createElement("div");
  popupContainer.className = "spot-popup-container";
  return popupContainer;
}

export function generateSpots(position, onConfirm, dispatchMap) {
  const popupContainer = getPopupContainer();
  const marker = new AMap.Marker({
    position: position,
    map: dispatchMap,
    content: popupContainer
  });

  ReactDOM.render(
    <Spot
      title={"新建建筑"}
      message={"高级 15:22 电压严重过低 (未解除)"}
      onConfirm={onConfirm}
      popupContainer={popupContainer}
    />,
    popupContainer
  );
}

function parseRouteToPath(route) {
  const path = [];
  for (let i = 0, l = route.steps.length; i < l; i++) {
    const step = route.steps[i];
    for (let j = 0, n = step.path.length; j < n; j++) {
      path.push(step.path[j]);
    }
  }
  return path;
}
