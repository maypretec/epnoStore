import React, { useState, useEffect } from 'react';
// import '../../../../node_modules/antd/dist/antd.css';
import "./SupplierLayout.scss";
import { notification, Layout, Menu, Row, Col, Input, Avatar, Badge, Button, Dropdown, Spin, Empty, Divider } from 'antd';
import { BellOutlined } from '@ant-design/icons';
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
import { setupNotifications } from '../../utils/services/firebase';
import useVisibilityChange from '../../utils/hooks/useVisibilityChange';
import { sendNativeNotification, toastNotification } from '../../actions/notificationHelpers';

const { Header, Sider, Content, Footer } = Layout;
const { Search } = Input;
const { SubMenu } = Menu;



export default function LayoutPage(props) {

  const { children } = props;

  const [visible, setVisible] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'))
  let token = localStorage.getItem('token');
  let role = localStorage.getItem('role');
  let history = useNavigate();
  const [isNotificationEnabled, setNotificationEnabled] = useState(Notification.permission === 'granted');

  const [notifications, setNotifications] = useState({
    notify: [],
    total: 0,
    user_id: ''
  });
  // const [notificationTotal, setNotificationTotal] = useState();

  const isForeground = useVisibilityChange();

  useEffect(() => {
    NotificationService.GetNotifications(user.id).then(resp => {
      console.log(resp.data)
      setNotifications({
        notify: resp.data || [],
        total: resp.data.length || 0,
        user_id: user.id
      })
    })
    // Setup notifications and define how to handle foreground notifications
    setupNotifications((message) => {
      // Check if app is in the foreground or background
      if (isForeground) {
        // Foreground: Use the toast notification
        toastNotification({
          title: message.data.title || 'Notification', // Ensure title is accessible from message.data
          description: message.data.body || 'You have a new notification', // Ensure body is accessible
          status: "info",
        });
      } else {
        // Background: Use native notification
        sendNativeNotification({
          title: message.data.title || 'Notification', // Ensure title is accessible from message.data
          body: message.data.body || 'You have a new notification',
        });
      }
    });
  }, [isForeground]);

  const handleEnableNotifications = () => {
    
    if (Notification.permission === 'denied') {
      notification.error({
        message: 'Notificaciones bloqueadas',
        description: 'Las notificaciones se encuentran bloquedas. Porfavor, habilitalas en las configuraciones del navegador.',
        placement: 'topRight',
      });
      return;
    }

    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        setNotificationEnabled(true);
        notification.success({
          message: 'Notificaciones habilitadas',
          description: 'Las notificaciones han sido habilitadas exitosamente.',
          placement: 'topRight',
        });
      }
    });
  };

  const logout = () => {
    history('/')
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('fcm');
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
        {notifications.total == 0 ? (
          <Empty description="Sin notificaciones" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) :
          notifications.notify.map((ntf) => (
            <Menu.Item key={ntf.id} style={{ backgroundColor: ntf.seen == 0 ? "#F7F7F7" : "", fontWeight: ntf.seen == 0 ? "bold" : "normal" }} icon={ntf.seen == 0 ? <EyeInvisibleOutlined style={{ fontSize: 20 }} /> : <EyeOutlined style={{ fontSize: 20 }} />}>

              <a  onClick={() => {}}>{ntf.title}-{ntf.description}</a>
            </Menu.Item>
          ))
        }
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
            <Menu.Item key="1" icon={<InboxOutlined />}><Link to='/orders/all/1'>Ordenes</Link> </Menu.Item>
            {/* 136 en prod */}
            {/* { id == 139 && ( */}
            {/*
              <Menu.Item key="2" icon={<UnorderedListOutlined />}><Link to="/@p">Números de parte</Link> </Menu.Item>
            */}
            {/* ) 
                } */}
            {/*
            <Menu.Item key="12" icon={<FundOutlined />}> <Link to='/@f-@s'>Finanzas</Link></Menu.Item>
            <Menu.Item key="13" icon={<FileProtectOutlined />} > <Link to='/@q'>Quejas</Link></Menu.Item>
            <Menu.Item key="14" icon={<FileProtectOutlined />}><Link to='/orders/all/0'>Historial</Link></Menu.Item>
            */}
          </Menu>
        </Sider>
        <Layout >
          <Header className="header" >
            <Row>
              <Col sm={6} md={24}>
                <Menu className="site-layout-sub-header-background" mode="horizontal" defaultSelectedKeys={['2']}>
                  <Menu.Item key="18" >
                  <a href={user.id !== ''?(`/#/@p/${user.id}`):(null)} disabled={user.id == '' && true}>
                        <Avatar style={{ backgroundColor: '#40a9ff' }} icon={<UserOutlined />} />
                      </a>
                  </Menu.Item>
                  {
                  <Menu.Item key="19" >
                  <Dropdown overlay={allNotifications} placement="bottomCenter" overflow='scroll' >
                    <Badge count={notifications.total} overflowCount={999} style={{ backgroundColor: '#95de64' }}>
                      <NotificationTwoTone twoToneColor="#ff4d4f" />

                    </Badge>
                  </Dropdown>
                </Menu.Item>
                  }
                  <Menu.Item key="20">
                    <Button
                      onClick={handleEnableNotifications}
                      type="text"
                      icon={<BellOutlined style={{ color: !isNotificationEnabled ? 'red' : 'green' }} />}
                    />
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
