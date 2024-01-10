import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Tag, Result, message, BackTop, Spin } from 'antd';
import { LoadingOutlined, SmileOutlined } from '@ant-design/icons';

import ComplaintInfo from "../components/ComplaintInfo";
import ComplaintStep from "../components/ComplaintStep";
import Chat from "../components/Chat";
import Rate from "../components/Rate";
import Collapse from '../components/StepsCollapse'
import LayoutPage from "../layouts/LayoutPage";
import SupplierLayout from "../layouts/SupplierLayout";
import CPLayout from "../layouts/ControlPanelLayout";
import { useNavigate, useParams } from 'react-router-dom';
import Login from "./Login"
import { isEmpty } from 'lodash';
import ComplaintService from "../utils/api/complaints";
import OrderUsers from '../components/Generals/OrderUsers/OrderUsers';


export default function ComplaintDetails() {
  let { id } = useParams();
  let role = localStorage.getItem('role');

  const [complaint, setComplaint] = useState({});

  const [reload, setReload] = useState(false)


  let token = localStorage.getItem('token');
  var type = role;
  var Layout = '';

  if (type == '4') {

    Layout = LayoutPage;
  } else if (type == 6) {
    Layout = SupplierLayout;
  } else if (type == 1 || type == 3 || type == 5 || type == 10) {
    Layout = CPLayout;
  }


  useEffect(() => {
    ComplaintService.GetComplaint(id)
    .then(response => {
      setComplaint(response.data)
      // console.log(response.data);
    })
    .catch(error => {
      console.log(error)
    })

  }, [reload])


  if (token == null) {
    return <Login />
  } else {
    return (
      <Layout>
        {
          (Object.entries(complaint).length === 0) ?
            <Row gutter={[12, 12]} justify="center" align='middle'>
              <Col xs={24} style={{ textAlign: 'center' }} >
                <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 90 }} spin />} tip="Cargando..." />
              </Col>
            </Row>
            :
            <Row gutter={[12, 12]}>

              <Col xs={24} lg={16} xl={16} >

                <ComplaintInfo
                  details={complaint.queja}
                  reload={reload}
                  role={role}
                  token={token}
                  setReload={setReload}
                />

              </Col>
              <Col xs={24} md={24} lg={8} xl={8}>
                <Row gutter={[12, 12]}>
                  <Col xs={24} >
                    <OrderUsers data={complaint} token={token} op={2} />

                  </Col>
                  <Col xs={24}>
                    <ComplaintStep info={complaint.queja.logs} />
                  </Col>
                </Row>

              </Col>
            </Row>
        }
        <BackTop />
      </Layout>
    )
  }


}
