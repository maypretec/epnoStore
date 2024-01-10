import React from 'react';
import { Result, Button, message, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import EmailService from '../utils/api/email';

export default function PendingVerification() {
    const navigate = useNavigate();
    const resend = () => {
        EmailService.Resend()
            .then((response) => {
                if (response.data.success === true) {
                    message.success(response.data.message);
                } else {
                    message.error(
                        'Hubo un error al reenviar el link, favor de intentar de nuevo.'
                    );
                }
            })
            .catch((error) => {
                message.error(
                    'Hubo un error al reenviar el link, favor de intentar de nuevo.'
                );
            });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <Result
            status='403'
            title={
                <Typography.Title level={2}>
                    Verificación pendiente
                </Typography.Title>
            }
            subTitle={
                <Space direction='vertical'>
                    <Typography.Text>
                        Aun no hemos verificado tu correo. Revisa tu bandeja de
                        entrada y haz click en el enlace.
                        <br />
                        Una vez verificado tu correo, podrás iniciar sesión en
                        nuestra plataforma.
                    </Typography.Text>
                    <Button type='primary' onClick={logout} block={true}>
                        Volver a inicio
                    </Button>
                </Space>
            }
            extra={
                <>
                    <Typography.Text type='secondary'>
                        Si no has recibido el correo
                    </Typography.Text>
                    <Typography.Link href='' target='_blank' onClick={resend}>
                        da click aqui
                    </Typography.Link>
                </>
            }
        />
    );
}
