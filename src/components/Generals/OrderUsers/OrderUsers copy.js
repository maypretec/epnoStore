import { Avatar, Card, Col, Divider, List, Modal, Row, Spin } from "antd";
import React, { useState, useEffect, useRef } from "react";
import Chat from "../../Chat";
import ChatService from "../../../utils/api/chat";

export default function OrderUsers(props) {
  const { data, token, op, chats } = props;
  let service = op == 1 ? data.service.id : data.queja.service_id;
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
  });
  const goBottom = useRef(null);
  const [reloadChat, setReloadChat] = useState(false);
  const [messages, setMessages] = useState({});
  const [load, setLoad] = useState(false);

  const showMessages = (order, user, name, email) => {
    setUser({
      id: user,
      name: name,
      email: email,
    });
    setVisible(true);
    setLoad(true);
    callApi(order, user);
  };

  function callApi(order, user) {
    ChatService.ChatMessages({ order: order, user: user })
      .then((response) => {
        setLoad(false);
        setMessages(response.data);
        goBottom.current.focus();
      })
      .catch((error) => {
        setLoad(false);
        console.log(error);
      });
  }

	useEffect(() => {
		console.log(chats)
	

	}, [])
	

  return (
    <Card
      title="Usuarios"
      style={{
        height: 260,
        overflow: "auto",
      }}
    >
      {/* TODO: validar usuarios. Si agente; todos. Si cliente; agente. Si proveedor; agente */}
      <List
        dataSource={chats}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={<Avatar src={`https://api.epno-app.com${item.logo}`} />}
              title={
                <a
                  onClick={() =>
                    showMessages(service, item.id, item.user_name, item.email)
                  }
                >
                  {item.org_name}
                </a>
              }
              description={item.user_name}
            />
          </List.Item>
        )}
      />
      <Modal
        visible={visible}
        footer=""
        closable
        width={600}
        style={{
          top: 30,
        }}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <Row gutter={[12, 12]} justify="center">
          {load ? (
            <Col style={{ marginTop: 30, marginButton: 30 }}>
              <Spin size="large" tip="Cargando mensajes" />
            </Col>
          ) : (
            <Col xs={24}>
              <Chat
							chat = {chats}
                data={data}
                conversation={messages}
                callApi={callApi}
                user={user}
                reloadChat={reloadChat}
                setReloadChat={setReloadChat}
                goBottom={goBottom}
                op={op}
              />
            </Col>
          )}
        </Row>
      </Modal>
    </Card>
  );
}
