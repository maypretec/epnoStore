import React, { useState, useEffect } from 'react';

import { Result, Button, Card, Col, Row, Empty, Form, Popconfirm, Input, Image, Radio, Tabs, Select, message } from 'antd';
import Layout from '../layouts/ControlPanelLayout';
import { useDispatch, useSelector } from 'react-redux';
import { newUserAction } from '../actions/notificationActions';
import UserService from '../utils/api/users';
import VSService from '../utils/api/valuestreams';
import CategoryService from '../utils/api/categories';

export default function Solicitudes() {
  const { TabPane } = Tabs;
  const { Option } = Select;
  const [solicitud, setSolicitud] = useState([]);
  const [vs, setVs] = useState([]);
  const [categories, setCategories] = useState([]);

  const [respuesta, setRespuesta] = useState(false);
  const [mode, setMode] = useState('right')
  const [load, setLoad] = useState({
    aceptar: false,
    rechazar: false
  });
  const dispatch = useDispatch();

  const newUsers = state => {
    dispatch(newUserAction(state));
  }
  const stateNotifications = useSelector(state => state.notifications.stateUserNotifications);


  useEffect(() => {
    //notificaciones
    UserService.GetNewUserRequest()
    .then((response) => {
      return response.json()

    })
    .then((solicitudes) => {

      setSolicitud(solicitudes);

    }).catch(console.log)

    VSService.All()
    .then((response) => {
      return response.json()

    })
    .then((value) => {

      setVs(value);

    }).catch(console.log)

    //Categories
    CategoryService.Get()
    .then((response) => {
      return response.json()
    })
    .then((categories) => {
      setCategories(categories)
    }).catch(console.log)

  }, [respuesta])

  const onFinish = (values) => {
    setLoad({
      ...load,
      aceptar: true
    })
    let categoria = "";
    let vs = "";

    if (values.role_id == 7) {
      categoria = values.categoria;
    }else{
      vs=values.vs;
    }

    UserService.NewUserRequest({
      'user': values.user_id, 'role': values.role_id,
      'email': values.email, 'response': 1,
      'vs': vs,
      'categoria': categoria,
      'org': values.org_id,
      })
      .then(response => {
        if (response.data.success == true) {
          message.success('Usuario actualizado correctamente.')
          newUsers(!stateNotifications);
          setRespuesta(!respuesta)
          setLoad({
            ...load,
            aceptar: false
          })
        } else {
          message.error('Hubo un error al actualizar el usuario.')
          setLoad({
            ...load,
            aceptar: false
          })
        }

      })
      .catch(error => {
        message.error('Hubo un error al actualizar el usuario.')
        setLoad({
          ...load,
          aceptar: false
        })
      })
  };
  const onFinishNew = (user, role, email) => {
    setLoad({
      ...load,
      rechazar: true
    })
    UserService.NewUserRequest({ 
      'user': user, 
      'role': role, 
      'email': email,
      'response': 0 
    })
    .then(response => {
      if (response.data.success == true) {
        message.success('Usuario actualizado correctamente.')
        newUsers(!stateNotifications);
        setRespuesta(!respuesta)
        setLoad({
          ...load,
          rechazar: false
        })
      } else {
        message.error('Hubo un error al actualizar el usuario.')
        setLoad({
          ...load,
          rechazar: false
        })
      }

      })
      .catch(error => {
        message.error('Hubo un error al actualizar el usuario.')
        setLoad({
          ...load,
          rechazar: false
        })
      })
  };
  const handleModeChange = e => {
    const mode = e.target.value;
    setMode(mode);
  };
  return (
    <Layout>
      {
        solicitud == '' ?
          <Empty description='No hay solicitudes pendientes.' />
          :
          <>
            <Radio.Group onChange={handleModeChange} value={mode} style={{ marginBottom: 8, textAlign: "center" }}>
              <Radio.Button value="top" style={{ marginTop: 0, textAlign: "center" }}>Horizontal</Radio.Button>
              <Radio.Button value="right" style={{ marginTop: 5, textAlign: "center" }}>Vertical</Radio.Button>
            </Radio.Group>
            <Tabs tabPosition={mode}  >
              {solicitud.map((s) => (

                <TabPane tab={s.name} key={s.user_id}>

                  <Form
                    name="normal_login"
                    // className="login-form"
                    initialValues={{
                      remember: true,
                    }}
                    onFinish={onFinish}
                  >
                    <Row gutter={[12, 12]} justify='center'>
                      <Col xs={24} md={12} lg={8} xl={6}>
                        <Form.Item
                          name="user_id"
                          initialValue={s.user_id}
                          hidden={true}
                        >
                        </Form.Item>
                        <Form.Item
                          name="role_id"
                          initialValue={s.role_id}
                          hidden={true}
                        >
                        </Form.Item>
                        <Form.Item
                          name="org_id"
                          initialValue={s.organization_id}
                          hidden={true}
                        >
                        </Form.Item>
                        <Form.Item
                          name="username"
                          label='Nombre'
                          initialValue={s.user}

                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={8} xl={6}>
                        <Form.Item
                          name="email"
                          label='Correo'
                          initialValue={s.email}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={8} xl={6}>
                        <Form.Item
                          name="phone"
                          label='Telefono'
                          initialValue={s.phone}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={8} xl={6}>
                        <Form.Item
                          name="org"
                          label='Organización'
                          initialValue={s.name}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={8} xl={6}>
                        <Form.Item
                          name="rfc"
                          label='RFC'
                          initialValue={s.rfc}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={8} xl={6}>
                        <Form.Item
                          name="calle"
                          label='Calle'
                          initialValue={s.street}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={8} xl={6}>
                        <Form.Item
                          name="ext_num"
                          label='Num.Ext'
                          initialValue={s.external_number}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={8} xl={6}>
                        <Form.Item
                          name="int_num"
                          label='Int.Ext'
                          initialValue={s.internal_number}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={8} xl={6}>
                        <Form.Item
                          name="colonia"
                          label='Colonia'
                          initialValue={s.Colonia}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={8} xl={6}>
                        <Form.Item
                          name="cp"
                          label='Código Postal'
                          initialValue={s.Codigo_postal}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={8} xl={6}>
                        <Form.Item
                          name="ciudad"
                          label='Ciudad'
                          initialValue={s.Ciudad}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={8} xl={6}>
                        <Form.Item
                          name="estado"
                          label='Estado'
                          initialValue={s.Estado}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={10} lg={8} xl={6}>
                        <Form.Item
                          name="pais"
                          label='Páis'
                          initialValue={s.Pais}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={14} lg={16} xl={6} >
                        <Form.Item
                          name="url"
                          label='Página Web'
                          initialValue='Sin pagina'
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: 'Please input your Username!',
                        //   },
                        // ]}
                        >
                          {
                            s.url !== null ?
                              <a href={s.url} target='a_blank'>{s.url}</a>
                              :
                              <Input disabled />
                          }
                        </Form.Item>
                      </Col>
                      <Col xs={12} md={6} lg={4} xl={3}>
                        <Form.Item
                          name="logo"
                          label='Logo'
                        >
                          <Image
                            // width={200}
                            src={`https://api.epno-app.com${s.logo}`}
                          />
                        </Form.Item>
                      </Col>
                      {
                        s.role_id == 8 &&
                        <Col xs={24} md={12} lg={10} xl={6}  >
                          <Form.Item name="vs" label="VS" rules={[{ required: true, message: 'Debes de seleccionar el VS al que pertenecerá' }]}>
                            <Select
                              placeholder="Elige el VS al que pertenecerá"
                              // onChange={this.onGenderChange}
                              allowClear
                            >
                              {
                                vs.map((v) => (
                                  <Option value={v.id}>{v.name}</Option>

                                ))
                              }
                            </Select>
                          </Form.Item>
                        </Col>
                      }
                      {
                        s.role_id == 7 &&
                        <Col xs={24} md={14} lg={10} xl={8}  >
                          <Form.Item
                            label="Categoria(s)"
                            name="categoria"
                            rules={[{ required: true, message: 'Debes elegir almenos una categoria' }]}
                          >
                            <Select
                              mode="multiple"
                              allowClear

                              placeholder="Seleccionar la(s) categoria(s)"

                              name="categoria"
                            // rules={[{ required: true }]}

                            >
                              {
                                categories.map((category, index) => (
                                  <Option key={index} value={category.id} >{category.name}</Option>
                                ))
                              }
                            </Select>
                          </Form.Item>
                        </Col>
                      }
                      <Col xs={24} md={10} lg={6} >
                        <Form.Item>
                          <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={load.aceptar}>Aceptar</Button>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={10} lg={6} >
                        <Form.Item>
                          <Popconfirm
                            title="¿Seguro que deseas rechazar a este usuario?"
                            onConfirm={() => onFinishNew(s.user_id, s.role_id, s.email)}
                            okText="Si"
                            cancelText="No"
                          >
                            <Button type="primary" style={{ width: '100%' }} danger loading={load.rechazar}>Rechazar</Button>
                          </Popconfirm>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>

                </TabPane>
              ))}
            </Tabs>
          </>
      }
    </Layout >
  );
}

