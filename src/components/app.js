import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal, Spin } from "antd";
import { getAllUserPosition, getAllUsers } from "@/actions/main";
import * as utils from "@/shared/utils";
import Loading from "@/shared/controls/loading";
import { mapLoader } from "@se/pop";

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

function LoadingMap() {
  return (
    <div className="flex-center">
      <Spin size="large" tip="地图加载中..." />
    </div>
  );
}

class App extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    globalError: PropTypes.object,
    init: PropTypes.func
  };

  UNSAGE_componentWillReceiveProps(nextProps) {
    const { globalError } = nextProps;
    if (this.props.globalError !== globalError) {
      if (globalError) {
        switch (globalError.status) {
          case 401: {
            Modal.warning({
              centered: true,
              content: "当前用户已退出，请重新登录",
              okText: "好的",
              autoFocusButton: "ok",
              onOk: () => {
                utils.exit();
              }
            });
            break;
          }
          default: {
            throwUnknownError();
            return;
          }
        }
      }
    }
  }

  componentDidMount() {
    this.props.getAllUserPosition();
    this.props.getAllUsers();
    mapLoader.load();
  }

  render() {
    if (!this.props.initialized) {
      return <Loading />;
    }
    if (!mapLoader.mapLoaded()) {
      return <LoadingMap />;
    }
    return this.props.children;
  }
}

const mapStateToProps = state => ({
  globalError: state.main.globalError,
  initialized: state.main.initialized
});

export default connect(mapStateToProps, {
  getAllUserPosition,
  getAllUsers
})(App);
