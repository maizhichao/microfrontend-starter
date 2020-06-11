import { setPublicPath } from "systemjs-webpack-interop";
setPublicPath("@se/module/wolf");

import React from "react";
import Loadable from "react-loadable";
import { Provider } from "react-redux";
import store from "./configure-store";
import { IntlProvider, addLocaleData } from "react-intl";
import zhLocale from "react-intl/locale-data/zh";

addLocaleData([...zhLocale]);

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

const routes = {
  path: "dispatch",
  component: ({ children }) => {
    return (
      <IntlProvider defaultLocale="zh-cn" onError={() => undefined}>
        <Provider store={store}>
          <App>{children}</App>
        </Provider>
      </IntlProvider>
    );
  },
  indexRoute: {
    onEnter: ({ params }, replace) => {
      const { lang, customerCode } = params;
      const customerId = decodeId(params.customerCode);
      return replace(
        `/${lang}/${customerCode}/dispatch/center?customerId=${customerId}`
      );
    }
  },
  childRoutes: [
    {
      path: "center",
      component: DispatchCenter
    }
  ]
};

export { routes };
