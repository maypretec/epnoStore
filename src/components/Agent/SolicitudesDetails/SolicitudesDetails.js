import React, { useState, useEffect } from 'react';
import { Result, Drawer, Divider, Button, Col, Row } from 'antd';
import { SafetyCertificateOutlined, ProfileOutlined } from '@ant-design/icons';
import {useDispatch,useSelector} from 'react-redux';
import {newUserAction} from '../../../actions/notificationActions';
import UserService from '../../../utils/api/users'

export default function SolicitudesDetails(props) {
    const [state, setState] = useState({ visible: false });
    const { solicitud, respuesta, setRespuesta } = props;
    const showDrawer = () => {
        setState({
            visible: true,
        });


    };
    const dispatch = useDispatch();

    const newUsers=state=>{
      dispatch(newUserAction(state));
    }
    const stateNotifications = useSelector(state => state.notifications.stateUserNotifications);
  
    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );
    const onClose = () => {
        setState({
            visible: false,
        });
        setRespuesta(!respuesta);
        newUsers(!stateNotifications);
    };
    const ResponseReq = (user_id,role, res,email) => {
        UserService.NewUserRequest({
            user:       user_id,
            role:       role,
            response:   res,
            email:      email
        })
        .then(response => {
                onClose();
            })
            .catch(error => {
                console.log(error)
            })
    }
  
    return (
        <>

            <Result
                status="success"
                icon={<ProfileOutlined />}

                title="¡Tienes una nueva solicitud!"
                subTitle={(<p>Nombre: {solicitud.user}, Organización: {solicitud.name}, {solicitud.email}</p>)}
                extra={[
                    <Button type="primary" key="console" onClick={showDrawer}>
                        Ver Detalles
                    </Button>

                ]}
            />




            <Drawer
                width={800}
                placement="right"
                closable={true}
                onClose={onClose}
                visible={state.visible}
            >
                <h5 className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
                    Organización
      </h5>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Nombre de la organización</b>)} content={solicitud.name} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={(<b>RFC</b>)} content={solicitud.rfc} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Pais</b>)} content={solicitud.Pais} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Estado</b>)} content={solicitud.Estado} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Ciudad</b>)} content={solicitud.Ciudad} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Codigo Postal</b>)} content={solicitud.Codigo_postal} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Colonia</b>)} content={solicitud.Colonia} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Calle</b>)} content={solicitud.street} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Num.Exterior</b>)} content={solicitud.external_number} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Num. Interior</b>)} content={solicitud.internal_number} />
                    </Col>
                </Row>
                <Divider />
                <h5 className="site-description-item-profile-p">Registro de planta</h5>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Nombre de la planta</b>)} content={solicitud.loc_name} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Tipo</b>)} content={solicitud.type} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Pais</b>)} content={solicitud.loc_Pais} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Estado</b>)} content={solicitud.loc_Estado} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Ciudad</b>)} content={solicitud.loc_Ciudad} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Codigo Postal</b>)} content={solicitud.loc_Codigo_postal} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Colonia</b>)} content={solicitud.loc_Colonia} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Calle</b>)} content={solicitud.loc_street} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Num. Exterior</b>)} content={solicitud.loc_external_number} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Num. Interior</b>)} content={solicitud.loc_internal_number} />
                    </Col>
                </Row>

                <Divider />
                <h5 className="site-description-item-profile-p">Contacto</h5>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Correo</b>)} content={solicitud.email} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title={(<b>Numero de telefono</b>)} content={solicitud.phone} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem
                            title={(<b>Pagina web:</b>)}
                            content={
                                <a
                                href={`//${solicitud.url}`}
                                target='_blank'                           
                                >
                                 {solicitud.url}
                                </a>
                            }
                        />
                    </Col>
                </Row>
                <Row style={{marginTop:15}}>
                    <Col span={12}>
                        <Button type="primary" onClick={() => ResponseReq(solicitud.user_id,solicitud.role_id, 1,solicitud.email)}>Aceptar</Button>
                    </Col>
                    <Col span={12}>
                        <Button type="primary" danger onClick={() => ResponseReq(solicitud.user_id,solicitud.role_id, 0,solicitud.email)}>Rechazar</Button>
                    </Col>
                </Row>
            </Drawer>
        </>
    )
}
