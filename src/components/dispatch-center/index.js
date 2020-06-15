import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { mapLoader } from "@se/pop";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Popconfirm } from "antd";
import "./styles.scss";
import * as dispatchPanelActions from "@/actions/dispatch-panel";
import DispatchPanel from "./dispatch-panel";
import DispatchLog from "./dispatch-log";

let dispatchMap = null;

function LoadingMap() {
  return (
    <div className="flex-center">
      <Spin size="large" tip="地图加载中..." />
    </div>
  );
}

function generateMarkers() {
  const markers = {
    1: [116.398506, 39.910148],
    2: [116.359281, 39.933121],
    3: [116.426058, 39.876366]
  };

  return Object.values(markers).map(p => {
    return new AMap.Marker({
      icon:
        "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
      position: p,
      map: dispatchMap
    });
  });
}

export default function DispatchCenter(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    mapLoader.load().then(() => {
      dispatchMap = new AMap.Map("_dispatch_map", {
        resizeEnable: true,
        center: [116.398506, 39.910148],
        zoom: 13
      });
      dispatchMap.on("click", e => {
        console.log([e.lnglat.getLng(), e.lnglat.getLat()]);
      });

      const target = document.createElement("div");
      const marker = new AMap.Marker({
        icon:
          "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
        position: [116.440048, 39.917126],
        map: dispatchMap,
        content: target
      });

      setTimeout(() => {
        marker.setPosition([116.42889, 39.932002]);
      }, 2000);

      ReactDOM.render(
        <Popconfirm
          getPopupContainer={() => target}
          style={{ height: "100%", width: "100%" }}
        >
          <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png" />
        </Popconfirm>,
        target
      );

      marker.on("click", () => {
        dispatch(dispatchPanelActions.setVisible(true));
      });

      generateMarkers();
    });
    return () => {
      if (dispatchMap) {
        dispatchMap.destroy();
      }
    };
  });

  const initialized = useSelector(state => state.main.initialized);

  return (
    <div id="_dispatch_map" style={{ width: "100%", height: "100%" }}>
      {!mapLoader.mapLoaded() && <LoadingMap />}
      <DispatchLog />
      <DispatchPanel />
    </div>
  );
}
