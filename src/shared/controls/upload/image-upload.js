import React from "react";
import classnames from "classnames";
import FontIcon from "@/shared/controls/font-icon";
import BackgroundImage from "./background-image";
import "./style.scss";
import { Modal } from "antd";
import { commonMessages } from "@/shared/translations/common";
import { defineMessages } from "react-intl";

const messages = defineMessages({
  invalidFormat: {
    id: "UploadImage.Failed.InvalidFormat",
    defaultMessage: "上传失败，仅支持PNG、JPG、BMP"
  },
  maxSizeExceeded: {
    id: "UploadImage.Failed.MaxSizeExceeded",
    defaultMessage: "图片文件超过了2M的上限，请重新选择。"
  },
  emptyFile: {
    id: "UploadImage.Failed.EmptyFile",
    defaultMessage: "图片文件大小为0，请重新选择。"
  },
  corruptedFile: {
    id: "UploadImage.Failed.CorruptedFile",
    defaultMessage: "图片已损坏，请重新选择。"
  }
});

const FILE_TYPE_IMAGE_REG = /(image\/png|image\/jpe?g|image\/bmp)/;
const ENABLE_FILE_LIMIT = false;

export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: true
    };
  }

  uploadButton = React.createRef();

  _handleClick() {
    this.uploadButton.current.value = "";
  }

  showUploadWarning(msg) {
    const { intl } = this.props;
    Modal.warning({
      title: null,
      content: msg,
      centered: true,
      closable: true,
      okText: intl.formatMessage(commonMessages.OK)
    });
  }

  setImageUploadSource(source) {
    return source
      .replace(/^url\("?/, "") // Remove header
      .replace(/"?\)$/, "") // Remove footer
      .replace(/^data:image\/(\w+|\*);base64,/, ""); // Remove first/second header
  }

  _handlerChangeImageUpload = event => {
    var files = event.target.files;
    this._imageUpload(files);
  };

  _imageUpload = files => {
    const { intl, imageSizeMax, imageDidChanged } = this.props;
    const self = this;
    if (files.length > 0) {
      let file = files[0];
      let warningMsg;
      if (!FILE_TYPE_IMAGE_REG.test(file.type)) {
        warningMsg = intl.formatMessage(messages.invalidFormat);
      } else if (ENABLE_FILE_LIMIT && file.size > imageSizeMax) {
        warningMsg = intl.formatMessage(messages.maxSizeExceeded);
      } else if (file.size === 0) {
        warningMsg = intl.formatMessage(messages.emptyFile);
      }
      if (warningMsg) {
        this.showUploadWarning(warningMsg);
        return;
      }
      let render = new FileReader();
      render.readAsDataURL(file);
      render.onload = function () {
        var ret = this.result;
        var imgChecker = new Image();
        imgChecker.onerror = () => {
          self.showUploadWarning(intl.formatMessage(messages.corruptedFile));
        };
        imgChecker.onload = () => {
          let result = self.setImageUploadSource(ret);
          imageDidChanged(result);
        };
        imgChecker.src = ret;
      };
    }
  };

  render() {
    let tips = null,
      backGroundStyle = {
        flex: "auto"
      };

    if (!this.props.clip) {
      backGroundStyle.backgroundOrigin = "border-box";
    }
    if (!this.props.imageSource && !this.props.background) {
      tips = (
        <div className="pop-image-tips">
          <div>
            <FontIcon className="icon-add" />
            <p className="tips">{this.props.updateTips}</p>
          </div>
        </div>
      );
    } else if (
      (this.props.imageSource || this.props.background) &&
      this.state.hover
    ) {
      tips = (
        <div className="pop-image-tips-hover">
          <div>
            <FontIcon className="icon-add" />
            <p className="tips">{this.props.updateTips}</p>
          </div>
        </div>
      );
    }
    const labelClass = classnames({
      "pop-image-upload": true,
      "pop-image-upload-hover":
        (this.props.imageSource || this.props.background) && this.state.hover
    });
    return (
      <div
        style={{ display: "flex", flex: "auto" }}
        onMouseEnter={() => {
          this.setState({ hover: true });
        }}
        onMouseLeave={() => {
          this.setState({ hover: false });
        }}
      >
        <label className={labelClass} htmlFor="pop_image_upload_button">
          <BackgroundImage
            style={backGroundStyle}
            mode={this.props.clipMode}
            imageId={this.props.imageId}
            imageContent={this.props.imageSource}
            background={this.props.background}
          >
            {tips}
            <input
              id="pop_image_upload_button"
              ref={this.uploadButton}
              type="file"
              style={{ opacity: 0, position: "absolute" }}
              onClick={() => this._handleClick()}
              onChange={e => this._handlerChangeImageUpload(e)}
              accept="images/*"
            />
          </BackgroundImage>
        </label>
      </div>
    );
  }
}
