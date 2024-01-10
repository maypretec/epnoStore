import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Button, Tag, Upload, Modal, Form, Input, Popconfirm, Collapse, Empty, Avatar,
  Radio, Badge, Typography, Tooltip, message, Checkbox, Steps, Select, InputNumber, Descriptions, DatePicker, Space, notification, List, Divider
} from 'antd';
import "./ComplaintInfo.scss";
import fileDownload from 'js-file-download'
import {
  DownloadOutlined, FileTextOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  CarOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  CaretRightOutlined,
  QuestionCircleOutlined,
  FileSearchOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  InboxOutlined,
  PlusOutlined,
  EditOutlined,
  FileOutlined,
  DollarCircleOutlined,
  NumberOutlined,
  HighlightOutlined,
  RedoOutlined,
  FieldTimeOutlined,
  InfoCircleOutlined

} from '@ant-design/icons';
import Rate from "../Rate";
import { Link, useParams } from 'react-router-dom';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import SubserviceComplaint from '../Generals/SubserviceComplaint/SubserviceComplaint';
import SubserviceComplaintSupp from '../Generals/SubserviceComplaintSupp';
import Evidencia from '../Generals/Evidencia/Evidencia';
import { values } from '@antv/util';
import ComplaintService from '../../utils/api/complaints';
import SupplierService from '../../utils/api/suppliers';
import OrderService from '../../utils/api/orders';
const { TextArea } = Input;
const { Panel } = Collapse;
const { Search } = Input;
const { Dragger } = Upload;
const { Step } = Steps;
const { Option } = Select;

