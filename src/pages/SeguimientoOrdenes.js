import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col, Input, Table, Button, Space, Tag } from "antd";

import GeneralTable from "../components/Generals/OrdersTable/GeneralTable";
import AgentTable from "../components/Generals/OrdersTable/AgentTable";
// import Layout from "../../views/layouts/LayoutPage";
// import "../../sass/SeguimientoOrdenes.scss";
import LayoutPage from "../layouts/LayoutPage";
import SupplierLayout from "../layouts/SupplierLayout";
import CPLayout from "../layouts/ControlPanelLayout";
import OrderService from "../utils/api/orders";

import { Link, useParams } from "react-router-dom";

export default function SeguimientoOrdenes(props) {
  let { type } = useParams();
  let role_auth = localStorage.getItem("role");
  var Layout = "";
  let token = localStorage.getItem("token");
  const [openOrders, setOpenOrders] = useState([]);
  const [loading, setLoading] = useState(false);

	const user = JSON.parse(localStorage.getItem('user'))

  if (role_auth == 4) {
    Layout = LayoutPage;
  } else if (role_auth == 6) {
    Layout = SupplierLayout;
  } else if (
    role_auth == 1 ||
    role_auth == 3 ||
    role_auth == 5 ||
    role_auth == 2 ||
    role_auth == 10
  ) {
    Layout = CPLayout;
  }


  useEffect(() => {
    setLoading(true)
    
    if (role_auth === '1') { // GET SERVICES FOR ADMIN
      OrderService.GetAll().then(response => {
        setOpenOrders(response.data);
        setLoading(false);
      }).catch((error) => { setLoading(false); });
    }

    if (role_auth === '4') { // GET SERVICES FOR INDUSTRY
      OrderService.GetServicesByUser({id: user.id}).then(response => {
        setOpenOrders(response.data);
        setLoading(false);
      }).catch((error) => { setLoading(false); });
    }

    if (role_auth === '6') { // GET SERVICES FOR SUPPLIER
      const categories = { cat1: user.role_data.cat1, cat2: user.role_data.cat2 }
      OrderService.GetServicesByCategory(categories).then(response => {
        setOpenOrders(response.data);
        setLoading(false);
      }).catch((error) => { setLoading(false); console.log(error) });
    }
  }, []);

  return (
    <Layout>
      <Row gutter={24}>
        <Col xs={24}>
          {role_auth == 6 || role_auth == 4 ? (
            <GeneralTable openOrders={openOrders} loading={loading} />
          ) : (
            (role_auth == 1 ||
              role_auth == 5 ||
              role_auth == 3 ||
              role_auth == 2 ||
              role_auth == 10) && (
              <AgentTable openOrders={openOrders} loading={loading} />
            )
          )}
        </Col>
      </Row>
    </Layout>
  );
}
