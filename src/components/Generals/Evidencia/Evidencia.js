import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Typography, Divider, Form, Input, message, Row, Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import EvidenceService from '../../../utils/api/evidence';

const {Text} = Typography;

export default function Evidencia(props) {
    const { evidencia,details, role, tabla, token, reload, setReload } = props;
    const [responder, setResponder] = useState(false);
    const [loadResponse, setLoadResponse] = useState(false);
    const [form] = Form.useForm();
    console.log(details);

    const ResponderEvidencia = (values) => {
        setLoadResponse(true)
        const formData = new FormData();
        formData.append('descripcion', values.descripcion);
        formData.append('evidencia', values.evidencia.fileList[0].originFileObj);
        formData.append('evidencia_id', evidencia.id);
        formData.append('tabla', tabla);
        formData.append('role', role);
        formData.append('complaint_id', evidencia.complaint_id);
        formData.append('complaint_num', evidencia.complaint.complaint_num);
        formData.append('service_title', evidencia.complaint.title);
        formData.append('user_id', evidencia.user_id);
        formData.append('client_mail', evidencia.user.email);

        EvidenceService.Response(formData)
        .then(response => {
            setLoadResponse(false)

            if (response.data.success == true) {
                message.success(response.data.message)
                setResponder(false)
                setReload(!reload)
                form.resetFields();

            } else {
                message.error(response.data.message)
            }

        })
        .catch(error => {
            console.log(error)
            setLoadResponse(false)
            message.error('Hubo un error al responder esta evidencia.')
        })

    }

    const CommentResponse = ({ children, user, org, logo, comentario, file, file_name, respuesta }) => (
        <Text
            actions={
                [
                    (respuesta == null && details.step_id !== 1) &&
                    <a key="comment-nested-reply-to" onClick={() => setResponder(!responder)}>Responder</a>
                ]
            }
            author={<a>{user}</a>}
            avatar={<Avatar src={`https://api.epno-app.com${logo}`} alt={org} />}
            content={
                <Row gutter={[12, 12]}>
                    <Col xs={24}>{comentario}</Col>
                    <Col xs={24}>
                        <a
                            href={`https://api.epno-app.com${file}`}
                            target="_blank" rel="noopener noreferrer"
                            download
                        >
                            <Button icon={<DownloadOutlined />} >
                                <i className="fas fa-download" />
                                &nbsp;{file_name}
                            </Button>
                        </a>
                    </Col>
                </Row>

            }
        >
            {children}
        </Text>
    );

    return (
        <CommentResponse
            user={
                (role == 4 || role == 3 || role == 5 || role == 1 || role == 2 || role == 10) && tabla == 'complaint_client_to_epno_evidence' ?
                    `${evidencia.user.name} para EP&O `
                    : (role == 6 || role == 3 || role == 5 || role == 1 || role == 2 || role == 10) && tabla == 'complaint_epno_to_supplier_evidence' &&
                    `ELECTRONIC PURCHASE AND ORDER para ${evidencia.user.name}`
            }
            org={
                (role == 4 || role == 3 || role == 5 || role == 1 || role == 2 || role == 10) && tabla == 'complaint_client_to_epno_evidence' ?
                    evidencia.user.organization.name
                    : (role == 6 || role == 3 || role == 5 || role == 1 || role == 2 || role == 10) && tabla == 'complaint_epno_to_supplier_evidence' && "EP&O"
            }
            logo={evidencia.user.organization.logo}
            comentario={
                (role == 4 || role == 3 || role == 5 || role == 1 || role == 2 || role == 10) && tabla == 'complaint_client_to_epno_evidence' ?
                    evidencia.client_description
                    : (role == 6 || role == 3 || role == 5 || role == 1 || role == 2 || role == 10) && tabla == 'complaint_epno_to_supplier_evidence' && evidencia.epno_description
            }
            file={
                (role == 4 || role == 3 || role == 5 || role == 1 || role == 2 || role == 10) && tabla == 'complaint_client_to_epno_evidence' ?
                    evidencia.client_file
                    : (role == 6 || role == 3 || role == 5 || role == 1 || role == 2 || role == 10) && tabla == 'complaint_epno_to_supplier_evidence' && evidencia.epno_file
            }
            file_name={
                (role == 4 || role == 3 || role == 5 || role == 1 || role == 2 || role == 10) && tabla == 'complaint_client_to_epno_evidence' ?
                    evidencia.client_file_name
                    : (role == 6 || role == 3 || role == 5 || role == 1 || role == 2 || role == 10) && tabla == 'complaint_epno_to_supplier_evidence' && evidencia.epno_file_name
            }
            respuesta={
                (role == 4 || role == 3 || role == 5 || role == 1 || role == 2) && tabla == 'complaint_client_to_epno_evidence' ?
                    'No puede responder'
                    : role == 10 && tabla == 'complaint_client_to_epno_evidence' ?
                        evidencia.epno_description
                        : (role == 3 || role == 5 || role == 1 || role == 2 || role == 10) && tabla == 'complaint_epno_to_supplier_evidence' ?
                            'No puede responder'
                            : role == 6 &&
                            evidencia.supplier_description
            }
        >
            {
                responder ?
                    <Card style={{ textAlign: 'center' }}>
                        <Form
                            name="basic"
                            // autoComplete="off"
                            // initialValues={{ remember: true }}
                            onFinish={ResponderEvidencia}
                            layout='vertical'
                            form={form}
                        >
                            <Row gutter={[12, 12]} >
                                <Col xs={24} md={14} lg={13} xl={16}>
                                    <Form.Item
                                        label="Escribe una breve descripcion de la evidencia."
                                        name='descripcion'
                                        rules={[{ required: true, message: 'Debes agregar una descripcion de tu evidencia.' }]}
                                    >
                                        <Input.TextArea
                                            showCount
                                            allowClear
                                            maxLength={500}
                                        />
                                    </Form.Item>

                                </Col>
                                <Col xs={24} md={10} lg={11} xl={8}>
                                    <Form.Item
                                        label="Evidencia"
                                        name='evidencia'
                                        rules={[{ required: true, message: 'Debes agregar una evidencia como respuesta.' }]}
                                    >
                                        <Upload
                                            listType="picture-card"
                                            maxCount={1}
                                            beforeUpload={() => false
                                            }

                                        >
                                            <div>
                                                <PlusOutlined />
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    </Form.Item>

                                </Col>
                                <Col xs={24} >
                                    <Form.Item>
                                        <Button type='primary'
                                            htmlType="submit"
                                            style={{ width: "50%" }}
                                            loading={loadResponse}
                                        >Enviar evidencia</Button>
                                    </Form.Item>

                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    : (role == 4 || role == 3 || role == 5 || role == 1 || role == 2 || role == 10) && tabla == 'complaint_client_to_epno_evidence' ?
                        evidencia.epno_description !== null &&
                        <>
                            <Divider type="vertical" />
                            <CommentResponse
                                user="ELECTRONIC PURCHASE AND ORDER"
                                org="EP&O"
                                logo={evidencia.user.organization.logo}
                                comentario={evidencia.epno_description}
                                file={evidencia.epno_file}
                                file_name={evidencia.epno_file_name}
                                respuesta={
                                    role == 10 ? evidencia.epno_description
                                        : 'No puede responder'
                                }

                            />
                        </>
                        :
                        (role == 6 || role == 3 || role == 5 || role == 1 || role == 2 || role == 10) && tabla == 'complaint_epno_to_supplier_evidence' &&
                        evidencia.supplier_description !== null &&
                        <>
                            <Divider type="vertical" />
                            <CommentResponse
                                user={evidencia.user.name}
                                logo={evidencia.user.organization.logo}
                                comentario={evidencia.supplier_description}
                                file={evidencia.supplier_file}
                                file_name={evidencia.supplier_file_name}
                                respuesta={
                                    role == 6 ?
                                        evidencia.supplier_description
                                        :
                                        'No puede responder'

                                }

                            />
                        </>

            }
        </CommentResponse >
    )
}