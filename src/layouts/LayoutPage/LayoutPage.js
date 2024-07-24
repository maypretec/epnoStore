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


const { Header, Sider, Content, Footer } = Layout;
const { Search } = Input;
const { SubMenu } = Menu;
const { Meta } = Card;

export default function LayoutPage(props) {

  const { children } = props;
  const [products, setProducts] = useState({
    productos: [],
    total: 0,
    count: 0,
    user_id: ''
  });

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
  const stateNotificaciones = useSelector(state => state.notifications.stateNotificacionesTotal);

  useEffect(() => {
    //notificaciones
    NotificationService.GetNotification()
    .then((response) => {
      const test={
        notificaciones: [],
        total: 0,
        user_id: 0
      }
    })
    .then((data) => {
      setNotifications({
        notify: data.notificaciones,
        total: data.total,
        user_id: data.user,
      });
    }).catch(console.log)


  }, [stateNotificaciones])


  const logout = () => {
    history('/')
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  const allNotifications = (
    <Menu>
      <Menu.ItemGroup title="Notificaciones">
        {notifications.notify == '' ? (
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
        }
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
    <Link to={`/@m-@o`}> <Button className="btn btn-info" >Ver carrito <EyeOutlined /></Button> </Link>
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
              <Menu.Item key="16" icon={<UserOutlined />}>
                <Link to="/@c">Para mi</Link>
              </Menu.Item>
              <Menu.Item key="17" icon={<HeartOutlined />}>
                <Link to="/@m-@t">Mis cosas</Link>
              </Menu.Item>
              {/* <Menu.Item key="2" icon={<FileSearchOutlined />}> Historial</Menu.Item> */}
              <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Servicios">
                <Menu.Item key="14">
                  <Link to="/@c">MRO</Link>
                </Menu.Item>
                {/* <Menu.Item key="3">
                  <Link to="/solicitud-de-software">Software</Link>
                </Menu.Item> */}
                <Menu.Item key="21">
                  <Link to={`/@g-@s`}>General</Link>
                </Menu.Item>
                {/* <Menu.Item key="4">RH</Menu.Item>
                <Menu.Item key="5">Cafeteria</Menu.Item>
                <Menu.Item key="6">Sorteos</Menu.Item>
                <Menu.Item key="7">Transportistas</Menu.Item>
                <Menu.Item key="8">Maquinados</Menu.Item>
                <Menu.Item key="9">Aduanas</Menu.Item>
                <Menu.Item key="10">Capacitaciones</Menu.Item>
                <Menu.Item key="11">Metrologia</Menu.Item> */}
              </SubMenu>
              <Menu.Item key="12" onClick={() => prueba('/@f-@c')} icon={<FundOutlined />} >
                Finanzas
              </Menu.Item>
              <Menu.Item key="13" icon={<FileProtectOutlined />} >
                <Link to='/@q'>Quejas</Link>
              </Menu.Item>
              <Menu.Item onClick={() => prueba('/orders/all/0')} key="15" icon={<InboxOutlined />}>
                Historial
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout >
            <Header className="header" >

              <Row className="row">

                <Col sm={6} md={23}>

                  <Menu mode="horizontal" defaultSelectedKeys={['2']} className="site-layout-sub-header-background">

                    <Menu.Item key="18" >
                      <Badge count={products.count} onClick={showDrawer} overflowCount={999}>
                        <Avatar className="avatar" icon={<ShoppingCartOutlined />} />
                      </Badge></Menu.Item>
                    <Menu.Item key="19" >
                    <a href={notifications.user_id !== '' &&`/#/@p/${notifications.user_id}`} disabled={notifications.user_id == '' && true}>
                        <Avatar style={{ backgroundColor: '#40a9ff' }} icon={<UserOutlined />} />
                      </a>
                    </Menu.Item>
                    <Menu.Item key="20" >
                      <Dropdown overlay={allNotifications} placement="bottomCenter" overflow='scroll' >
                        <Badge count={notifications.total} overflowCount={999} style={{ backgroundColor: '#95de64' }}>
                          <NotificationTwoTone twoToneColor="#ff4d4f" />

                        </Badge>
                      </Dropdown>
                    </Menu.Item>
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



