import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Layout from '../layouts/SupplierLayout';
import Ganancias from "../components/Supplier/Ganancias";
import { Row, Col, Card } from "antd";
import SummaryOrder from "../components/Agent/SummaryOrders";
import { FundOutlined, FileDoneOutlined, DollarOutlined, StarOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

const { Meta } = Card;
export default function Finanzas() {
    let role = localStorage.getItem('role');
    let token = localStorage.getItem('token');
    const ganancia = { backgroundColor: "#52c41a" }
    const servicio = { backgroundColor: "#13c2c2" }
    const promedio = { backgroundColor: "#9254de" }
    const calificación = { backgroundColor: "#1890ff" }
    const [ganancias, setGanancias] = useState([])
    const [gananciasResumen, setGananciasResumen] = useState([])
    const [gananciasEmpty, setGananciasEmpty] = useState(false)
    useEffect(() => {
        // role == 6 && (
        //     fetch('/api/ganancias_supplier', {
        //         headers: {
        //             'Accept': 'application/json',
        //             'Authorization': `Bearer ${token}`,
        //         }
        //     })
        //         .then((response) => {
        //             return response.json()

        //         })
        //         .then((ganancias) => {
        //             setGanancias(ganancias);

        //             if (isEmpty(ganancias['orderSum'])) {
        //                 setGananciasEmpty(true);
        //             }

        //         }).catch(console.log),

        //     fetch('/api/ganancias_resumen_supplier', {
        //         headers: {
        //             'Accept': 'application/json',
        //             'Authorization': `Bearer ${token}`,
        //         }
        //     })
        //         .then((response) => {
        //             return response.json()

        //         })
        //         .then((gananciasResumen) => {
        //             setGananciasResumen(gananciasResumen);

        //         }).catch(console.log)
        // )
    }, [])
    return (
        <Layout>
            <Ganancias ganancias={ganancias} gananciasEmpty={gananciasEmpty} role={role} />
            <Row gutter={24}>
                <Col md={12} xs={24} lg={6}>
                    <SummaryOrder title={`$ ${gananciasResumen.ganancia}`} text="Ganancias"
                        description="Ganacia total por los servicios realizados" avatarColor={ganancia} icon={<FundOutlined />} />
                </Col>
                <Col md={12} xs={24} lg={6}>
                    <SummaryOrder title={gananciasResumen.servicios} text="Servicios"
                        description="Número de servicio realizados" avatarColor={servicio} icon={<FileDoneOutlined />} />
                </Col>
                <Col md={12} xs={24} lg={6}>
                    <SummaryOrder title={`$ ${gananciasResumen.gananciaAvg}`} text="Promedio"
                        description="Ganancia promedio por cada servicio" avatarColor={promedio} icon={<DollarOutlined />} />
                </Col>
                <Col md={12} xs={24} lg={6}>
                    <SummaryOrder title="5.0/5.0" text="Calificación"
                        description="Calificación en EP&O" avatarColor={calificación} icon={<StarOutlined />} />
                </Col>
            </Row>


        </Layout>
    )
}

