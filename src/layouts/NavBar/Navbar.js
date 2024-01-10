import { Layout, Menu, Image, Row, Col, Avatar } from 'antd';
import './Navbar.scss'
import { InstagramOutlined, YoutubeFilled, GlobalOutlined } from '@ant-design/icons'
import Logo from '../../images/logo.png'
const { Header, Content, Footer } = Layout;

export default function Navbar(props) {
    const { children } = props;

    return (
        <Layout className='layout' style={{ minHeight: '100vh' }}>
            <Header>
            {/* <img src={Logo} className='logo' width='90px' /> */}
                <Menu theme='light' mode='horizontal' defaultSelectedKeys={['3']}>
                    {/* <Menu.Item key='1'><Image
                        width={35}  
                        src={Logo}
                    /></Menu.Item> */}
                    <Menu.Item key='1'><a href='https://epno.com.mx/' >EP&O</a></Menu.Item>
                    <Menu.Item key='2'><a href='https://epno.com.mx/industria.php' >Industria</a> </Menu.Item>
                    <Menu.Item key='3'> <a href='https://epno.com.mx/proveedor.php'  >Proveeduría</a></Menu.Item>
                    <Menu.Item key='4'> <a href='https://epno.com.mx/contacto.php'  >Contactanos</a></Menu.Item>
                </Menu>
            </Header>
            <Content
                style={{
                    margin: '10px 10px',
                    backgroundSize: 'cover',
                    minHeight: 280,
                }}>

                <div className='site-layout-content'>{children}</div>
            </Content>
            <Footer style={{ textAlign: 'center', background: '#1b262c', color: '#bbbbbb', fontSize: '16px' }}>
                <Row gutter={24} style={{ textAlign: 'left' }}>
                    <Col xs={24} md={12} lg={8} style={{ textAlign: 'center' }}>
                        <a href='https://epno.com.mx/'>
                            <Image
                                preview={false}
                                width={200}
                                src={Logo}
                            />
                        </a>
                    </Col>
                    <Col xs={24} md={12} lg={4} style={{ marginTop: 25 }}>
                        <h5 style={{ color: '#fff' }}>Nosotros</h5>
                        <p>Brindamos a la industria herramientas digitales que facilitan la busqueda de proveedores confiables.</p>
                    </Col>
                    <Col xs={24} md={12} lg={4} style={{ marginTop: 25 }}>
                        <h5 style={{ color: '#fff' }}>Dirección</h5>
                        <p>Plaza Solid, EP&amp;O  <br />
                            Blvd. Municipio Libre #3529 <br />
                            Melchor Ocampo, 32280</p>
                    </Col>
                    <Col xs={24} md={12} lg={4} style={{ marginTop: 25 }}>
                        <h5 style={{ color: '#fff' }}>Contactanos</h5>
                        <a style={{ color: '#47b5ed' }} href='https://api.whatsapp.com/send/?phone=526567038586&text&app_absent=0' target='_blank'>(656) 689-91-49</a> <br />
                        <a style={{ color: '#47b5ed' }} href='mailto:contacto@epno.com.mx' target='_blank'>contacto@epno.com.mx</a>
                    </Col>
                    <Col xs={24} md={12} lg={4} style={{ marginTop: 25, justifyContent: 'space-between' }}>
                        <h5 style={{ color: '#fff' }}>Siguenos</h5>
                        <a href='https://www.instagram.com/epnomx/' target='_blank'>
                            <Avatar size={40} style={{ backgroundColor: '#fff', color: '#47b5ed' }} icon={<InstagramOutlined />} />

                        </a>
                        <a href='https://www.youtube.com/channel/UCfShkhZ2kb-NhR2LVUDtcRg' target='_blank'>
                            <Avatar size={40} style={{ backgroundColor: '#fff', color: '#47b5ed' }} icon={<YoutubeFilled />} />

                        </a>
                        <a href='https://epno.com.mx' target='_blank'>
                            <Avatar size={40} style={{ backgroundColor: '#fff', color: '#47b5ed' }} icon={<GlobalOutlined />} />

                        </a>

                    </Col>

                </Row>

            </Footer>
        </Layout>
    )
}