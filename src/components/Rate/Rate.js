import React, { useState, useEffect } from 'react';
import { Card, Rate as Rating, Form, Button, Row, Col, Input, Alert, message } from 'antd';
import { isEmpty } from 'lodash';
import RateService from '../../utils/api/rates';

const desc = ['Horrible', 'Malo', 'Normal', 'Bueno', 'Excelente'];

export default function Rate(props) {

  const { rate, order, step, setReload, reload,title} = props;
  const [valor, setValor] = useState({
    value: 0,
    comentario: ""
  });
  let token = localStorage.getItem('token');
  const [form] = Form.useForm();

  const handleChange = (value) => {
    setValor({
      value: value,
    });

  };
  const handleInput = (event) => {
    setValor({
      ...valor,
      comentario: event.target.value,

    });
  };

  const validateMessages = {
    required: '${label} is required!',

  };

  const onFinish = () => {
    RateService.Send({ 
      valor, 
      'order': order
    })
    .then(response => {
      if (response.data.success == true) {
        message.success("Calificacion enviada correctamente.")
        setReload(!reload)
      } else {
        message.error('Hubo un error al guardar tu calificón.')
      }
    })
    .catch(error => {
      console.log(error.response.data.errors)
      message.error('Hubo un error al guardar tu calificón.')

    })
  }



  return (


    <Card title={(rate.calificacion == null && rate.comentario == "" && step >= 7) && title} bordered={false} style={{ textAlign: "center" }}
      headStyle={{
        background: (rate.calificacion == null && rate.comentario == "" && step >= 7) && "#baf2c5"
      }}
    >
      {
        rate.calificacion == null && rate.comentario == "" && step >= 7 ? (
          <Row gutter={[12, 12]}>
            <Col xs={24}>
              <h5>¡Evalua nuestros servicios!, cada puntuación nos ayuda a crecer.</h5>

            </Col>
            <Col xs={24} >
              <Form form={form} name="nest-messages" validateMessages={validateMessages} onFinish={onFinish}>

                <Form.Item name="rate" >

                  <span>
                    <Rating tooltips={desc}
                      onChange={handleChange} value={valor.value}
                      allowHalf />
                    {valor.value ? <span className="ant-rate-text">{desc[valor.value - 1]}</span> : ''}
                  </span>
                </Form.Item>
                <Form.Item label="Comentarios" >
                  <Input.TextArea
                    required
                    value={valor.comentario}
                    onChange={handleInput}
                  />
                </Form.Item>
                <Form.Item >
                  <Button type="primary" htmlType="submit"

                    disabled={
                      valor.value !== 0 ? false : true}
                  >
                    Enviar
                  </Button>
                </Form.Item>

              </Form>
            </Col>
          </Row>
        ) :
          (
            <Card>
              <span>
                <Rating
                  tooltips={desc}
                  value={rate.calificacion}
                  disabled
                  allowHalf
                />
                {
                  rate.calificacion &&
                  <span className="ant-rate-text"> <b>{rate.calificacion ? desc[rate.calificacion - 1] : ''}</b>  - {rate.comentario}</span>


                }
              </span>
            </Card>
          )
      }

    </Card >
  )
}