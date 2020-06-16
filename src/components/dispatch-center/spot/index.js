import React, { useMemo } from "react";
import { Popconfirm } from "antd";
import ReactDOM from "react-dom";
import "./styles.scss";

function makeTitle(title, message) {
  return (
    <div className="content">
      <div className="header">{title}</div>
      <div>{message}</div>
    </div>
  );
}

function Spot(props) {
  const title = useMemo(() => makeTitle(props.title, props.message), [
    props.title,
    props.message
  ]);
  return (
    <Popconfirm
      title={title}
      getPopupContainer={() => props.popupContainer}
      okText="派工"
      cancelText="忽略报警"
      onConfirm={props.onConfirm}
      onCancel={() => undefined}
      icon={null}
    >
      <span>
        <div className="pulse-dot inner"></div>
        <div className="pulse-dot outer"></div>
        <div className="pulse inner"></div>
        <div className="pulse outer"></div>
      </span>
    </Popconfirm>
  );
}

function getPopupContainer() {
  const popupContainer = document.createElement("div");
  popupContainer.className = "spot-popup-container";
  return popupContainer;
}

function generateSpots(position, onConfirm, dispatchMap) {
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

export { Spot, getPopupContainer, generateSpots };
