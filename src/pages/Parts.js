import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Col, Row, Divider } from 'antd';
import AddPart from "../components/Supplier/AddPart";
import ListParts from "../components/Supplier/ListParts";
import Layout from '../layouts/SupplierLayout';

export default function Parts()
{
    return(
        <Layout>
            <Row gutter={[12,12]} justify="space-between">
                <Col xs={24} lg={ 18} >
                    <ListParts/>
                </Col>
                <Col xs={ 24} lg={ 6} >
                    <AddPart/>
                </Col>
            </Row>
        </Layout>
    );
}
