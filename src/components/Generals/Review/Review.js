import React, {useState} from 'react';
import { Card,Row,Col,Rate} from 'antd';

const desc = ['Horrible', 'Malo', 'Normal', 'Bueno', 'Excelente'];
export default function Reviews(props) {
    const{title,valor,description}=props;
   
    return(
        <Card title={title} bordered={false} headStyle={{ textAlign: "center"}}>
        <Row>
            <Col xs={24} md={6}>
            <span>
            <Rate tooltips={desc}  value={valor} allowClear={false} allowHalf disabled />
            {valor ? <span className="ant-rate-text">{desc[valor - 1]}</span> : ''}
          </span>
            </Col>
            <Col xs={24} md={16}>
                <p>{description} </p>
            </Col>
        </Row>
      </Card>
   
    )
}