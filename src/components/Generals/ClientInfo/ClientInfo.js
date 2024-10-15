import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Input,
  Typography,
  Rate,
  Modal,
  Avatar,
  Skeleton,
  Upload,
  message,
  Tooltip,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import UserService from "../../../utils/api/users";

const { Title } = Typography;
const { Text } = Typography;

export default function ClientInfo(props) {
  const { reload, setReload, profile, role } = props;
  const desc = ["Horrible", "Malo", "Normal", "Bueno", "Excelente"];

  const [form] = Form.useForm();

  const [editProfile, setEditProfile] = useState(false)
  const [editImg, setEditImg] = useState(false)
  const [loading, setLoading] = useState(false)

  const [logo, setLogo] = useState()

  const propsLogo = {
    beforeUpload: (file) => {
      const isPNG = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';
      if (!isPNG) {
        message.error(`${file.name} is not a png file`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
      setLogo(info.fileList)
    },
  };

  const changeProfile = () => {
    console.log(logo[0].thumbUrl)

    UserService.ChangeLogo({
      logo: logo[0].thumbUrl,
      userId: profile.id
    }).then(resp => {
      console.log(resp)
      window.location.reload();
    }).catch(error => {
      console.log('Error en los datos: ' + error)
    })
    /*let base64Logo = logo.fileList[0].thumbUrl

    if (base64Logo.startsWith('data:image')) {
      base64Logo = base64Logo.split(',')[1];
    }*/
  }

  console.log(profile)

  return (
    <>
      {profile == "" ? (
        <Skeleton active avatar />
      ) : (
        <Row gutter={[12, 12]}>
          <Col xs={24} md={8}>
            <Row gutter={[12, 12]}>
              <Col xs={0} sm={24} style={{ alignItems: "center" }}>
                <Avatar
                  src={profile.logo}
                  size={300}
                  shape="square"
                />
              </Col>
              <Col sm={24} style={{ display: "flex", flexDirection:'row', alignItems: "center" }}>
                <Upload name="logo" maxCount={1} {...propsLogo} beforeUpload={() => false} listType="picture-card"
                >
                  <div> <PlusOutlined /> <div style={{ marginTop: 8 }}>Nueva foto de perfil</div> </div>
                </Upload>
              </Col>
              <Col sm={24} style={{ display: "flex", flexDirection:'row', alignItems: "center" }}>
                <Button disabled={!logo} onClick={changeProfile}>Subir foto de perfil</Button>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={16}>
          {!editProfile ? 
            <Row gutter={[12, 12]}>
              <Col xs={24} md={10}>
              
                <Text>
                  Tel:<Title level={4}>{profile.phone}</Title>
                </Text>
              </Col>
              <Col xs={24} md={14}>
                <Text>
                  Email:<Title level={4}>{profile.email}</Title>
                </Text>
              </Col>
              <Col xs={24} md={10}>
                <Text>
                  Org Name:<Title level={4}>{profile.bussiness}</Title>
                </Text>
              </Col>
              <Col xs={24} md={14}>
                <Text>
                  RFC:<Title level={4}>{profile.rfc}</Title>
                </Text>
              </Col>
              <Col span={24}>
                <Text>
                  Address:
                  <Title
                    level={4}
                  >{`${profile.colony} ${profile.postal_code},${profile.city},${profile.state}, ${profile.country}`}</Title>
                </Text>
              </Col>
              {/* 
                <Col xs={24} md={10}>
                <Text>
                  Total :<Title level={3}>12,654</Title>
                </Text>
              </Col>
              */}
              
              <Col xs={24} md={14}>
                {(profile.role_id == 1 ||
                  profile.role_id == 2 ||
                  profile.role_id == 3 ||
                  profile.role_id == 5) && (
                  <Text>
                    Org rate:
                    <Title level={3}>
                      <Rate
                        tooltips={desc}
                        value={profile.org_rate}
                        allowClear={false}
                        allowHalf
                        disabled
                      />
                    </Title>
                  </Text>
                )}
              </Col>
            </Row>
          :
          <Form name='update_profile' className='profile-form' form={form} layout="vertical">
            <Row gutter={[12, 12]}>
              <Col xs={24}>
                <Form.Item name='name' label='Nombre completo'>
                  <Input  placeholder={profile.name} value={profile.name}  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='phone' label='Número telefónico'>
                  <Input  placeholder={profile.phone} value={profile.phone}  />
                </Form.Item>
              </Col>

              {/* UBICACION ---------------------------------------- */}
              <Col xs={24} md={4}>
                <Form.Item name='country' label='País'>
                  <Input  placeholder={profile.country} value={profile.country}  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item name='state' label='Estado'>
                  <Input  placeholder={profile.state} value={profile.state}  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='city' label='Ciudad'>
                  <Input  placeholder={profile.city} value={profile.city}  />
                </Form.Item>
              </Col>

              {/* DIRECCION */}
              <Col xs={24} md={8}>
                <Form.Item name='city' label='Ciudad'>
                  <Input  placeholder={profile.city} value={profile.city}  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='city' label='Ciudad'>
                  <Input  placeholder={profile.city} value={profile.city}  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='city' label='Ciudad'>
                  <Input  placeholder={profile.city} value={profile.city}  />
                </Form.Item>
              </Col>
              <Col span={24}>
              <Form.Item shouldUpdate={true}>
                {() => (
                  <Button
                    style={{ width: '100%' }}
                    type='primary'
                    htmlType='submit'
                    className='login-form-button'
                    loading={loading}
                  >
                    Guardar cambios
                  </Button>
                )}
              </Form.Item>
              </Col>
            </Row>
              
              

            </Form>
          }
            
          </Col>
          {/* 
          <Col xs={24} md={12}>
            <Row gutter={[12, 12]}>
              <div>
                <Button onClick={() => setEditProfile(!editProfile)}>Editar Perfil</Button>
              </div>
            </Row>
          </Col>
          */}
          
        </Row>
        
      )}
    </>
  );
}
