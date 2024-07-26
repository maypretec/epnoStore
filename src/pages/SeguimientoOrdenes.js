import React, { useState, useEffect } from "react";
import {Row, Col} from "antd";

import GeneralTable from "../components/Generals/OrdersTable/GeneralTable";
import AgentTable from "../components/Generals/OrdersTable/AgentTable";
import LayoutPage from "../layouts/LayoutPage";
import SupplierLayout from "../layouts/SupplierLayout";
import CPLayout from "../layouts/ControlPanelLayout";
import OrderService from "../utils/api/orders";

export default function SeguimientoOrdenes(props) {
  let role_auth = localStorage.getItem("role");
  var Layout = "";
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
      }).catch((error) => {  setLoading(false); });
    }

    if (role_auth === '6') { // GET SERVICES FOR SUPPLIER
      const categories = { cat1: user.role_data.cat1, cat2: user.role_data.cat2 }
      OrderService.GetServicesByCategory(categories).then(response => {
        const serviceUser1 = response.data.filter(ser => ser.status == 2)
        const serviceUser2 = response.data.filter(ser => ser.status > 3 && ser.supplierId == user.id)
        const combinedServiceUsers = [...serviceUser1, ...serviceUser2];
        setOpenOrders(combinedServiceUsers);
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
