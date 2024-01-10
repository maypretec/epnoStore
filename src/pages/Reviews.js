import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Descriptions, Card, Row, Col, Tag, Empty } from 'antd';
import Review from "../components/Generals/Review";
import { isEmpty } from 'lodash';
import Layout from "../layouts/ControlPanelLayout";
import Forbidden from "../components/Forbidden"
import moment from 'moment';
import ReviewService from '../utils/api/reviews';


export default function Reviews() {
    let role = localStorage.getItem('role');
    let token = localStorage.getItem('token');
    const [reviews, setReviews] = useState([])



    useEffect(() => {
        {
            ReviewService.GetReviews()
            .then((response) => {
                return response.json()

            })
            .then((reviews) => {

                setReviews(reviews)
            }).catch(console.log)
        }
    }, [])
    return (

        role == 6 || role == 4 ?
            <Forbidden />
            :
            <Layout>
                {
                    reviews == '' ?
                        (<Empty description='No hay reviews disponibles aun' />)
                        :
                        reviews.map((r, index) => (
                            // review.map((r, index) => (

                            <Row gutter={24} style={{ marginTop: 16 }}>
                                <Col xs={24} md={12}>
                                    <Review title={r.order_num} valor={r.rating} description={r.comment} key={index} />

                                </Col>
                                <Col xs={24} md={12}>
                                    <Card key={index}>
                                        <Descriptions title={`${r.order_num} Detalles`}>
                                            <Descriptions.Item label="Titulo">{r.title}</Descriptions.Item>
                                            <Descriptions.Item label="# Orden">{r.order_num}</Descriptions.Item>
                                            <Descriptions.Item label="Fecha">{moment(r.created_at).format("DD/MM/YYYY")} </Descriptions.Item>
                                            <Descriptions.Item label="Tipo">{r.tipo} </Descriptions.Item>
                                            <Descriptions.Item label="Status">
                                                <Tag color="purple">Finalizada</Tag>
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Card>
                                </Col>


                            </Row>
                            // ))
                        ))


                }
                {/* {
                    !reviewsMroEmpty ?
                        reviewsMro.map((r,index) => (
                            // review.map((r, index) => (

                                <Row gutter={24} style={{ marginTop: 16 }}>
                                    <Col xs={24} md={12}>
                                        <Review title={r.purchase_order} valor={r.rate} description={r.comment} />

                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Card>
                                            <Descriptions title={`${r.purchase_order} Detalles`}>
                                                <Descriptions.Item label="Titulo">{r.titulo}</Descriptions.Item>
                                                <Descriptions.Item label="# Orden">{r.purchase_order}</Descriptions.Item>
                                                <Descriptions.Item label="Fecha">{r.created_at} </Descriptions.Item>
                                                <Descriptions.Item label="Tipo">{r.tipo} </Descriptions.Item>
                                                <Descriptions.Item label="Status">
                                                    <Tag color="purple">Finalizada</Tag>
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    </Col>


                                </Row>
                            // ))
                        ))
                        :
                        (<Empty />)
                } */}
            </Layout >
    );


}

