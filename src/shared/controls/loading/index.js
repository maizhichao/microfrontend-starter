import React from "react";
import { Spin } from "antd";

export default function Loading(props) {
  return (
    <div className="flex-center">
      <Spin delay={300} size="large" tip={"加载中..."}>
        {props.children}
      </Spin>
    </div>
  );
}
