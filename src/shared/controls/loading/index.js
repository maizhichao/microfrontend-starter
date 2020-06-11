import React from "react";
import { Spin } from "antd";

import "./style.scss";

export default function Loading(props) {
  return (
    <div className="loading">
      <Spin delay={300} size="large" tip={"加载中..."}>
        {props.children}
      </Spin>
    </div>
  );
}
