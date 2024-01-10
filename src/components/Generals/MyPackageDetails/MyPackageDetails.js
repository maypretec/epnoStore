import React, { useState, useEffect } from 'react';
import { Row, Col, Divider, Dropdown, Menu, Select, Card, Image, Button, message, notification } from 'antd';
import { FileOutlined, DeleteTwoTone, ShoppingCartOutlined, MoreOutlined, DeleteOutlined } from '@ant-design/icons';
import './MyPackageDetails.scss';
import { useDispatch, useSelector } from 'react-redux';
import { showNewProductAction } from '../../../actions/productActions';
import ProductService from '../../../utils/api/products';

const { SubMenu } = Menu;
const { Option } = Select;
const { Meta } = Card;


export default function MyPackage(props) {
    const { bundle, borrar, setBorrar, paquetes } = props;
    const dispatch = useDispatch();
    let token = localStorage.getItem('token');
    const showNewProducts = state => {
        dispatch(showNewProductAction(state));
    }
    const stateProducts = useSelector(state => state.products.stateShowProducts);


    const onChange = (id) => (value) => {

        ProductService.AddToPackageState({
            "bundle_id": id,
            "qty": value,
            "epno_part_id": bundle.EpnoPartId
        })
        .then(response => {
            message.success(response.data.message)
        })
        .catch(error => {
            console.log(error)
        })

    }

    const menu = (

        <Menu>
            <SubMenu
                title="Añadir a Mis cosas"
                onClick={e => e.stopPropagation()}
            >
                <Menu.Item>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Selecciona un paquete"
                        optionFilterProp="children"
                        onChange={onChange(bundle.EpnoPartId)}

                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {
                            paquetes.map((pack) => (

                                <Option value={pack.id} key={pack.id}>{pack.name}</Option>
                            ))
                        }

                    </Select>
                </Menu.Item>

            </SubMenu>
            <Menu.ItemGroup >
                <Menu.Item onClick={() => sendCarrito(bundle.EpnoPartId, bundle.Price, bundle.Quantity, bundle.EpnoPartName, bundle.Quantity, bundle.Partno)}> Enviar al carrito <ShoppingCartOutlined /> </Menu.Item>
            </Menu.ItemGroup>

        </Menu>
    );

    const borrarItem = (id) => {
        ProductService.DeleteBundlePart(id)
        .then(response => {
            if (response.data.success == true) {
                message.success(response.data.message)
                setBorrar(!borrar);
            } else {
                message.error(response.data.message)
            }
        })
        .catch(error => {
            console.log(error.response.data.errors)
        })

    }

    const openNotificationWithIcon = (type, name, desc) => {
        notification[type]({
            message: name,
            description: desc
        });
    };


    const sendCarrito = (epno_part_id, price, qty, name, current_qty, part_no_id) => {

        ProductService.AddProducts({
            "epno_part_id": epno_part_id,
            "cost": price,
            "qty": qty,
            "current_qty": current_qty,
            "part_no_id": part_no_id
        })
        .then(response => {
            if (response.data.success == true) {
                openNotificationWithIcon('success', name,'Ha sido añadido correctamente a tu carrito.')
                showNewProducts(!stateProducts);
            } else {
                openNotificationWithIcon('error', name,'Hubo un problema al añadir a tu carrito.')

            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    return (


        <Col xs={24} md={12} lg={8} xl={6}  >
            <Card
                key={bundle.EpnoPartId}
                title={bundle.EpnoPartName}
                style={{ marginTop: 16 }}
                extra={<Dropdown overlay={menu}
                >
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <MoreOutlined className="colorText" />
                    </a>
                </Dropdown>}
                cover={
                    <Image
                        preview={false}
                        height='250px'
                        width="100%"
                        alt={bundle.EpnoPartName}
                        src={`https://api.epno-app.com${bundle.Image}`}
                    />
                }
                actions={[
                    <Col>  <p >${bundle.Price} C/U</p> </Col>,
                    <Col>  <p >Qty: {bundle.Quantity}</p> </Col>,
                ]}
            >
                <Meta
                    title={bundle.PartCategory}
                    avatar={
                        <Button size="large" type="primary" shape="circle" danger
                            icon={<DeleteOutlined />}
                            onClick={() => borrarItem(bundle.bundle_part_id)}
                        />
                    }

                    description={`Partno: ${bundle.EpnoPartNo}`}
                />
            </Card>
        </Col>





    )
}

