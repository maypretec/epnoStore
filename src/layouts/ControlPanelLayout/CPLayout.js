import React, { useState, useEffect } from 'react';
import "./CPLayout.scss";
import { Layout, Menu, Row, Col, Input, Avatar, Button, Badge, Dropdown, Modal, Form, Spin, message, Empty, Divider } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import {
  UsergroupAddOutlined,
  MoneyCollectOutlined,
  MonitorOutlined,
  FileProtectOutlined,
  InboxOutlined,
  GlobalOutlined,
  EyeOutlined,
  UserAddOutlined,
  MenuFoldOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  NotificationTwoTone,
  EyeInvisibleOutlined,
  SwapOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import Forbidden from "../../components/Forbidden"
import { useSelector } from 'react-redux';
import OrderService from '../../utils/api/orders';
import NotificationService from '../../utils/api/notifications';

const { Header, Sider, Content, Footer } = Layout;
const { Search } = Input;
const { SubMenu } = Menu;

export default function CPLayout(props) {
  const formRef = React.createRef();
  const [form] = Form.useForm();
  const { children } = props;


  let role = localStorage.getItem('role');
  // TODO: change to dynamic role reading

  const footerContent = <div className="footer_cart">
    <div>
      <p>Total:</p>
      <p>$0.00</p>
    </div>
    <Button className="btn btn-info">Ver carrito <EyeOutlined /></Button>
  </div>;
  const [load, setLoad] = useState(false)
  const [notifications, setNotifications] = useState({
    notify: [],
    total: 0,
    user_id: ''
  });
  const [newUserNotifications, setNewUserNotifications] = useState({
    user: [],
    count: ''
  });
  let token = localStorage.getItem('token');

  const [isModalVisibleServicios, setIsModalVisibleServicios] = useState(false);
  const stateNotifications = useSelector(state => state.notifications.stateUserNotifications);
  const stateNotificaciones = useSelector(state => state.notifications.stateNotificacionesTotal);



  // useEffect(() => {
  //   //notificaciones
  //   fetch(`https://api.epno-app.com/api/get_notifications/1`, {
  //     headers: {
  //       'Accept': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //     }
  //   })
  //     .then((response) => {
  //       return response.json()

  //     })
  //     .then((data) => {
  //       setNotifications({
  //         notify: data.notificaciones,
  //         total: data.total,
  //         user_id: data.user,
  //       });
  //     }).catch(console.log)


  // }, [stateNotificaciones])




  // useEffect(() => {

  //   fetch('https://api.epno-app.com/api/new_user_request_notification')
  //     .then((response) => {
  //       return response.json()

  //     })
  //     .then((newUserNotifications) => {

  //       setNewUserNotifications({
  //         user: newUserNotifications.userNotification,
  //         count: newUserNotifications.countNotification
  //       });
  //     }).catch(console.log)

  // }, [stateNotifications])



  let history = useNavigate();

  const onFinishServicio = (values) => {

    setLoad(true)
  OrderService.NewService(values)
    .then(response => {
      if (response.data.success == true) {
        message.success(response.data.message);
        setLoad(false);
        setIsModalVisibleServicios(false)
        form.resetFields();
      } else {
        message.error(response.data.message);
        setLoad(false);
      }
    })
    .catch(error => {
      console.log(error);
      setLoad(false);

    })
  };


  const logout = () => {
    history('/')
    localStorage.removeItem('token');
    localStorage.removeItem('role');

  }

  const allNotifications = (
    <Menu >
      <Menu.ItemGroup title="Notificaciones">
        {/*notifications.notify == "" ? (
          <Empty description="Sin notificaciones" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) :
          notifications.notify.map((ntf) => (
            <Menu.Item key={ntf.id} style={{ backgroundColor: ntf.seen == 0 ? "#F7F7F7" : "", fontWeight: ntf.seen == 0 ? "bold" : "normal" }} icon={ntf.seen == 0 ? <EyeInvisibleOutlined style={{ fontSize: 20 }} /> : <EyeOutlined style={{ fontSize: 20 }} />}>

              <a href={`/orders/details/${ntf.table_id}`} onClick={() => ChangeNotification(ntf.id)}>{ntf.title}-{ntf.description}</a>
            </Menu.Item>
          ))
        */}
        <Row justify="center">
          <Divider className="divider_link" />
          <Col > <Link to={`/@a-@n`}>Ver más</Link></Col>
        </Row>
      </Menu.ItemGroup>
    </Menu>
  );

  const userNotifications = (
    <Menu >
      <Menu.ItemGroup title="Notificaciones">
        {
          newUserNotifications.user.map((untf, index) => (
            <Menu.Item key={index} style={{ fontWeight: "bold" }} icon={<EyeInvisibleOutlined style={{ fontSize: 20 }} />}>
              <Link to={`/@s/`} >Tienes una nueva solicitud de {untf.name}-{untf.org}</Link>
            </Menu.Item>
          ))
        }
      </Menu.ItemGroup>
    </Menu>
  );

  const ChangeNotification = (id) => {
    NotificationService.ChangeStatus(id)
    .then(response => {
      // console.log(response);
    })
    .catch(error => {
      console.log(error)
    })
  }

  const handleNav = (route) => {
    history(route)
  }

  if (role == '') {
    return (
      <Row justify='center'>
        <Col xs={24} style={{ textAlign: 'center' }}>
          <Spin size="large" tip="Validando" />
        </Col>
      </Row>
    )
  } else {
    //if (role == 1 || role == 2 || role == 3 || role == 5 || role == 10) {
      return (
        <Layout style={{ minHeight: "100vh" }}>

          <Sider
            trigger={<SwapOutlined />}
            collapsible
            breakpoint="lg"
            collapsedWidth="0"
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" >
              {
                (role == 1 || role == 3) &&
                <SubMenu key="sub1" icon={<UsergroupAddOutlined />} title="Usuarios">
                  {/*
                    role == 1 &&
                    <Menu.Item key="1">
                      <Link to="/@s">Solicitudes</Link>
                    </Menu.Item>

                  */}
                  {
                    (role == 1 || role == 3) &&
                    <>
                      {/*
                      <Menu.Item key="2">
                        <Link to='/@u'>Lista de Usuarios</Link>
                      </Menu.Item>
                      <Menu.Item key="3">
                        <Link to='/@rev'>Reviews</Link>
                      </Menu.Item>
                      */}
                      <Menu.Item key="21" >

                        <Link to='/@a-@u'>Agregar</Link>
                      </Menu.Item>
                    </>
                  }
                </SubMenu>
              }
              {/*
                (role == 1 || role == 3 || role == 2) && (
                  <Menu.Item key="4" icon={<MoneyCollectOutlined />}>
                    <Link to='/@cns' >Consumo</Link>
                  </Menu.Item>
                )
              */}


              {/*
                (role == 1 || role == 5 || role == 2) && (
                  <Menu.Item key="5" icon={<MonitorOutlined />}>
                    <Link to='/@v'>Ventas</Link>
                  </Menu.Item>
                )
              */}

              <Menu.Item key="6" icon={<InboxOutlined />} onClick={() => handleNav('/orders/all/1')}>
                 Ordenes
              </Menu.Item>
              {
                (role == 1) && (
                  <>
                    {/*
                    <SubMenu key="sub2" icon={<OrderedListOutlined />} title="Num. de parte">

                      <Menu.Item key="10" >
                        <Link to="/@p-@p">Partno. pendientes</Link>
                      </Menu.Item>
                      <Menu.Item key="11" >
                        <Link to="/@e-@p">Mis numeros de parte</Link>
                      </Menu.Item>

                    </SubMenu>
                    */}
                    {/*
                    <Menu.Item key="8" icon={<PlusCircleOutlined />}>
                      <Link to="/@c-@a">Catalogo</Link>
                    </Menu.Item>
                    */}
                    {/* <Menu.Item key="8" onClick={() => setIsModalVisibleServicios(true)} icon={<PlusCircleOutlined />}>
                      Alta de servicios
                    </Menu.Item> */}
                  </>
                )
              }


              {/*
              <Menu.Item key="7" icon={<FileProtectOutlined />} >
                <Link to="/@q">Quejas</Link>
              </Menu.Item>
              <Menu.Item key="12" icon={<InboxOutlined />}>
                <a href={`/#/orders/all/0`}>Historial</a>
              </Menu.Item>
              */}
              {/* {
                (role == 1 || role == 2) && (
                  <SubMenu key="sub2" icon={<GlobalOutlined />} title="Mapas">
                    <Menu.Item key="8">
                      <Link to="/mapac">Clientes</Link>
                    </Menu.Item>
                    <Menu.Item key="9">
                      <Link to="/mapas">Proveedores</Link>
                    </Menu.Item>
  
                  </SubMenu>
                ) 
              } */}

            </Menu>
          </Sider>
          <Layout>
            <Header className="header" >

              <Row>
                {/* <Col sm={0} lg={1} >
                  {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: toggle,
                  })}
                </Col> */}
                <Col sm={6} md={23}>

                  <Menu mode="horizontal" className="site-layout-sub-header-background" >

                    <Menu.Item key="1">
                      <Link to={'/dashboard'}>Inicio</Link>
                    </Menu.Item>
                    {/* <Menu.Item key="2">
                      <Link to="/garantias">Garantias</Link>
                    </Menu.Item> */}
                    {
                      role == 1 && (

                        <Menu.Item key="3" >
                          {/* <Dropdown overlay={userNotifications} placement="bottomCenter" overflow='scroll' >
                            <Badge count={newUserNotifications.count} overflowCount={999} style={{ backgroundColor: '#ff4d4f' }}>
                              <Link to={`/@s/`}><UserAddOutlined /></Link>
                            </Badge>
                          </Dropdown> */}

                        </Menu.Item>
                      )
                    }
                    {/* <Menu.Item key="19" >
                      <a href={notifications.user_id !== '' && `/@p/${notifications.user_id}`} disabled={notifications.user_id == '' && true}>
                        <Avatar style={{ backgroundColor: '#40a9ff' }} icon={<UserOutlined />} />
                      </a>
                    </Menu.Item> */}
                    {/*
                    <Menu.Item key="20" >
                      <Dropdown overlay={allNotifications} placement="bottomCenter" >
                        <Badge count={notifications.total} overflowCount={999} style={{ backgroundColor: '#95de64' }}>
                          <NotificationTwoTone twoToneColor="#ff4d4f" />

                        </Badge>
                      </Dropdown>
                    </Menu.Item>
                    */}
                    <Menu.Item key="21" >
                      <Button onClick={() => logout()} type="text">
                        Salir
                      </Button>
                    </Menu.Item>
                  </Menu>
                </Col>

              </Row>

            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
              }}
            >
              
              {children}
            </Content>
            <Footer style={{ textAlign: 'center' }}>Copyright ©2020 Created by EP&O</Footer>
          </Layout>


          {/* Modal alta de servisios */}
          <Modal title="Dar de alta un nuevo servicio" visible={isModalVisibleServicios}
            onCancel={() => setIsModalVisibleServicios(false)}
            footer={[]}
          >
            <Form
              ref={formRef}
              form={form}
              onFinish={onFinishServicio}
            >
              <Form.Item
                label="Servicio"
                name="name"
                rules={[{ required: true, message: 'Es necesario que ingreses el servicio' }]}
              >
                <Input placeholder="Escriba el servicio que desea crear" name="name" />
              </Form.Item>
              <Row gutter={24} style={{ justifyContent: "flex-end" }}>
                <Col>
                  <Button onClick={() => setIsModalVisibleServicios(false)} >
                    Cancelar
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" htmlType="submit"
                    loading={load}
                  >
                    Agregar
                  </Button>
                </Col>
              </Row>
            </Form>

          </Modal>
        </Layout >
      );

    //} else {
      //return <Forbidden />
    //}
  }
}
