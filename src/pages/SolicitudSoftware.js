import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Row, Col, Descriptions, Select, Modal, Result, Card, DatePicker } from 'antd';
import Layout from '../layouts/LayoutPage';
import "../scss/SolicitudSoftware.scss";
import moment from "moment"
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../utils/api/users';


export default function SolicitudSoftware() {
  const dateFormatList = ['YYYY-MM-DD HH:mm:ss'];
  const [formValue, setFormValue] = useState({
    title: "",
    description: "",
    // fecha:''

  });
  let token = localStorage.getItem('token');
  let history = useNavigate();
  const [role, setRole] = useState('')
  const [startDate, setStartDate] = useState(null);
  const [show, setShow] = useState({
    show: false,
    order: ''
  });
  const [form] = Form.useForm();
  const [load, setLoad] = useState({
    loadings: []
  })
  const onFormChange = event => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value
    });
  };
  useEffect(() => {
    UserService.UserRole()
    .then((response) => {
      if (response.data.role) {
        setRole(response.data.role);
      } else {
        localStorage.removeItem('token')
        // history('/login')
      }

    }).catch(() => {
      localStorage.removeItem('token')
      // history('/login')
    }
    )

  }, [])
  const onFinish = (index) => {

    setLoad(({ loadings }) => {
      const newLoadings = [...loadings];
      newLoadings[index] = true;

      return {
        loadings: newLoadings,
      };
    })
    UserService.solicitudSoftware([{ formValue, 'fecha': startDate }])
    .then(response => {

      setTimeout(() => {
        setShow({
          show: true,
          order: response.data.purchase_order
        });
        setLoad(({ loadings }) => {
          const newLoadings = [...loadings];
          newLoadings[index] = false;

          return {
            loadings: newLoadings
          };
        });
      })
      form.resetFields();

    })
    .catch(error => {
      console.log(error.response.data.errors)
    })

  }


  return (
    <>
      <Layout>
        <Card title="Solicitud de software" className="card-head">

          <Row gutter={24} >
            <Col span={24}  >
              <Descriptions  >

                <Descriptions.Item label="NOTA" name="description">
                  Favor de completar todos los campos del siguiente formulario , de esta manera nos podemos poner en contacto contigo y
                  revisar a detalle tu solicitud, asi mismo cada punto es importante para realizar un previo analisis de tus necesidades.
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
          <Row gutter={24}  >

            <Col xs={24} md={20} lg={14} style={{ marginLeft: "auto", marginRight: "auto", marginTop: 16 }}>
              <Form name="nest-messages" method="POST" form={form} onFinish={()=>onFinish(0)}>

                <Form.Item
                  name='title'
                  label="Titulo de software"
                  rules={[{ required: true, message: 'Favor de ingresar un titulo para su proyecto' }]}>
                  <Input
                    name='title'
                    onChange={onFormChange}
                    value={formValue.title}

                  />
                </Form.Item>


                <Form.Item
                  name='description'
                  label="Descripcion de lo deseado"
                  rules={[{ required: true, message: 'Favor de ingresar una pequeña descripcion de lo deseado' }]}>
                  <Input.TextArea
                    name='description'
                    onChange={onFormChange}
                    value={formValue.description}
                  />
                </Form.Item>
                <Form.Item
                  name='fecha'
                  label="Fecha tentativa para reunion"
                  rules={[{ required: true, message: 'Favor de seleccionar una fecha' }]}>
                  <DatePicker
                    selected={startDate} onChange={date => setStartDate(moment(date).format(dateFormatList))} value={startDate} format={dateFormatList} />

                </Form.Item>
                <Form.Item >
                  <Button type="primary" htmlType="submit"
                  loading={load.loadings[0]}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>

        </Card>
      </Layout>
      <Modal
        title="Notificación de solicitud"
        closable={true}
        visible={show.show}
        footer={[
          <Button key="submit" type="primary" >
            {/* <Link to={`/orders/${role}`}>Aceptar</Link> */}
          </Button>,
        ]}
      >

        <Result
          status="success"
          title="¡Solicitud enviada con exito!"
          subTitle={`Tu numero de orden es: ${show.order}, podras ver tu pedido, en apartado de ORDENES .`}

        />
      </Modal>
    </>
  );
};

