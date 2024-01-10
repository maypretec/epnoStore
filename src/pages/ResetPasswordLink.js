import { useState, useEffect } from 'react';
import { Card, Button, Input, Form, Alert, Col, Row, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import Layout from '../layouts/NavBar';
import '../scss/reset-password.scss';
import AuthService from '../utils/api/auth';

export default function ResetPasswordLink() {
    const [feedback, setFeedback] = useState({
        isSuccess: false,
        isError: false,
        message: '',
    });
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);
    const [load, setLoad] = useState(false);
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
        AuthService.PasswordEmail(values)
            .then((response) => {
                if (response.data.success === true) {
                    setFeedback({
                        isSuccess: true,
                        message: response.data.message,
                    });
                    form.resetFields();
                    setLoad(false);
                } else {
                    setFeedback({
                        isError: true,
                        message: response.data.message,
                    });
                    setLoad(false);
                }
            })
            .catch((error) => {
                setFeedback({
                    isError: true,
                    message:
                        'Hubo un error al enviar el correo, intenta de nuevo.',
                });
                setLoad(false);
            });
    };

    return (
        <Layout>
            <Row justify='center'>
                <Col xs={24} md={12} lg={8}>
                    <Card
                        title={
                            <Typography.Title level={3}>
                                Recuperar Contraseña
                            </Typography.Title>
                        }>
                        <Row>
                            <Col span={24}>
                                <Typography.Paragraph>
                                    Ingresa tu correo. Te enviaremos un correo
                                    con el link para recuperar tu contraseña
                                </Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form onFinish={onFinish} form={form}>
                                    {feedback.isError && (
                                        <Col
                                            style={{
                                                marginTop: 16,
                                                marginBottom: 16,
                                                textAlign: 'center',
                                            }}>
                                            <Alert
                                                message={feedback.message}
                                                type='error'
                                                closable
                                            />
                                        </Col>
                                    )}
                                    {feedback.isSuccess && (
                                        <Col
                                            style={{
                                                marginTop: 16,
                                                marginBottom: 16,
                                                textAlign: 'center',
                                            }}>
                                            <Alert
                                                message={feedback.message}
                                                type='success'
                                                closable
                                            />
                                        </Col>
                                    )}
                                    <Form.Item
                                        name='email'
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Favor de ingresar tu correo electronico',
                                            },
                                            {
                                                type: 'email',
                                                message:
                                                    'Esto no parece un correo electronico',
                                            },
                                        ]}>
                                        <Input
                                            prefix={<MailOutlined />}
                                            placeholder='Tu email'
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type='primary'
                                            htmlType='submit'
                                            block={true}
                                            loading={load}
                                            disabled={!submitableForm}>
                                            Enviar correo
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
}
