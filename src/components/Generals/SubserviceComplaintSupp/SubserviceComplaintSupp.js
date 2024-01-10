import React, { useState, useEffect } from 'react';

import {
    Card, Row, Col, Button, Tag, Upload, Modal, Form, Input, Popconfirm, Collapse, Empty, Avatar,
    Radio, Badge, Typography, Tooltip, message, Checkbox, InputNumber, Descriptions, DatePicker, Space, notification, List, Divider
} from 'antd';
import {
    DownloadOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UploadOutlined,
    QuestionCircleOutlined,
    PlusOutlined,

} from '@ant-design/icons';
const { Panel } = Collapse;
const { Paragraph, Text } = Typography;


export default function SubserviceComplaint(props) {

    const { subservice, role, details, token,setChangeStepModal } = props;
    return (

        <Collapse bordered={false} className='background-gris'>
            <Panel
                extra={
                    <Row gutter={[12, 12]} align='middle' justify='center'>

                        <Col xs={24}  >
                            <a
                                href={`https://api.epno-app.com${subservice.sub.specs_file}`}
                                target="_blank" rel="noopener noreferrer"
                                download
                                style={{ fontWeight: "bold" }}
                                onClick={event => {
                                    // If you don't want click extra trigger collapse, you can prevent this:
                                    event.stopPropagation();
                                }}
                            >
                                <Button icon={<DownloadOutlined />}  >
                                    Specs
                                </Button>
                            </a>
                        </Col>
                    </Row>
                }
                header={
                    <b>Servicio: {subservice.sub.name} | Categoria: {subservice.sub.category.name} | Cant:{subservice.sub.qty}</b>
                }
                key="1"
            >
                <Row gutter={[12, 12]} justify='center'>
                    <Col xs={24}>
                        <Card>
                            <Descriptions bordered size='small'
                                title="Cotización"
                                column={{ xl: 3, lg: 3, md: 3, sm: 1, xs: 1 }}
                            >
                                <Descriptions.Item label="Costo total">${subservice.total_cost} </Descriptions.Item>
                                <Descriptions.Item label="$ C/U">${subservice.unitary_subtotal_cost} </Descriptions.Item>
                                <Descriptions.Item label="Cant.">{subservice.qty} </Descriptions.Item>
                                <Descriptions.Item label="Fecha">{subservice.supplier_deadline} </Descriptions.Item>
                                <Descriptions.Item label="Opciones" span={3}>
                                    <Row gutter={[12, 12]} justify='center'>

                                        <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                                            <a
                                                href={`https://api.epno-app.com${subservice.quote_file}`}
                                                target="_blank" rel="noopener noreferrer"
                                                download
                                            >

                                                <DownloadOutlined /> &nbsp;Cotizacion
                                            </a>
                                        </Col>
                                        <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                                            {
                                                subservice.new_po == 1 && subservice.po_file !== null
                                                    ?
                                                    <a
                                                        href={`https://api.epno-app.com${subservice.po_file}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        download
                                                    >

                                                        <DownloadOutlined /> &nbsp;PO
                                                    </a>
                                                    :
                                                    <a
                                                        href={`https://api.epno-app.com${subservice.epno_po_file}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        download
                                                    >

                                                        <DownloadOutlined /> &nbsp;PO
                                                    </a>
                                            }
                                        </Col>
                                        {
                                            (details.step_id == 4 && role == 6)  &&
                                            <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                                                <Popconfirm
                                                    title="¿Seguro que desea solicitar una auditoria?"
                                                    okText="Si"
                                                    cancelText="No"
                                                    onConfirm={() => setChangeStepModal({
                                                        action: true,
                                                        option: 5,
                                                        titulo: 'Enviar queja a inspección.',
                                                        subservice_complaint: subservice.id,
                                                        supplier_complaint_id: subservice.supplier_id,
                                                        supplier_desc: subservice.description,
                                                        subservice_tittle: subservice.sub.name,
                                                        supplier_id: subservice.user_id,
                                                        supplier_email: subservice.email,
                                                    })}
                                                >
                                                    <Button type="primary" icon={<CheckCircleOutlined />}
                                                    >
                                                        Inspección
                                                    </Button>
                                                </Popconfirm>
                                            </Col>

                                        }

                                    </Row>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>

                </Row>


            </Panel >

        </Collapse >

    )
}