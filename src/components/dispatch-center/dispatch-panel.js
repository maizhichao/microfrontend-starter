import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Drawer, Button, Card, Avatar, Checkbox, PageHeader, Spin } from "antd";
import { setVisible, getSortedUsers } from "@/actions/dispatch-panel";
import _ from "lodash";
import { getDispatchMap } from "./index";

const CARD_GRID_STYLE = { width: "100%" };

function UserDesc({ user, time, distance }) {
  return (
    <div>
      <p>
        路程: 预计{time}分钟到达 ({distance}km)
      </p>
      <p></p>状态: {user.status}
    </div>
  );
}

function parseRouteToPath(route) {
  const path = [];
  for (let i = 0, l = route.steps.length; i < l; i++) {
    const step = route.steps[i];
    for (let j = 0, n = step.path.length; j < n; j++) {
      path.push(step.path[j]);
    }
  }
  return path;
}

function removeRoute(routeLine) {
  const dispatchMap = getDispatchMap();
  dispatchMap.remove(routeLine);
}

function drawRoute(startPosition, currentSpot) {
  const dispatchMap = getDispatchMap();
  return new Promise((resolve, reject) => {
    AMap.plugin("AMap.Driving", async () => {
      const driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME
      });
      driving.search(startPosition, currentSpot, function (status, result) {
        if (status === "complete") {
          if (result.routes && result.routes.length) {
            const path = parseRouteToPath(result.routes[0]);
            const routeLine = new AMap.Polyline({
              path: path,
              isOutline: true,
              outlineColor: "#ffeeee",
              borderWeight: 2,
              strokeWeight: 5,
              strokeColor: "#0091ff",
              lineJoin: "round"
            });
            routeLine.setMap(dispatchMap);
            resolve(routeLine);
          }
        }
      });
    });
  });
}

function UserList(props) {
  const dispatch = useDispatch();
  const users = useSelector(state => state.main.users);
  const userPosition = useSelector(state => state.main.userPosition);
  const currentSpot = useSelector(state => state.dispatchPanel.currentSpot);
  const sortedUsers = useSelector(state => state.dispatchPanel.sortedUsers);
  const loadingSortedUsers = useSelector(
    state => state.dispatchPanel.loadingSortedUsers
  );

  useEffect(() => {
    dispatch(getSortedUsers(currentSpot, userPosition, users));
    return () => {};
  }, [currentSpot]);

  if (!props.display) {
    return null;
  }

  if (loadingSortedUsers) {
    return (
      <div className="flex-center">
        <Spin size="large" tip="计算派工人员列表..." />
      </div>
    );
  }

  const onChange = async (key, checked) => {
    if (checked) {
      const routeLine = await drawRoute(userPosition[key], currentSpot);
      props.setRouteLines({ ...props.routeLines, [key]: routeLine });
    } else {
      removeRoute(props.routeLines[key]);
      props.setRouteLines({ ...props.routeLines, [key]: null });
    }
  };

  return (
    <Card>
      {sortedUsers.map(([key, time, distance]) => {
        const user = users[key];
        return (
          <Card.Grid style={CARD_GRID_STYLE} hoverable={false}>
            <Card.Meta
              avatar={
                <div className="flex-center">
                  <Checkbox
                    checked={!!props.routeLines[key]}
                    onChange={e => onChange(key, e.target.checked)}
                    style={{ paddingRight: 10 }}
                  ></Checkbox>
                  <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                </div>
              }
              title={user.name}
              description={
                <UserDesc user={user} distance={distance} time={time} />
              }
            ></Card.Meta>
          </Card.Grid>
        );
      })}
    </Card>
  );
}

function TicketSetting(props) {
  if (!props.display) {
    return null;
  }
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
      <Button
        key="footer-next"
        disabled={props.nextStepDisabled}
        onClick={() => props.setPage(2)}
        type="primary"
      >
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
  const [routeLines, setRouteLines] = useState({});
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
      <UserList
        routeLines={routeLines}
        setRouteLines={setRouteLines}
        display={page === 1}
      />
      <TicketSetting display={page === 2} />
      <Footer
        page={page}
        onClose={onClose}
        setPage={setPage}
        nextStepDisabled={_.isEmpty(routeLines)}
        dispatch={props.dispatch}
      />
    </Drawer>
  );
}
