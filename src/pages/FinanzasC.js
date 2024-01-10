import React, { useState, useEffect } from 'react';
import Ganancias from "../components/Clients/Ganancias";
import { Row, Col, Progress, Tooltip, Card } from "antd";
import { isEmpty } from 'lodash';
import Layout from '../layouts/LayoutPage';
import CustomerService from '../utils/api/customers';

const { Meta } = Card;
export default function FinanzasC(props) {
    let role = localStorage.getItem('role');
    let token = localStorage.getItem('token');
    const [ganancias, setGanancias] = useState([])
    const [gananciasResumen, setGananciasResumen] = useState([])
    const [gananciasEmpty, setGananciasEmpty] = useState(false)

    useEffect(() => {
        role == 4 && 
            CustomerService.Earnings()
            .then((response) => {
                return response.json()

            })
            .then((ganancias) => {
                setGanancias(ganancias);

                if (isEmpty(ganancias['orderSum'])) {
                    setGananciasEmpty(true);
                }

            }).catch(console.log)

        CustomerService.EarningsSummary()
        .then((response) => {
            return response.json()

        })
        .then((gananciasResumen) => {
            setGananciasResumen(gananciasResumen);

        }).catch(console.log)
        
}, [])
return (
    <Layout>
        <Ganancias ganancias={ganancias} gananciasEmpty={gananciasEmpty} role={role} />
        <Card >
            <Meta title="Resumen de mis movimientos" description="¡Dame click o posicionate en mi!" />
            <Row gutter={24}>

                <Col lg={4} md={8} style={{ marginTop: 16 }}>
                    <Tooltip title="Costo total de servicios" color={"#108ee9"}>
                        <Progress
                            type="circle"
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                            percent={90}
                            format={() =>
                                gananciasResumen.costo == '' || gananciasResumen.costo == null ?
                                    ('$0 ') : (`$ ${gananciasResumen.costo}`)


                            }
                        />
                    </Tooltip>
                </Col>
                <Col lg={4} md={8} style={{ marginTop: 16 }} >
                    <Tooltip title="Pago total de servicios" color={'pink'}>
                        <Progress
                            type="circle"
                            strokeColor={{
                                '0%': '#f759ab',
                                '100%': '#9254de',
                            }}
                            percent={80}
                            format={() =>
                                gananciasResumen.pago == '' || gananciasResumen.pago == null ?
                                    ('$0 ') : (`$ ${gananciasResumen.pago}`)
                            }
                        />
                    </Tooltip>
                </Col>
                <Col lg={4} md={8} style={{ marginTop: 16 }}>
                    <Tooltip title="Ahorro total con EP&O" color={'lime'}>
                        <Progress
                            type="circle"
                            strokeColor={{
                                '0%': '#389e0d',
                                '100%': '#eaff8f',
                            }}
                            percent={95}
                            format={() =>
                                gananciasResumen.ahorro == '' || gananciasResumen.ahorro == null ?
                                    ('$0') : (`$ ${gananciasResumen.ahorro}`)

                            }
                        />
                    </Tooltip>
                </Col>
                <Col lg={4} md={8} style={{ marginTop: 16 }}>
                    <Tooltip title="Número de servicio recibidos" color={'geekblue'}>
                        <Progress
                            type="circle"
                            strokeColor={{
                                '0%': '#006d75',
                                '100%': '#0050b3',
                            }}
                            percent={90}
                            format={() =>
                                gananciasResumen.servicios == '' || gananciasResumen.servicios == null ?
                                    ('0 ') : (gananciasResumen.servicios)

                            }
                        />
                    </Tooltip>
                </Col>
                <Col lg={4} md={8} style={{ marginTop: 16 }}>
                    <Tooltip title="Ahorro promedio por cada servicio." color={'green'}>
                        <Progress
                            type="circle"
                            strokeColor={{
                                '0%': '#52c41a',
                                '100%': '#5cdbd3',
                            }}
                            percent={100}
                            format={() =>
                                gananciasResumen.Avgahorro == '' || gananciasResumen.Avgahorro == null ?
                                    ('$0 ') : (`$ ${gananciasResumen.Avgahorro}`)
                            }
                        />
                    </Tooltip>
                </Col>

                <Col lg={4} md={8} style={{ marginTop: 16 }}>
                    <Tooltip title="Calificación en EP&O" color={'orange'}>
                        <Progress
                            type="circle"
                            strokeColor={{
                                '0%': '#fa8c16',
                                '100%': '#ad8b00',
                            }}
                            percent={75}
                            format={() => '3'}
                        />
                    </Tooltip>
                </Col>


            </Row>
        </Card>

    </Layout>
)
}
