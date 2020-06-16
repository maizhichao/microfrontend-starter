import React, { useState } from "react";
import { Drawer, Card, Avatar, Checkbox } from "antd";

const CARD_GRID_STYLE = { width: "100%" };

function LogList(props) {
  return (
    <Checkbox.Group style={{ width: "100%" }}>
      <Card>
        <Card.Grid style={CARD_GRID_STYLE} hoverable={false}>
          <Card.Meta
            avatar={
              <div className="flex-center">
                <Checkbox style={{ paddingRight: 10 }}></Checkbox>
                <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
              </div>
            }
            title={"title"}
            description="Progresser XTech"
          ></Card.Meta>
        </Card.Grid>
        <Card.Grid style={CARD_GRID_STYLE}>
          <Card.Meta
            avatar={
              <div className="flex-center">
                <Checkbox style={{ paddingRight: 10 }}></Checkbox>
                <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
              </div>
            }
            title={"title"}
            description="Progresser XTech"
          ></Card.Meta>
        </Card.Grid>
        <Card.Grid style={CARD_GRID_STYLE}>
          <Card.Meta
            avatar={
              <div className="flex-center">
                <Checkbox style={{ paddingRight: 10 }}></Checkbox>
                <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
              </div>
            }
            title={"title"}
            description="Progresser XTech"
          ></Card.Meta>
        </Card.Grid>
      </Card>
    </Checkbox.Group>
  );
}

function Title(props) {
  return `24小时内抢修记录 (${props.dispatchCount})`;
}

function Arrow(props) {
  return (
    <div className="dispatch-log-arrow" onClick={props.onClick}>
      <p title="隐藏抢修记录">‹</p>
    </div>
  );
}

export default function DispatchLog(props) {
  const [visible, setVisible] = useState(false);
  if (!visible) {
    return (
      <div className="dispatch-log-anchor" onClick={() => setVisible(true)}>
        24小时抢修记录
      </div>
    );
  }

  return (
    <Drawer
      width={340}
      placement="left"
      title={<Title dispatchCount={10} />}
      visible={true}
      mask={false}
      closable={false}
      bodyStyle={{ padding: 0 }}
    >
      <Arrow onClick={() => setVisible(false)} />
      <LogList />
    </Drawer>
  );
}
