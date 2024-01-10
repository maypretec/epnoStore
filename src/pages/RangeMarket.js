import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Col, Row } from 'antd';
import Range from '../components/Supplier/Range';
import RangeSummary from '../components/Supplier/RangeSummary';
import Layout from '../layouts/SupplierLayout';

const testdata = 
{
    title: "Numero de parte de epno",
    desc: "Numero de parte de proveedor",
    min: 10.2,
    max: 11.2,
    avg: 10.7,
    chartData: [{"month":"jan","Range":[-1,10], "Avg": 5.5},{"month":"feb","Range":[2,15], "Avg": 8.5},{"month":"mar","Range":[3,12], "Avg": 7.5},{"month":"apr","Range":[4,12], "Avg": 8},{"month":"may","Range":[12,16], "Avg": 14},{"month":"jun","Range":[5,16], "Avg": 9.5}]
};
const rage = 
{
    min: 10,
    max: 20,
    unit: "kg",
    status: 1
};
const rage1 = 
{
    min: 21,
    max: 100,
    unit: "kg",
    status: 1
};
const rage2 = 
{
    min: 100,
    max: 500,
    unit: "kg",
    status: 1
};
const rage3 = 
{
    min: 501,
    max: 2000,
    unit: "kg",
    status: 1
};
export default function RangeMarket()
{
    return (
        <Layout>
            <Row>
                <Col span={24}>
                    {/* <RangeSummary {...testdata}/> */}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Range {...rage} />
                    
                    <Range {...rage1} />
                    
                    <Range {...rage2} />
                    
                    <Range {...rage3} />
                    
                </Col>
            </Row>
        </Layout>
    );
}

