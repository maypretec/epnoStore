import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Tooltip,
  Avatar,
  Card,
  Input,
  Form,
  Upload,
  Button,
  Col,
  Row,
  Space,
  message,
  Tag,
  Badge,
  Empty,
} from "antd";
import moment from "moment";
import {
  SendOutlined,
  ClockCircleOutlined,
  PaperClipOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  CarOutlined,
  MinusCircleOutlined,
  SearchOutlined,
  UserOutlined,
  FileSearchOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import "./Chat.scss";
import { BASE_URL } from "../../utils/constants";
import OrderService from "../../utils//api/orders";
import ChatService from "../../utils/api/chat";
export default function Chat(props) {
  const { data, reloadChat, setReloadChat, goBottom, user, callApi, op } = props;

  const userData = JSON.parse(localStorage.getItem('user'))


  useEffect(() => {
    goBottom.current.focus();
  }, []);

  const { Text } = Typography;

  const [inputValue, setInputValue] = useState("");
  let token = localStorage.getItem("token");
  let role = localStorage.getItem("role");
  let dateNow = moment();
  var datePublication = 0;
  var fecha = 0;
  const [loading, setLoading] = useState(false);

  const onFinish = () => {
    if ( inputValue == "") {
      message.error("Debes enviar un comentario.", 1);
    } else {
      const data_message = {
        user_id: user.id,
        service_id: user.serviceId, 
        comment: inputValue,
        type: user.type
      }

      setLoading(true)
      console.log(message)

      ChatService.SendMessage(data_message).then(resp => {
        setInputValue("");
        setLoading(false)
        setReloadChat(!reloadChat)
        console.log(resp.data)

        if (resp.data.success === true) {
          callApi(user.chatId, user.id);
          message.success("Mensaje enviado correctamente.");
        } else {
          message.error(resp.data.message);
        }
      }).catch(e => {
        setInputValue("");
        setLoading(false)
        console.log(e);
      })
    }
  };
  const keyPress = (e) => {
    if (e.keyCode == 13) {
      onFinish();
    }
  };

  const suffix = (
    <>
      <Button
        type="link"
        loading={loading}
      >
        <SendOutlined
          onClick={onFinish}
          style={{
            fontSize: 20,
            color: "#1890ff",
          }}
        />
      </Button>
    </>
  );

  const goToBottom = () => {
    goBottom.current.focus();
  };
  

  return (
    <Card
      title={user.name}
      // headStyle={{ background: "#001529", color: "#fff", borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}
      bodyStyle={{
        maxHeight: 400,
        overflowX: "auto",
      }}
      bordered={false}
      extra={
        <Button
          type="link"
          // style={{background: "#001529", color: "#fff"}}
        >
          <ArrowDownOutlined onClick={goToBottom} />
        </Button>
      }
      // style={{ borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}
      actions={[
        <Form onFinish={onFinish}>
          <Input
            required
            name="inputValue"
            size="large"
            allowClear
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={keyPress}
            value={inputValue}
            bordered={false}
            suffix={suffix}
            placeholder="Agregar comentario"
            
          />
        </Form>,
      ]}
    >
      {Object.entries(props.conversation).length === 0 ? (
        <Empty
          description={`Aun no has iniciado una conversacion con ${user.name}, envia un mensaje para iniciar una.`}
        />
      ) : (
        props.conversation.map(
          (cm) => (
            (fecha = moment(cm.created_at)),
            (datePublication = dateNow.diff(fecha, "days")),
            <Text
              key={cm.id}
              author={cm.user_id}
              className={cm.user_id == userData.id ? 'my_comment' : userData.role == 1 && cm.user_id == 'Administrador' ? 'my_comment' : 'user_comment'}
              actions={
                [<span >
                  <ClockCircleOutlined />
                </span>,
                <Tooltip title={moment(cm.created_at).format('DD/MM/YYYY HH:mm:ss')}>
                  <span>
                    {datePublication == 0 ? (
                      'Publicado hace un momento'
                    ) : (
                      `Publicado hace ${datePublication} días`
                    )

                    }

                  </span>
                </Tooltip>]
              }
              
            >
              <Row style={{marginTop: '16px'}} gutter={[12, 12]}>
                <Col
                  xs={24}
                  style={{
                    display:"flex",
                    justifyContent: cm.user_id == userData.id ? 'right' : userData.role == 1 && cm.user_id == 'Administrador' ? 'right' : 'left'
                  }}
                >
                  <span className="span-comment"> {cm.comment} </span>
                </Col>
              </Row>
            </Text>
            
          )
        )
      )}
      <div data-test={"container"} ref={goBottom} tabIndex={-1} />
    </Card>
  );
}
