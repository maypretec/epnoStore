import React, { useState, useEffect, useRef } from 'react';
import { Typography, Tooltip, Avatar, Card, Input, Form, Upload, Button, Col, Row, Space, message, Tag, Badge, Empty } from 'antd';
import moment from 'moment';
import {
  SendOutlined, ClockCircleOutlined, PaperClipOutlined, DownloadOutlined, CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  CarOutlined,
  MinusCircleOutlined,
  SearchOutlined,
  UserOutlined,
  FileSearchOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import "./Chat.scss"
import { BASE_URL } from '../../utils/constants';
import OrderService from '../../utils//api/orders';
export default function Chat(props) {
  const { data, reloadChat, setReloadChat, goBottom, user, callApi, op } = props;
  let service = (op == 1 ? data.service.id : data.queja.service_id);
  let order = (op == 1 ? data.order.id : data.queja.order_id);
  let order_num = (op == 1 ? data.service.order_num : data.queja.order_num);
  let step = (op == 1 ? data.service.step_id : data.queja.step_id);

  // useEffect(() => {
  //   goBottom.current.focus();
  // }, []);

  const {Text} = Typography;

  const [inputValue, setInputValue] = useState('');
  let token = localStorage.getItem('token');
  let role = localStorage.getItem('role');
  let dateNow = moment();
  var datePublication = 0;
  var fecha = 0;
  const [state, setState] = useState({
    fileList: [],
    uploading: false,
  })

  const conversation = {
    messages: [
      {
        id: 1,
        created_at: "2024-08-25T14:30:00Z",
        user: {
          name: "John Doe",
          organization: {
            logo: null
          }
        },
        my_comment: "false",
        step_id: 4,
        comment: "El proyecto está en construcción y se completará en dos semanas.",
        files: [
          {
            file: "/files/documento1.pdf",
            file_name: "Plan_de_Construcción.pdf"
          }
        ]
      },
      {
        id: 2,
        created_at: "2024-08-26T09:45:00Z",
        user: {
          name: "Jane Smith",
          organization: {
            logo: "/logos/company-logo.png"
          }
        },
        my_comment: "true",
        step_id: 7,
        comment: "La entrega ha sido exitosa, gracias por su colaboración.",
        files: []
      }
    ]
  };
  


  const onFinish = () => {

    if (fileList.length > 5) {
      message.error("Solo puedes enviar maximo 5 archivos adjuntos.")
    } else if (fileList.length === 0 && inputValue == '') {
      message.error("Debes enviar un comentario o archivo.")
    } else {

      let exist_conversation;
      if (Object.entries(conversation).length === 0) {
        exist_conversation = false;
      } else {
        exist_conversation = conversation.id;
      }

      const { fileList } = state;

      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('files[]', file);
      });
      formData.append("comment", inputValue)
      formData.append("service_id", service)
      formData.append("step_id", step)
      formData.append("order_num", order_num)
      formData.append("order_id", order)
      formData.append("receptor", user.id)
      formData.append("receptor_mail", user.email)
      formData.append("conversacion", exist_conversation)


      setState({
        ...state,
        uploading: true,
      });

      OrderService.SendOrderComment(formData)
      .then(response => {
        setInputValue('');
        setState({
          fileList: [],
          uploading: false,
        });
        setReloadChat(!reloadChat);
        if (response.data.success == true) {
          callApi(service, user.id)
          message.success('Mensaje enviado correctamente.');
        } else {

          message.error(response.data.message);
        }
      })
      .catch(error => {
        // console.log(error.response.data.errors)
        setInputValue('');
        setState({
          fileList: [],
          uploading: false,
        });
        message.error(error);
      })
    }
  }
  const keyPress = (e) => {
    if (e.keyCode == 13) {
      onFinish();
    }
  }

  const { uploading, fileList } = state;
  const propsUp = {
    onRemove: file => {
      setState(state => {
        const index = state.fileList.indexOf(file);
        const newFileList = state.fileList.slice();
        newFileList.splice(index, 1);
        return {
          fileList: newFileList,
        };
      });
    },
    beforeUpload: file => {
      const isLt2M = file.size / 1024 / 1024 < 9;
      if (!isLt2M) {
        message.error("¡El archivo no puede pesar mas de 9MB!");
      } else {
        setState(state => ({
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
      <Upload
        {...propsUp}
        // listType="picture"
        className="upload-list-inline"
        maxCount={5}
        multiple
        disabled={
          role == 6 && service == 11 ? true
            : (service == 9 || service == 7) && true
        }
      >
        <PaperClipOutlined style={{
          fontSize: 20,
          color: '#7f7f7f',
        }} />
      </Upload>
      <Button
        type="link"
        disabled={role == 6 && service == 11 ? true
          : (service == 9 || service == 7) && true}
        loading={uploading}
      >
        <SendOutlined
          onClick={onFinish}
          disabled={role == 6 && service == 11 ? true
            : (service == 9 || service == 7) && true}
          style={{
            fontSize: 20,
            color: '#1890ff',
          }} />

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
        <Button type='link'
        // style={{background: "#001529", color: "#fff"}} 
        >
          <ArrowDownOutlined onClick={goToBottom}
          />
        </Button>
      }

      // style={{ borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}
      actions={[
        <Form onFinish={onFinish}>

          <Input
            required
            name='inputValue'
            size='large'
            allowClear
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={keyPress}
            value={inputValue}
            bordered={false}
            suffix={suffix}
            placeholder="Agregar comentario"
            disabled={role == 6 && service == 11 ? true
              : (service == 9 || service == 7) && true}
          />

        </Form>


      ]}
    >

      {
        (Object.entries(conversation).length === 0) ? (
          <Empty description={`Aun no has iniciado una conversacion con ${user.name}, envia un mensaje para iniciar una.`} />
        ) :
          conversation.messages.map((cm) => (
            console.log(cm),
            fecha = moment(cm.created_at),
            datePublication = dateNow.diff(fecha, 'days'),
            <Text
              className={cm.my_comment == "true" ? 'my_comment' : 'user_comment'}
              // style={{ background: cm.step_id == 8 && '#EBAACE', borderRadius: cm.step_id == 8 && "5px" }}

              key={cm.id}
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
              author={cm.user.name}
              datetime={

                <Tag color={
                  cm.step_id == 1 ? 'purple' :
                    cm.step_id == 2 ? 'brown' :
                      cm.step_id == 3 ? 'default' :
                        cm.step_id == 4 ? 'processing' :
                          cm.step_id == 5 ? 'cyan' :
                            cm.step_id == 6 ? 'geekblue' :
                              cm.step_id == 7 ? 'success' :
                                cm.step_id == 8 ? 'warning' :
                                  cm.step_id == 9 ? '#ff7875' :
                                    cm.step_id == 11 ? '#000' :
                                      cm.step_id == 12 ? '#ff7875' :
                                        cm.step_id == 13 ? 'processing' :
                                          cm.step_id == 14 && 'success'
                }

                >
                  {
                    cm.step_id == 1 ? 'En revisión' :
                      cm.step_id == 2 ? 'En cotización' :
                        cm.step_id == 3 ? 'Pendiente de aprobación' :
                          cm.step_id == 4 ? 'En construcción' :
                            cm.step_id == 5 ? 'En inspección' :
                              cm.step_id == 6 ? 'En camino' :
                                cm.step_id == 7 ? 'Entregado' :
                                  cm.step_id == 8 ? 'Rechazado' :
                                    cm.step_id == 9 ? 'Cancelado' :
                                      cm.step_id == 11 ? 'Cancelación solicitada' :
                                        cm.step_id == 12 ? 'Queja' :
                                          cm.step_id == 13 ? 'Disputa' :
                                            cm.step_id == 14 && 'Cerrada'
                  }

                </Tag>

              }
              avatar={
                cm.user.organization.logo == null ? (
                  <Tooltip title={cm.user.name} placement="top">
                    <Avatar style={{ backgroundColor: '#1890FF', marginLeft: cm.step_id == 8 && 10 }} icon={<UserOutlined />} />
                  </Tooltip>
                ) : (
                  <Tooltip title={cm.user.name} placement="top">
                    <Avatar
                      style={{ margin: cm.step_id == 8 && 10 }}
                      src={`https://api.epno-app.com${cm.user.organization.logo}`}
                      alt={cm.user.name}
                    />
                  </Tooltip>
                )

              }
              content={
                <Row gutter={[12, 12]} >
                  <Col xs={24}
                   style={{
                     background: cm.my_comment == "true" && '#1A6ED8',
                     color: cm.my_comment == "true" && 'white',
                     borderRadius: cm.my_comment == "true" && "10px",
                     textAlign: cm.my_comment == "true" && 'center',
                     paddingTop: cm.my_comment == "true" && 5,
                     paddingBottom: cm.my_comment == "true" && 5,
                     fontWeight: 'bold',
                   }}
                  >
                    <span className='span-comment'>
                      {cm.comment}
                      sdadasdasz
                    </span>
                    &nbsp;
                    {cm.files !== "" &&
                      cm.files.map((f) => (
                        <a href={`https://api.epno-app.com${f.file}`} target="_blank" rel="noopener noreferrer" download >
                          <Button icon={<DownloadOutlined />} shape="round" style={{ marginTop: 5 }} >
                            {f.file_name}
                          </Button>
                          &nbsp;
                        </a>
                      ))
                      // <Col xs={24} >
                      //  </Col>
                    }

                  </Col>
                </Row>
              }
            />


          ))
      }
      <div
        data-test={'container'}
        ref={goBottom}
        tabIndex={-1}
      />


    </Card>
  )


}