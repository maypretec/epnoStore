import React, { useState, useEffect } from 'react';
import { Upload, Modal, Button, Result, Select, Alert, Checkbox, Card, Row, Col, Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import SupplierService from '../../utils/api/suppliers';
import Layout from '../../layouts/LayoutPage';
import RegisterService from '../../utils/api/register';



export default function RegisterSupplier() {
    const [load, setLoad] = useState({
        loadings: []
    })
    const [form] = Form.useForm();
    let token = localStorage.getItem('token');
    const { Option } = Select;
    const [disabled, setDisabled] = useState({
        stateOrg: true,
        cityOrg: true,
        pcOrg: true,
        colonyOrg: true,
        statePlanta: true,
        cityPlanta: true,
        pcPlanta: true,
        colonyPlanta: true
    })
    

    const [camposVacios, setCamposVacios] = useState(false)
    const [country, setCountry] = useState({
        countries: [],
    });
    const [state, setState] = useState({
        states: [],
    });
    const [city, setCity] = useState({
        cities: [],
    });
    const [pc, setPC] = useState({
        pcodes: [],
    });
    const [colony, setColony] = useState({
        colonies: [],
    });

    const [categories, setCategories] = useState([]);

    const [show, setShow] = useState(false);

    const showModal = () => {
        setShow(!show);
    };


    useEffect(() => {
        //cuntry
        RegisterService.Country()
        .then((response) => {
            return response.json()
        })
        .then((countries) => {
            setCountry({ countries: countries })
        }).catch(console.log)

        //Categories
        RegisterService.Categories()
        .then((response) => {
            return response.json()
        })
        .then((categories) => {
            setCategories(categories)
        }).catch(console.log)

    }, []);


    const onFormChangePais = (value) => {


        RegisterService.State(value)
        .then((response) => {
            return response.json()
        })
        .then((states) => {
            setState({ states: states })
            setDisabled({
                ...disabled,
                stateOrg: false
            })

        }).catch(console.log)

    };

    const onFormChangeState = (value) => {

        RegisterService.City(value)
        .then((response) => {
            return response.json()
        })
        .then((cities) => {
            setCity({ cities: cities })
            setDisabled({
                ...disabled,
                cityOrg: false
            })



        }).catch(console.log)

    };
    const onFormChangeCity = (value) => {


        //city
        RegisterService.PC(value)
        .then((response) => {
            return response.json()
        })
        .then((pcodes) => {
            setPC({ pcodes: pcodes })

            setDisabled({
                ...disabled,
                pcOrg: false
            })


        }).catch(console.log)

        // console.log(value);
    };
    const onFormChangeCP = (value) => {


        //city
        RegisterService.Colony(value)
        .then((response) => {
            return response.json()
        })
        .then((colonies) => {
            setColony({ colonies: colonies })

            setDisabled({
                ...disabled,
                colonyOrg: false
            })


        }).catch(console.log)

    };




    const [st, setSt] = useState({
        logo: null
    });


    // On file select (from the pop up) 
    const onFileChange = event => {

        // Update the state 
        setSt({ logo: event.target.files[0] });


    };
    
    // console.log(category);

    const sendForm = (index) => (values) => {
        console.log(values);
        // event.preventDefault()
        // setLoad(({ loadings }) => {
        //     const newLoadings = [...loadings];
        //     newLoadings[index] = true;

        //     return {
        //         loadings: newLoadings,
        //     };
        // })
        const params = new FormData();
        params.append('myFile', st.logo);
        params.append('organizacion', values.organizacion);
        params.append('rfc', values.rfc);
        params.append('pais', values.pais);
        params.append('estado', values.estado);
        params.append('ciudad', values.ciudad);
        params.append('codigo_postal', values.codigo_postal);
        params.append('colonia', values.colonia);
        params.append('calle', values.calle);
        params.append('numero_exterior', values.numero_exterior);
        params.append('numero_interior', values.numero_interior);
        params.append('url', values.url);
        params.append('categoria', values.categoria);
        params.append('terminos', values.terminos);

        // console.log(params);


        SupplierService.AddSupplier(params)
        .then(response => {
            // if (response.data.success == true) {
            //     setTimeout(() => {
            //         setShow(true);
            //         setLoad(({ loadings }) => {
            //             const newLoadings = [...loadings];
            //             newLoadings[index] = false;

            //             return {
            //                 loadings: newLoadings
            //             };
            //         });
            //     })
            // } else if (response.data.campos_vacios == true) {
            //     setCamposVacios(true);
            //     setLoad(({ loadings }) => {
            //         const newLoadings = [...loadings];
            //         newLoadings[index] = false;

            //         return {
            //             loadings: newLoadings
            //         };
            //     });
            // } else if (response.data.success == false) {
            //     message.error('Error al enviar la solicitud')
            //     setLoad(({ loadings }) => {
            //         const newLoadings = [...loadings];
            //         newLoadings[index] = false;

            //         return {
            //             loadings: newLoadings
            //         };
            //     });
            // }

        })
        .catch(error => {
            console.log(error.response.data.errors)
        })
    }


    return (
        <Layout>

            <Row justify="center" style={{ marginTop: 30, marginBottom: 30 }}>
                <Col xs={24} lg={18}>

                    <Card title="Completa el registro de proveduría" headStyle={{ background: '#007BFF', color: '#FFF' }}>
                        {/* <Row>
                        <Col xs={24}>
                            <h5>Registro de Organización</h5>
                        </Col>
                    </Row> */}
                        <Form
                            form={form}
                            method="POST"
                            // layout="vertical"
                            onFinish={sendForm(0)}
                        >
                            {
                                camposVacios && (
                                    <Alert message="Todos los campos deben ser llenados" type="error" showIcon closable
                                        style={{ marginBottom: 20, marginTop: 20, marginLeft: "auto", marginRight: "auto" }} />
                                )
                            }
                            <Row gutter={[12, 12]} justify="center">
                                <Col xs={24} md={14}>
                                    <Form.Item
                                        label="Nombre de la organización"
                                        name="organizacion"
                                        rules={[{ required: true, message: 'Debes ingresar el nombre de la organización' }]}
                                    >
                                        <Input placeholder="Añadir nombre" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={10}>
                                    <Form.Item
                                        label="RFC"
                                        name="rfc"
                                        rules={[{ required: true, message: 'Debes ingresar el RFC de la organización' }]}
                                    >
                                        <Input maxLength={13} minLength={12} />
                                    </Form.Item>

                                </Col>
                                <Col xs={24} md={12} xl={8}>
                                    <Form.Item
                                        label="País"
                                        name="pais"
                                    rules={[{ required: true, message: 'Debes elegir un país' }]}

                                    >
                                        <Select
                                            showSearch
                                            name="pais"
                                            placeholder="Seleccionar país"
                                            optionFilterProp="children"
                                            onChange={onFormChangePais}

                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {
                                                country.countries.map((ct, index) =>
                                                    <Option key={index} value={ct.id}>{ct.name}</Option>
                                                )
                                            }
                                        </Select>
                                    </Form.Item>

                                </Col>
                                <Col xs={24} md={12} xl={8}>
                                    <Form.Item
                                        label="Estado"
                                        name="estado"
                                    rules={[{ required: true, message: 'Debes elegir un estado' }]}

                                    >
                                        <Select
                                            showSearch
                                            name="estado"
                                            placeholder="Seleccionar estado"
                                            optionFilterProp="children"
                                            disabled={disabled.stateOrg}
                                            onChange={onFormChangeState}

                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {
                                                state.states.map((st, index) =>
                                                    <Option key={index} value={st.id}>{st.name}</Option>
                                                )
                                            }
                                        </Select>
                                    </Form.Item>

                                </Col>
                                <Col xs={24} md={12} xl={8}>
                                    <Form.Item
                                        label="Ciudad"
                                        name="ciudad"
                                    rules={[{ required: true, message: 'Debes elegir una ciudad' }]}

                                    >
                                        <Select
                                            showSearch
                                            name="ciudad"
                                            placeholder="Seleccionar ciudad"
                                            optionFilterProp="children"
                                            disabled={disabled.cityOrg}
                                            onChange={onFormChangeCity}

                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {
                                                city.cities.map((cty, index) =>
                                                    <Option key={index} value={cty.id}>{cty.name}</Option>
                                                )
                                            }
                                        </Select>
                                    </Form.Item>

                                </Col>
                                <Col xs={24} md={12} xl={8}>
                                    <Form.Item
                                        label="Código postal"
                                        name="codigo_postal"
                                    rules={[{ required: true, message: 'Debes elegir un codigo postal' }]}

                                    >
                                        <Select
                                            showSearch
                                            name="codigo_postal"
                                            placeholder="Seleccionar código postal"
                                            optionFilterProp="children"
                                            disabled={disabled.pcOrg}
                                            onChange={onFormChangeCP}

                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {
                                                pc.pcodes.map((pcod, index) =>
                                                    <Option key={index} value={pcod.id}>{pcod.name}</Option>
                                                )
                                            }
                                        </Select>
                                    </Form.Item>

                                </Col>
                                <Col xs={24} md={12} xl={8}>
                                    <Form.Item
                                        label="Colonia"
                                        name="colonia"
                                    rules={[{ required: true, message: 'Debes elegir una colonia' }]}

                                    >
                                        <Select
                                            showSearch
                                            name="colonia"
                                            placeholder="Seleccionar colonia"
                                            optionFilterProp="children"
                                            disabled={disabled.colonyOrg}
                                            // onChange={onFormChange}

                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {
                                                colony.colonies.map((col, index) =>
                                                    <Option key={index} value={col.id}>{col.name}</Option>
                                                )
                                            }
                                        </Select>
                                    </Form.Item>

                                </Col>
                                <Col xs={24} md={12} xl={8}>

                                    <Form.Item
                                        label="Calle"
                                        name="calle"
                                        rules={[{ required: true, message: 'Debes ingresar una calle' }]}
                                    >
                                        <Input placeholder="Ingresar calle" />
                                    </Form.Item>


                                </Col>
                                <Col xs={24} md={12} xl={8}>

                                    <Form.Item
                                        label="Número exterior"
                                        name="numero_exterior"
                                        rules={[{ required: true, message: 'Debes ingresar el número exterior' }]}
                                    >
                                        <Input placeholder="Ingresar núm. ext" />
                                    </Form.Item>


                                </Col>
                                <Col xs={24} md={12} xl={8}>

                                    <Form.Item
                                        label="Número interior"
                                        name="numero_interior"
                                        rules={[{ required: true, message: 'Debes ingresar el número interior' }]}
                                    >
                                        <Input placeholder="Ingresar núm. int" />
                                    </Form.Item>


                                </Col>


                                <Col xs={24} md={12}>

                                    <Form.Item
                                        label="Página web"
                                        name="url"
                                        rules={[{ required: true, message: 'Debes ingresar tu página web' }]}
                                    >
                                        <Input placeholder="Ingresar página web" />
                                    </Form.Item>


                                </Col>
                                <Col xs={24} md={12}>

                                    <Form.Item
                                        label="Categoria(s)"
                                        name="categoria"
                                    // rules={[{ required: true, message: 'Debes elegir almenos una categoria' }]}
                                    >
                                        <Select
                                            mode="multiple"
                                            allowClear

                                            placeholder="Seleccionar la(s) categoria(s)"
                                            
                                            name="categoria"
                                            rules={[{ required: true }]}
                                        >
                                            {
                                                categories.map((category, index) => (
                                                    <Option key={index} value={category.id}>{category.name}</Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} xl={8}>
                                    <Form.Item
                                        name="terminos"
                                        valuePropName="checked"
                                        rules={[
                                            {
                                                validator: (_, value) =>
                                                    value ? Promise.resolve() : Promise.reject(new Error('Debes de aceptar los terminos y condiciones')),
                                            },
                                        ]}
                                    >
                                        <Checkbox>
                                            Acepto los terminos y codiciones
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} xl={8}>

                                    <Form.Item
                                        label="Mi logo"
                                        name="logo"
                                        rules={[{ required: true, message: 'Debes agregar tu logo' }]}
                                    >
                                        <input type="file" onChange={onFileChange}  />
                                    </Form.Item>


                                </Col>
                                <Col xs={24} md={12} xl={8}>
                                    <Form.Item >
                                        <Button type="primary" htmlType="submit" loading={load.loadings[0]} style={{ width: '100%' }} >
                                            Registrarme
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>

                        </Form>

                      
                        <Modal
                            title="Notificación de solicitud"
                            closable={false}
                            visible={show}
                            footer={[

                                <Button key="submit" type="primary" >
                                    <Link to="/error/401">Entendido</Link>
                                </Button>,
                            ]}

                        >

                            <Result
                                status="success"
                                title="¡Solicitud enviada con exito!"
                                subTitle="Una vez que un agente revise tu información recibirás un correo donde se especifique si tu solicitud fue aprobada."

                            />
                        </Modal>
                    </Card>
                </Col>
            </Row>

        </Layout>
    );

}



