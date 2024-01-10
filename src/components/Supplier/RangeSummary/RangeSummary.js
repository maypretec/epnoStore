// import React, {usestate} from 'react';
// import {Row, Col, Statistic, Card} from 'antd';
// import { ResponsiveContainer, XAxis, YAxis, Area, Line, Tooltip, CartesianGrid, ComposedChart, Legend} from 'recharts';
// import { VerticalAlignBottomOutlined, VerticalAlignTopOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons'
// import Lang from '../../Language';

// const {Meta} = Card;

// export default function RangeSummary(props)
// {
//     return (
//         <Row>
//         <Col xs={24} md={9}>
//             <Card>
//                 <Meta title={props.title} description={
//                     <div>
//                         <h5>{props.desc}</h5>
//                         <Row justify="space-between" align="bottom" gutter={32}>
//                         <Col xs={24} md={8}>
//                             <Statistic title={Lang("RangeSummary", "1")} value={props.min} precision={2} valueStyle={{color: '#4361EE'}} prefix={<VerticalAlignBottomOutlined/>} suffix="mxn"/>
//                         </Col>
//                         <Col xs={24} md={8}>
//                             <Statistic title={Lang("RangeSummary", "2")} value={props.max} precision={2} valueStyle={{color: '#4CB963'}} prefix={<VerticalAlignTopOutlined/>} suffix="mxn"/>
//                         </Col>
//                         <Col xs={24} md={8}>
//                             <Statistic title={Lang("RangeSummary", "3")} value={props.avg} precision={2} valueStyle={{color: '#ECCB26'}} prefix={<VerticalAlignMiddleOutlined/>} suffix="mxn"/>
//                         </Col>
//                     </Row>
//                 </div>
//                 }/>
//             </Card>
//         </Col>
//         <Col xs={0} md={15}>
//             <div style={{ width: '100%', height: 300 }}>
//                 <ResponsiveContainer>
//                     <ComposedChart
//                         data={props.chartData}
//                         margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                             <defs>
//                                 <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
//                                   <stop offset="5%" stopColor="#00AFB9" stopOpacity={0.6}/>
//                                   <stop offset="95%" stopColor="#00AFB9" stopOpacity={0.9}/>
//                                 </linearGradient>
//                             </defs>
//                         <XAxis dataKey="month" />
//                         <YAxis />
//                         <Area dataKey="Range" stroke="#00AFB9" fill="url(#colorUv)" />
//                         <Line dataKey="Avg" type="monotone" stroke="#413ea0"/>
//                         <Tooltip />
//                         <Legend/>
//                     </ComposedChart>
//                 </ResponsiveContainer>
//             </div>
//         </Col>
//     </Row>
//     );
// }