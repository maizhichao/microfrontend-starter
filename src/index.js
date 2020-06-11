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
  loader: () => import("./app"),
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
        `/${lang}/${customerCode}/dispatch/board-view?customerId=${customerId}`
      );
    }
  },
  childRoutes: [
    {
      path: "board-view",
      component: BoardView
    },
    {
      path: "edit-charts",
      component: ChartsEdit
    },
    {
      path: "edit-diagram",
      component: DiagramEdit
    }
  ]
};

export { routes };
