import React, { useState, useEffect } from 'react';
import { Badge, Card, Row, Col, Avatar, Dropdown, Menu, notification } from 'antd';
import { FolderTwoTone, MoreOutlined, ShoppingCartOutlined } from '@ant-design/icons';
// import { ToastContainer, toast } from 'react-toastify';
import "./MyPackage.scss";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showNewProductAction } from '../../../actions/productActions';
import { isEmpty } from 'lodash';
import ProductService from '../../../utils/api/products';

export default function MyPackage(props) {
     const { nombre, index } = props;
     const dispatch = useDispatch();

     const showNewProducts = state => {
          dispatch(showNewProductAction(state));
     }
     const stateProducts = useSelector(state => state.products.stateShowProducts);


     const menu = (

          <Menu >
               <Menu.ItemGroup >
                    <Menu.Item
                         //     disabled={vacio}
                         onClick={() => sendCarrito(index)}
                    > Enviar al carrito <ShoppingCartOutlined /> </Menu.Item>
               </Menu.ItemGroup>
          </Menu>
     );

     const openNotificationWithIcon = (type, name) => {
          notification[type]({
               message: name,
               description:
                    'Ha sido añadido correctamente a tu carrito.',
          });
     };

     const sendCarrito = (index) => {


          ProductService.AddToPackage(index)
          .then(response => {
               openNotificationWithIcon('success',nombre.name)
               showNewProducts(!stateProducts);
          })
          .catch(error => {
               console.log(error)
          })
     }
     return (
          <>
               <Card >
                    <Row>
                         <Col xs={8} >
                              <Link to={`/@m-@p/${index}`}>
                                   <Badge count={nombre.count} style={{ backgroundColor: '#87d068' }}>
                                        <Avatar size={40} icon={<FolderTwoTone style={{ fontSize: 40 }} />} style={{ background: '#b7e5f8' }} />
                                   </Badge>

                              </Link>
                         </Col>
                         <Col xs={13} >
                              <Link to={`/@m-@p/${index}`}> <h5 style={{ marginTop: 20 }}>{nombre.name}</h5></Link>

                         </Col>
                         <Col xs={1} >
                              <Dropdown
                                   overlay={menu}

                              >
                                   <a className="ant-dropdown-link" >
                                        <MoreOutlined />
                                   </a>
                              </Dropdown>

                         </Col>
                    </Row>
               </Card>
          </>

     );

}

