import React, { Component } from "react";
import PropTypes from "prop-types";
import { HIERARCHY_TYPE } from "@/constants/hierarchy";
import { Tree, TreeSelect as AntDTreeSelect } from "antd";
const { TreeNode } = Tree;

export const PANEL_TYPE = {
  Distribution: 0, //配电柜
  Data: 10, //数据机柜
  Transformer: 20, //变压器柜
  SystemEqu: 30, //系统装置,
  RelatedDevice: 40, //关联设备,
  PluginBox: 50, //插接箱
  FunctionUnit: 60 //功能单元组
};

export const ROOM_TYPE = {
  Switch: 1, //配电室
  Data: 2, //数据机房
  FrequencyConversion: 3, //变频室
  System: 4, //系统,
  Motherline: 7 //母线系统
};

function getHierarchyIcon(node) {
  const isAsset = node.IsAsset;
  switch (node.Type) {
    case HIERARCHY_TYPE.Customer:
      return "icon-customer";
    case HIERARCHY_TYPE.Organization:
      return "icon-orgnization";
    case HIERARCHY_TYPE.Site:
      return "icon-site";
    case HIERARCHY_TYPE.Building:
      return "icon-building";
    case HIERARCHY_TYPE.Room:
      switch (node.SubType) {
        case ROOM_TYPE.Motherline:
          return "icon-busway-system";
        default:
          return "icon-room";
      }
    case HIERARCHY_TYPE.Panel:
      switch (node.SubType) {
        case PANEL_TYPE.PluginBox:
          return "icon-Socket-box";
        case PANEL_TYPE.FunctionUnit:
          return "icon-Functional-unit-group";
        default:
          return isAsset ? "icon-panel" : "icon-panel-box";
      }
    case HIERARCHY_TYPE.Circuit:
      return isAsset ? "icon-circuit" : "icon-circuit-box";
    case HIERARCHY_TYPE.Device:
      return isAsset ? "icon-device" : "icon-device-box";
    case HIERARCHY_TYPE.Asset:
      return "icon-device";
    case HIERARCHY_TYPE.Area:
      return "icon-dimension-node";
  }
}

function renderTreeNodes(
  data,
  clickableNodeTypes = Object.values(HIERARCHY_TYPE)
) {
  const icon = <div className={getHierarchyIcon(data)} />;
  const disabled =
    [...clickableNodeTypes, HIERARCHY_TYPE.Asset].indexOf(data.Type) === -1;
  if (data.Children && data.Children.length) {
    return (
      <TreeNode
        title={data.Name}
        disabled={disabled}
        key={String(data.Id)}
        value={data.Id}
        icon={icon}
        disableCheckbox
        nodeType={data.Type}
      >
        {data.Children.map(item => renderTreeNodes(item, clickableNodeTypes))}
      </TreeNode>
    );
  }
  return (
    <TreeNode
      title={data.Name}
      key={String(data.Id)}
      value={data.Id}
      disabled={disabled}
      icon={icon}
      disableCheckbox
      nodeType={data.Type}
      isLeaf
    />
  );
}

export class TreeSelect extends Component {
  static propTypes = {
    hierarchyTree: PropTypes.object,
    placeholder: PropTypes.string,
    onTreeNodeSelect: PropTypes.func,
    selectedKey: PropTypes.any
  };

  state = {
    value: null
  };

  constructor(props) {
    super(props);
    const key = props.selectedKey;
    this.state = {
      value: key
    };
  }

  onChange = (value, nodeType) => {
    this.setState({ value }, () => {
      this.props.onTreeNodeSelect(value, nodeType);
    });
  };

  render() {
    const { hierarchyTree, ignoreRootNode, clickableNodeTypes } = this.props;
    if (!hierarchyTree) {
      return null;
    }
    let treeNodes = null;
    if (ignoreRootNode) {
      treeNodes = hierarchyTree.Children
        ? hierarchyTree.Children.map((v, i) => {
            return renderTreeNodes(v, clickableNodeTypes);
          })
        : [];
    } else {
      treeNodes = renderTreeNodes(hierarchyTree, clickableNodeTypes);
    }

    const { placeholder } = this.props;
    return (
      <AntDTreeSelect
        treeIcon
        value={this.state.value}
        onChange={(value, label, extra) => {
          let nodeType = extra.triggerNode.props.nodeType;
          this.onChange(value, nodeType);
        }}
        style={{ width: "100%" }}
        dropdownStyle={{
          width: 216,
          maxHeight: 268,
          overflow: "auto",
          overflowX: "hidden"
        }}
        placeholder={placeholder}
      >
        {treeNodes}
      </AntDTreeSelect>
    );
  }
}

export class TreeView extends Component {
  static propTypes = {
    hierarchyTree: PropTypes.object,
    selectedKey: PropTypes.string,
    expandedKeys: PropTypes.array,
    onSelect: PropTypes.func
  };

  onSelect = (selectedKeys, { node }) => {
    const { eventKey: key, nodeType } = node.props;
    this.props.onSelect({ key, nodeType });
  };

  shouldComponentUpdate(nextProps) {
    return this.props.hierarchyTree !== nextProps.hierarchyTree;
  }

  render() {
    const { hierarchyTree } = this.props;
    if (!hierarchyTree) {
      return null;
    }
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <Tree showIcon onSelect={this.onSelect}>
          {renderTreeNodes(hierarchyTree)}
        </Tree>
      </div>
    );
  }
}
