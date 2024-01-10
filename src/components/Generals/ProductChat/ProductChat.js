import React, { useState, useEffect } from 'react';
import { Typography, Tooltip, Avatar, Card, Input, Form, Modal, Button, Col, Row, message, Divider } from 'antd';
import moment from 'moment';
import { SendOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import "./ProductChat.scss"
import InputPregunta from '../../Generals/InputPregunta'
import ProductService from '../../../utils/api/products';

const {Text} = Typography;

export default function ProductChat(props) {
    const { id, role, reload, setReload, comments } = props;
    let token = localStorage.getItem('token');
    const [verMas, setVerMas] = useState(false)

    return (
        <>

            <InputPregunta reload={reload} setReload={setReload} id={id} token={token} />

            {
                comments.slice(0, 5).map((cm) => (
                    <Text cm={cm} key={cm.id} role={role} epno_part_id={id} token={token} reload={reload} setReload={setReload} />
                ))

            }
            {
                comments.length > 5 &&
                <Row gutter={[12, 12]} style={{ marginTop: 10 }}>
                    <Col xs={24}>
                        <a style={{ color: '#40A9FF' }} onClick={() => setVerMas(true)}>Ver más comentarios...</a>
                    </Col>
                </Row>

            }
            <Modal
                title="Comentarios"
                visible={verMas}
                onOk={() => setVerMas(false)}
                onCancel={() => setVerMas(false)}
                width={1000}
                style={{ top: 20 }}
                bodyStyle={{ overflowY: 'scroll', maxHeight: 550 }}

                footer={[
                    <Button onClick={() => setVerMas(false)}>
                        Ok
                    </Button>

                ]}
            >
                {
                    comments.map((cm) => (
                        <Text cm={cm} key={cm.id} role={role} epno_part_id={id} token={token} reload={reload} setReload={setReload} />
                    ))

                }
            </Modal>
        </>


    )


}

function Comments(props) {

    const { cm, role, epno_part_id, token, reload, setReload } = props;
    const [responder, setResponder] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    let dateNow = moment();
    const [form] = Form.useForm();
    const { TextArea } = Input;


    let fechaR = moment(cm.updated_at)
    let fecha = moment(cm.created_at)
    let datePublication = dateNow.diff(fecha, 'days')
    let dateRespuesta = dateNow.diff(fechaR, 'days')

    const onResponse = (values) => {
        setSubmitting(true);

        ProductService.Answer({
            'respuesta': values.respuesta,
            'id': cm.id, 
            'user_comment': cm.user_comment, 
            "epno_part_id": epno_part_id
        })
        .then(response => {
            if (response.data.success == true) {
                form.resetFields();
                setResponder(false);
                setReload(!reload);
                setSubmitting(false)
                message.success('Mensaje enviado correctamente.');
            } else {
                setSubmitting(false)
                message.error('Error al enviar mensaje');
            }
        })
        .catch(error => {
            // console.log(error.response.data.errors)
            // setInputValue('');
            setSubmitting(false)
            message.error('Error al enviar mensaje');
        })
    }
    return (
        <>
            <Text
                style={{ background: cm.my_comment == "true" && "#F2F4F5", borderRadius: cm.my_comment == "true" && "5px" }}
                key={cm.id}
                actions={
                    [
                        <span >
                            <ClockCircleOutlined />
                        </span>,
                        <Tooltip title={moment(cm.created_at).format('DD/MM/YYYY HH:mm:ss')}>
                            <span>

                                {datePublication == 0 ? (
                                    'Publicado hace un momento'
                                ) : (
                                    `Publicado hace ${datePublication} días`
                                )

                                }

                            </span>
                        </Tooltip>,
                        role == 6 && cm.answer == null && (

                            <span key="comment-basic-reply-to" style={{ color: "#009BFF" }} onClick={() => setResponder(!responder)}>Responder</span>

                        )


                    ]

                }
                author={cm.name}
                avatar={
                    cm.logo == null ? (
                        <Tooltip title={cm.name} placement="top">
                            <Avatar style={{ backgroundColor: '#1890FF', marginLeft: cm.my_comment == "true" && 10 }} icon={<UserOutlined />} />
                        </Tooltip>
                    ) : (
                        <Tooltip title={cm.name} placement="top">
                            <Avatar
                                style={{ margin: cm.my_comment == "true" && 10 }}
                                src={`https://api.epno-app.com${cm.logo}`}
                                alt={cm.name}
                            />
                        </Tooltip>
                    )
                }
                content={
                    <Row gutter={[12, 12]} style={{ marginRight: cm.my_comment == "true" && 10 }}>
                        <Col xs={24} >
                            {cm.comment}
                            {
                                cm.answer !== null && (
                                    <Col xs={24}>
                                        <Divider type="vertical" style={{ height: 25 }} />
                                        <Text
                                            // style={{ background: cm.my_comment == "true" && "#F2F4F5", borderRadius: cm.my_comment == "true" && "5px" }}
                                            key={cm.id}
                                            actions={
                                                [
                                                    <span >
                                                        <ClockCircleOutlined />
                                                    </span>,
                                                    <Tooltip title={moment(cm.updated_at).format('DD/MM/YYYY HH:mm:ss')}>
                                                        <span>

                                                            {dateRespuesta == 0 ? (
                                                                'Publicado hace un momento'
                                                            ) : (
                                                                `Publicado hace ${dateRespuesta} días`
                                                            )

                                                            }

                                                        </span>
                                                    </Tooltip>,


                                                ]

                                            }
                                            author={cm.sp_name}
                                            avatar={
                                                cm.logo == null ? (
                                                    <Tooltip title={cm.sp_name} placement="top">
                                                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title={cm.sp_name} placement="top">
                                                        <Avatar
                                                            // style={{ margin: cm.my_comment == "true" && 10 }}
                                                            src={`https://api.epno-app.com${cm.sp_logo}`}
                                                            alt={cm.sp_name}
                                                        />
                                                    </Tooltip>
                                                )
                                            }
                                            content={
                                                <Row
                                                >
                                                    <Col xs={24} >
                                                        {cm.answer}
                                                    </Col>

                                                </Row>
                                            }
                                        />

                                    </Col>

                                )
                            }
                        </Col>
                        {

                            responder && (
                                <Col xs={24}>
                                    <Form
                                        name="respuesta"
                                        onFinish={onResponse}
                                        form={form}
                                    // style={{width:500, marginTop:15}}
                                    >
                                        <Form.Item
                                            name="respuesta"
                                            rules={[{ required: true, message: '¡Debes responder este comentario!' }]}
                                        >
                                            <TextArea rows={2} />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button htmlType="submit" loading={submitting} type="primary">
                                                Responder
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Col>




                            )
                        }

                    </Row>
                }
            />



        </>

    )

}