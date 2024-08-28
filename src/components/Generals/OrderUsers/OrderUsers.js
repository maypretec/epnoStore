import { Avatar, Card, Col, Divider, List, Modal, Row, Spin } from "antd";
import React, { useState, useEffect, useRef } from "react";
import Chat from "../../Chat";
import ChatService from "../../../utils/api/chat";

export default function OrderUsers(props) {
  const { data, op, chats } = props;
  console.log((props))
  let service = op == 1 ? data.service.id : data.queja.service_id;
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
  });
  const goBottom = useRef(null);
  const [reloadChat, setReloadChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [load, setLoad] = useState(false);
  const [chatId, setChatId] = useState('')

	const role = localStorage.getItem('role')

  const showMessages = (chatId, type, userName, userId, serviceId ) => {
    setChatId(chatId)
    setUser({
      id: userId,
      name: userName,
      type: type,
      serviceId: serviceId,
      chatId: chatId
    });
    setVisible(true);
    setLoad(true);
    callApi(chatId);
  };

  function callApi(chatId) {
		ChatService.GetMessages(chatId).then(resp => {
			setLoad(false);
			setMessages(resp.data.data);
      goBottom.current.focus();
		}).catch((error) => {
      setLoad(false);
      console.log(error);
    });
  }


  return (
    <Card title="Usuarios" style={{ height: 260, overflow: "auto", }} >
      {/* TODO: validar usuarios. Si agente; todos. Si cliente; agente. Si proveedor; agente */}
      <List
        dataSource={chats}
        renderItem={(chat) => (
          <List.Item key={chat.id}>
            <List.Item.Meta
              title={
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a  onClick={() => showMessages(
                  chat.id, 
                  chat.type, 
                  chat.type === 1 && role == 1 ? chat.users[0].user_name : 
                  chat.type === 2 && role == 4 ? chat.users[0].user_name : 
                  chat.type === 2 && role == 6 ? chat.users[1].user_name : 'Administrador', 
                  chat.type === 1 && role != 1 ? chat.users[0].user_id : 
                  chat.type === 2 && role == 6 ? chat.users[0].user_id : 
                  chat.type === 2 && role == 4 ? chat.users[1].user_id : 'Administrador',
                  chat.serviceId
                    )} >
                  {
                  chat.type === 1 && role == 1 ? chat.users[0].user_name : 
                  chat.type === 2 && role == 4 ? chat.users[0].user_name : 
                  chat.type === 2 && role == 6 ? chat.users[1].user_name : 'Administrador' 
                  }
									
                </a>
              }
              description={chat.type === 2 && role == 4 ? 'Proovedor' : chat.type === 2 && role == 6 ? 'Industria' :  'EPNO'}
            />
          </List.Item>
        )}
      />
      <Modal
        open={visible}
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
