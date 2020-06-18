import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Select, Icon, Spin } from "antd";
import { getAllBuildings, selectSpot } from "@/actions/main";
import "./styles.scss";
import _ from "lodash";

export default function SearchSpot(props) {
  const loadingSpots = useSelector(state => state.main.loadingSpots);
  const spots = useSelector(state => state.main.spots);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBuildings(props.customerId));
  }, [props.customerId]);

  return (
    <div className="search-spot">
      <Select
        onChange={spot => dispatch(selectSpot(spot))}
        labelInValue={true}
        style={{ width: 340 }}
        showSearch={true}
        notFoundContent={loadingSpots ? <Spin size="small" /> : null}
        placeholder={
          <span>
            <Icon type="search" />
            {" 请搜索站点"}
          </span>
        }
        allowClear={true}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {spots.map(spot => (
          <Select.Option key={spot.HierarchyId} value={spot.HierarchyId}>
            {spot.Name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}
