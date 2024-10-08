import React, { useState, useEffect } from 'react';

import {
    Card, Row, Col, Button, Tag, Upload, Modal, Form, Input, Popconfirm, Collapse, Empty, Avatar,
    Radio, Badge, Typography, Tooltip, message, Checkbox, InputNumber, Descriptions, DatePicker, Space, notification, List, Divider, Select
} from 'antd';
import {
    DownloadOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UploadOutlined,
    QuestionCircleOutlined,
    PlusOutlined,
    MinusCircleOutlined,
    InboxOutlined,

} from '@ant-design/icons';

import SupplierService from '../../../utils/api/suppliers';
import ComplaintService from '../../../utils/api/complaints';

const { Panel } = Collapse;
const { Paragraph, Text } = Typography;
const { Dragger } = Upload;

export default function SubserviceComplaint(props) {

    const { subservice, role, details, token, reload, setReload, setChangeStepModal, ChangeStep } = props;
    const [form] = Form.useForm();

    const [loadAgregarSupp, setLoadAgregarSupp] = useState(false);
    const [suppliersList, setSuppliersList] = useState([]);
    const [addSupplierModal, setAddSupplierModal] = useState(false);
    const [selectSuppRequired, setSelectSuppRequired] = useState(true);
    const [load, setLoad] = useState(false);
    const [loadInterna, setLoadInterna] = useState(false);
    const [subirPoModal, setSubirPoModal] = useState({
        action: false,
        supplier_id: '',
        supp_user: '',
        supp_mail: '',
    });


    const AddSuppliers = (service, subservice) => {
        setLoadAgregarSupp(true);

        SupplierService.ComplaintSupplier({
                'service': service, 'subservice': subservice,
            })
            .then(response => {
                setSuppliersList(response.data)
                setAddSupplierModal(true)
                setLoadAgregarSupp(false);
            })
            .catch(error => {
                console.log(error);
            })

    }
    const procesarInterna = (service, subservice) => {
        setLoadInterna(true);

        ComplaintService.InternalComplaint({

           'service': service,'subservice': subservice
        })
            .then(response => {
                setLoadInterna(false);

                if (response.data.success == true) {
                    setReload(!reload)
                    message.success('Queja asignada correctamente.')
                } else {
                    message.error('Hubo un problema al asignar la queja.')
                }
            })
            .catch(error => {
                setLoadInterna(false);
                message.error('Hubo un problema al asignar la queja.')

                console.log(error);
            })

    }

    const isRequired = (size) => {
        if (size == 1) {
            setSelectSuppRequired(true)
        }
    }

    const AddServiceSuppliersComplaint = (values) => {
        setLoad(true)
        const formData = new FormData();
        formData.append('subservice_complaint_id', subservice.id);
        formData.append('complaint_id', details.id);
        formData.append('complaint_step', details.step_id);
        formData.append('complaint_num', details.complaint_num);
        formData.append('step_name', details.step.name);
        formData.append('service_title', details.title);

        values.suppliers.forEach(supp => {
            formData.append('suppliers[]', supp);
        });
        if (values.client_evidencias !== [] && values.client_evidencias !== undefined) {
            values.client_evidencias.forEach(ev => {
                formData.append('client_evidencias[]', ev);
            });
        }

        if (values.epno_evidencias !== [] && values.epno_evidencias !== undefined) {
            values.epno_evidencias.forEach(file => {
                formData.append('epno_descs[]', file.descripcion);
                formData.append('epno_evidencias[]', file.evidencia.fileList[0].originFileObj);

            });

        }

        ComplaintService.SuppliersComplaint(formData)
            .then(response => {
                setLoad(false)
                if (response.data.success == true) {
                    setReload(!reload)
                    message.success('Queja asignada correctamente.')
                    setAddSupplierModal(false)
                } else {
                    message.error('Hubo un problema al asignar la queja al proveedor(es).')
                }

            })
            .catch(error => {
                message.error('Hubo un problema al asignar la queja al proveedor(es).')
                setLoad(false)

            })

    }

    const propsDragger = {
        name: 'file',
        multiple: false,
        data: {
            'supplier_id': subirPoModal.supplier_id,
            'supplier_user': subirPoModal.supp_user,
            'supplier_mail': subirPoModal.supp_mail,
            'complaint_id': details.id,
            'service_tittle': details.title,
            'complaint_num': details.complaint_num
        },
        action: 'https://api.epno-app.com/api/send_po_supplier',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },

        onChange(info) {
            const { status } = info.file;

            if (status === 'done') {
                if (info.file.response.success == true) {
                    message.success(`${info.file.name}, ${info.file.response.message}.`, 10);
                    setReload(!reload)
                    setSubirPoModal(false)
                } else {
                    message.error(`Hubo un error al subir el archivo ${info.file.name}, ${info.file.response.message}.`, 10);
                }
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <>
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
                    {
                        (subservice.suppliers == "") ?

                            <Row gutter={[12, 12]} justify='center'>
                                <Col xs={24}>
                                    <Empty
                                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                        imageStyle={{
                                            height: 60,
                                        }}
                                        description={
                                            <span>
                                                Aun no hay proveedores para este servicio
                                            </span>
                                        }
                                    >
                                        {
                                            role == 10 && (details.step_id == 1 || details.step_id == 13) &&
                                            <Row guter={[12, 12]} justify='center'>
                                                <Col xs={24} md={12} lg={6} xl={5}>
                                                    <Button type="dashed" danger
                                                        loading={loadAgregarSupp}
                                                        onClick={() => AddSuppliers(details.service.id, subservice.subservice_id)}
                                                    >Agregar proveedores</Button>
                                                </Col>
                                                <Col xs={24} md={12} lg={6} xl={5}>
                                                    <Button type="dashed"
                                                        loading={loadInterna}
                                                        onClick={() => procesarInterna(details.service.id, subservice.id)}
                                                    >Asignar a EP&O</Button>
                                                </Col>
                                            </Row>
                                        }
                                    </Empty>
                                </Col>
                            </Row>
                            :
                            subservice.suppliers.map((sp) => {

                                return (
                                    sp.proposal == null ?
                                        <Row gutter={[12, 12]} justify='center'>
                                            <Col xs={24}>
                                                <Card>
                                                    <Descriptions bordered size='small'
                                                        title={sp.user.organization.name}
                                                        column={{ xl: 3, lg: 3, md: 3, sm: 1, xs: 1 }}
                                                    >
                                                        {/* <Descriptions.Item label="Fecha">{sp.proposal.epno_deadline} </Descriptions.Item> */}
                                                        <Descriptions.Item label="Contacto" span={2} >{sp.user.name} </Descriptions.Item>
                                                        <Descriptions.Item label="Correo" span={2}>{sp.user.email} </Descriptions.Item>
                                                        <Descriptions.Item label="Telefono">{sp.user.phone} </Descriptions.Item>
                                                        <Descriptions.Item label="Direccion" span={3}>
                                                            <Row gutter={[12, 12]}>
                                                                <Col xs={24} md={16} >
                                                                    {sp.user.organization.street} #{sp.user.organization.external_number}
                                                                </Col>
                                                                {
                                                                    (details.step_id == 5 && role == 10) &&
                                                                    // : (details.step_id == 5 && (role == 3 || role == 5)) ?
                                                                    <Col xs={24} md={8} >

                                                                        <Popconfirm
                                                                            title="¿Seguro que desea confirmar esta orden como lista?"
                                                                            okText="Si"
                                                                            cancelText="No"
                                                                            onConfirm={() => setChangeStepModal({
                                                                                action: true,
                                                                                option: 6,
                                                                                titulo: 'Enviar queja a en camino.',
                                                                                subservice_complaint: subservice.subservice_complaint_id,
                                                                                supplier_complaint_id: sp.id,
                                                                                supplier_desc: sp.user.organization.name,
                                                                                subservice_tittle: subservice.sub.name,
                                                                                supplier_id: sp.user_id,
                                                                                supplier_email: sp.user.email,
                                                                            })}

                                                                        >
                                                                            <Button type="primary" icon={<CheckCircleOutlined />}
                                                                            >
                                                                                Orden Lista
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

                                        :
                                        (role == 3 || role == 5 || role == 2 || role == 1 || role == 10) ?
                                            <Collapse defaultActiveKey="1">
                                                <Panel
                                                    collapsible="header"
                                                    extra={
                                                        <>
                                                            <Row gutter={[12, 12]} justify='center' align='middle'>
                                                                <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                                                                    Costo (C/U): <b>${sp.proposal.unitary_subtotal_cost} mxn</b>
                                                                </Col>
                                                                <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                                                                    Entrega: <b>{sp.proposal.supplier_deadline}</b>
                                                                </Col>
                                                                <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                                                                    Cantidad: <b>{sp.proposal.qty}</b>
                                                                </Col>
                                                                <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                                                                    <a
                                                                        href={`https://api.epno-app.com${sp.proposal.quote_file}`}

                                                                        target="_blank" rel="noopener noreferrer"
                                                                        download
                                                                    >
                                                                        <Button icon={<DownloadOutlined />} onClick={event => {
                                                                            // If you don't want click extra trigger collapse, you can prevent this:
                                                                            event.stopPropagation();
                                                                        }} >
                                                                            <i className="fas fa-download" />
                                                                            &nbsp;Cotización
                                                                        </Button>
                                                                    </a>
                                                                </Col>

                                                            </Row>

                                                        </>

                                                    }
                                                    header={
                                                        <Row gutter={[12, 12]} justify='center' align='middle' >
                                                            <Col xs={24} md={8} xl={8} style={{ textAlign: 'center' }}>
                                                                <Avatar src={`https://api.epno-app.com${sp.user.organization.logo}`}
                                                                    size={{ xs: 60, md: 60, lg: 60, xl: 60 }}
                                                                />
                                                            </Col>
                                                            <Col xs={24} md={16} xl={16} style={{ textAlign: 'center' }}>
                                                                <b>{sp.user.name}</b>
                                                            </Col>


                                                        </Row >
                                                    }
                                                >
                                                    <Row gutter={[12, 12]} justify='center' align='middle'>


                                                        <Col xs={24} md={12} lg={8}>
                                                            <label className='gris-bold'>Teléfono</label> <br />
                                                            <a href={`tel:${sp.user.phone}`} style={{ fontWeight: 600 }}>{sp.user.phone} </a>
                                                        </Col>
                                                        <Col xs={24} md={12} lg={8}>
                                                            <label className='gris-bold'>Correo</label> <br />
                                                            <a href={`mailto:${sp.user.email}`} style={{ fontWeight: 600 }}>{sp.user.email} </a>
                                                        </Col>
                                                        <Col xs={24} md={6} lg={8} >
                                                            <label className='gris-bold'>Total</label> <br />
                                                            <b>${sp.proposal.total_cost}</b>
                                                        </Col>
                                                        <Col xs={24} md={12}>
                                                            <label className='gris-bold'>Dirección</label> <br />
                                                            <b>{sp.user.organization.street},{sp.user.organization.external_number} </b>
                                                        </Col>
                                                        {
                                                            sp.new_po == 1 && sp.po_file == null ?
                                                                <Col xs={24} md={6} lg={6} xl={4} >
                                                                    <Button icon={<UploadOutlined />}
                                                                        disabled={details.step_id !== 4 && true}
                                                                        onClick={() => setSubirPoModal({
                                                                            action: true,
                                                                            supplier_id: sp.id,
                                                                            supp_user: sp.user_id,
                                                                            supp_mail: sp.user.email,
                                                                        })}
                                                                    >
                                                                        &nbsp;Subir PO
                                                                    </Button>
                                                                </Col>

                                                                : sp.new_po == 1 && sp.po_file !== null &&
                                                                <Col xs={24} md={6} lg={6} xl={4} >
                                                                    <a href={`https://api.epno-app.com${sp.po_file}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        download
                                                                    >
                                                                        <Button icon={<DownloadOutlined />} >
                                                                            &nbsp;Nueva PO
                                                                        </Button>
                                                                    </a>
                                                                </Col>
                                                        }
                                                        {
                                                            (details.step_id == 5 && role == 10) &&
                                                            // : (details.step_id == 5 && (role == 3 || role == 5)) ?
                                                            <Col xs={24} md={6} lg={6} xl={4} >

                                                                <Popconfirm
                                                                    title="¿Seguro que desea confirmar esta orden como lista?"
                                                                    okText="Si"
                                                                    cancelText="No"
                                                                    onConfirm={() => setChangeStepModal({
                                                                        action: true,
                                                                        option: 6,
                                                                        titulo: 'Enviar queja a en camino.',
                                                                        subservice_complaint: subservice.id,
                                                                        supplier_complaint_id: sp.id,
                                                                        supplier_desc: sp.proposal.description,
                                                                        subservice_tittle: subservice.sub.name,
                                                                        supplier_id: sp.user_id,
                                                                        supplier_email: sp.user.email,
                                                                    })}

                                                                >
                                                                    <Button type="primary" icon={<CheckCircleOutlined />}
                                                                    >
                                                                        Orden Lista
                                                                    </Button>
                                                                </Popconfirm>
                                                            </Col>
                                                        }
                                                    </Row>
                                                </Panel >
                                            </Collapse >
                                            : role == 4 &&
                                            <Row gutter={[12, 12]} justify='center'>
                                                <Col xs={24}>
                                                    <Card>
                                                        <Descriptions bordered size='small'
                                                            title={sp.proposal.supplier_code}
                                                            column={{ xl: 3, lg: 3, md: 3, sm: 1, xs: 1 }}
                                                        >
                                                            <Descriptions.Item label="Descripción" span={3}>{sp.proposal.description} </Descriptions.Item>
                                                            <Descriptions.Item label="$ C/U">${sp.proposal.epno_cost} </Descriptions.Item>
                                                            <Descriptions.Item label="Cant.">{sp.proposal.qty} </Descriptions.Item>
                                                            <Descriptions.Item label="Fecha">{sp.proposal.epno_deadline} </Descriptions.Item>
                                                            <Descriptions.Item label="Opciones" span={3}>
                                                                <Row gutter={[12, 12]} justify='center'>

                                                                    <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                                                                        <a
                                                                            href={`https://api.epno-app.com${details.service.quote_file}`}
                                                                            target="_blank" rel="noopener noreferrer"
                                                                            download
                                                                        >

                                                                            <DownloadOutlined /> &nbsp;Cotizacion
                                                                        </a>
                                                                    </Col>
                                                                    {
                                                                        (details.step_id == 6 && role == 4) &&
                                                                        <Popconfirm
                                                                            title="¿Seguro que ha recibido su orden completa?"
                                                                            okText="Si"
                                                                            cancelText="No"
                                                                            onConfirm={() => {
                                                                                setChangeStepModal({
                                                                                    subservice_complaint: subservice.id,
                                                                                    supplier_complaint_id: sp.id,
                                                                                    supplier_desc: sp.organization.name,
                                                                                    subservice_tittle: subservice.sub.name,
                                                                                    supplier_id: sp.user_id,
                                                                                    supplier_email: sp.user.email,
                                                                                });
                                                                                ChangeStep(7);
                                                                            }}


                                                                        >
                                                                            <Button type="primary" icon={<CheckCircleOutlined />}
                                                                            // loading={loadChangeStep}
                                                                            >
                                                                                Entregado
                                                                            </Button>
                                                                        </Popconfirm>

                                                                    }

                                                                </Row>
                                                            </Descriptions.Item>
                                                        </Descriptions>
                                                    </Card>
                                                </Col>

                                            </Row>

                                )
                            })
                    }
                </Panel >
            </Collapse >

            <Modal
                title="Añadir proveedores al servicio."
                visible={addSupplierModal}
                onOk={() => { setAddSupplierModal(false); form.resetFields(); }}
                onCancel={() => { setAddSupplierModal(false); form.resetFields(); }}
                footer=''>
                <Form
                    name="basic"
                    autoComplete="off"
                    initialValues={{ remember: true }}
                    onFinish={AddServiceSuppliersComplaint}
                    layout='vertical'
                    form={form}
                >
                    <Form.Item
                        label="Estos son el/los proveedor(es) que cotizarón el servicio, selecciona al/los que se le(s) asignara la queja:"
                        name="suppliers"
                        rules={[{ required: true, message: 'Debes seleccionar al menos un proveedor de la lista.' }]}
                    >
                        <Checkbox.Group style={{ width: '100%' }}
                        // onChange={onChange}
                        >
                            <Row gutter={[12, 12]} >
                                {
                                    suppliersList.map((sp) => (
                                        <Col xs={24}>
                                            <Checkbox key={sp.id} value={sp.id}>{sp.user.name} | {sp.user.organization.name} </Checkbox>
                                        </Col>

                                    ))
                                }

                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item
                        label="Selecciona las evidencias que quieres mostrar al proveedor:"
                        name="client_evidencias"
                        rules={[{ required: selectSuppRequired, message: 'Debes seleccionar al menos una evidencia de la lista.' }]}
                    >
                        <Checkbox.Group style={{ width: '100%' }}
                        // onChange={onChange}
                        >
                            <Row gutter={[12, 12]} >
                                {
                                    details.subservice_complaint_client.map((ev) => (
                                        <Col xs={24}>
                                            <Checkbox value={ev.id} key={ev.id}>
                                                <Row gutter={[12, 12]} align="middle">
                                                    <Col xs={18}>{ev.client_description}</Col>
                                                    <Col xs={6}>
                                                        <a href={`https://api.epno-app.com${ev.client_file}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download
                                                        >
                                                            <Button icon={<DownloadOutlined />} >
                                                                &nbsp;Evidencia
                                                            </Button>
                                                        </a>
                                                    </Col>
                                                </Row>

                                            </Checkbox>
                                        </Col>

                                    ))
                                }

                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.List name="epno_evidencias" >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (

                                    <Row guter={[12, 12]} key={key}>
                                        <Col xs={22} md={23}>
                                            <Form.Item
                                                label="Escribe una breve descripcion de la evidencia."
                                                {...restField}
                                                name={[name, 'descripcion']}
                                                rules={[{ required: true, message: 'Debes agregar una descripcion de tu evidencia.' }]}
                                            >
                                                <Input.TextArea
                                                    showCount
                                                    allowClear
                                                    maxLength={500}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label="Evidencia de la queja"
                                                {...restField}
                                                name={[name, 'evidencia']}
                                                rules={[{ required: true, message: 'Debes agregar una evidencia.' }]}
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
                                        <Col xs={2} md={1}>
                                            <Tooltip title="Remover componente">
                                                <MinusCircleOutlined style={{ color: 'red' }}
                                                    onClick={() => {
                                                        remove(name);
                                                        isRequired(fields.length)
                                                    }}
                                                />

                                            </Tooltip>
                                        </Col>
                                    </Row>

                                ))}
                                {/* {fields.length < 1 && ( */}
                                <Form.Item
                                // name="agregar"
                                >
                                    <Button type="dashed"
                                        style={{ width: "100%" }}
                                        onClick={() => {
                                            add();
                                            setSelectSuppRequired(false)
                                        }} icon={<PlusOutlined />}
                                    >
                                        Agregar más
                                    </Button>
                                </Form.Item>
                                {/* )}  */}
                            </>
                        )}
                    </Form.List>

                    <Form.Item
                    // name='enviar'
                    >
                        <Button type='primary'
                            htmlType="submit"
                            style={{ width: "100%" }}
                            loading={load}
                        >Enviar listado</Button>
                    </Form.Item>
                </Form>

            </Modal>
            <Modal
                title="Subir po al proveedor."
                visible={subirPoModal.action}
                onOk={() => { setSubirPoModal({ ...subirPoModal, action: false }); form.resetFields(); }}
                onCancel={() => { setSubirPoModal({ ...subirPoModal, action: false }); form.resetFields(); }}
                footer=''>
                <Dragger
                    {...propsDragger}
                    accept=".pdf"
                    maxCount={1}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                        band files
                    </p>
                </Dragger>
            </Modal>

        </>

    )
}