import React, { useState, useEffect } from 'react';
// import '../../../../node_modules/antd/dist/antd.css';
import "./SupplierLayout.scss";
import { Layout, Menu, Row, Col, Input, Avatar, Badge, Button, Dropdown, Spin, Empty, Divider } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UnorderedListOutlined,
  InboxOutlined,
  FundOutlined,
  FileProtectOutlined,
  UserOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  NotificationTwoTone,
  SwapOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Forbidden from "../../components/Forbidden"
import { useSelector } from 'react-redux';
import NotificationService from '../../utils/api/notifications';

const { Header, Sider, Content, Footer } = Layout;
const { Search } = Input;
const { SubMenu } = Menu;



export default function LayoutPage(props) {

  const { children } = props;

  const [visible, setVisible] = useState(false);


  let token = localStorage.getItem('token');
  let role = localStorage.getItem('role');
  let history = useNavigate();
  const [notifications, setNotifications] = useState({
    notify: [],
    total: 0,
    user_id: ''
  });
  // const [notificationTotal, setNotificationTotal] = useState();
  const stateNotificaciones = useSelector(state => state.notifications.stateNotificacionesTotal);

  useEffect(() => {
    //notificaciones
    NotificationService.GetNotification()
    .then((response) => {
      return response.json()

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

  const ChangeNotification = (id) => {
    NotificationService.ChangeStatus(id)
    .then(response => {
      // console.log(response);
    })
    .catch(error => {
      console.log(error)
    })
  }

  const allNotifications = (
    <Menu >
      <Menu.ItemGroup title="Notificaciones">
        {notifications.notify == '' ? (
          <Empty description="Sin notificaciones" image={Empty.PRESENTED_IMAGE_SIMPLE} />

        ) :
          notifications.notify.map((ntf) => (
            <Menu.Item key={ntf.id} style={{ backgroundColor: ntf.seen == 0 ? "#F7F7F7" : "", fontWeight: ntf.seen == 0 ? "bold" : "normal" }} icon={ntf.seen == 0 ? <EyeInvisibleOutlined style={{ fontSize: 20 }} /> : <EyeOutlined style={{ fontSize: 20 }} />}>

              <a href={`/orders/details/${ntf.table_id}`} onClick={() => ChangeNotification(ntf.id)}>{ntf.title}-{ntf.description}</a>
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
  // if (role == '') {
  //   return (
  //     <Row justify='center'>
  //       <Col xs={24} style={{textAlign:'center'}}>
  //         <Spin size="large" tip="Validando"  />
  //       </Col>
  //     </Row>
  //   )
  // } else {
  if (role == 6) {
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
            <Menu.Item key="1" icon={<InboxOutlined />}>   <a href={`/orders/all/1`}> Ordenes</a></Menu.Item>
            {/* 136 en prod */}
            {/* { id == 139 && ( */}
            <Menu.Item key="2" icon={<UnorderedListOutlined />}><Link to="/@p">Números de parte</Link> </Menu.Item>
            {/* ) 
                } */}
            <Menu.Item key="12" icon={<FundOutlined />}> <Link to='/@f-@s'>Finanzas</Link></Menu.Item>
            <Menu.Item key="13" icon={<FileProtectOutlined />} > <Link to='/@q'>Quejas</Link></Menu.Item>
            <Menu.Item key="14" icon={<FileProtectOutlined />}> <a href={`/orders/all/0`}>Historial</a></Menu.Item>
          </Menu>
        </Sider>
        <Layout >
          <Header className="header" >
            <Row>
              <Col sm={6} md={24}>
                <Menu className="site-layout-sub-header-background" mode="horizontal" defaultSelectedKeys={['2']}>
                  <Menu.Item key="19" >
                  <a href={notifications.user_id !== ''?(`/@p/${notifications.user_id}`):(null)} disabled={notifications.user_id == '' && true}>
                        <Avatar style={{ backgroundColor: '#40a9ff' }} icon={<UserOutlined />} />
                      </a>
                  </Menu.Item>
                  <Menu.Item key="20" >
                    <Dropdown menu={allNotifications} placement="bottom" overflow='scroll' >
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

      </Layout>
    );
  } else {
    return <Forbidden />
  }
  // }



}
