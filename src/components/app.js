import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal } from "antd";
import { init } from "@/actions/main";
import { commonMessages } from "@/shared/translations/common";
import { injectIntl, intlShape } from "react-intl";
import { auth, utils } from "@/shared";
import Loading from "@/shared/controls/loading";

const { getUserId } = auth;

function throwUnknownError(intl) {
  if (process.env.NODE_ENV !== "production") {
    Modal.error({
      title: intl.formatMessage(commonMessages.unknownErrorTitle),
      content: intl.formatMessage(commonMessages.unknownError),
      centered: true,
      okText: intl.formatMessage(commonMessages.OK)
    });
  }
}

class App extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    match: PropTypes.object,
    globalError: PropTypes.object,
    init: PropTypes.func
  };

  componentWillReceiveProps(nextProps) {
    const { intl, globalError } = nextProps;
    if (this.props.globalError !== globalError) {
      if (globalError) {
        switch (globalError.status) {
          case 401: {
            Modal.warning({
              centered: true,
              content: intl.formatMessage(commonMessages.loginError),
              okText: intl.formatMessage(commonMessages.OK),
              autoFocusButton: "ok",
              onOk: () => {
                utils.exit();
              }
            });
            break;
          }
          default: {
            throwUnknownError(intl);
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
    console.log("render app");
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
})(injectIntl(App));
