import { setPublicPath } from "systemjs-webpack-interop";
setPublicPath("@se/module/leopard");

import React from "react";
import Loadable from "react-loadable";
import { Provider } from "react-redux";
import store from "./configure-store";

function decodeId(encoded) {
  return parseInt(encoded, 16);
}

function Loading() {
  return <div />;
}

const App = Loadable({
  loader: () => import("./components/app"),
  loading: Loading
});

const DispatchCenter = Loadable({
  loader: () => import("./components/dispatch-center"),
  loading: Loading
});

// import App from "./components/app";
// import DispatchCenter from "./components/dispatch-center";

const routes = {
  path: "maintenance/dispatch",
  component: () => {
    return (
      <Provider store={store}>
        <App>
          <DispatchCenter />
        </App>
      </Provider>
    );
  }
};

export { routes };
