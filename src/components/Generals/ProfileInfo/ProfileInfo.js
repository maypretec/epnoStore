import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Card,
  Divider,
  Typography,
  Menu,
  Rate,
  Tag,
  Skeleton,
} from "antd";
import ClientInfo from "../ClientInfo";
import UserService from "../../../utils/api/users";

const { Title } = Typography;
const { Text } = Typography;

export default function ProfileInfo(props) {
  const {id } = props;

  const [profile, setProfile] = useState({});
  const [reload, setReload] = useState(false);

  // API informacion de perfil
  useEffect(() => {
    UserService.GetUserById({ id: id }).then((response) => { setProfile(response.data) }).catch(console.log);  
  }, []);

  const desc = ["Horrible", "Malo", "Normal", "Bueno", "Excelente"];

  const title = (name, role, cat1, cat2) => (
    <Row>
      {profile == {} ? (
        <Skeleton active paragraph={{ rows: 0 }} />
      ) : (
        <Col span={24}>
          <Title level={3} style={{ color: "white" }}>
            {name}{" "}
            <Tag color="blue">
              {role == 1 ? "Administrador"
              : role == 2 ? "Finanzas"
              : role == 3 ? "VS Manager"
              : role == 5 ? "Buyer"
              : role == 4 ? "Industria"
              : role == 6 ? "Proveedor"
              : "Estandar"}
            </Tag>
            {role == 6 && cat1 !== '' ? <Tag color="green">
              {
                cat1 === 1 ? 'Servicios'
                : cat1 === 2 ? 'Tecnologia'
                : cat1 === 3 ? 'Maquinado'
                : cat1 === 4 ? 'MRO'
                : cat1 === 5 ? 'MRP' : ""
              }
            </Tag> :<></>}
            {role == 6 && cat2 !== '' ? <Tag color="red">
              {
                cat2 === 1 ? 'Servicios'
                : cat2 === 2 ? 'Tecnologia'
                : cat2 === 3 ? 'Maquinado'
                : cat2 === 4 ? 'MRO'
                : cat2 === 5 ? 'MRP' : ""
              }
            </Tag> :<></>}
          </Title>
        </Col>
      )}
    </Row>
  );
  const extra = (rate) => (
    <Row>
      <Col span={24}>
        <Text style={{ color: "white" }}>{rate} - </Text>
        <Rate
          tooltips={desc}
          value={rate}
          allowClear={false}
          allowHalf
          disabled
        />
      </Col>
    </Row>
  );


  return (
    <Card
      extra={
        profile.role == 3 ||
        (profile.role == 5 && extra(profile.user_rate))
      }
      headStyle={{ background: "#001529" }}
      title= {profile.role == 6 ? title(profile.name, profile.role, profile.role_data.cat1, profile.role_data.cat2)
      : title(profile.name, profile.role)} 
    >
      <Divider orientation="left">Información</Divider>
      <Row gutter={32}>
        <ClientInfo reload={reload} setReload={setReload} profile={profile} />
      </Row>
    </Card>
  );
}
