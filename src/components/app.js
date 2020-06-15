import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal } from "antd";
import { init } from "@/actions/main";
import { auth, utils } from "@/shared";
import Loading from "@/shared/controls/loading";

const { getUserId } = auth;

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

class App extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    globalError: PropTypes.object,
    init: PropTypes.func
  };

  componentWillReceiveProps(nextProps) {
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
    const { init } = this.props;
    init();
  }

  render() {
    if (!this.props.initialized) {
      return <Loading />;
    }
    return this.props.children;
  }
}

const mapStateToProps = state => ({
  globalError: state.main.globalError,
  initialized: state.main.initialized
});

export default connect(mapStateToProps, {
  init
})(App);
