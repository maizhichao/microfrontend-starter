import React, { useMemo } from "react";
import { Popconfirm } from "antd";
import "./styles.scss";

function makeTitle(title, message) {
  return (
    <div className="content">
      <div className="header">{title}</div>
      <div>{message}</div>
    </div>
  );
}

export default function Spot(props) {
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
