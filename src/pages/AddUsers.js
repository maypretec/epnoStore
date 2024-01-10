import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    Steps, Button, message, Form,
    Input,
    Tooltip,
    Cascader,
    Select,
    Row,
    Col,
    Alert,
    Checkbox,
    AutoComplete,
    Typography
} from 'antd';
import Layout from "../layouts/ControlPanelLayout";
import { DoubleRightOutlined } from '@ant-design/icons'
import "../scss/steps.scss"
import { Link, useNavigate, useParams } from "react-router-dom";
import Users from "../utils/api/users";
import ValueStream from '../utils/api/valuestreams';

const { Step } = Steps;
const { Text } = Typography;

export default function AddUsers(props) {
    let { cuentas } = useParams();
    let history = useNavigate();
    let token = localStorage.getItem('token');
    let role = localStorage.getItem('role');
    const [error, setError] = useState({
        msjSuccess: false,
        msjError: false,
        msg: ''
    });
    const [load, setLoad] = useState(false)
    const [vs, setVs] = useState([]);
    const [form] = Form.useForm();
    const [autoCompleteResult, setAutoCompleteResult] = useState([]);

    useEffect(() => {
        role == 1 &&
            ValueStream.All()
            .then((response) => {
                return response.json()

            })
            .then((data) => {
                setVs(data)
            }).catch(console.log)
    }, []);

    const onemailChange = (value) => {
        if (!value) {
            setAutoCompleteResult([]);
        } else {
            setAutoCompleteResult(['@live.com.mx', '@gmail.com', '@outlook.com', '@hotmail.com', '@yahoo.com', '@epno.com.mx'].map((domain) => `${value}${domain}`));
        }
    };

    const emailOptions = autoCompleteResult.map((email) => ({
        label: email,
        value: email,
    }));

    const onFinish = (values) => {
        setLoad(true)
        Users.NewUser(values)
        .then(response => {
            if (response.data.success == true) {
                setLoad(false);
                setError({
                    msjSuccess: true,
                    msg: response.data.message
                })
                form.resetFields();
            } else {
                setLoad(false);
                setError({
                    msjError: true,
                    msg: response.data.message
                })
            }

        })
        .catch(error => {
            setError({
                msjError: true,
                msg: 'Hubo un error al crear el nuevo usuario'
            })
            setLoad(false);

        })
    };


    return (
        <Layout>

            <div className="steps-content">
                {
                    role != 1 ?
                        <Text mark >NOTA: El usuario agregado, quedará asignado a tu misma organización y valuestream.</Text>
                        :
                        <Text mark >NOTA: El usuario agregado, quedará asignado a tu misma organización.</Text>
                }
                <Form
                    onFinish={onFinish}
                    form={form}
                    name="register"
                    layout='vertical'
                    style={{ marginTop: 15 }}
                    scrollToFirstError

                >
                    {
                        error.msjError && (
                            <Col style={{ marginTop: 16, marginBottom: 16, textAlign: "center" }}>
                                <Alert
                                    message={error.msg}
                                    type="error"
                                    closable
                                />
                            </Col>


                        )
                    }
                    {
                        error.msjSuccess && (
                            <Col style={{ marginTop: 16, marginBottom: 16, textAlign: "center" }}>
                                <Alert
                                    message={error.msg}
                                    type="success"
                                    closable
                                />
                            </Col>


                        )
                    }
                    <Row justify='center' gutter={[12, 12]} align='middle'>
                        <Col xs={24} md={12} lg={8} xl={6}>
                            <Form.Item
                                name="name"
                                label="Nombre"
                                rules={[{ required: true, message: 'Ingresa el nombre de usuario!' }]}
                            >
                                <Input
                                    name="name"

                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8} xl={6}>
                            <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'El correo agregado no es valido.',
                                    },
                                    {
                                        required: true,
                                        message: 'Favor de ingresar un correo.',
                                    },
                                ]}
                            >
                                <AutoComplete options={emailOptions} onChange={onemailChange} >
                                    <Input className="login-input" placeholder="Correo electronico" />
                                </AutoComplete>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8} xl={6}>
                            <Form.Item
                                name="phone"
                                label="Telefono"
                                rules={[{ required: true, message: 'Favor de agregar un numero de telefono.' },

                                {
                                    pattern: /^(?:\d*)$/,
                                    message: "Favor de agregar un numero valido",
                                },
                                {
                                    pattern: /^[\d]{10,13}$/,
                                    message: "El numero de telefono debe tener al menos 10 caracteres y no mayor a 13.",
                                },
                                ]}
                            >
                                <Input
                                    name="phone"

                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8} xl={6} >
                            <Form.Item
                                name="password"
                                label="Contraseña"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Favor de agregar su contraseña.',
                                    },
                                    {
                                        min: 8,
                                        message: "La contraseña debe contener al menos 8 caracteres",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password
                                    name="password"

                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8} xl={6} >
                            <Form.Item
                                name="confirm"
                                label="Confirmar Contraseña"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Favor de confirmar la contraseña.',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Las contraseñas no coinciden.');
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    name="confirm"

                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12} lg={8} xl={6} >
                            <Form.Item
                                name="role_id"
                                label="Tipo"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Selecciona un tipo de usuario.',
                                    },

                                ]}
                            >
                                <Select placeholder="Selecciona un tipo de usuario"

                                >
                                    {
                                        role == 1 ?
                                            <>
                                                <Select.Option value={5}>Comprador</Select.Option>
                                                <Select.Option value={3}>VS Manager</Select.Option>
                                                <Select.Option value={2}>Finanzas</Select.Option>
                                            </>
                                            :
                                            <>
                                                <Select.Option value={5}>Comprador</Select.Option>
                                                <Select.Option value={9}>Repartidor</Select.Option>
                                            </>
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        {
                            role == 1 &&

                            <Col xs={24} md={12} lg={8} xl={6}>
                                <Form.Item name="vs" label="VS"
                                    rules={[{ required: true, message: 'Debes de seleccionar el VS al que pertenecerán' }]}
                                >
                                    <Select
                                        placeholder="Elige el VS al que pertenecerá"
                                        allowClear
                                    >
                                        {
                                            vs.map((v) => (
                                                <Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>

                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>

                        }
                        <Col xs={24} md={12} lg={8} xl={6}>
                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit" shape="round" danger
                                    loading={load}
                                >
                                    Registrar
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>

        </Layout >
    );
}

