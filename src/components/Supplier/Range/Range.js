import React, {useState} from 'react';
import {Row, Col, Collapse, Form, InputNumber, Button, Tag} from 'antd';
import {CheckCircleOutlined, MinusCircleOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import RangeSummary from '../RangeSummary';

const {Panel} = Collapse;
    const test = 10.5;
    const testdata = 
    {
        title: "Numero de parte de epno",
        desc: "Numero de parte de proveedor",
        min: 10.2,
        max: 11.2,
        avg: 10.7,
        chartData: [{"month":"jan","Range":[-1,10], "Avg": 5.5},{"month":"feb","Range":[2,15], "Avg": 8.5},{"month":"mar","Range":[3,12], "Avg": 7.5},{"month":"apr","Range":[4,12], "Avg": 8},{"month":"may","Range":[12,16], "Avg": 14},{"month":"jun","Range":[5,16], "Avg": 9.5}]
    };

export default function Range(props)

{
    

    const [range, setRange] = useState({currentPrice: 0, status: 0});
    const priceHandler = (price) =>
    {
        // actualizar el precio en la db
        var currentStatus = 0;
        if (price == test) {
            currentStatus = 1;
        }
        else if(price > test)
        {
            currentStatus = 2;
        }
        setRange({currentPrice: price, status: currentStatus});
    };

    
    const rangeHeader = (min, max, unit, status) =>
    {
        var statusLabel;
        switch (status) {
            case 1:
                statusLabel = <Tag icon={<CheckCircleOutlined/>} color='success'>Competitive</Tag>;
                break;
            case 2:
                statusLabel = <Tag icon={<ExclamationCircleOutlined/>} color='warning'>Second state</Tag>;
                break;
            default:
                statusLabel = <Tag icon={<MinusCircleOutlined/>} color='default'>Not Registered</Tag>;
                break;
        }
        return (
            <Form layout="inline" wrapperCol={{span: 16}}>
                <Row gutter={32}>
                    <Col span={24}>
                        <h2>{min} - {max} {unit} {statusLabel}</h2>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="price"
                            label="Costo"
                            rule={[{required: true, type:"number", message: "Input a price", min: 0}]}>
                            <InputNumber 
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                size='large'
                              
                                />
                                
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" onClick={()=>priceHandler(10.5)}>Cambiar precio</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    };
    return(
        <Collapse>
            <Panel header={rangeHeader(props.min, props.max, props.unit, range.status)} showArrow={false}>
                <RangeSummary {...testdata}/>
            </Panel>
        </Collapse>
    );
}