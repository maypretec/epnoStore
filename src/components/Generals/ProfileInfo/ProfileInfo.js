import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Table,
  Card,
  Button,
  Switch,
  Form,
  Input,
  Divider,
  Typography,
  Dropdown,
  Menu,
  Rate,
  Tag,
  Select,
  Tooltip,
  InputNumber,
  Skeleton,
} from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import ClientInfo from "../ClientInfo";
import LocationService from "../../../utils/api/locations";
import { lowerFirst } from "lodash";
import ProfileService from "../../../utils/api/profile";
import RegisterService from "../../../utils/api/register";
import UserService from "../../../utils/api/users";

const { Title } = Typography;
const { Text } = Typography;
const { Option } = Select;
const { SubMenu } = Menu;

export default function ProfileInfo(props) {
  // const [newLocation, setNewLocation] = useState(false)
  const [form] = Form.useForm();
  const { locations, id } = props;

  const [profile, setProfile] = useState({});
  const [reload, setReload] = useState(false);
  let token = localStorage.getItem("token");
  const [load, setLoad] = useState({
    loadings: [],
  });

  // API informacion de perfil
  useEffect(() => {
    UserService.GetUserById({ id: id })
    .then((response) => {
      console.log(response.data)
      return response.data;
    })
    .then((user) => {
      console.log(user)
      setProfile(user);
    })
    .catch(console.log);
    
  }, [reload]);

  const [show, setShow] = useState(false);

  // Envio de datos a la API
  const onFinish = (index) => (values) => {
    setLoad(({ loadings }) => {
      const newLoadings = [...loadings];
      newLoadings[index] = true;

      return {
        loadings: newLoadings,
      };
    });

    const params = new FormData();
    // params.append('img', formImage.image);

    LocationService.CreateLocation(values)
      .then((response) => {
        setTimeout(() => {
          setShow(true);
          setReload(!reload);
          setLoad(({ loadings }) => {
            const newLoadings = [...loadings];
            newLoadings[index] = false;

            return {
              loadings: newLoadings,
            };
          });
        });
        form.resetFields();
      })
      .catch((error) => {
        console.log(error.response.data.errors);
        setTimeout(() => {
          setLoad(({ loadings }) => {
            const newLoadings = [...loadings];
            newLoadings[index] = false;

            return {
              loadings: newLoadings,
            };
          });
        }, 1000);
      });
  };

  const recargar = () => {
    window.location.reload(true);
  };

  const desc = ["Horrible", "Malo", "Normal", "Bueno", "Excelente"];

  const menu = (
    <Menu>
      <Menu.Item>test1</Menu.Item>
      <Menu.Item>test2</Menu.Item>
    </Menu>
  );
  const title = (name, role) => (
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
              : (role == 4 || role == 6 || role == 9) && "Estandar"}
            </Tag>
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
  function filter(inputValue, path) {
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  }
  const data = [];
  {
    locations.map((loc) => {
      data.push({
        key: loc.id,
        name: loc.name,
        address:
          loc.colonie +
          " " +
          loc.CP +
          ", " +
          loc.city +
          ", " +
          loc.state +
          ", " +
          loc.country,
      });
    });
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "60%",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render: (text, location) => (
        <Dropdown overlay={menu} key={location.key}>
          <a className="ant-dropdown-link">
            <MoreOutlined />
          </a>
        </Dropdown>
      ),
    },
  ];
  // const inputCompanion = (labelNo, tooltiplabel) => {
  //     return ({
  //         placeholder: Lang("AddPart", labelNo),
  //         suffix: tooltipIcon(tooltiplabel)
  //     });
  // };
  // console.log(profile.info[0].name);

  return (
    <Card
      extra={
        profile.role_id == 3 ||
        (profile.role_id == 5 && extra(profile.user_rate))
      }
      headStyle={{ background: "#001529" }}
      title={title(profile.name, profile.role_id)}
    >
      <Divider orientation="left">Información</Divider>
      <Row gutter={32}>
        <ClientInfo reload={reload} setReload={setReload} profile={profile} />
      </Row>
      {/* <Divider orientation="left">Locaciones</Divider>
            <Row gutter={32}>
                <Col xs={24} md={14}>
                    <Table columns={columns} dataSource={data} />
                </Col>
                <Col xs={24} md={10}>
                    <Card title={<Row>
                        <Col span={24}>
                            <Text style={{ color: "white" }}>Nueva locación</Text>
                        </Col>
                    </Row>}
                        headStyle={{ backgroundColor: "#1890ff" }} extra={<Tooltip title="Agregar">
                             <Button onClick={() =>onFinish()} shape="circle" icon={<PlusOutlined />}></Button> 
                        </Tooltip>}>
                        <Row>
                            <Col span={24}>
                                <Form
                                    layout="vertical"
                                    form={form}
                                    scrollToFirstError
                                    name="newLocation"
                                    size="middle"
                                    onFinish={onFinish(0)}
                                // reload={reload}
                                >
                                    <Form.Item
                                        name="nombre"
                                        label="Nombre"

                                        rules={[{ required: true, type: "string", message: "Ingrese el nombre de la locación" }]}>
                                        <Input value={formValue.nombre} placeholder="El nombre de la locación" />
                                    </Form.Item>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="pais"
                                                label="País"
                                                rules={[{ required: true, message: "Seleccione el país" }]}>
                                                <Select
                                                    onChange={onFormChangePais}

                                                    placeholder="Seleccione pais"
                                                >
                                                    {
                                                        country.countries.map((ct, index) =>
                                                            <Option key={index} value={ct.id}>{ct.name}</Option>
                                                        )
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="estado"
                                                label="Estado"
                                                rules={[{ required: true, message: "Seleccione el estado" }]}>
                                                <Select disabled={disabled.stateOrg}
                                                    onChange={onFormChangeState} defaultValue="Seleccione el estado">
                                                    {
                                                        state.states.map((st, index) =>
                                                            <Option key={index} value={st.id}>{st.name} required</Option>
                                                        )
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="ciudad"
                                                label="Ciudad"
                                                rules={[{ required: true, message: "Seleccione la ciudad" }]}>
                                                <Select disabled={disabled.cityOrg} onChange={onFormChangeCity} defaultValue="Seleccione la ciudad">
                                                    {
                                                        city.cities.map((cty, index) =>
                                                            <Option key={index} value={cty.id}>{cty.name}</Option>
                                                        )
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="codigo_postal"
                                                label="Codigo postal"
                                                rules={[{ required: true, message: "Seleccione el codigo postal" }]}>
                                                <Select disabled={disabled.pcOrg} onChange={onFormChangeCP} defaultValue="Seleccione el codigo postal">
                                                    {
                                                        pc.pcodes.map((pcod, index) =>
                                                            <Option key={index} value={pcod.id}>{pcod.name}</Option>
                                                        )
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="colonia"
                                                label="Colonia"
                                                rules={[{ required: true, message: "Seleccione la colonia" }]}>
                                                <Select disabled={disabled.colonyOrg} onChange={onFormChange} defaultValue="Seleccione la colonia">
                                                    {
                                                        colony.colonies.map((col, index) =>
                                                            <Option key={index} value={col.id}>{col.name}</Option>
                                                        )
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="calle"
                                                label="Calle"
                                                rules={[{ required: true, type: "string", message: "Ingrese el nombre de la calle" }]}>
                                                <Input onChange={onFormChange} value={formValue.calle} placeholder="El nombre de la locación" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="numero_interior"
                                                label="Num Ext."
                                                rules={[{ required: true, type: "number", message: "Ingrese el numero exterior" }]}>
                                                <InputNumber value={formValue.numero_interior} placeholder="Num int." />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="numero_exterior"
                                                label="Num Int."
                                                rules={[{ type: "number", message: "Ingrese el numero interior" }]}>
                                                <InputNumber value={formValue.numero_exterior} placeholder="Num ext." />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row justify="center" gutter={12}>
                                        <Col xs={12}>
                                            <Form.Item
                                            >
                                                <Button style={{ alignItems: "center", width: "100%" }} type="primary" htmlType="submit"
                                                    onClick={recargar}
                                                    loading={load.loadings[0]}
                                                >Agregar</Button>
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row> */}
    </Card>
  );
}
