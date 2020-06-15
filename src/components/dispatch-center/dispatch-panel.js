import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Drawer, Button, Card, Avatar, Checkbox, PageHeader } from "antd";
import { setVisible } from "@/actions/dispatch-panel";

const CARD_GRID_STYLE = { width: "100%" };

function UserList(props) {
  return (
    <Checkbox.Group style={{ width: "100%" }}>
      <Card>
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

function TicketSetting(props) {
  return <div>TODO</div>;
}

function Footer(props) {
  const buttons = [
    <Button
      key="footer-cancel"
      onClick={props.onClose}
      style={{ marginRight: 8 }}
    >
      取消
    </Button>
  ];

  if (props.page === 1) {
    buttons.push(
      <Button key="footer-next" onClick={() => props.setPage(2)} type="primary">
        下一步
      </Button>
    );
  } else {
    buttons.push(
      <Button
        key="footer-dispatch"
        onClick={() => props.dispatch()}
        type="primary"
      >
        派工
      </Button>
    );
  }

  return <div className="dispatch-panel-drawer-footer">{buttons}</div>;
}

function Title(props) {
  if (props.page === 1) {
    return "请选择班组/驻场工程师";
  }
  return (
    <PageHeader
      style={{
        padding: 0
      }}
      onBack={() => props.setPage(1)}
      title="请填写工单内容"
    />
  );
}

export default function DispatchPanel(props) {
  const panelVisible = useSelector(state => state.dispatchPanel.visible);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const onClose = () => {
    dispatch(setVisible(false));
  };

  return (
    <Drawer
      width={340}
      placement="right"
      title={<Title page={page} setPage={setPage} />}
      closable={false}
      onClose={onClose}
      visible={panelVisible}
      mask={false}
      bodyStyle={{ padding: 0 }}
    >
      {page === 1 ? <UserList /> : <TicketSetting />}
      <Footer
        page={page}
        onClose={onClose}
        setPage={setPage}
        dispatch={props.dispatch}
      />
    </Drawer>
  );
}
