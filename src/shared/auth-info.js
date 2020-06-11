import { sensors } from "./sensors-events";
import * as cookie from "./cookie";
import _ from "lodash";

function SearchBuilder() {
  const caches = {};
  return key => {
    const searchStr = document.location.search;
    let cache = caches[searchStr];
    if (!cache) {
      cache = {};
      caches[searchStr] = cache;
    }
    if (cache[key]) {
      return cache[key];
    }
    let val = "";
    if (searchStr && searchStr.length > 2) {
      searchStr
        .substr(1)
        .split("&")
        .some(keyValStr => {
          if (keyValStr && keyValStr.split("=")[0] === key) {
            val = keyValStr.split("=")[1];
            return true;
          }
        });
    }
    cache[key] = val;
    return val;
  };
}

export const getSearch = new SearchBuilder();

// 权限控制
let _isFull = null;
export function setIsFull(isFull) {
  _isFull = isFull;
}

export function isFull() {
  return _isFull;
}

let _isReadonly = null;
export function setIsReadonly(isReadonly) {
  _isReadonly = isReadonly;
}

export function isReadonly() {
  return _isReadonly;
}

let _user = null;
export function setUser(user) {
  _user = user;
  // 神策设置用户属性
  sensors.setProfile(user);
  if (localStorage.getItem("isLogin")) {
    sensors.loginEvent();
    localStorage.removeItem("isLogin");
  }
}

let _customers = null;
export function setCustomers(customers) {
  _customers = customers;
}

export function getCustomerById(id) {
  if (!_customers) {
    return null;
  }
  return _customers.find(item => item.Id === id);
}

export function getUser() {
  return _user;
}

export function getUserId() {
  return +cookie.get("UserId");
}

export function getCustomerId() {
  return +getSearch("customerId");
}

export function getHierarchyId() {
  return +getSearch("hierarchyId");
}

export function getLang() {
  return location.pathname.split("/")[1];
}

export function getUrl({
  customerCode,
  path,
  hierarchyId,
  boardId,
  customerId = getCustomerId()
}) {
  const lang = getLang();
  let url = `${customerCode}/dispatch/${path}?customerId=${customerId}`;
  if (hierarchyId) {
    url += `&hierarchyId=${hierarchyId}`;
  }
  if (boardId) {
    url += `&boardId=${boardId}`;
  }
  return `/${lang}/${url}`;
}
