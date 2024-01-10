import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
// import Summary from "../components/Agent/Summary";
import Forbidden from "../components/Forbidden"
import Layout from '../layouts/ControlPanelLayout'
import { Row, Col, Spin } from 'antd';
import CustomerService from '../utils/api/customers';
export default function Cosumo(props) {
  // const { role } = props;
  // var type = role;
  const [consumo, setConsumo] = useState([]);
  let token = localStorage.getItem('token');
  let role = localStorage.getItem('role');

  useEffect(() => {
    {
      CustomerService.Consume()
      .then((response) => {
        return response.json()
      })
      .then((consumo) => {
        setConsumo(consumo)
      }).catch(console.log)
    }
  }, [])


  useEffect(() => {
    {
      role == '1' ?
        (
          CustomerService.ClientConsume()
          .then((response) => {
            return response.json()
          })
          .then((consumo) => {
            setConsumo(consumo)
          }).catch(console.log)
        ) :
        role == '3' &&
          (
            CustomerService.ProfileConsume()
            .then((response) => {
              return response.json()
            })
            .then((consumo) => {
              setConsumo(consumo)
            }).catch(console.log)
          ) 
    }
  }, [])

  // if (consumo == ''){
  //   return (
  //     <Row align='middle'>
  //         <Col style={{ marginTop: 100, marginLeft: "auto", marginRight: "auto" }}>
  //             <Spin size="large" tip="Cargando información" style={{ marginTop: 250, height: 450 }} />
  //         </Col>
  //     </Row>
  // )
  // } else {
    return (
      role == 4 || role == 6 ?
        <Forbidden />
        :
      <Layout>
        {/* <Summary consumo={consumo} title="Consumo de clientes" description="Reporte del consumo mes con mes."
          column1="Consumo" column2="Ahorro" column3="Costo en el mercado" role={role} /> */}
      </Layout>
    )

  // }
}

if (document.getElementById('Cosumo')) {
  ReactDOM.render(<Cosumo />, document.getElementById('Cosumo'));
}