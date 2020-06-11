import React from "react";
import _ from "lodash";

export default class BackgroundImage extends React.Component {
  render() {
    const hasImg =
      this.props.imageContent || this.props.background
        ? "1px solid #d0d0d0"
        : "1px dashed #d0d0d0";
    const style = _.assign(
      {
        backgroundSize: this.props.mode || "cover",
        width: "100%",
        height: "100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        cursor: "pointer",
        border: hasImg
      },
      this.props.style
    );
    let url;
    if (this.props.imageContent) {
      url = "url(data:image/png;base64," + this.props.imageContent + ")";
    } else if (this.props.background) {
      url =
        "url(http://se-test-data.oss-cn-hangzhou.aliyuncs.com/" +
        this.props.background +
        "?x-oss-process=image/resize,w_" +
        this.props.width +
        ",h_" +
        this.props.height +
        "/format,png)";
    } else {
      url = "url(" + this.props.url + ")" || "url()";
    }
    style.backgroundImage = url;
    return (
      <div
        key={this.props.imageId}
        className={"pop-image"}
        style={style}
        title={this.props.title}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </div>
    );
  }
}
