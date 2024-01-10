import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Products from '../components/Clients/ProductsByCategory'
import Layout from "../layouts/LayoutPage";
import { Col, Row, Input } from 'antd';
import { Link, useParams } from 'react-router-dom';

const { Search } = Input;

export default function ShowProductsByCategory() {
    let { category } = useParams();
    const [busqueda, setBusqueda] = useState("");

    return (
        <Layout>
            <Row gutter={24}>
               
                <Col xs={24} md={8}>
                    <Search
                        placeholder="Buscar producto (nombre, categoria, numero de parte)"
                        enterButton
                        onChange={(evento) => {
                            setBusqueda(evento.target.value);
                        }
                        }
                    />
                </Col>
            </Row>
            <Products category={category} tipo={1} busqueda={busqueda} url='get_catalogo' />
        </Layout>
    )
}
