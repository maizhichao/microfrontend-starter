import React, { Component } from "react";
import PropTypes from "prop-types";
import querystring from "querystring";
import { connect } from "react-redux";
import { injectIntl, intlShape } from "react-intl";
import { init } from "@/actions/main";
import { auth, sensors, utils } from "@/shared";
import { commonMessages } from "@/shared/translations/common";

const { getUserId, getCustomerId } = auth;

class Main extends Component {
  static propTypes = {
    intl: intlShape.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!getCustomerId() && getUserId()) {
      const { search } = location;
      if (search.length > 0) {
        const callbackURL = querystring.parse(search.substr(1)).callbackURL;
        if (callbackURL) {
          return (location.href = callbackURL);
        }
      }
    }
  }

  componentDidMount() {
    if (getUserId()) {
      this.props.init();
    }
    sensors.addCustomerEvent();
  }

  render() {
    let { intl, customerList, children } = this.props;

    if (!customerList) {
      return null;
    }

    if (customerList.length === 0) {
      return (
        <div className="select-customer-no-pril-tip">
          <div>{intl.formatMessage(commonMessages.notEnoughPermission)}</div>
          <div>{intl.formatMessage(commonMessages.contactAdministrator)}</div>
          <button onClick={() => utils.exit()}>
            {intl.formatMessage(commonMessages.exit)}
          </button>
        </div>
      );
    }

    return children;
  }
}

export default connect(
  state => {
    return {
      customerList: state.main.customerList
    };
  },
  {
    init
  }
)(injectIntl(Main));
