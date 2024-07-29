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
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Text } = Typography;

export default function ClientInfo(props) {
  const { reload, setReload, profile, role } = props;
  const desc = ["Horrible", "Malo", "Normal", "Bueno", "Excelente"];
  const types = ["image/jpeg", "image/jpg", "image/png"];

  let token = localStorage.getItem("token");

  const propsFile = {
    name: "img",
    multiple: false,
    data: {
      org_id: profile.organization_id,
    },
    action: "https://api.epno-app.com/api/change_profile_image",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        if (info.file.response.success == true) {
          setReload(!reload);
          message.success(
            `${info.file.name}, ${info.file.response.message}.`,
            10
          );
        } else {
          message.error(
            `Hubo un error al subir el archivo ${info.file.name}, ${info.file.response.message}.`,
            10
          );
        }
      }
    },
    beforeUpload: (file) => {
      if (!types.includes(file.type)) {
        message.error(
          `El archivo ${file.name}, esta en un formato no permitido, 
           toma en cuenta que no sera subido`,
          10
        );
        return false;
      } else {
        return true;
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <>
      {profile == "" ? (
        <Skeleton active avatar />
      ) : (
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <Row gutter={[12, 12]}>
              <Col xs={0} sm={24} style={{ alignItems: "center" }}>
                <Avatar
                  src={`data:image/png;base64,${profile.logo}`}
                  size={300}
                  shape="square"
                />
              </Col>
              <Col sm={24} style={{ alignItems: "center" }}>
                <Upload {...propsFile} maxCount={1} accept=".png,.jpg,.jpeg">
                  <Button icon={<UploadOutlined />}>
                    <Tooltip title="Acepta png,jpg y jpeg">
                      Cambiar foto
                    </Tooltip>
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12}>
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
              <Col xs={24} md={10}>
                <Text>
                  Total :<Title level={3}>12,654</Title>
                </Text>
              </Col>
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
          </Col>
        </Row>
      )}
    </>
  );
}
