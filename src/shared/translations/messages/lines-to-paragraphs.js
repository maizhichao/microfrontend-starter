import React from "@/shared/translations/messages/react";
import { FormattedMessage } from "react-intl";

const children = (...lines) => {
  return lines
    .map(line =>
      typeof line === "string"
        ? line.split("__NEW_LINE__").map(text => <div>{text}</div>)
        : line
    )
    .reduce((lines, line) => lines.concat(line), []);
};

export default message => {
  return <FormattedMessage {...message}>{children}</FormattedMessage>;
};
