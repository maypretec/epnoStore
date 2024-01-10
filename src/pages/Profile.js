import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Divider, Collapse, Tabs, Typography, Card,Empty } from 'antd';
import { RightOutlined } from "@ant-design/icons";
import LayoutPage from "../layouts/LayoutPage";
import SupplierLayout from "../layouts/SupplierLayout";
import CPLayout from "../layouts/ControlPanelLayout";
import Review from "../components/Generals/Review";
// import SavingsChart from "../components/Supplier/SavingsChart";
// import ComparisonCharts from '../components/Supplier/ComparisonChart';
// import SpentChart from '../components/Supplier/SpentChart';
import ProfileInfo from "../components/Generals/ProfileInfo";
import OrderByEmployee from "../components/Clients/OrderByEmployee";
import { isEmpty } from 'lodash';
import { Link, useParams } from 'react-router-dom';

const { TabPane } = Tabs;
const { Title } = Typography;
const { Panel } = Collapse;

export default function Profile(props) {
  let {id } = useParams();
  const [locations, setLocations] = useState([]);
  const [gastosMes, setGastosMes] = useState([]);
  const [ordenesPro, setOrdenesPro] = useState([]);
  const [revAgent, setRevAgent] = useState([]);
  const [reviewsMro, setReviewsMro] = useState([])
  let token = localStorage.getItem('token');
  let role = localStorage.getItem('role');
  var Layout = '';
  const panelStyle = { backgroundColor: "#001529", color: "white" };
  const panelHeader = (title) => (<Row><Col span={24}><Title level={4} style={{ color: "white" }}>{title}</Title></Col></Row>);

  // const title = "COT-1"
  if (role == '4') {

    Layout = LayoutPage;
  } else if (role == '6') {
    Layout = SupplierLayout;
  } else {
    Layout = CPLayout;

  }

  useEffect(() => {
    // fetch('/api/ordenes_perfil', {
    //   headers: {
    //     'Accept': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   }
    // })
    //   .then((response) => {
    //     return response.json()

    //   })
    //   .then((ordenesPro) => {
    //     setOrdenesPro(ordenesPro);

    //   }).catch(console.log),

    //   fetch(`/api/profile_locationsAgent/${id}`, {
    //     headers: {
    //       'Accept': 'application/json',
    //       'Authorization': `Bearer ${token}`,
    //     }
    //   })
    //     .then((response) => {
    //       return response.json()

    //     })
    //     .then((locations) => {
    //       setLocations(locations)

    //     }).catch(console.log)

    // {
    //   (type == '1' || type == '2') ?
    //     (
    //       fetch('/api/ordenes_perfil', {
    //         headers: {
    //           'Accept': 'application/json',
    //           'Authorization': `Bearer ${token}`,
    //         }
    //       })
    //         .then((response) => {
    //           return response.json()

    //         })
    //         .then((ordenesPro) => {
    //           setOrdenesPro(ordenesPro);

    //         }).catch(console.log),

    //       fetch('/api/gastos_perfil', {
    //         headers: {
    //           'Accept': 'application/json',
    //           'Authorization': `Bearer ${token}`,
    //         }
    //       })
    //         .then((response) => {
    //           return response.json()

    //         })
    //         .then((gastosMes) => {
    //           setGastosMes(gastosMes);

    //         }).catch(console.log),

    //       fetch(`/api/get_close_orders_agent_reviews/${role}`, {
    //         headers: {
    //           'Accept': 'application/json',
    //           'Authorization': `Bearer ${token}`,
    //         }
    //       })
    //         .then((response) => {
    //           return response.json()

    //         })
    //         .then((reviewsMro) => {
    //           setReviewsMro(reviewsMro);

    //         }).catch(console.log)
    //     ) :
    //     (type == '3' || type == '5') ?
    //       (
    //         fetch('/api/ordenes_perfilAdmin', {
    //           headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //           }
    //         })
    //           .then((response) => {
    //             return response.json()

    //           })
    //           .then((ordenesPro) => {
    //             setOrdenesPro(ordenesPro);

    //           }).catch(console.log),

    //         fetch('/api/gastos_perfilAdmin_supplier', {
    //           headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //           }
    //         })
    //           .then((response) => {
    //             return response.json()

    //           })
    //           .then((gastosMes) => {
    //             setGastosMes(gastosMes);

    //           }).catch(console.log),

    //         fetch(`/api/get_close_orders_admin_reviews/${role}`, {
    //           headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //           }
    //         })
    //           .then((response) => {
    //             return response.json()

    //           })
    //           .then((reviewsMro) => {
    //             setReviewsMro(reviewsMro);

    //           }).catch(console.log)

    //       ) :
    //       (type == '4' || type == '6') &&
    //       (

    //         fetch('/api/ordenes_perfilStd', {
    //           headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //           }
    //         })
    //           .then((response) => {
    //             return response.json()

    //           })
    //           .then((ordenesPro) => {
    //             setOrdenesPro(ordenesPro);

    //           }).catch(console.log),

    //         fetch('/api/gastos_perfilClient',
    //           {
    //             headers: {
    //               'Accept': 'application/json',
    //               'Authorization': `Bearer ${token}`,
    //             }
    //           })
    //           .then((response) => {
    //             return response.json()

    //           })
    //           .then((gastosMes) => {
    //             setGastosMes(gastosMes);

    //           }).catch(console.log)
    //         ,

    //         fetch(`/api/get_close_orders_std_reviews/${role}`, {
    //           headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //           }
    //         })
    //           .then((response) => {
    //             return response.json()

    //           })
    //           .then((reviewsMro) => {
    //             setReviewsMro(reviewsMro);

    //           }).catch(console.log)
    //       )
    // }
  }, [])


  return (
    <Layout>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <ProfileInfo locations={locations} id={id} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Collapse accordion defaultActiveKey={1} expandIcon={({ isActive }) => <RightOutlined style={{ color: "white" }} rotate={isActive ? 90 : 0} />}>
            {/* <Panel header={panelHeader("Grafica de Ahorros")} key={1} style={{ ...panelStyle }}>
                            <Tabs defaultActiveKey={1} tabPosition='top'>
                                <TabPane tab="Ahorro" key={1}>
                                    <SavingsChart 
                                      ahorroMes = {gastosMes}
                                    />
                                </TabPane>
                                <TabPane tab="Gastos" key={2}>
                                    <SpentChart
                                      gastosMes = {gastosMes}
                                    />
                                </TabPane>
                                <TabPane tab="Contraste" key={3}>
                                    <ComparisonCharts 
                                      contrasteMes = {gastosMes}
                                    />
                                </TabPane>
                                <TabPane tab="Tipo" key={4}>
                                </TabPane>
                            </Tabs>
                        </Panel> */}
            {/* Holis */}
            <Panel header={panelHeader("Ordenes")} style={{ ...panelStyle }} key={2}>
              <OrderByEmployee ordenesPro={ordenesPro} role={role} type={2} />
            </Panel>

            <Panel header={panelHeader("Reviews")} style={{ ...panelStyle }} key={3}>
              <Card bordered={false}
                bodyStyle={{
                  maxHeight: 350,
                  overflow: "auto"
                }}
              >
                {
                  !isEmpty(reviewsMro) ? (
                    reviewsMro.slice(0, 5).map((rev, index) => (
                      // review.map((rev,index) => (
                      <Link to={`/orders/details/${role}/${rev.id}/${rev.request_type_id}`}>
                        <Review title={rev.purchase_order} valor={rev.rate} description={rev.comment} key={index} />
                      </Link>
                      // ))
                    ))

                  ) : (
                    <Empty />
                  )
                }
              </Card>
            </Panel>
          </Collapse>
        </Col>
      </Row>
      {/* <Divider orientation='left'>Partnos mas comprados</Divider> */}
    </Layout>

  );
}

