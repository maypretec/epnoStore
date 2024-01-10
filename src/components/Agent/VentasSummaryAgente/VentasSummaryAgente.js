// import React from 'react';
// import { Card, Row, Col, Table, Link, Empty } from "antd";
// import { isEmpty } from 'lodash';
// import { ResponsiveContainer, AreaChart, XAxis, YAxis, Bar, Tooltip, CartesianGrid, Area, ComposedChart, Legend, Line } from 'recharts';


// const { Meta } = Card;
// export default function VentasSummaryAgente(props) {
//     const { title, description,  role, consumo } = props;
//     const dataTable = [];
    
//     {

//         for (const property in consumo) {
           

//             dataTable.push(
//                 {
//                     key: consumo[property].month,
//                     month: consumo[property].month,
//                     cost: `$ ${consumo[property].costo}`,
//                     cost_promedio: `$ ${consumo[property].cost_promedio}`,
//                     ganancia_promedio: `$ ${consumo[property].ganancia_promedio}`,
//                     description: (
//                         <>

//                             <Row gutter={32} style={{fontWeight:"bold",fontSize:16}}>
//                                 <Col md={4}>#Orden</Col>
//                                 <Col md={4}>Entrada</Col>
//                                 <Col md={4}>Salida</Col>
//                                 <Col md={4}>Ganancia</Col>
//                                 <Col md={4}>% Ganancia</Col>
//                                 <Col md={4}>Ver Más</Col>
//                             </Row>

//                             {
//                                 consumo[property].order.map((or) => (

//                                     <Row gutter={32} style={{marginTop:16}} key={or.id}>
//                                         <Col md={4}>{or.purchase_order}</Col>
//                                         <Col md={4}>${or.costo_servicio} </Col>
//                                         <Col md={4}>${or.costo_proveedor} </Col>
//                                         <Col md={4}>${or.ganancia} </Col>
//                                         <Col md={4}>{or.ganancia_porcent}% </Col>                                      
//                                         <Col md={4}><a href={`/orderdetails/${role}/${or.id}/${or.request_type_id}`} >Detalles</a> </Col>
//                                     </Row>

//                                 ))
//                             }




//                         </>
//                     )
//                 }
//             )

        

//         }
//     }
    
//     const columns = [
//         { title: 'Mes', dataIndex: 'month', key: 'month' },
//         { title: 'Ventas', dataIndex: 'cost', key: 'cost' },
//         { title: 'Costo Promedio', dataIndex: 'cost_promedio', key: 'cost_promedio' },    
//         { title: 'Ganancia Promedio', dataIndex: 'ganancia_promedio', key: 'ganancia_promedio' },

//     ];



//     const dataChart = [];
//     {
//         for (const property in consumo) {
//             dataChart.push(
//                 {
//                     "name":consumo[property].month,
//                     "Costo Promedio": consumo[property].cost_promedio,
//                     "Costo": consumo[property].costo,
//                     "Ganancia Promedio": consumo[property].ganancia_promedio,
//                     //key: con.id,
//                 }
//             )
//         }
//     }

//     return (
//         <>
//             <Card >
//                 <Meta title={title} description={description} />
//                 {
//                     isEmpty(dataChart) ?
//                     (

//                     <Row gutter={32} > 
//                         <Col style={{marginLeft:'auto', marginRight:'auto'}}>
//                         <Empty description="Aun no hay datos para mostrar la grafica."/>
//                         </Col>
//                     </Row>
//                     ):(
//                         <Row>
//                         <Col span={24} >
//                             <ResponsiveContainer width="100%" height={500} >
    
//                                 <ComposedChart width={730} height={250} data={dataChart}>
//                                     <XAxis dataKey="name" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <CartesianGrid stroke="#f5f5f5" />
//                                     <Area type="monotone" dataKey="Costo Promedio" fill="#8884d8" stroke="#8884d8" />
//                                     <Bar dataKey="Costo" barSize={20} fill="#413ea0" />
//                                     <Line type="monotone" dataKey="Ganancia Promedio" stroke="#ff7300" />
//                                 </ComposedChart>
//                             </ResponsiveContainer>
//                         </Col>
//                     </Row>
//                     )
//                 }
               
//             </Card>

//             <Table
//                 scroll={{ x: '100vh' }}
//                 classconsumption="components-table-demo-nested"
//                 columns={columns}
//                 expandable={{
//                     expandedRowRender: record => record.description,
//                     rowExpandable: record => record.name !== 'Not Expandable',
//                 }}
//                 dataSource={dataTable}
//             />

//         </>
//     )

// }

