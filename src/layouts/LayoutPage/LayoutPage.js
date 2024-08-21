import React, { useState, useEffect, useReducer } from 'react';
import "./Layout.scss";
import { Layout, Menu, Row, Col, Input, Card, Avatar, Button, Badge, Dropdown, Spin, Divider, Empty } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AppstoreOutlined,
  InboxOutlined,
  FundOutlined,
  FileSearchOutlined,
  FileProtectOutlined,
  UserOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  NotificationTwoTone,
  EyeInvisibleOutlined,
  HeartOutlined,
  SwapOutlined

} from '@ant-design/icons';
import Drawer from "../../components/Drawer";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Forbidden from "../../components/Forbidden";
import NotificationService from '../../utils/api/notifications';
import ProductService from '../../utils/api/products';
import { setupNotifications } from '../../utils/services/firebase';
import useVisibilityChange from '../../utils/hooks/useVisibilityChange';
import { sendNativeNotification, toastNotification } from '../../actions/notificationHelpers';


const { Header, Sider, Content, Footer } = Layout;
const { Search } = Input;
const { SubMenu } = Menu;
const { Meta } = Card;

export default function LayoutPage(props) {

  const { children } = props;
  const user = JSON.parse(localStorage.getItem('user'))
  const [products, setProducts] = useState({
    productos: [],
    total: 0,
    count: 0,
    user_id: ''
  });

  const [isNotificationEnabled, setNotificationEnabled] = useState(Notification.permission === 'granted');
  const [notifications, setNotifications] = useState({
    notify: [],
    total: 0,
  });
  let history = useNavigate();
  const [visible, setVisible] = useState(false);
  let role = localStorage.getItem('role');

  let token = localStorage.getItem('token');
  const showDrawer = () => {
    setVisible(true);
  };

  const isForeground = useVisibilityChange();

  useEffect(() => {
    // Setup notifications and define how to handle foreground notifications
    console.log('aaaaaaaaaaaa')
    setupNotifications((message) => {
      // Check if app is in the foreground or background
      if (isForeground) {
        // Foreground: Use the toast notification
        toastNotification({
          title: message.data.title || 'Notification', // Ensure title is accessible from message.data
          description: message.data.body || 'You have a new notification', // Ensure body is accessible
          status: "info",
        });
        console.log('Foreground notification:', message);
      } else {
        // Background: Use native notification
        sendNativeNotification({
          title: message.data.title || 'Notification', // Ensure title is accessible from message.data
          body: message.data.body || 'You have a new notification',
        });
        console.log('Background notification:', message);
      }
    });
  }, [isForeground]);

  const handleEnableNotifications = () => {
    console.log('click')
    if (Notification.permission === 'denied') {
      alert('You have blocked notifications. Please enable them from your browser settings.');
      return;
    }
    
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        setNotificationEnabled(true);
        console.log('Notifications enabled');
      }
    });
  };


  const logout = () => {
    history('/')
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  const allNotifications = (
    <Menu>
      <Menu.ItemGroup title="Notificaciones">
        {/*notifications.notify == '' ? (
          <Empty description="Sin notificaciones" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) :notifications.notify.map((ntf) => (
            <Menu.Item key={ntf.id} style={
              { 
                backgroundColor: ntf.seen == 0 ? "#F7F7F7" : "", fontWeight: ntf.seen == 0 ? "bold" : "normal" 
              }
            } 
            icon={
              ntf.seen == 0 ? <EyeInvisibleOutlined style={
                { fontSize: 20 }} /> : <EyeOutlined style={{ fontSize: 20 }} />
              }
            >
              <a href={`/#/orders/details/${ntf.table_id}`} onClick={() => ChangeNotification(ntf.id)}>{ntf.title}-{ntf.description}</a>
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

  const stateProducts = useSelector(state => state.products.stateShowProducts);

  useEffect(() => {
    console.log(role)
    //productos
    ProductService.GetProducts()
    .then((response) => {
      const test={
        products:[],
        total: 0,
        count: 0,
      }
      return (test);
    })
    .then((data) => {
      setProducts({
        productos: data.products,
        total: data.total,
        count: data.count
      })
      // console.log(products);
    }).catch(console.log)


  }, [stateProducts]);

  const ChangeNotification = (id) => {
    NotificationService.ChangeStatus(id)
    .then(response => {
      // console.log(response);
    })
    .catch(error => {
      console.log(error)
    })
  }

  const prueba = (route) => {
    history(route)
  }

  const footerContent = <div className="footer_cart">
    <div>
      <p>Subtotal:</p>
      {

        <p >${products.total}  </p>


      }
    </div>
    {/*
    <Link to={`/@m-@o`}> <Button className="btn btn-info" >Ver carrito <EyeOutlined /></Button> </Link>
    */}
  </div>;
  if (role == '') {
    return (
      <Row justify='center'>
        <Col xs={24} style={{ textAlign: 'center' }}>
          <Spin size="large" tip="Validando" />
        </Col>
      </Row>
    )
  } else {
      return (

        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            trigger={<SwapOutlined />}
            collapsible
            breakpoint="lg"
            collapsedWidth="0"
          >
            {/* <div className="logo" /> */}
            <Menu theme="dark" mode="inline"  >
              <Menu.Item key="1" icon={<InboxOutlined />} onClick={() => prueba('/orders/all/1')}>
                Ordenes{/*<a href={`/orders/all/1`}> Ordenes</a>*/}
              </Menu.Item>
              {/*
              <Menu.Item key="16" icon={<UserOutlined />}>
                <Link to="/@c">Para mi</Link>
              </Menu.Item>
              */}
              {/*
              <Menu.Item key="17" icon={<HeartOutlined />}>
                <Link to="/@m-@t">Mis cosas</Link>
              </Menu.Item>
              */}
              {/* <Menu.Item key="2" icon={<FileSearchOutlined />}> Historial</Menu.Item> */}
                {/*
                <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Servicios">
                */}
                {/*
                <Menu.Item key="14">
                  <Link to="/@c">MRO</Link>
                </Menu.Item>
                  */}
                {/* <Menu.Item key="3">
                  <Link to="/solicitud-de-software">Software</Link>
                </Menu.Item> */}
                {/*
                <Menu.Item key="21">
                  <Link to={`/@g-@s`}>General</Link>
                </Menu.Item>
                */}
                {/* <Menu.Item key="4">RH</Menu.Item>
                <Menu.Item key="5">Cafeteria</Menu.Item>
                <Menu.Item key="6">Sorteos</Menu.Item>
                <Menu.Item key="7">Transportistas</Menu.Item>
                <Menu.Item key="8">Maquinados</Menu.Item>
                <Menu.Item key="9">Aduanas</Menu.Item>
                <Menu.Item key="10">Capacitaciones</Menu.Item>
                <Menu.Item key="11">Metrologia</Menu.Item> */}
              {/*</SubMenu>*/}
              {/*
              <Menu.Item key="12" onClick={() => prueba('/@f-@c')} icon={<FundOutlined />} >
                Finanzas
              </Menu.Item>
              */}
              {/*<Menu.Item key="13" icon={<FileProtectOutlined />} >
                <Link to='/@q'>Quejas</Link>
              </Menu.Item>*/}
              {/*
              <Menu.Item onClick={() => prueba('/orders/all/0')} key="15" icon={<InboxOutlined />}>
                Historial
              </Menu.Item>
              */}
            </Menu>
          </Sider>
          <Layout >
            <Header className="header" >

              <Row className="row">

                <Col sm={6} md={23}>

                  <Menu mode="horizontal" defaultSelectedKeys={['2']} className="site-layout-sub-header-background">
                    <a href={user.id !== '' &&`/#/@p/${user.id}`} disabled={user.id == '' && true}>
                      <Avatar style={{ backgroundColor: '#40a9ff' }} icon={<UserOutlined />} />
                    </a>
                    {/*      
                    <Menu.Item key="18" >
                      <Badge count={products.count} onClick={showDrawer} overflowCount={999}>
                        <Avatar className="avatar" icon={<ShoppingCartOutlined />} />
                      </Badge></Menu.Item>
                    <Menu.Item key="19" >
                    
                    </Menu.Item>
                    <Menu.Item key="20" >
                      <Dropdown overlay={allNotifications} placement="bottomCenter" overflow='scroll' >
                        <Badge count={notifications.total} overflowCount={999} style={{ backgroundColor: '#95de64' }}>
                          <NotificationTwoTone twoToneColor="#ff4d4f" />

                        </Badge>
                      </Dropdown>
                    </Menu.Item>
                    */}
                    <Button
                      type="primary"
                      onClick={handleEnableNotifications}
                      style={{ backgroundColor: isNotificationEnabled ? '#52c41a' : '#1890ff' }}
                    >
                      {isNotificationEnabled ? 'Notificaciones habilitadas' : 'Habilitar notificaciones'}
                    </Button>
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
          <Drawer

            title={"Mi carrito"} footerContent={footerContent} visible={visible} setVisible={setVisible}

          >
            {
              products.productos.map((prod, index) => (
                <Col
                  key={index}
                >
                  <Card
                    key={index}
                    actions={[
                      <label >Precio(C/U): ${prod.part_cost}</label>,
                      <label >Cant: {prod.qty}</label>
                    ]}
                  >
                    <Meta
                      key={index}
                      avatar={<Avatar src={`https://api.epno-app.com${prod.image}`} />}
                      title={prod.name}
                      description={`Part.No: ${prod.part_no}`}
                    />
                  </Card>
                </Col>
              ))
            }


          </Drawer>
        </Layout>

      );
    }
  }



