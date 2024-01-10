import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Card, Tabs, Progress, Empty } from 'antd';
import { FileDoneOutlined, StarOutlined, UserOutlined, FileProtectOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import Summary from "../components/Agent/Summary";
// import VentasSummaryAgente from "../components/Agent/VentasSummaryAgente";
import Layout from "../layouts/ControlPanelLayout";
import SummaryOrders from "../components/Agent/SummaryOrders";
import OrderByEmployee from "../components/Clients/OrderByEmployee";
import Review from "../components/Generals/Review";
// import StatusPieChart from '../components/Agent/StatusPieChart';
import { isEmpty } from 'lodash';


const { Meta } = Card;
const { TabPane } = Tabs;
export default function Dashboard(props) {
  const ordenActual = { backgroundColor: 'rgb(175 223 155)' }
  const ordenFinalizada = { backgroundColor: '#8cb9e3' }
  const totalReviews = { backgroundColor: '#e68283' }
  const totalClientes = { backgroundColor: '#a9abd9' }
  const score = { backgroundColor: '#f6c665' }
  const calificacion = (<Progress percent={78} status="active" />);

  const [ordenesPro, setOrdenesPro] = useState([]);
  const [consumoAgentClient, setConsumoAgentClient] = useState([]);
  const [consumoAgentSupplier, setConsumoAgentSupplier] = useState([]);
  const [productosAgentClient, setProductosAgentClient] = useState([]);
  const [usuariosAgentClient, setUsuariosAgentClient] = useState([]);
  const [req_foll, setReq_foll] = useState([])
  const [total_users, setTotal_users] = useState([])
  const [reviewsMro, setReviewsMro] = useState([])
  const [consumoAgentStd, setConsumoAgentStd] = useState([])
  let token = localStorage.getItem('token');
  let role = localStorage.getItem('role');
  var type = role;

  useEffect(() => {

    // fetch('/api/consumo_clientesAgent', {
    //   headers: {
    //     'Accept': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   }
    // })
    //   .then((response) => {
    //     return response.json()

    //   })
    //   .then((consumoAgentClient) => {
    //     setConsumoAgentClient(consumoAgentClient)

    //   }).catch(console.log),

    // fetch('/api/consumo_supplierAgent', {
    //   headers: {
    //     'Accept': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   }
    // })
    //   .then((response) => {
    //     return response.json()

    //   })
    //   .then((consumoAgentStd) => {
    //     setConsumoAgentStd(consumoAgentStd)

    //   }).catch(console.log)


    // {
    //   (type == '5' || type == '3') &&
    //     (

    //       fetch('/api/ordenes_TransTotal', {
    //         headers: {
    //           'Accept': 'application/json',
    //           'Authorization': `Bearer ${token}`,
    //         }
    //       })
    //         .then((response) => {
    //           return response.json()

    //         })
    //         .then((req_foll) => {
    //           setReq_foll(req_foll)

    //         }).catch(console.log),

    //       fetch('/api/totalUsers', {
    //         headers: {
    //           'Accept': 'application/json',
    //           'Authorization': `Bearer ${token}`,
    //         }
    //       })
    //         .then((response) => {
    //           return response.json()

    //         })
    //         .then((total_users) => {
    //           setTotal_users(total_users)

    //         }).catch(console.log),

    //       fetch('/api/productos_serviciosAdmin', {
    //         headers: {
    //           'Accept': 'application/json',
    //           'Authorization': `Bearer ${token}`,
    //         }
    //       })
    //         .then((response) => {
    //           return response.json()

    //         })
    //         .then((productosAgentClient) => {
    //           setProductosAgentClient(productosAgentClient)

    //         }).catch(console.log),

    //       fetch('/api/usuarios_activosAdmin', {
    //         headers: {
    //           'Accept': 'application/json',
    //           'Authorization': `Bearer ${token}`,
    //         }
    //       })
    //         .then((response) => {
    //           return response.json()

    //         })
    //         .then((usuariosAgentClient) => {
    //           setUsuariosAgentClient(usuariosAgentClient)

    //         }).catch(console.log),

    //       fetch(`/api/get_close_orders_admin_reviews/${role}`, {
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
    //     ),
    //     (type == '1'||type == '2') ?
    //       (
    //         fetch('/api/ordenes_TransTotal', {
    //           headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //           }
    //         })
    //           .then((response) => {
    //             // console.log(response);
    //             return response.json()

    //           })
    //           .then((req_foll) => {
    //             setReq_foll(req_foll)

    //           }).catch(console.log),

    //         fetch('/api/ordenes_perfil', {
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

    //         fetch('/api/totalUsersAgent', {
    //           headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //           }
    //         })
    //           .then((response) => {
    //             return response.json()

    //           })
    //           .then((total_users) => {
    //             setTotal_users(total_users)

    //           }).catch(console.log),

    //         fetch('/api/productos_serviciosAgent', {
    //           headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //           }
    //         })
    //           .then((response) => {
    //             return response.json()

    //           })
    //           .then((productosAgentClient) => {
    //             setProductosAgentClient(productosAgentClient)

    //           }).catch(console.log),

    //         fetch('/api/usuarios_activosAgent', {
    //           headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //           }
    //         })
    //           .then((response) => {
    //             return response.json()

    //           })
    //           .then((usuariosAgentClient) => {
    //             setUsuariosAgentClient(usuariosAgentClient)

    //           }).catch(console.log),

    //         fetch(`/api/get_close_orders_agent_reviews/${role}`, {
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

    //           }).catch(console.log),

    //         fetch('/api/ventas_supplier', {
    //           headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //           }
    //         })
    //           .then((response) => {
    //             return response.json()

    //           })
    //           .then((consumoAgentSupplier) => {
    //             setConsumoAgentSupplier(consumoAgentSupplier)


    //           }).catch(console.log),

    //         fetch('/api/consumo_clientes', {
    //           headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //           }
    //         })
    //           .then((response) => {
    //             return response.json()

    //           })
    //           .then((consumoAgentClient) => {
    //             setConsumoAgentClient(consumoAgentClient)


    //           }).catch(console.log)



    //       ) : type == '5' ? (
    //         fetch('/api/gastos_perfilAdmin_supplier', {
    //           headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //           }
    //         })
    //           .then((response) => {
    //             return response.json()

    //           })
    //           .then((consumoAgentSupplier) => {
    //             setConsumoAgentSupplier(consumoAgentSupplier)


    //           }).catch(console.log)
    //       ) : (type == '3') && (
    //         fetch('/api/gastos_perfilAdmin_client', {
    //           headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //           }
    //         })
    //           .then((response) => {
    //             return response.json()

    //           })
    //           .then((consumoAgentClient) => {
    //             setConsumoAgentClient(consumoAgentClient)


    //           }).catch(console.log)

    //       )

    // }
  }, [])

  return (
    <Layout>

      <Tabs defaultActiveKey={1} tabPosition='top'>
        {
          type == 3 ? (
            <TabPane tab="Clientes" key={1}>
              {/* <Summary consumo={consumoAgentClient} title="Consumo de clientes" description="Reporte del consumo mes con mes."
                column1="Consumo" column2="Ahorro" column3="Costo en el mercado" role={role} /> */}
            </TabPane>
          ) : type == 5 ? (
            <TabPane tab="Proveedores" key={2}>
              {/* <Summary consumo={consumoAgentSupplier} title="Ventas de proveedores" description="Reporte del ventas de los proveedores mes con mes."
                column1="Ventas" column2="#Ordenes" column3="Costo del servicio" role={role} /> */}
            </TabPane>
          ) : (type == 1 || type == 2) && (
            <>
              <TabPane tab="Clientes" key={1}>
                {/* <Summary consumo={consumoAgentClient} title="Consumo de clientes" description="Reporte del consumo mes con mes."
                  column1="Consumo" column2="Ahorro" column3="Costo en el mercado" role={role} /> */}
              </TabPane>
              <TabPane tab="Proveedores" key={2}>
                {/* <VentasSummaryAgente consumo={consumoAgentSupplier} title="Ventas de proveedores" description="Reporte del ventas de los proveedores por orden."
                  role={role} /> */}
              </TabPane>
            </>
          )
        }


      </Tabs>



      <Row gutter={24}>
        <Col md={12} xs={24} lg={6}>
          <SummaryOrders title={`Total: ${req_foll}`} text="Ordenes en transito" description="Revisa las ordenes actuales." avatarColor={ordenActual} icon={<FileDoneOutlined />} />
        </Col>
        <Col md={12} xs={24} lg={6}>
          <SummaryOrders title="Total: 0" text="Garantias en transito" description="Revisa las garantias actuales." avatarColor={ordenFinalizada} icon={<FileProtectOutlined />} />
        </Col>
        <Col md={12} xs={24} lg={6}>
          <SummaryOrders title={`Total: ${total_users}`} text="Total de usuarios" description="Revisa los usuaros de tu app." avatarColor={totalClientes} icon={<UserOutlined />} />
        </Col>
        <Col md={12} xs={24} lg={6}>
          <SummaryOrders title="Score: 78 " text="Calificación de la aplicación" description={calificacion} avatarColor={score} icon={<StarOutlined />} />
        </Col>

      </Row>
      <Row gutter={24}>

        <Col lg={14} xs={24} style={{ marginTop: 16 }}>
          <Card headStyle={{ backgroundColor: "#002140", color: "white" }} title="Productos y servicios" >
            <Meta description="Revisa los productos y servicios mas usados." />
            <OrderByEmployee ordenesPro={productosAgentClient} type={1} style={{ marginTop: 16 }} />
          </Card>
        </Col>
        {/* <Col lg={10} xs={24} style={{ marginTop: 16 }}>
          <Card  >
            <Meta description="Revisa el status de tus ordenes." />
            <StatusPieChart />
          </Card>
        </Col> */}

      </Row>
      <Row gutter={24}>
        <Col lg={11} xs={24} style={{ marginTop: 16 }}>
          <Card headStyle={{ backgroundColor: "#002140", color: "white" }} title="Usuarios" >
            <Meta description="Revisa los usuarios mas activos." />
            <OrderByEmployee ordenesPro={usuariosAgentClient} type={2} role={role} style={{ marginTop: 16 }} />
          </Card>
        </Col>
        <Col lg={13} xs={24} style={{ marginTop: 16 }}>
          <Card headStyle={{ backgroundColor: "#002140", color: "white" }} title="Total de comentarios"
            bodyStyle={{
              maxHeight: 300,
              overflow: "auto"
            }}
          >
            <Meta description="Revisa los comentarios de tus clientes." />
            {
              !isEmpty(reviewsMro)  ? (
                reviewsMro.slice(0, 5).map((rev, index) => (
                  // review.map((rev,index) => (
                    <Link to={`/orders/details/${rev.id}/${rev.request_type_id}`}>
                  <Review title={rev.purchase_order} valor={rev.rate} description={rev.comment} key={index} />
                    </Link>
                  // ))
                ))

              ) : (
                <Empty />
              )
            }
          </Card>
        </Col>
      </Row>

    </Layout>
  )
}
