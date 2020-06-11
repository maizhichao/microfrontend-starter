import React from "react";
import { Spin } from "antd";
import { FormattedMessage } from "react-intl";
import { commonMessages } from "@/shared/translations/common";

import "./style.scss";

export default function Loading(props) {
  return (
    <div className="loading">
      <FormattedMessage {...commonMessages.loading}>
        {loadingMsg => (
          <Spin delay={300} size="large" tip={loadingMsg}>
            {props.children}
          </Spin>
        )}
      </FormattedMessage>
    </div>
  );
}
