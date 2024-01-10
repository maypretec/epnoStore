// import React from 'react';
// import { Card, Row, Col, Table, Link, Empty } from "antd";
// import { isEmpty } from 'lodash';
// import { ResponsiveContainer, AreaChart, XAxis, YAxis, Bar, Tooltip, CartesianGrid, Area, ComposedChart, Legend, Line } from 'recharts';


// const { Meta } = Card;
// export default function Summary(props) {
//     const { title, description, column1, column2, column3, role, consumo } = props;
//     const dataExpand = [];
//     const dataTable = [];
//     // let expandedRowRender;
//     const data = [
//         {
//             title: '#Orden',
//         },
//         {
//             title: 'Precio',
//         },
//         {
//             title: 'Fecha',
//         },
//         {
//             title: 'Tipo',
//         },
//     ];
//     {

//         for (const property in consumo) {


//             dataTable.push(
//                 {
//                     key: consumo[property].month,
//                     month: consumo[property].month,
//                     consumption: `$ ${consumo[property].costo}`,
//                     // saving: `${consumo[property].ahorro_ordenes}`,
//                     average: `$ ${consumo[property].promedio}`,
//                     generico: role== 3 ?`$ ${consumo[property].ahorro_ordenes}`: consumo[property].ahorro_ordenes ,
//                 description: (
//                 <>

//                     <Row gutter={32} style={{ fontWeight: "bold", fontSize: 16 }}>
//                         <Col md={5}>#Orden</Col>
//                         <Col md={5}>{column3}</Col>
//                         <Col md={5}>Fecha</Col>
//                         <Col md={5}>Tipo</Col>
//                         <Col md={4}>Ver Más</Col>
//                     </Row>

//                     {
//                         consumo[property].order.map((or) => (

//                             <Row gutter={32} style={{ marginTop: 16 }} key={or.id}>
//                                 <Col md={5}>{or.purchase_order}</Col>
//                                 <Col md={5}>$ {or.costo_servicio} </Col>
//                                 <Col md={5}>{or.fecha} </Col>
//                                 <Col md={5}>{or.service} </Col>
//                                 <Col md={4}><a href={`/orderdetails/${role}/${or.id}`} >Detalles</a> </Col>
//                             </Row>

//                         ))
//                     }




//                 </>
//             )
//                 }
//             )



//     }
// }

// const columns = [
//     { title: 'Mes', dataIndex: 'month', key: 'month' },
//     { title: column1, dataIndex: 'consumption', key: 'consumption' },
//     // { title: column2, dataIndex: 'saving', key: 'saving' },
//     { title: 'Promedio', dataIndex: 'average', key: 'average' },
//     { title: column2, dataIndex: "generico", key: "generico"},

// ];



// const dataChart = [];
// {
//     for (const property in consumo) {
//         dataChart.push(
//             {
//                 "name": consumo[property].month,
//                 "promedio": consumo[property].promedio,
//                 "costo ": consumo[property].costo,
//               "generico": consumo[property].ahorro_ordenes,
//                 //key: con.id,
//             }
//         )
//     }
// }

// return (
//     <>
//         <Card >
//             <Meta title={title} description={description} />
//             {
//                 isEmpty(dataChart) ?
//                     (

//                         <Row gutter={32} >
//                             <Col style={{ marginLeft: 'auto', marginRight: 'auto' }}>
//                                 <Empty description="Aun no hay datos para mostrar la grafica." />
//                             </Col>
//                         </Row>
//                     ) : (
//                         <Row>
//                             <Col span={24} >
//                                 <ResponsiveContainer width="100%" height={500} >

//                                     <ComposedChart width={730} height={250} data={dataChart}>
//                                         <XAxis dataKey="name" />
//                                         <YAxis />
//                                         <Tooltip />
//                                         <Legend />
//                                         <CartesianGrid stroke="#f5f5f5" />
//                                         <Area type="monotone" dataKey="generico" fill="#8884d8" stroke="#8884d8" />
//                                         <Bar dataKey="costo " barSize={20} fill="#413ea0" />
//                                         <Line type="monotone" dataKey="promedio" stroke="#ff7300" />
//                                     </ComposedChart>
//                                 </ResponsiveContainer>
//                             </Col>
//                         </Row>
//                     )
//             }

//         </Card>

//         <Table
//             scroll={{ x: '100vh' }}
//             classconsumption="components-table-demo-nested"
//             columns={columns}
//             expandable={{
//                 expandedRowRender: record => record.description,
//                 rowExpandable: record => record.name !== 'Not Expandable',
//             }}
//             dataSource={dataTable}
//         />

//     </>
// )

// }

