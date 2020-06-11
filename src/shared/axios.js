import axios from "axios";
import { Modal } from "antd";
import { exit } from "./utils";
// TODO: const BASE_URL = window.Wolf.APIPath + "/api";
const BASE_URL = "/";

function throwUnknownError() {
  if (process.env.NODE_ENV !== "production") {
    Modal.error({
      title: "操作失败",
      content: "我们正在寻找原因。请稍后再试。",
      centered: true,
      okText: "好的"
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
          content: "当前用户已退出，请重新登录",
          okText: "好的",
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
