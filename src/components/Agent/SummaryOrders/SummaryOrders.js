import React from 'react';
import { Row, Col, Divider, Card, Avatar } from 'antd';

import { FileDoneOutlined, PieChartOutlined } from '@ant-design/icons';



const { Meta } = Card;
export default function SummaryOrders(props) {

    const { text, title, description,avatarColor,icon } = props;

    return (
        <Card
            style={{ marginTop: 16 ,boxShadow: "0 1px 1px rgba(0,0,0,0.12), 0 2px 2px rgba(0,0,0,0.12), 0 4px 4px rgba(0,0,0,0.12), 0 5px 5px rgba(0,0,0,0.12), 0 10px 10px rgba(0,0,0,0.12)"}}
            headStyle={{ color: "#fff" }}
           
            actions={[

                <label> <PieChartOutlined /> {text}</label>
            ]}
        >
            <Meta

                avatar={
                    <Avatar style={{boxShadow: "2px 2px 5px 0px rgba(0,0,0,0.75)",backgroundColor:avatarColor.backgroundColor }} icon={icon} size={60} xs={0} />
                }
                title={title}
                description={description}
            />

        </Card>

    )
}
