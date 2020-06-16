import React, { useEffect } from "react";
import { mapLoader } from "@se/pop";
import { useSelector, useDispatch } from "react-redux";
import { Spin } from "antd";
import "./styles.scss";
import { setCurrentSpot } from "@/actions/dispatch-panel";
import DispatchPanel from "./dispatch-panel";
import DispatchLog from "./dispatch-log";
import { generateSpots } from "./spot";

let dispatchMap = null;

export function getDispatchMap() {
  return dispatchMap;
}

function LoadingMap() {
  return (
    <div className="flex-center">
      <Spin size="large" tip="地图加载中..." />
    </div>
  );
}

function generateMarkers(users, userPosition) {
  return Object.values(userPosition).map(p => {
    return new AMap.Marker({
      icon:
        "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
      position: p,
      map: dispatchMap
    });
  });
}

async function loadMap(dispatch, users, userPosition) {
  await mapLoader.load();
  dispatchMap = new AMap.Map("_dispatch_map", {
    resizeEnable: true,
    center: [116.398506, 39.910148],
    zoom: 13
  });
  dispatchMap.on("click", e => {
    console.log([e.lnglat.getLng(), e.lnglat.getLat()]);
  });
  const position = [116.440048, 39.917126];

  const onConfirm = () => dispatch(setCurrentSpot(position));

  generateSpots(position, onConfirm, dispatchMap);

  generateMarkers(users, userPosition);
}

export default function DispatchCenter(props) {
  const dispatch = useDispatch();
  const users = useSelector(state => state.main.users);
  const userPosition = useSelector(state => state.main.userPosition);

  useEffect(() => {
    loadMap(dispatch, users, userPosition);
    return () => {
      if (dispatchMap) {
        dispatchMap.destroy();
      }
    };
  });

  const audioSrc = `${process.env.PUBLIC_PATH}public/alarm-notice.mp3`;

  return (
    <>
      <audio src={audioSrc} autoPlay loop />
      <div id="_dispatch_map" style={{ width: "100%", height: "100%" }}>
        {!mapLoader.mapLoaded() && <LoadingMap />}
      </div>
      <DispatchLog />
      <DispatchPanel />
    </>
  );
}
