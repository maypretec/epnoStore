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
export default function Chat(props) {
  const { data, reloadChat, setReloadChat, goBottom, user, callApi, op } = props;

  const userData = JSON.parse(localStorage.getItem('user'))

  let service = op == 1 ? data.service.id : data.queja.service_id;
  let order = op == 1 ? data.order.id : data.queja.order_id;
  let order_num = op == 1 ? data.service.order_num : data.queja.order_num;
  let step = op == 1 ? data.service.step_id : data.queja.step_id;

  // useEffect(() => {
  //   goBottom.current.focus();
  // }, []);

  const { Text } = Typography;

  const [inputValue, setInputValue] = useState("");
  let token = localStorage.getItem("token");
  let role = localStorage.getItem("role");
  let dateNow = moment();
  var datePublication = 0;
  var fecha = 0;
  const [state, setState] = useState({
    fileList: [],
    uploading: false,
  });

  const conversation = {
    messages: [
      {
        id: 1,
        created_at: "2024-08-25T14:30:00Z",
        user: {
          name: "John Doe",
          organization: {
            logo: null,
          },
        },
        my_comment: "false",
        comment:
          "El proyecto está en construcción y se completará en dos semanas.",
      },
      {
        id: 2,
        created_at: "2024-08-26T09:45:00Z",
        user: {
          name: "Jane Smith",
          organization: {
            logo: "/logos/company-logo.png",
          },
        },
        my_comment: "true",
        step_id: 7,
        comment: "La entrega ha sido exitosa, gracias por su colaboración.",
      },
      
    ],
  };

  const onFinish = () => {
    if (fileList.length > 5) {
      message.error("Solo puedes enviar maximo 5 archivos adjuntos.");
    } else if (fileList.length === 0 && inputValue == "") {
      message.error("Debes enviar un comentario o archivo.");
    } else {
      let exist_conversation;
      if (Object.entries(conversation).length === 0) {
        exist_conversation = false;
      } else {
        exist_conversation = conversation.id;
      }

      const { fileList } = state;

      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("files[]", file);
      });
      formData.append("comment", inputValue);
      formData.append("service_id", service);
      formData.append("step_id", step);
      formData.append("order_num", order_num);
      formData.append("order_id", order);
      formData.append("receptor", user.id);
      formData.append("receptor_mail", user.email);
      formData.append("conversacion", exist_conversation);

      setState({
        ...state,
        uploading: true,
      });

      OrderService.SendOrderComment(formData)
        .then((response) => {
          setInputValue("");
          setState({
            fileList: [],
            uploading: false,
          });
          setReloadChat(!reloadChat);
          if (response.data.success == true) {
            callApi(service, user.id);
            message.success("Mensaje enviado correctamente.");
          } else {
            message.error(response.data.message);
          }
        })
        .catch((error) => {
          // console.log(error.response.data.errors)
          setInputValue("");
          setState({
            fileList: [],
            uploading: false,
          });
          message.error(error);
        });
    }
  };
  const keyPress = (e) => {
    if (e.keyCode == 13) {
      onFinish();
    }
  };

  const { uploading, fileList } = state;
  const propsUp = {
    onRemove: (file) => {
      setState((state) => {
        const index = state.fileList.indexOf(file);
        const newFileList = state.fileList.slice();
        newFileList.splice(index, 1);
        return {
          fileList: newFileList,
        };
      });
    },
    beforeUpload: (file) => {
      const isLt2M = file.size / 1024 / 1024 < 9;
      if (!isLt2M) {
        message.error("¡El archivo no puede pesar mas de 9MB!");
      } else {
        setState((state) => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      }
    },
    fileList,
    // beforeUpload: file => {
    //   setState(state => ({
    //     fileList: [...state.fileList, file],
    //   }));
    //   return false;
    // },
  };
  const suffix = (
    <>
      <Button
        type="link"
        disabled={
          role == 6 && service == 11
            ? true
            : (service == 9 || service == 7) && true
        }
        loading={uploading}
      >
        <SendOutlined
          onClick={onFinish}
          disabled={
            role == 6 && service == 11
              ? true
              : (service == 9 || service == 7) && true
          }
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
            disabled={
              role == 6 && service == 11
                ? true
                : (service == 9 || service == 7) && true
            }
          />
        </Form>,
      ]}
    >
      {Object.entries(props.conversation).length === 0 ? (
        <Empty
          description={`Aun no has iniciado una conversacion con ${'user.name'}, envia un mensaje para iniciar una.`}
        />
      ) : (
        props.conversation.map(
          (cm) => (
            (fecha = moment(cm.created_at)),
            (datePublication = dateNow.diff(fecha, "days")),
            <Text
              key={cm.id}
              author={cm.user_id}
              className={cm.user_id == userData.id ? 'my_comment' : 'user_comment'}
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
                    justifyContent: cm.user_id == userData.id ? 'right' : 'left'
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
