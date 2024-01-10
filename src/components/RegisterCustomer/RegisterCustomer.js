import React, { useState, useEffect } from 'react';
import { Upload, Modal, Button, Result, Select, Alert, Checkbox, Card, Row, Col, Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';
// import ImgCrop from 'antd-img-crop';
import "./RegisterCustomer.scss"
// import OrganizacionForm from "../components/Generals/OrganizacionForm";
// import PlantaForm from "../components/Generals/PlantaForm";
// import 'bootstrap/dist/css/bootstrap.min.css';
import Customer from '../../utils/api/customers'
// import "../../sass/inputfile.scss"
import Layout from '../../layouts/NavBar';
import Register from '../../utils/api/register';

export default function RegisterCustomer() {
    const { Option } = Select;
    const [load, setLoad] = useState({
        loadings: []
    })
    let token = localStorage.getItem('token');
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
    const [form] = Form.useForm();
    // const [formValue, setFormValue] = useState({
    //     organizacion: "",
    //     rfc: "",
    //     pais: "",
    //     estado: "",
    //     ciudad: "",
    //     codigo_postal: "",
    //     colonia: "",
    //     calle: "",
    //     numero_exterior: "",
    //     numero_interior: "",

    //     nombre_planta: "",
    //     tipo: "",
    //     paisP: "",
    //     estadoP: "",
    //     ciudadP: "",
    //     codigo_postal_p: "",
    //     coloniaP: "",
    //     calleP: "",
    //     numero_exterior_p: "",
    //     numero_interior_p: "",
    //     // logo: ""

    // });

    // const [isData, setIsData] = useState([])

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

    const [show, setShow] = useState(false);



    useEffect(() => {
        //cuntry
        Register.Country()
        .then((response) => {
            return response.json()
        })
        .then((countries) => {
            setCountry({ countries: countries })
        }).catch(console.log)


    }, []);


    const onFormChangePais = (value) => {

        let id = value[1];
        let tipo = value[2];
        // setFormValue({
        //     ...formValue,
        //     [event.target.name]: event.target.value
        // });

        //state
        Register.State(id)
        .then((response) => {
            return response.json()
        })
        .then((states) => {
            setState({ states: states })
            if (tipo == 'pais') {
                setDisabled({
                    ...disabled,
                    stateOrg: false
                })

            } else if (tipo == 'paisP') {
                setDisabled({
                    ...disabled,
                    statePlanta: false
                })
            }

        }).catch(console.log)

        // console.log(value);
    };

    const onFormChangeState = (value) => {
        let id = value[1];
        let tipo = value[2];
        // setFormValue({
        //     ...formValue,
        //     [event.target.name]: event.target.value
        // });

        //city
        Register.City(id)
        .then((response) => {
            return response.json()
        })
        .then((cities) => {
            setCity({ cities: cities })
            if (tipo == 'estado') {
                setDisabled({
                    ...disabled,
                    cityOrg: false
                })

            } else if (tipo == 'estadoP') {
                setDisabled({
                    ...disabled,
                    cityPlanta: false
                })
            }

        }).catch(console.log)

        // console.log(value);
    };
    const onFormChangeCity = (value) => {
        let id = value[1];
        let tipo = value[2];
        // setFormValue({
        //     ...formValue,
        //     [event.target.name]: event.target.value
        // });

        //city
        Register.PC(id)
        .then((response) => {
            return response.json()
        })
        .then((pcodes) => {
            setPC({ pcodes: pcodes })
            if (tipo == 'ciudad') {
                setDisabled({
                    ...disabled,
                    pcOrg: false
                })

            } else if (tipo == 'ciudadP') {
                setDisabled({
                    ...disabled,
                    pcPlanta: false
                })
            }

        }).catch(console.log)

        // console.log(value);
    };
    const onFormChangeCP = (value) => {
        let id = value[1];
        let tipo = value[2];
        // setFormValue({
        //     ...formValue,
        //     [event.target.name]: event.target.value
        // });

        //city
        Register.Colony(id)
        .then((response) => {
            return response.json()
        })
        .then((colonies) => {
            setColony({ colonies: colonies })
            if (tipo == 'codigo_postal') {
                setDisabled({
                    ...disabled,
                    colonyOrg: false
                })

            } else if (tipo == 'codigo_postal_p') {
                setDisabled({
                    ...disabled,
                    colonyPlanta: false
                })
            }

        }).catch(console.log)

        // console.log(value);
    };

    // const onFormChange = event => {


    //     setFormValue({
    //         ...formValue,
    //         [event.target.name]: event.target.value
    //     });
    // };



    const [st, setSt] = useState({
        logo: null
    })


    // On file select (from the pop up) 
    const onFileChange = event => {
        // Update the state 
        setSt({ logo: event.target.files[0] });

    };

    const sendForm = (index) => (values) => {
        // console.log(values);
        // event.preventDefault()
        setLoad(({ loadings }) => {
            const newLoadings = [...loadings];
            newLoadings[index] = true;

            return {
                loadings: newLoadings,
            };
        })
        const params = new FormData();
        params.append('myFile', st.logo);
        params.append('organizacion', values.organizacion);
        params.append('rfc', values.rfc);
        params.append('pais', values.pais[1]);
        params.append('estado', values.estado[1]);
        params.append('ciudad', values.ciudad[1]);
        params.append('codigo_postal', values.codigo_postal[1]);
        params.append('colonia', values.colonia[1]);
        params.append('calle', values.calle);
        params.append('numero_exterior', values.numero_exterior);
        params.append('numero_interior', values.numero_interior);
        params.append('nombre_planta', values.nombre_planta);
        params.append('tipo', values.tipo);
        params.append('paisP', values.paisP[1]);
        params.append('estadoP', values.estadoP[1]);
        params.append('ciudadP', values.ciudadP[1]);
        params.append('codigo_postal_p', values.codigo_postal_p[1]);
        params.append('coloniaP', values.coloniaP[1]);
        params.append('calleP', values.calleP);
        params.append('numero_exterior_p', values.numero_exterior_p);
        params.append('numero_interior_p', values.numero_interior_p);


        console.log(params);

        Customer.ADD(params)
        .then(response => {
            if (response.data.success == true) {
                setTimeout(() => {
                    setShow(true);
                    setLoad(({ loadings }) => {
                        const newLoadings = [...loadings];
                        newLoadings[index] = false;

                        return {
                            loadings: newLoadings
                        };
                    });
                })
            } else {
                message.error('Error al enviar la solicitud')
                setLoad(({ loadings }) => {
                    const newLoadings = [...loadings];
                    newLoadings[index] = false;

                    return {
                        loadings: newLoadings
                    };
                });
            }

        })
        .catch(error => {
            console.log(error.response.data.errors)
        })
    }


    return (
        <Layout>

            <Row justify="center" style={{marginTop:30,marginBottom:30}} >
                <Col xs={24} lg={18}>

                    <Card title="Completa el registro de proveduría" headStyle={{ background: '#007BFF', color: '#FFF' }}>
                        {/* <Row>
                        <Col xs={24}> */}
                        {/* <h5>Registro de Organización</h5> */}
                        {/* </Col>
                    </Row> */}
                        <Form
                            form={form}
                            method="POST"
                            // layout="vertical"
                            onFinish={sendForm(0)}
                        >
                            <Row gutter={[12, 12]}  >
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
                                                    <Option key={index} value={[ct.name, ct.id, 'pais']}>{ct.name}</Option>
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
                                                    <Option key={index} value={[st.name, st.id, 'estado']}>{st.name}</Option>
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
                                                    <Option key={index} value={[cty.name, cty.id, 'ciudad']}>{cty.name}</Option>
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
                                                    <Option key={index} value={[pcod.name, pcod.id, 'codigo_postal']}>{pcod.name}</Option>
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
                                                    <Option key={index} value={[col.name, col.id, 'colonia']}>{col.name}</Option>
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

                                {/* <Col xs={24}>
                                <h5>Registro de planta</h5>
                            </Col>
                            <Col xs={24} md={14}>
                                <Form.Item
                                    label="Nombre de la planta"
                                    name="nombre_planta"
                                    rules={[{ required: true, message: 'Debes ingresar el nombre de la planta' }]}
                                >
                                    <Input placeholder="Añadir nombre" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={10}>
                                <Form.Item
                                    label="Tipo"
                                    name="tipo"
                                    rules={[{ required: true, message: 'Debes elegir un tipo de planta' }]}
                                >
                                    <Select
                                        showSearch
                                        name="tipo"
                                        placeholder="Seleccionar tipo de planta"
                                        optionFilterProp="children"

                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Option value="1">Almacen</Option>
                                        <Option value="2">Planta</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="País"
                                    name="paisP"
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
                                                <Option key={index} value={[ct.name, ct.id, 'paisP']}>{ct.name}</Option>
                                            )
                                        }
                                    </Select>
                                </Form.Item>

                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Estado"
                                    name="estadoP"
                                    rules={[{ required: true, message: 'Debes elegir un estado' }]}

                                >
                                    <Select
                                        showSearch
                                        name="estadoP"
                                        placeholder="Seleccionar estado"
                                        optionFilterProp="children"
                                        disabled={disabled.statePlanta}
                                        onChange={onFormChangeState}

                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            state.states.map((st, index) =>
                                                <Option key={index} value={[st.name, st.id, 'estadoP']}>{st.name}</Option>
                                            )
                                        }
                                    </Select>
                                </Form.Item>

                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Ciudad"
                                    name="ciudadP"
                                    rules={[{ required: true, message: 'Debes elegir una ciudad' }]}

                                >
                                    <Select
                                        showSearch
                                        name="ciudadP"
                                        placeholder="Seleccionar ciudad"
                                        optionFilterProp="children"
                                        disabled={disabled.cityPlanta}
                                        onChange={onFormChangeCity}

                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            city.cities.map((cty, index) =>
                                                <Option key={index} value={[cty.name, cty.id, 'ciudadP']}>{cty.name}</Option>
                                            )
                                        }
                                    </Select>
                                </Form.Item>

                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Código postal"
                                    name="codigo_postal_p"
                                    rules={[{ required: true, message: 'Debes elegir un codigo postal' }]}

                                >
                                    <Select
                                        showSearch
                                        name="codigo_postal_p"
                                        placeholder="Seleccionar código postal"
                                        optionFilterProp="children"
                                        disabled={disabled.pcPlanta}
                                        onChange={onFormChangeCP}

                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            pc.pcodes.map((pcod, index) =>
                                                <Option key={index} value={[pcod.name, pcod.id, 'codigo_postal_p']}>{pcod.name}</Option>
                                            )
                                        }
                                    </Select>
                                </Form.Item>

                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Colonia"
                                    name="coloniaP"
                                    rules={[{ required: true, message: 'Debes elegir una colonia' }]}

                                >
                                    <Select
                                        showSearch
                                        name="coloniaP"
                                        placeholder="Seleccionar colonia"
                                        optionFilterProp="children"
                                        disabled={disabled.colonyPlanta}
                                        // onChange={onFormChange}

                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            colony.colonies.map((col, index) =>
                                                <Option key={index} value={[col.name, col.id, 'coloniaP']}>{col.name}</Option>
                                            )
                                        }
                                    </Select>
                                </Form.Item>

                            </Col>
                            <Col xs={24} md={6}>

                                <Form.Item
                                    label="Calle"
                                    name="calleP"
                                    rules={[{ required: true, message: 'Debes ingresar una calle' }]}
                                >
                                    <Input placeholder="Ingresar calle" />
                                </Form.Item>


                            </Col>
                            <Col xs={24} md={6}>

                                <Form.Item
                                    label="Número exterior"
                                    name="numero_exterior_p"
                                    rules={[{ required: true, message: 'Debes ingresar el número exterior' }]}
                                >
                                    <Input placeholder="Ingresar núm. ext" />
                                </Form.Item>


                            </Col> 
                            <Col xs={24} md={12} xl={8}>

                                <Form.Item
                                    label="Número interior"
                                    name="numero_interior_p"
                                    rules={[{ required: true, message: 'Debes ingresar el número interior' }]}
                                >
                                    <Input placeholder="Ingresar núm. int" />
                                </Form.Item>


                            </Col>
*/}
                            </Row>
                            <Row gutter={[12, 12]}>
                                <Col xs={24} md={12}>

                                    <Form.Item
                                        label="Mi logo"
                                        name="logo"
                                        rules={[{ required: true, message: 'Debes agregar tu logo' }]}
                                    >
                                        <input type="file" onChange={onFileChange} required />
                                    </Form.Item>


                                </Col>

                                <Col xs={24} md={12} >
                                    <Form.Item >
                                        <Button type="primary" htmlType="submit" loading={load.loadings[0]} style={{ width: '100%' }} >
                                            Registrarme
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>

                        </Form>

                        {/* <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card ">
                            <h5 className="card-header bg-primary text-white">Completa el registro de comprador</h5>
                            <div className="card-body">

                                <form className="col-12" method="POST" id="upload-image" onSubmit={sendForm(0)} encType="multipart/form-data">

                                    <h1>Registro de Organizacion</h1>

                                    <div className="row justify-content-center mt-1">
                                        <div className="col-7">
                                            <div className="form-group">
                                                <label htmlFor=" Email1">Nombre de la organizacion*</label>
                                                <input onChange={onFormChange} type="text" className="form-control" id=" Email1" name="organizacion" aria-describedby="emailHelp" required
                                                    value={formValue.organizacion}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-5">
                                            <div className="form-group">
                                                <label htmlFor=" Email1">RFC*</label>
                                                <input onChange={onFormChange} type="text" minLength="12" maxLength="13" className="form-control" id="Email1" name="rfc" aria-describedby="emailHelp"
                                                    value={formValue.rfc}
                                                    required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center">
                                        <div className="col-3">
                                            <label htmlFor=" Email1">Pais*</label>
                                            <select className="custom-select custom-select-md mb-3" name="pais"
                                                onChange={onFormChangePais}
                                                //  value={formValue.pais}
                                                required>
                                                <option defaultValue="1" >Seleccionar Pais</option>
                                                {
                                                    country.countries.map((ct, index) =>
                                                        <option key={index} value={ct.id}>{ct.name}</option>
                                                    )
                                                }


                                            </select>
                                        </div>
                                        <div className="col-3">
                                            <label htmlFor=" Email1">Estado*</label>
                                            <select className="custom-select custom-select-md mb-3" name="estado"
                                                disabled={disabled.stateOrg}
                                                onChange={onFormChangeState}
                                                required>
                                                <option defaultValue="1" >Seleccionar Estado</option>
                                                {
                                                    state.states.map((st, index) =>
                                                        <option key={index} value={st.id}>{st.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="col-3">
                                            <label htmlFor=" Email1">Ciudad*</label>
                                            <select className="custom-select custom-select-md mb-3" name="ciudad"
                                                disabled={disabled.cityOrg}
                                                onChange={onFormChangeCity}
                                                required>
                                                <option defaultValue="1">Seleccionar Ciudad</option>
                                                {
                                                    city.cities.map((cty, index) =>
                                                        <option key={index} value={cty.id}>{cty.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="col-3">
                                            <label htmlFor=" Email1">Código postal*</label>

                                            <select className="custom-select custom-select-md mb-3" name="codigo_postal"
                                                required
                                                disabled={disabled.pcOrg}
                                                onChange={onFormChangeCP}
                                            >
                                                <option defaultValue="1" >Seleccionar Codigo Postal</option>
                                                {
                                                    pc.pcodes.map((pcod, index) =>
                                                        <option key={index} value={pcod.id}>{pcod.name}</option>
                                                    )
                                                }
                                            </select>

                                        </div>

                                    </div>

                                    <div className="row justify-content-center">
                                        <div className="col-3">
                                            <label htmlFor="exampleinput  Email1">Colonia*</label>
                                            <select className="custom-select custom-select-md mb-3" name="colonia"
                                                disabled={disabled.colonyOrg}
                                                onChange={onFormChange}
                                                required>
                                                <option defaultValue="1">Seleccionar Colonia</option>
                                                {
                                                    colony.colonies.map((col, index) =>
                                                        <option key={index} value={col.id}>{col.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="col-3">
                                            <div className="form-group">
                                                <label htmlFor="exampleinputEmail1">Calle*</label>
                                                <input onChange={onFormChange} type="text" className="form-control" id="exampleinput  Email1" aria-describedby="emailHelp" name="calle"
                                                    value={formValue.calle}
                                                    onChange={onFormChange}
                                                    required />
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <div className="form-group">
                                                <label htmlFor="exampleinput  Email1">Numero exterior*</label>
                                                <input onChange={onFormChange} type="text" className="form-control" id=" Email1" aria-describedby="emailHelp" name="numero_exterior"
                                                    value={formValue.numero_exterior}
                                                    required />
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <div className="form-group">
                                                <label htmlFor="exampleinput  Email1">Numero interior*</label>
                                                <input onChange={onFormChange} type="text" className="form-control" id=" Email1" aria-describedby="emailHelp" name="numero_interior"
                                                    value={formValue.numero_interior}
                                                    required />
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row mt-1">
                                        <h1>Registro de planta</h1>
                                    </div>

                                    <div className="row justify-content-center mt-1">
                                        <div className="col-7">
                                            <div className="form-group">
                                                <label htmlFor=" Email1">Nombre de la Planta*</label>
                                                <input onChange={onFormChange} type="text" className="form-control" id=" Email1" aria-describedby="emailHelp" name="nombre_planta"
                                                    value={formValue.nombre_planta}
                                                    required />
                                            </div>
                                        </div>
                                        <div className="col-5">
                                            <div className="form-group">
                                                <label htmlFor=" Email1">Tipo*</label>
                                                <select className="custom-select custom-select-md mb-3" name="tipo"
                                                    // value={formValue.tipo}
                                                    onChange={onFormChange}
                                                    required>
                                                    <option defaultValue="1">Seleccionar tipo de planta</option>
                                                    <option value="1">Almacen</option>
                                                    <option value="2">Planta</option>

                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center">
                                        <div className="col-3">
                                            <label htmlFor=" Email1">Pais*</label>
                                            <select className="custom-select custom-select-md mb-3" name="paisP"
                                                onChange={onFormChangePais}
                                                required>
                                                <option defaultValue="1"  >Seleccionar Pais</option>
                                                {
                                                    country.countries.map((ct, index) =>
                                                        <option key={index} value={ct.id}>{ct.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="col-3">
                                            <label htmlFor=" Email1">Estado*</label>
                                            <select className="custom-select custom-select-md mb-3" name="estadoP"
                                                // value={formValue.estadoP}
                                                disabled={disabled.statePlanta}
                                                onChange={onFormChangeState}
                                                required>
                                                <option defaultValue="1">Seleccionar Estado</option>
                                                {
                                                    state.states.map((st, index) =>
                                                        <option key={index} value={st.id}>{st.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="col-3">
                                            <label htmlFor=" Email1">Ciudad*</label>
                                            <select className="custom-select custom-select-md mb-3" name="ciudadP"
                                                // value={formValue.ciudadP}
                                                disabled={disabled.cityPlanta}
                                                onChange={onFormChangeCity}
                                                required>
                                                <option defaultValue="1">Seleccionar Ciudad</option>
                                                {
                                                    city.cities.map((cty, index) =>
                                                        <option key={index} value={cty.id}>{cty.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="col-3">
                                            <label htmlFor=" Email1">Código postal*</label>

                                            <select className="custom-select custom-select-md mb-3" name="codigo_postal_p"
                                                // value={formValue.codigo_postal_p}
                                                disabled={disabled.pcPlanta}
                                                onChange={onFormChangeCP}
                                                required
                                            >
                                                <option defaultValue="1">Seleccionar Codigo Postal</option>
                                                {
                                                    pc.pcodes.map((pcod, index) =>
                                                        <option key={index} value={pcod.id}>{pcod.name}</option>
                                                    )
                                                }
                                            </select>

                                        </div>

                                    </div>

                                    <div className="row justify-content-center">
                                        <div className="col-3">
                                            <label htmlFor=" Email1">Colonia*</label>
                                            <select className="custom-select custom-select-md mb-3" name="coloniaP"
                                                // value={formValue.coloniaP}
                                                disabled={disabled.colonyPlanta}
                                                onChange={onFormChange}
                                                required>
                                                <option defaultValue="1">Seleccionar Colonia</option>
                                                {
                                                    colony.colonies.map((col, index) =>
                                                        <option key={index} value={col.id}>{col.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="col-3">
                                            <div className="form-group">
                                                <label htmlFor=" Email1">Calle*</label>
                                                <input onChange={onFormChange} type="text" className="form-control" id=" Email1" aria-describedby="emailHelp" name="calleP"
                                                    value={formValue.calleP}
                                                    required />
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <div className="form-group">
                                                <label htmlFor=" Email1">Numero exterior*</label>
                                                <input onChange={onFormChange} type="text" className="form-control" id=" Email1" aria-describedby="emailHelp" name="numero_exterior_p"
                                                    value={formValue.numero_exterior_p}
                                                    required />
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <div className="form-group">
                                                <label htmlFor=" Email1">Numero interior*</label>
                                                <input onChange={onFormChange} type="text" className="form-control" id=" Email1" aria-describedby="emailHelp" name="numero_interior_p"
                                                    value={formValue.numero_interior_p}
                                                    required />
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row mt-2">
                                        <div className="col-1 ml-auto">
                                            <label htmlFor="avatar">Mi logo:</label>
                                        </div>

                                        <div className="col-7 ">
                                            <div className="form-group">

                                                <input type="file" onChange={onFileChange} style={{ width: "80%" }} required />

                                            </div>

                                        </div>

                                        <div className="col-4">
                                            <button className="btn btn-primary" style={{ width: "100%" }}
                                                loading={load.loadings[0]}
                                            >Guardar</button>
                                        </div>
                                    </div>

                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
 */}

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



