import axios from "axios";
import { Modal } from "antd";
import React from "react";
import { FormattedMessage } from "react-intl";
import { commonMessages } from "@/shared/translations/common";
import { exit } from "./utils";
// const BASE_URL = window.Wolf.APIPath + "/api";
const BASE_URL = "/";

const getMessage = config => {
  return <FormattedMessage {...config}>{txt => txt}</FormattedMessage>;
};

function throwUnknownError() {
  if (process.env.NODE_ENV !== "production") {
    Modal.error({
      title: getMessage(commonMessages.unknownErrorTitle),
      content: getMessage(commonMessages.unknownError),
      centered: true,
      okText: getMessage(commonMessages.OK)
    });
  }
}

export const service = axios.create({
  timeout: 100000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "cache-control": "no-cache",
    cache: "no-cache"
  },
  mode: "cors",
  withCredentials: true, //解决axios不带cookie
  method: "GET",
  data: {}
});

service.interceptors.request.use(
  config => {
    config.url = BASE_URL + config.url;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  res => {
    if (res.data && res.data.Result) {
      return res.data.Result;
    }
    return res.data;
  },
  err => {
    if (!err.response) {
      // Silently ignore this err, as the request is explicitly canceled by the same comming request.
      return;
    }
    switch (err.response.status) {
      case 401: {
        Modal.warning({
          centered: true,
          content: getMessage(commonMessages.loginError),
          okText: getMessage(commonMessages.OK),
          autoFocusButton: "ok",
          onOk: () => {
            exit();
          }
        });
        break;
      }
      default: {
        console.error(err);
        throwUnknownError();
      }
    }
  }
);
