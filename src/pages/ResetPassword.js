import { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Col, message, Typography, Row, } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import Layout from '../layouts/NavBar';
import '../scss/reset-password.scss';
import { useNavigate, useParams } from 'react-router-dom';
import AuthService from '../utils/api/auth';

export default function ResetPassword() {
    
    const { tokenUrl } = useParams();
    const [feedback, setFeedback] = useState({
        isSuccess: false,
        isError: false,
        message: '',
    });

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [load, setLoad] = useState(false);
    const formValues = Form.useWatch([], form);
    const [submitableForm, setSubmitableForm] = useState(false);

    useEffect(() => {
        form.validateFields({
            validateOnly: true,
        }).then(
            () => {
                setSubmitableForm(true);
            },
            () => {
                setSubmitableForm(false);
            }
        );
    }, [formValues]);

    const onFinish = (values) => {
        setLoad(true);

        AuthService.PasswordReset(values)
            .then((response) => {
                if (response.data.success === true) {
                    setFeedback({
                        isSuccess: true,
                        message: response.data.message,
                    });
                    message.success('Espere a iniciar sesión...');
                    AuthService.Login({
                        email: values.email,
                        password: values.password,
                    })
                        .then((response) => {
                            localStorage.setItem('token', response.data.token);
                            localStorage.setItem('role', response.data.user.role_id);
                            setLoad(false);
                            if (response.data.user.email_verified_at == null) {
                                navigate('/account/unverified');
                            } else if (response.data.user.status === 2) {
                                navigate('/error/401');
                            } else if (response.data.user.status === 0) {
                                navigate('/account/suspended');
                            } else if (
                                response.data.user.role_id === 1 ||
                                response.data.user.role_id === 2 ||
                                response.data.user.role_id === 3
                            ) {
                                navigate('/dashboard');
                            } else if (response.data.user.role_id === 4) {
                                navigate('/catalog');
                            } else if (response.data.user.role_id === 5) {
                                navigate(`/orders/${response.data.user.id}/1`);
                            } else if (response.data.user.role_id === 6) {
                                navigate(`/orders/${response.data.user.id}/1`);
                            }
                        })
                        .catch((error) => {
                            setLoad(false);
                        });
                } else {
                    setFeedback({
                        isError: true,
                        message: response.data.message,
                    });
                    setLoad(false);
                }
            })
            .catch((error) => {
                setFeedback({ isError: true });
                setLoad(false);
            });
        setLoad(false);
    };

    return (
        <Layout>
            <Row justify='center'>
                <Col span={24}>
                    <Typography.Title
                        level={2}
                        className='login-form'
                        style={{ textAlign: 'center' }}>
                        Recuperar contraseña
                    </Typography.Title>
                </Col>
            </Row>

            {feedback.isError && (
                <Col
                    span={24}
                    style={{
                        marginTop: 16,
                        marginBottom: 16,
                        textAlign: 'center',
                    }}>
                    <Alert message={feedback.message} type='error' closable />
                </Col>
            )}
            {feedback.isSuccess && (
                <Col
                    span={24}
                    style={{
                        marginTop: 16,
                        marginBottom: 16,
                        textAlign: 'center',
                    }}>
                    <Alert message={feedback.message} type='success' closable />
                </Col>
            )}
            <Form
                name='normal_login'
                className='login-form'
                onFinish={onFinish}
                form={form}>
                <Form.Item
                    name='email'
                    rules={[
                        {
                            required: true,
                            message: 'Favor de ingresar tu correo electronico',
                        },
                        {
                            type: 'email',
                            message: 'Esto no parece un correo electronico',
                        }
                    ]}>
                    <Input
                        prefix={
                            <MailOutlined />
                        }
                        placeholder='Tu email'
                    />
                </Form.Item>

                <Form.Item
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: 'Favor de escribir su contraseña.',
                        },
                        {
                            min: 8,
                            message:
                                'La contraseña debe contener al menos 8 caracteres',
                        },
                    ]}
                    hasFeedback>
                    <Input.Password
                        prefix={
                            <LockOutlined />
                        }
                        placeholder='Ingresa tu contraseña'
                    />
                </Form.Item>

                <Form.Item
                    name='password_confirmation'
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Favor de confirmar la contraseña.',
                        },
                        {
                            min: 8,
                            message:
                                'La contraseña debe contener al menos 8 caracteres',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                 return (!value || getFieldValue('password') === value) ? Promise.resolve() : Promise.reject('Las contraseñas no coinciden.');
                            },
                        }),
                    ]}>
                    <Input.Password
                        prefix={
                            <LockOutlined />
                        }
                        placeholder='Confirma tu contraseña'
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type='primary'
                        htmlType='submit'
                        block={true}
                        loading={load}
                        disabled={!submitableForm}>
                        Cambiar contraseña
                    </Button>
                </Form.Item>
            </Form>
        </Layout>
    );
}
