import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
// import { ToastContainer, toast } from 'react-toastify';
import LayoutPage from "../layouts/LayoutPage";
import SupplierLayout from "../layouts/SupplierLayout";
import { Card, Col, Row, Button, Breadcrumb, Divider, Image, Input, Tag, Tooltip, InputNumber, notification } from 'antd';
import Products from '../components/Clients/ProductsByCategory'
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showNewProductAction } from '../actions/productActions';
import "../scss/productById.scss"
import ProductChat from '../components/Generals/ProductChat'
import { SendOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import InputPregunta from '../components/Generals/InputPregunta';
import moment from 'moment';
import ProductService from '../utils/api/products'

export default function ProductById() {
    let { id, category } = useParams();
    const { Search } = Input;
    var Layout = '';
    const [producto, setProducto] = useState([])
    const [qty, setQty] = useState(1)
    let token = localStorage.getItem('token');
    let role_auth = localStorage.getItem('role');
    const [busqueda, setBusqueda] = useState("");
    const [reload, setReload] = useState(false);
    const [comments, setComments] = useState([]);
    const [publicarPreg, setPublicarPreg] = useState(false)
    let emptyR = false;
    let dateNow = moment();

    if (role_auth == '4') {
        Layout = LayoutPage;
    } else if (role_auth == 6) {
        Layout = SupplierLayout;
    }

    const dispatch = useDispatch();

    const showNewProducts = state => {
        dispatch(showNewProductAction(state));
    }
    const stateProducts = useSelector(state => state.products.stateShowProducts);


    useEffect(() => {
        ProductService.GetDetails(id)
        .then((response) => {
            return response.json()
        })
        .then((info) => {
            setProducto(info);

        }).catch(console.log)
    }, [])

    useEffect(() => {

        ProductService.GetComments(id)
        .then((response) => {
            // console.log(response);
            return response.json()

        })
        .then((comments) => {
            setComments(comments);
        }).catch(console.log)

    }, [reload])

    const onChangeQty = (value) => {
        if (value == null) {
            setQty(1)
        } else {
            setQty(value)
        }
    }

    const openNotificationWithIcon = (type, name, desc) => {
        notification[type]({
            message: name,
            description: desc,
        });
    };

    const addProduct = (epno_part_id, price, qty, name, current_qty, part_no_id) => {

        ProductService.AddProducts({ 
            "epno_part_id": epno_part_id, 
            "cost": price, 
            "qty": qty, 
            "current_qty": current_qty, 
            "part_no_id": part_no_id 
        })
        .then(response => {
            if (response.data.success == true) {
                openNotificationWithIcon('success', name, 'Ha sido añadido correctamente a tu carrito.')
                setQty(1)
                showNewProducts(!stateProducts);
            } else {
                openNotificationWithIcon('error', name, 'Hubo un problema al añadir a tu carrito.')
            }

        })
        .catch(error => {
            console.log(error)
        })

    }

    return (
        <Layout>
            <Row gutter={[12, 12]} >
                <Col xs={24} md={12} lg={8} style={{ marginLeft: "auto", marginRight: "auto" }} >
                    <Image
                        alt={producto.name}
                        src={`https://api.epno-app.com${producto.image}`}
                        className="img_resolution"
                    />
                </Col>
                <Col xs={24} md={12} lg={12} style={{ marginLeft: "auto", marginRight: "auto" }} >
                    <Row gutter={[12, 12]}>
                        <Col xs={24}>
                            <Breadcrumb>
                                <Breadcrumb.Item>
                                    <Link to="/@c">Catalogo</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to={`/@c-@p/${producto.part_category_id}`}>{producto.categoria}</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>{producto.name}</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col xs={24}>
                            <label style={{ fontSize: 30 }}>{producto.name}&nbsp; </label>
                            <label style={{ fontStyle: "italic" }}>(Part No. {producto.part_no})</label>
                            <h4><b> MXN ${producto.price}</b></h4>
                            <p>{producto.description} </p>
                            <label style={{ color: "#77A464" }}> <b style={{ color: "#000" }}>Disponibilidad: </b> {producto.current_qty} disponibles</label>
                        </Col>
                        {
                            producto.current_qty == 0 ?
                                (
                                    <Col>
                                        <Tag color="red">Producto Agotado</Tag>
                                    </Col>
                                ) : (
                                    <>
                                        <Col xs={12} md={8} style={{ textAlign: "right" }}>
                                            <InputNumber
                                                // type="number"
                                                name="qty"
                                                // bordered={false}
                                                onChange={onChangeQty}
                                                value={qty}
                                                min={1}
                                                max={producto.current_qty}
                                            // required
                                            />
                                        </Col>
                                        <Col xs={12} md={10} style={{ textAlign: "left" }}>
                                            <Button type="primary" onClick={() => addProduct(producto.id, producto.price, qty, producto.name, producto.current_qty, producto.sp_id)}>Añadir al carrito</Button>
                                        </Col>
                                    </>
                                )

                        }

                    </Row>

                </Col>
            </Row>
            <Divider>¿Tienes alguna duda?</Divider>
            <Row gutter={[12, 12]} justify="center">
                <Col md={20} lg={16} xs={24}>
                    <Search
                        placeholder="Busca tu duda, ¡alguien más pudo haberla tenido!"
                        enterButton
                        onChange={(evento) => {
                            setBusqueda(evento.target.value);
                        }
                        }
                    />
                </Col>

                {
                    comments.filter((comentario) => {
                        if (busqueda == "") {
                            return '';
                        } else if (comentario.answer !== null && comentario.comment.toString().toLowerCase().includes(busqueda.toLowerCase())) {
                            return (
                                { comentario },
                                emptyR = true

                            )

                        }
                    }).map((comentario) => (

                        <Col
                            md={20} lg={16} xs={24}
                            key={comentario.id}
                        >

                            <>
                                <b>P: {comentario.comment}</b> <br />
                                <b>R: </b> <label>{comentario.answer}</label> <br />
                                <span >
                                    <ClockCircleOutlined style={{ color: '#a09f9f' }} />
                                </span>
                                &nbsp;
                                <Tooltip title={moment(comentario.created_at).format('DD/MM/YYYY HH:mm:ss')}>
                                    <span style={{ color: '#a09f9f' }}>

                                        {dateNow.diff(comentario.created_at, 'days') == 0 ? (
                                            'Publicado hace un momento'
                                        ) : (
                                            `Publicado hace ${dateNow.diff(comentario.created_at, 'days')} días`
                                        )

                                        }

                                    </span>
                                </Tooltip>
                                <Divider />
                            </>

                        </Col>

                    ))
                }
            </Row>
            {
                emptyR == true && (

                    <Row gutter={[12, 12]} justify="center" >
                        <Col md={12} lg={10} xs={24} >
                            <b style={{ fontSize: 16 }}>¿No encuentras la pregunta que buscabas?</b>
                        </Col>
                        <Col md={8} lg={6} xs={24} >
                            {
                                publicarPreg ? (
                                    <Button type="primary" danger onClick={() => setPublicarPreg(false)}>Cerrar sección</Button>
                                ) : (
                                    <Button type="primary" onClick={() => setPublicarPreg(true)}>Has una pregunta</Button>
                                )
                            }
                        </Col>

                    </Row>
                )
            }
            {
                publicarPreg && (

                    <Row gutter={[12, 12]} justify="center" style={{ marginTop: 15 }}>
                        <Col md={20} lg={16} xs={24}>
                            <InputPregunta reload={reload} setReload={setReload} id={id} token={token} />
                        </Col>


                    </Row>
                )
            }

            <Divider>Productos relacionados</Divider>
            <div style={{ margin: 20, padding: 20 }}>
                <Products category={category} tipo={0} busqueda="" url={`get_related_products/${id}`} />
            </div>

            <Divider>Preguntas recientes</Divider>
            <Row justify="center">
                <Col md={20} lg={16} xs={24}>
                    <ProductChat id={id} reload={reload} setReload={setReload} role={role_auth} comments={comments} />
                </Col>
            </Row>

        </Layout>
    )
}