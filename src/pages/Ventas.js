import React, { useState, useEffect } from 'react';
import { Row, Col, Spin } from 'antd';
import Summary from "../components/Agent/Summary";
import Forbidden from "../components/Forbidden"
import Layout from '../layouts/ControlPanelLayout'

export default function Ventas(props) {
  // const {role}=props;
  // var type = role;
  let token = localStorage.getItem('token');
  let role =1;
  // let role = localStorage.getItem('role');
  const [consumoAgentSupplier, setConsumoAgentSupplier] = useState([]);
  
  useEffect(() => {
    // role == '1' ?
    //   (
    //     fetch('/api/ventas_supplier', {
    //       headers: {
    //         'Accept': 'application/json',
    //         'Authorization': `Bearer ${token}`,
    //       }
    //     })
    //       .then((response) => {
    //         return response.json()
    //       })
    //       .then((consumoAgentSupplier) => {
    //         setConsumoAgentSupplier(consumoAgentSupplier)
    //       }).catch(console.log)
    //   ) : role == '5' &&
    //   fetch('/api/gastos_perfilAdmin_supplier', {
    //     headers: {
    //       'Accept': 'application/json',
    //       'Authorization': `Bearer ${token}`,
    //     }
    //   })
    //     .then((response) => {
    //       return response.json()
    //     })
    //     .then((consumoAgentSupplier) => {
    //       setConsumoAgentSupplier(consumoAgentSupplier)
    //     }).catch(console.log)
  }, [])

  
    return (
      role == 4 || role == 6 ?
        <Forbidden />
        :
        <Layout>
          {/* <Summary consumo={consumoAgentSupplier} title="Ventas de proveedores" description="Reporte del ventas de los proveedores mes con mes."
            column1="Ventas" column2="#Ordenes" column3="Costo del servicio" role={role} /> */}
        </Layout>
    )
  
}

