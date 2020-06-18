import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./styles.scss";
import { setCurrentSpot } from "@/actions/dispatch-panel";
import DispatchPanel from "./dispatch-panel";
import DispatchLog from "./dispatch-log";
import { FitView, IgnoreAlarm } from "./map-controls";
import SearchSpot from "./map-controls/search-spot";
import {
  initializeMap,
  destroyMap,
  generateMarkers,
  generateSpots
} from "@/amap";

async function init(dispatch, users, userPosition) {
  const dispatchMap = initializeMap([116.43, 39.92]);

  const position = [116.440048, 39.917126];

  const onConfirm = () => dispatch(setCurrentSpot(position));

  generateSpots(position, onConfirm, dispatchMap);

  generateMarkers(users, userPosition);
}

export default function DispatchCenter(props) {
  const dispatch = useDispatch();
  const users = useSelector(state => state.main.users);
  const userPosition = useSelector(state => state.main.userPosition);
  const customerId = props.customerId;

  useEffect(() => {
    init(dispatch, users, userPosition);
    return () => {
      destroyMap();
    };
  }, []);

  const audioSrc = `${process.env.PUBLIC_PATH}public/alarm-notice.mp3`;

  return (
    <div
      className="dispatch-map-container"
      style={{ width: "100%", height: "100%" }}
    >
      <div id="_dispatch_map" style={{ width: "100%", height: "100%" }}></div>
      <audio src={audioSrc} autoPlay="autoplay" />
      <SearchSpot customerId={customerId} />
      <DispatchLog />
      <DispatchPanel />
      <FitView />
      <IgnoreAlarm />
    </div>
  );
}