export default function ComplaintInfo(props) {
  const { details, reload, setReload, role, token } = props;
  const [rechazarModal, setRechazarModal] = useState({
    titulo: '',
    action: false
  });
  const [changeStepModal, setChangeStepModal] = useState({
    action: false,
    option: '',
    titulo: '',
    subservice_complaint: null,
    supplier_complaint_id: null,
    supplier_desc: null,
    subservice_tittle: null,
    supplier_id: null,
    supplier_email: null,
  });
  const [loadChangeStep, setLoadChangeStep] = useState(false);
  const [cerrarComplaintModal, setCerrarComplaintModal] = useState(false);
  const [loadCerrarComplaint, setLoadCerrarComplaint] = useState(false);
  const [form] = Form.useForm();
  const [requierePo, setRequierePo] = useState(false);

  const onChangeComplaint = (id, value) => {

    ComplaintService.ComplaintChangeType({
      'complaint': id,
      'value': value
    })
    .then(response => {

      if (response.data.success == true) {
        message.success(response.data.message)
        setReload(!reload)

      } else {
        message.error(response.data.message)
      }

    })
    .catch(error => {
      message.error("Hubo un error al actualizar la información.")
    })
  }

  const sendResponseComplaint = (option) => (values) => {
    // console.log({ 'op': option, 'values': values.descripcion });

    ComplaintService.ComplaintRejection({
      'opcion': option,
      'descripcion': values.descripcion,
      'complaint_id': details.id,
      'complaint_num': details.complaint_num,
      'service_title': details.title,
      'user_id': details.user_id,
      'user_email': details.user.email
    })
    .then(response => {

      if (response.data.success == true) {
        message.success(response.data.message)
        setReload(!reload)
        setRechazarModal(false)

      } else {
        message.error(response.data.message)
      }

    })
    .catch(error => {
      message.error("Hubo un error al actualizar la información.")
    })
  }

  const ChangeStep = (option) => (values) => {
    console.log(values);
    

    setLoadChangeStep(true)
    const formData = new FormData();
    if (option == 3 && (values.po == undefined || values.po == false)) {
      formData.append('opcion', 4);
    } else {
      formData.append('opcion', option);
    }

    formData.append('complaint_id', details.id);
    formData.append('complaint_num', details.complaint_num);
    formData.append('service_title', details.title);
    formData.append('user_id', details.user_id);
    formData.append('user_email', details.user.email);

    if (role != 6) {
      details.subservices.forEach(sub => {
        sub.suppliers.forEach(supp => {
          formData.append('suppliers[]', JSON.stringify(supp));
        })
      });
    }
    if (values.costo !== undefined && values.costo !== null) {
      formData.append('costo', values.costo);
    }
    if (values.descripcion !== undefined && values.descripcion !== "") {
      formData.append('descripcion', values.descripcion);
    }
    if (values.po !== undefined && values.po !== false) {
      formData.append('po', values.po);
      formData.append('nueva_cotizacion', values.nueva_cotizacion.fileList[0].originFileObj);

    }
    if (option == 5 || option == 6 || option == 7) {
      formData.append('subservice_complaint', changeStepModal.subservice_complaint);
      formData.append('supplier_complaint_id', changeStepModal.supplier_complaint_id);
      formData.append('supplier_desc', changeStepModal.supplier_desc);
      formData.append('subservice_tittle', changeStepModal.subservice_tittle);
      formData.append('supplier_id', changeStepModal.supplier_id);
      formData.append('supplier_email', changeStepModal.supplier_email);
    }


    if (option == 13 || option == 3 || option == 4) {
      OrderService.ChangeStep(formData)
      .then(response => {
        setLoadChangeStep(false)

        if (response.data.success == true) {
          message.success(response.data.message)
          setReload(!reload)
          setChangeStepModal(false)

        } else {
          message.error(response.data.message)
        }

      })
      .catch(error => {
        setLoadChangeStep(false)

        message.error("Hubo un error al actualizar la información.")
      })

    } else if (option == 5 || option == 6 || option == 7) {
      SupplierService.ChangeStep(formData)
      .then(response => {
        setLoadChangeStep(false)

        if (response.data.success == true) {
          message.success(response.data.message)
          setReload(!reload)
          setChangeStepModal(false)

        } else {
          message.error(response.data.message)
        }

      })
      .catch(error => {
        setLoadChangeStep(false)

        message.error("Hubo un error al actualizar la información.")
      })
    }

  }

  const closeComplaint = (values) => {
    setLoadCerrarComplaint(true)

    const formData = new FormData();
    formData.append('complaint_id', details.id);
    formData.append('complaint_num', details.complaint_num);
    formData.append('service_title', details.title);
    formData.append('user_id', details.user_id);
    formData.append('user_mail', details.user.email);
    formData.append('user_phone', details.user.phone);
    formData.append('user_name', details.organization.name);
    formData.append('root_cause', values.root_cause.fileList[0].originFileObj);
    formData.append('leccion_aprendida', values.leccion_aprendida.fileList[0].originFileObj);
    formData.append('primer_d', values.info_equipo);
    formData.append('segunda_d', values.desc_problema);
    formData.append('tercer_d', values.acciones_provisionales);
    formData.append('cuarta_d', values.causa_raiz);
    formData.append('quinta_d', values.acciones_permanentes);
    formData.append('sexta_d', values.implementacion);
    formData.append('septima_d', values.acciones_prevencion);
    formData.append('octava_d', values.reconocimiento);

    details.subservices.forEach(sub => {
      sub.suppliers.forEach(supp => {
        formData.append('suppliers[]', JSON.stringify(supp));
      })
    });

    ComplaintService.CloseComplaint(formData)
    .then(response => {
      setLoadCerrarComplaint(false)

      if (response.data.success == true) {
        message.success(response.data.message)
        setReload(!reload)
        setCerrarComplaintModal(false)

      } else {
        message.error(response.data.message)
      }

    })
    .catch(error => {
      setLoadCerrarComplaint(false)
      message.error("Hubo un error al actualizar la información.")
    })
  }

  const propsClientPO = {
    name: 'po',
    multiple: false,
    data: {
      'complaint_id': details.id,
      'complaint_num': details.complaint_num,
      'service_title': details.title,
      'user_id': details.user_id,
      'user_email': details.user.email,
      'user_phone': details.user.phone,
      'user_name': details.organization.name,
      'subservices': JSON.stringify(details.subservices)
    },
    action: 'https://api.epno-app.com/api/subir_client_nueva_po',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        if (info.file.response.success == true) {
          setReload(!reload)
          message.success(`${info.file.name} ${info.file.response.message}.`, 10);
          setChangeStepModal(false)
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
    <Row gutter={[12, 12]} justify='center' align='middle'>
      <Col xs={24}>
        <Row gutter={[12, 12]} justify='center' align='middle'>
          <Col xs={24} md={18} xl={20} >
            <Row gutter={[12, 12]} justify='center'>
              <Col xs={24}>
                <label style={{ fontWeight: 600, fontSize: 18 }}>{details.complaint_num} - {details.title}</label>
              </Col>
              <Col xs={24} >
                <label style={{ fontWeight: 600, color: '#888888' }}>{moment(details.created_at).format('DD/MM/YYYY')} -</label> <Tag color={
                  details.step_id == 1 ? 'purple' :
                    details.step_id == 13 ? 'brown' :
                      details.step_id == 4 ? 'processing' :
                        details.step_id == 5 ? 'cyan' :
                          details.step_id == 6 ? 'geekblue' :
                            (details.step_id == 7 || details.step_id == 14) ? 'success' :
                              details.step_id == 8 && '#ff0000'

                }>{details.step.name} </Tag>
              </Col>
            </Row>
          </Col>

          <Col xs={24} md={6} xl={4} style={{ textAlign: "center" }} >
            {
              // (details.step_id == 1 && (role == 3 || role == 5)) ?
              (details.step_id == 1 && role == 10) ?
                <Row gutter={[12, 12]}>
                  <Col xs={24}>
                    <Button type='primary'
                      onClick={() => setChangeStepModal({
                        action: true,
                        option: 13,
                        titulo: 'Poner queja en disputa.'
                      })}
                    >Enviar a disputa</Button>
                  </Col>
                  <Col xs={24}>
                    <Popconfirm
                      title="¿Seguro que dese
                       rechazar esta orden?"
                      okText="Si"
                      cancelText="No"
                      onConfirm={() => setRechazarModal({
                        titulo: "Rechazar queja",
                        action: true
                      })}
                    >
                      <Button type="primary" danger
                      >
                        Rechazar Queja
                      </Button>
                    </Popconfirm>
                  </Col>
                </Row>
                // : (details.step_id == 13 && (role == 3 || role == 5)) ?
                : (details.step_id == 13 && role == 10) ?
                  //  El agente envia la queja a en pendiente de aprobacion es decir que requirio retrabajo y la aprobacion del cliente.
                  <Button type="primary" icon={<UploadOutlined />}
                    onClick={() => setChangeStepModal({
                      action: true,
                      option: 3,
                      titulo: 'Enviar queja a retrabajo.'
                    })}

                  >
                    Retrabajo
                  </Button>
                  : (details.step_id == 3 && role == 4 && details.new_po == 1) &&
                  //  El agente envia la queja a en construccion es decir que requirio retrabajo 
                  <Button type="primary" icon={<UploadOutlined />}
                    onClick={() => setChangeStepModal({
                      action: true,
                      option: 4,
                      titulo: 'Enviar queja a en construcción.'
                    })}

                  >
                    Aceptar retrabajo
                  </Button>

              // : details.step_id == 4 && (role == 6 || role == 10) ?
              //   // Falta aqui validar que exista la po para mostrar este boton de inspeccion
              //   <Popconfirm
              //     title="¿Seguro que desea solicitar una auditoria?"
              //     okText="Si"
              //     cancelText="No"
              //     onConfirm={() => setChangeStepModal({
              //       action: true,
              //       option: 5,
              //       titulo: 'Enviar queja a inspección.'
              //     })}
              //   >
              //     <Button type="primary" icon={<CheckCircleOutlined />}
              //     >
              //       Inspección
              //     </Button>
              //   </Popconfirm>
              //   : (details.step_id == 5 && role == 10) ?
              //     // : (details.step_id == 5 && (role == 3 || role == 5)) ?
              //     <Popconfirm
              //       title="¿Seguro que desea confirmar esta orden como lista?"
              //       okText="Si"
              //       cancelText="No"
              //       onConfirm={() => setChangeStepModal({
              //         action: true,
              //         option: 6,
              //         titulo: 'Enviar queja a en camino.'
              //       })}

              //     >
              //       <Button type="primary" icon={<CheckCircleOutlined />}
              //       >
              //         Orden Lista
              //       </Button>
              //     </Popconfirm>
              //     : (details.step_id == 6 && role == 4) &&
              //     <Popconfirm
              //       title="¿Seguro que ha recibido su orden completa?"
              //       okText="Si"
              //       cancelText="No"
              //       onConfirm={ChangeStep(7)}
              //     // onConfirm={() => setChangeStepModal({
              //     //   action: true,
              //     //   option: 7,
              //     //   titulo: 'Enviar queja a entregada.'
              //     // })}

              //     >
              //       <Button type="primary" icon={<CheckCircleOutlined />}
              //         loading={loadChangeStep}
              //       >
              //         Entregado
              //       </Button>
              //     </Popconfirm>

            }
          </Col>

        </Row>
      </Col >

      <Col xs={24}>
        <Card className='background-gris'>
          <Row gutter={[12, 12]} align='middle' >
            <Col xs={24} md={6} style={{ textAlign: 'center' }}>
              <Avatar src={`https://api.epno-app.com${details.organization.logo}`}
                size={{ xs: 150, md: 120, lg: 100, xl: 100, xxl: 150 }}
              />
            </Col>
            <Col xs={24} md={18} >
              <Row gutter={[12, 12]}>
                <Col xs={24} md={12} xl={8} >
                  <label className='gris-bold'>Cliente</label> <br />
                  <b>{details.organization.name} </b>
                </Col>
                <Col xs={24} md={12} xl={5} >
                  <label className='gris-bold' >Teléfono</label> <br />
                  <a href={`tel:${details.user.phone}`} style={{ fontWeight: 600 }}>{details.user.phone}</a>
                </Col>
                <Col xs={24} md={14} lg={24} xl={11} >
                  <label className='gris-bold' >Correo</label> <br />
                  <a href={`mailto:${details.user.email}`} style={{ fontWeight: 600 }}>{details.user.email}</a>
                </Col>
                <Col xs={24} md={10} lg={24} xl={11} >
                  <label className='gris-bold' >Requisitor</label> <br />
                  <b>{details.user.name}</b>
                </Col>
                <Col xs={24} xl={13} >
                  <label className='gris-bold' >Dirección</label> <br />
                  <b>{details.organization.street} #{details.organization.external_number},
                    Col: {details.organization.colony.name}, CP:{details.organization.colony.postal_code.name},
                    Cd. {details.organization.colony.postal_code.city.name},
                    {details.organization.colony.postal_code.city.state.name}, {details.organization.colony.postal_code.city.state.country.name}</b>
                </Col>

              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col xs={24}>
        <Card headStyle={{ background: '#F4F6F6' }} className='actions-back'
          // Servicio y categoria de la orden
          title={
            <Row gutter={[12, 12]}>
              <Col>
                <b>Tipo: </b>
                {
                  details.type == null && role == 10 ?
                    // (details.type == null && details.step_id==1 && role == 10) ?
                    // details.type == null && (role == 3 || role == 5) ?
                    <Select
                      showSearch
                      placeholder="Tipo de queja"
                      optionFilterProp="children"
                      onChange={(value) => onChangeComplaint(details.id, value)}
                      style={{ width: 150 }}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="Cosmético">Cosmético</Option>
                      <Option value="Funcional">Funcional</Option>
                      <Option value="Especificación">Especificación</Option>
                    </Select>
                    : details.type == null && (role == 4 || role == 6 || role == 1 || role == 2 || role == 3 || role == 5) ?
                      <label>Sin definir</label>
                      : <label>{details.type}</label>
                }
              </Col>

            </Row>
          }
          extra={
            role == 4 ?
              <b>${details.client_cost}</b>
              : (role == 3 || role == 5 || role == 1 || role == 2) &&
              <b>C:${details.client_cost}, V:${details.supplier_cost}</b>
          }
          actions={[
            <Row gutter={[12, 12]}>
              {

                // role == 10 &&
                role == 10 && (details.step_id == 13 || details.step_id == 7) &&
                // (role == 3 || role == 5) && (details.step_id == 13) &&

                <Col xs={24} md={8} xl={8}>
                  <Popconfirm
                    title="¿Seguro que deseas cerrar esta queja?"
                    okText="Si"
                    cancelText="No"
                    onConfirm={() => setCerrarComplaintModal(true)}

                  >
                    <Button type="primary" danger icon={<CheckCircleOutlined />}
                    >
                      Cerrar {details.complaint_num}
                    </Button>
                  </Popconfirm>
                </Col>

              }


              {
                (role != 6) &&
                <>
                  <Col xs={24} md={8} xl={6}>
                    <a
                      href={`https://api.epno-app.com${details.service.quote_file}`}

                      target="_blank" rel="noopener noreferrer"
                      download
                    >
                      <Button icon={<DownloadOutlined />} >
                        <i className="fas fa-download" />
                        &nbsp;Cotización
                      </Button>
                    </a>
                  </Col>

                  <Col xs={24} md={8} xl={6}>
                    {
                      details.new_po == 1 && details.client_po_file !== null ?
                        <a
                          href={`https://api.epno-app.com${details.client_po_file}`}
                          target="_blank" rel="noopener noreferrer"
                          download
                        >
                          <Button icon={<DownloadOutlined />} >
                            <i className="fas fa-download" />
                            &nbsp;PO
                          </Button>
                        </a>
                        :
                        <a
                          href={`https://api.epno-app.com${details.order.client_po_file}`}
                          target="_blank" rel="noopener noreferrer"
                          download
                        >
                          <Button icon={<DownloadOutlined />} >
                            <i className="fas fa-download" />
                            &nbsp;PO
                          </Button>
                        </a>
                    }
                  </Col>
                </>
              }
            </Row>
          ]
          }
        >
          <Row gutter={[12, 12]} align="middle" >
            {/* <Col xs={24} md={18}>
              <Row gutter={[12, 12]}> */}
            <Col xs={24} md={16} style={{ textAlign: "center" }} >
              <b>Fecha de entrega:</b> <b style={{ fontSize: 16 }}>{details.service.client_deadline}</b>
            </Col>

            <Col xs={24} md={8}>
              <b>Orden: <Link to={`/orders/details/${details.order_id}`}>{details.order_num}</Link> </b>
            </Col>
            <Col xs={24} xl={18}>
              {details.service.description}
            </Col>
            {
              (role != 6 && details.step_id == 14) &&
              <Col xs={24} xl={6} >
                <Row gutter={[12, 12]} justify='center'>
                  <Col>
                    <a
                      href={`https://api.epno-app.com${details.root_cause}`}
                      target="_blank" rel="noopener noreferrer"
                      download
                    >
                      <Button icon={<DownloadOutlined />} >
                        <i className="fas fa-download" />
                        &nbsp;Cauza Raíz
                      </Button>
                    </a>
                  </Col>
                  <Col>
                    <a
                      href={`https://api.epno-app.com${details.lesson_learned}`}
                      target="_blank" rel="noopener noreferrer"
                      download
                    >
                      <Button icon={<DownloadOutlined />} >
                        <i className="fas fa-download" />
                        &nbsp;Lección aprendida
                      </Button>
                    </a>
                  </Col>
                  <Col>
                    <a
                      href={`https://api.epno-app.com${details.ocho_ds}`}
                      target="_blank" rel="noopener noreferrer"
                      download
                    >
                      <Button icon={<DownloadOutlined />} >
                        <i className="fas fa-download" />
                        &nbsp;8D's
                      </Button>
                    </a>
                  </Col>
                </Row>

              </Col>
            }


            {/* </Row>
            </Col> */}
          </Row>
        </Card >
      </Col >
      <Col xs={24}>
        {

          details.subservices.map((sub) => (
            role == 6 ?
              <SubserviceComplaintSupp subservice={sub} role={role} details={details} token={token} reload={reload} setReload={setReload} setChangeStepModal={setChangeStepModal} />
              :
              <SubserviceComplaint subservice={sub} role={role} details={details} token={token} reload={reload} setReload={setReload} setChangeStepModal={setChangeStepModal} ChangeStep={ChangeStep} />
          ))}
      </Col>
      <Col xs={24}>

        <Collapse defaultActiveKey={['1']} ghost>
          <Panel key="1"
            header={<b >SECCION DE EVIDENCIAS</b>}>

            <Col xs={24}>
              {
                (role == 6 && details.subservice_complaint_epno == "") ?

                  <Empty description="No se han agregado evidencias" />
                  : (role == 6 && details.subservice_complaint_epno !== "") ?
                    details.subservice_complaint_epno.map((ev) => (
                      <Evidencia details={details} evidencia={ev} role={role} tabla='complaint_epno_to_supplier_evidence' token={token} reload={reload} setReload={setReload} />

                    ))
                    : (role == 4 && details.subservice_complaint_client == "") ?

                      <Empty description="No se han agregado evidencias" />
                      : (role == 4 && details.subservice_complaint_client !== "") &&
                      details.subservice_complaint_client.map((ev) => (
                        <Evidencia details={details} evidencia={ev} role={role} tabla='complaint_client_to_epno_evidence' token={token} reload={reload} setReload={setReload} />

                      ))

              }
            </Col>
            <Col xs={24}>
              {
                (role == 3 || role == 5 || role == 1 || role == 2 || role == 10) &&
                details.subservice_complaint_client.map((ev) => (
                  <Evidencia evidencia={ev} details={details} role={role} tabla='complaint_client_to_epno_evidence' token={token} reload={reload} setReload={setReload} />

                ))
              }

            </Col>
            <Col xs={24}>
              {
                (role == 3 || role == 5 || role == 1 || role == 2 || role == 10) &&
                details.subservice_complaint_epno.map((ev) => (
                  <Evidencia evidencia={ev} details={details} role={role} tabla='complaint_epno_to_supplier_evidence' token={token} reload={reload} setReload={setReload} />

                ))
              }

            </Col>

          </Panel>

        </Collapse>
      </Col>
      <Modal
        title={rechazarModal.titulo}
        visible={rechazarModal.action}
        onOk={() => {
          setRechazarModal({
            ...rechazarModal,
            action: false
          });
          form.resetFields();
        }}
        onCancel={() => {
          setRechazarModal({
            ...rechazarModal,
            action: false
          });
          form.resetFields();
        }}
        footer=''>
        <Form
          name="basic"
          autoComplete="off"
          initialValues={{ remember: true }}
          onFinish={sendResponseComplaint(8)}
          layout='vertical'
          form={form}
        >
          <Form.Item
            label="Escribe una breve explicacion del por que de tu acción."
            name='descripcion'
            rules={[{ required: true, message: 'Debes agregar una explicación de tu acción.' }]}
          >
            <Input.TextArea
              showCount
              allowClear
              maxLength={500}
            />
          </Form.Item>
          <Form.Item
          >
            <Button type='primary'
              htmlType="submit"
              style={{ width: "100%" }}
            // loading={load}
            >Enviar</Button>
          </Form.Item>
        </Form>

      </Modal>
      <Modal
        title={changeStepModal.titulo}
        visible={changeStepModal.action}
        onOk={() => {
          setChangeStepModal({
            ...changeStepModal,
            action: false
          });
          form.resetFields();
        }}
        onCancel={() => {
          setChangeStepModal({
            ...changeStepModal,
            action: false
          });
          form.resetFields();
        }}
        footer=''>
        {
          changeStepModal.option == 4 ?
            <Row gutter={[12, 12]}>
              <Col xs={24}>
                <a
                  href={`https://api.epno-app.com${details.epno_cot_file}`}

                  target="_blank" rel="noopener noreferrer"
                  download
                >
                  <Button icon={<DownloadOutlined />} >
                    <i className="fas fa-download" />
                    &nbsp;Descargar nueva cotización por retrabajo
                  </Button>
                </a>
              </Col>
              <Col xs={24} style={{ marginBottom: 25 }}>
                <Dragger
                  {...propsClientPO}
                  maxCount={1}
                  accept=".pdf"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Da click o arrastra para subir un archivo</p>
                  <p className="ant-upload-hint">
                    Sube la nueva po o po complementaria (PDF) para enviar esta orden a retrabajo.
                  </p>
                </Dragger>
              </Col>
            </Row>

            :
            <Form
              name="change_step"
              autoComplete="off"
              initialValues={{ remember: true }}
              onFinish={ChangeStep(changeStepModal.option)}
              layout='vertical'
              form={form}
            >

              <Form.Item
                label="¿El realizar esta acción implica algún costo?"
                name='costo'
              // rules={[{ required: true, message: 'Debes agregar una explicación de tu acción.' }]}
              >
                <InputNumber
                  showCount
                  allowClear
                  style={{ width: '50%' }}
                  min={1}
                />
              </Form.Item>
              <Form.Item
                label="De ser así, escribe una breve explicación de los detalles que implica."
                name='descripcion'
              // rules={[{ required: true, message: 'Debes agregar una explicación de tu acción.' }]}
              >
                <Input.TextArea
                  showCount
                  allowClear
                  maxLength={500}
                />
              </Form.Item>
              {
                changeStepModal.option == 3 &&

                <Form.Item
                  label="¿Requiere una po nueva?"
                  name='po'
                  valuePropName="checked"
                // rules={[{ required: true, message: 'Debes agregar una explicación de tu acción.' }]}
                >
                  <Checkbox
                    name='po'
                    onChange={() => setRequierePo(!requierePo)}
                  >Si, es necesario subir una PO</Checkbox>
                </Form.Item>
              }
              {
                requierePo &&
                <Form.Item
                  style={{ textAlign: 'center' }}
                  label="Cotización nueva."
                  name='nueva_cotizacion'
                  valuePropName="checked"
                  rules={[{ required: true, message: 'Debes subir una cotización con el costo adicional.' }]}
                >
                  <Upload
                    name="nueva_cotizacion"
                    maxCount={1}
                    accept='.pdf'
                    beforeUpload={() => false
                    }
                    listType="picture-card">
                    <div>
                      <div style={{ marginTop: 8 }}>Subir cotizacion</div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>(PDF)</div>
                    </div>
                  </Upload>
                </Form.Item>
              }

              <Form.Item
              >
                <Button type='primary'
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={loadChangeStep}
                >Enviar</Button>
              </Form.Item>
            </Form>
        }

      </Modal>
      <Modal
        title="Cerrar Queja"
        visible={cerrarComplaintModal}
        onOk={() => {
          setCerrarComplaintModal(false)
          form.resetFields();
        }}
        width={1200}
        style={{
          top: 10,
        }}
        onCancel={() => {
          setCerrarComplaintModal(false)

          form.resetFields();
        }}
        footer=''>
        <Form
          name="change_step"
          autoComplete="off"
          initialValues={{ remember: true }}
          onFinish={closeComplaint}
          layout='vertical'
          form={form}

        >
          <Row gutter={[12, 12]} align='middle'>
            <Col xs={24} md={12} lg={8} xl={6}>
              <Form.Item
                style={{ textAlign: 'center' }}
                name="root_cause"
                label="Causa Raíz"
                rules={[
                  {
                    required: true,
                    message: 'Debes subir un pdf con la causa raíz.',
                  },

                ]}
              >
                <Upload
                  name="root_cause"
                  maxCount={1}
                  accept='.pdf'
                  beforeUpload={() => false
                  }
                  listType="picture-card">
                  <div>
                    <div style={{ marginTop: 8 }}>Subir causa</div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>(PDF)</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8} xl={6}>
              <Form.Item
                style={{ textAlign: 'center' }}
                name="leccion_aprendida"
                label="Lección aprendida"
                rules={[
                  {
                    required: true,
                    message: 'Debes subir un pdf con la lección aprendida.',
                  },

                ]}
              >
                <Upload
                  name="leccion_aprendida"
                  maxCount={1}
                  accept='.pdf'
                  beforeUpload={() => false
                  }
                  listType="picture-card">
                  <div>
                    <div style={{ marginTop: 8 }}>Subir lección</div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>(PDF)</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8} xl={12}>
              <Form.Item
                style={{ textAlign: 'center' }}
                name="info_equipo"
                label="1D. Información del equipo"
                tooltip={{
                  title: 'Nombre, puesto, rol.',
                  icon: <InfoCircleOutlined />,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Ingresa la información de tu equipo.',
                  },

                ]}
              >
                <Input.TextArea
                  showCount
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8} xl={12}>
              <Form.Item
                style={{ textAlign: 'center' }}
                name="desc_problema"
                label="2D. Descripción del problema"
                tooltip={{
                  title: '¿Qué?, ¿Cuándo?, ¿Por qué?, ¿Donde?, ¿Quién?, ¿Cómo?',
                  icon: <InfoCircleOutlined />,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Ingresa la descripción del problema.',
                  },

                ]}
              >
                <Input.TextArea
                  showCount
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8} xl={12}>
              <Form.Item
                style={{ textAlign: 'center' }}
                name="acciones_provisionales"
                label="3D. Acciones de contención privicionales (En las primeras 24 hrs)"
                tooltip={{
                  title: 'Acción, responsable, fecha de acción acordada y fecha de acción completada.',
                  icon: <InfoCircleOutlined />,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Ingresa las acciones de contención para las primeras 24 hrs.',
                  },

                ]}
              >
                <Input.TextArea
                  showCount
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8} xl={12}>
              <Form.Item
                style={{ textAlign: 'center' }}
                name="causa_raiz"
                label="4D. Define y verifique la(s) causa(s) raíz principal(es)"

                rules={[
                  {
                    required: true,
                    message: 'Ingresa las causa raiz.',
                  },

                ]}
              >
                <Input.TextArea
                  showCount
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8} xl={12}>
              <Form.Item
                style={{ textAlign: 'center' }}
                name="acciones_permanentes"
                label="5D. Acciones correctivas permanentes"
                tooltip={{
                  title: 'Acción, responsable, fecha objetivo y fecha actual.',
                  icon: <InfoCircleOutlined />,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Ingresa las acciones correctivas permanentes.',
                  },

                ]}
              >
                <Input.TextArea
                  showCount
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8} xl={12}>
              <Form.Item
                style={{ textAlign: 'center' }}
                name="implementacion"
                label="6D. Implementación y validacion de acciones correctivas permanentes"
                tooltip={{
                  title: 'Acción,metodo de validacion, responsable, fecha objetivo y fecha actual.',
                  icon: <InfoCircleOutlined />,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Ingresa la implementación de las acciones correctivas permanentes.',
                  },

                ]}
              >
                <Input.TextArea
                  showCount
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8} xl={12}>
              <Form.Item
                style={{ textAlign: 'center' }}
                name="acciones_prevencion"
                label="7D. Acciones para prevenir que recurra el incidente"
                tooltip={{
                  title: 'Acción, responsable, fecha objetivo y fecha actual.',
                  icon: <InfoCircleOutlined />,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Ingresa el sistema de acciones para prevenir la recurrencia.',
                  },

                ]}
              >
                <Input.TextArea
                  showCount
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8} xl={12}>
              <Form.Item
                style={{ textAlign: 'center' }}
                name="reconocimiento"
                label="8D. Equipo y reconocimiento individual"
                tooltip={{
                  title: 'Nombre y reconocimiento.',
                  icon: <InfoCircleOutlined />,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Ingresa el equipo asi como el reconocimiento individual.',
                  },

                ]}
              >
                <Input.TextArea
                  showCount
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12} >
              <Form.Item
              >
                <Button type='primary'
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={loadCerrarComplaint}
                >Enviar</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

      </Modal>

    </Row >


  );
}

