import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Row, Col, Card, Divider, Button, Dropdown, Menu, Select, Image, message, Modal, Result } from 'antd';
import Layout from '../layouts/LayoutPage';
import "../scss/MyOrder.scss";
import { CloseCircleOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, MoreOutlined, SaveOutlined } from '@ant-design/icons';
import Product from '../utils/api/products';
import Order from '../utils/api/orders';
import { useDispatch, useSelector } from 'react-redux';

import { showNewProductAction } from '../actions/productActions';
import { Link } from 'react-router-dom';


export default function MyOrder(props) {
    const { SubMenu } = Menu;
    const { Option } = Select;
    const [form] = Form.useForm();
    const [reload, setReload] = useState(false);
    const [editingKey, setEditingKey] = useState('');
    const [load, setLoad] = useState(false);
    let token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);

    const [modal, setModal] = useState({
        visible: false,
        orden: '',
        cotFile: '',
    });
    const [info, setInfo] = useState({
        products: [],
        subtotal: 0,
        iva: 0,
        total: 0,
        supp_total: 0,
        supp_subtotal: 0,
    });
    const [paquetes, setPaquetes] = useState([]);


    const isEditing = (record) => record.key === editingKey;

    const dispatch = useDispatch();

    const showNewProducts = state => {
        dispatch(showNewProductAction(state));
    }
    const stateProducts = useSelector(state => state.products.stateShowProducts);

    useEffect(() => {

        Product.GetProducts()
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            setInfo({
                products: data.products,
                subtotal: data.total,
                iva: data.total * 0.08,
                total: data.total + (data.total * 0.08),
                supp_total: data.supp_total,
                supp_subtotal: data.supp_subtotal
            })
            setLoading(false)
        }).catch(console.log)

        Product.GetPackages()
        .then((response) => {
            // console.log(response);
            return response.json()

        })
        .then((paquetes) => {
            setPaquetes(paquetes);
        }).catch(console.log)
    }, [reload]);



    const originData = [];

    {

        info.products.map((p, index) => {
            originData.push({
                key: p.id,
                epno_part_id: p.epno_part_id,
                index: index + 1,
                articulo: p.name,
                image: <Image
                    width={40}
                    src={`https://api.epno-app.com${p.image}`}
                />,
                price: `$${p.part_cost}`,
                cant: p.qty,
                total: `$${p.part_cost * p.qty}`,
            });
        })
    }

    // const menu = (id) => (
    //     <Menu>
    //         <SubMenu
    //             title="Añadir a Mis cosas"
    //             onClick={e => e.stopPropagation()}
    //         >
    //             <Menu.Item>
    //                 <Select
    //                     showSearch
    //                     style={{ width: 200 }}
    //                     placeholder="Selecciona un paquete"
    //                     optionFilterProp="children"
    //                     // onChange={onChange(producto.epno_part_id)}                       
    //                     filterOption={(input, option) =>
    //                         option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    //                     }
    //                 >
    //                     {
    //                         paquetes.map((pack) => (

    //                             <Option value={pack.id} key={pack.id}>{pack.name}</Option>
    //                         ))
    //                     }

    //                 </Select>

    //             </Menu.Item>

    //         </SubMenu>
    //         <Menu.ItemGroup >
    //             <Menu.Item
    //                 onClick={() => borrarItem(id)}
    //             ><DeleteOutlined /> Borrar  </Menu.Item>
    //         </Menu.ItemGroup>

    //     </Menu>
    // );



    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        <InputNumber min={1} />
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };


    const edit = (record) => {
        form.setFieldsValue({
            index: '',
            articulo: '',
            image: '',
            price: '',
            cant: '',
            total: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const values = await form.validateFields();

            Product.MroPartUp ({
                 "id": key, 
                 "qty": values.cant
            })
            .then(response => {
                if (response.data.success) {
                    setReload(!reload);
                    showNewProducts(!stateProducts);
                    message.success('Producto actualizado correctamente')
                    setEditingKey('');
                } else {
                    message.error('No se pudo actualizar el producto')
                    setEditingKey('');
                }
            })
            .catch(error => {
                console.log(error)
            })
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const borrarItem = (id) => {

        Product.DeleteProducts(id)
        .then(response => {
            setReload(!reload);
            showNewProducts(!stateProducts);
            setEditingKey('');
            message.success('Producto eliminado correctamente')
        })
        .catch(error => {
            console.log(error)
        })

    }

    const onChange = (id, qty) => (value) => {

        Product.AddToPackage({
            "bundle_id": value, 
            "qty": qty, 
            "epno_part_id": id 
        })
        .then(response => {
            message.success(response.data.message)
            setEditingKey('');

        })
        .catch(error => {
            console.log(error.response.data.errors)
        })

    }

    const generarOrden = () => {
        setLoad(true)

        Order.AddRequest({
            "subtotal": info.subtotal,
            "finalCost": info.total,
            "precio_iva": info.iva,
            "iva": 8,
            "supp_total": info.supp_total,
            "supp_subtotal": info.supp_subtotal,
            "id_mro_parts": info.products
        })
        .then(response => {
            setLoad(false)
            if (response.data.success == true) {
                setModal({
                    visible: true,
                    orden: response.data.purchase_order,
                    cotFile: response.data.cotFile,
                });
            }

        })
        .catch(error => {
            setLoad(false)
            console.log(error.response.data.errors)
        })

    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            align: 'center'
        },

        {
            title: 'Articulo',
            dataIndex: 'articulo',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                return (
                    <Row gutter={[12, 12]} align='middle'>
                        <Col xs={4} >
                            {record.image}
                        </Col>
                        <Col xs={18} >
                            {record.articulo}
                        </Col>
                        <Col xs={2} >
                            <Dropdown
                                disabled={editable ? false : true}
                                overlay={
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
                                                    onChange={onChange(record.epno_part_id, record.cant)}
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
                                            <Menu.Item
                                                onClick={() => borrarItem(record.key)}
                                            ><DeleteOutlined /> Borrar  </Menu.Item>
                                        </Menu.ItemGroup>

                                    </Menu>
                                }
                            >
                                <a className="ant-dropdown-link" >
                                    <MoreOutlined style={{ fontSize: 20 }} />
                                </a>
                            </Dropdown>
                        </Col>
                    </Row>
                )
            },
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            align: 'center'

        },
        {
            title: 'Cantidad',
            dataIndex: 'cant',
            editable: true,
            align: 'center'

        },
        {
            title: 'Total',
            dataIndex: 'total',
            align: 'center'

        },

        {
            title: 'Acciones',
            dataIndex: 'operation',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            <SaveOutlined /> Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a><CloseCircleOutlined />  Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        <EditOutlined /> Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'cant' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Layout>
            <Row gutter={[12, 12]}>
                <Col xs={24} lg={16} xl={18}>
                    <Form form={form} component={false}>
                        <Table
                            scroll={{ x: '100vh' }}
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            bordered
                            dataSource={originData}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            pagination={{
                                onChange: cancel,
                            }}
                            loading={loading}
                        />
                    </Form>
                </Col>
                <Col xs={24} lg={8} xl={6}>
                    <Card title="Orden de compra"
                        style={{ marginTop: 16, textAlign: 'center' }}
                        bordered={false}

                    >
                        <Divider type="vertical" className="divider_h" />
                        <Col className="subtotal">
                            <h4>Subtotal:</h4>
                            {/* <h4>${subt}</h4> */}
                            <h4>${info.subtotal}</h4>

                        </Col>
                        <Col className="ml-3 subtotal">
                            <p>Iva:</p>
                            {/* <h5>${(subt * 0.08).toFixed(2)}</h5> */}
                            <h5>${info.iva}</h5>
                        </Col>
                        <Col className="subtotal">
                            <h2>Total:</h2>
                            <h2>${info.total}</h2>
                        </Col>

                        <Col className="btnOrden">
                            <Button
                                onClick={generarOrden}
                                loading={load}
                                disabled={info.products == '' ? true : false}
                            >Generar Orden</Button></Col>


                    </Card>
                </Col>

            </Row>

            <Modal
                visible={modal.visible}
                title="Confirmación de orden de compra."
                footer={[

                    <Button key="submit" type="primary" >
                        <Link to={`/orders/all/1`}>Aceptar</Link>
                    </Button>,
                ]}
            >
                <Result
                    status="success"
                    title={`Total de la orden de compra: ${info.total} `}
                    subTitle={`Tu numero de orden es: ${modal.orden}, podras ver tu pedido, en apartado de ORDENES .`}
                    extra={[
                        <a href={`https://api.epno-app.com${modal.cotFile}`} target="_blank" rel="noopener noreferrer"
                            download
                        >
                            <Button icon={<DownloadOutlined />} type="primary" >
                                &nbsp; Descargar Cotización
                            </Button>
                        </a>
                    ]}
                />

            </Modal>
        </Layout>

    );




}
