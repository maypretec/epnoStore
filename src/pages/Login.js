import React, { useState } from 'react';
import { Form, Input, Button, Col, Row, Alert, Avatar, Space } from 'antd';
import { UserOutlined, LockOutlined, ThunderboltTwoTone, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Layout from '../layouts/NavBar';
import { Link, useNavigate } from 'react-router-dom';
import '../scss/login.scss'
import AuthService from '../utils/api/auth';


export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  let history = useNavigate();
  const [error, setError] = useState({
    status: false,
    msg: ''
  });

  const [inactiveAccount, setInactiveAccount] = useState(false)


  const onFinish = (values) => {
    setLoading(true);
    AuthService.LoginEpno(values)
      .then(response => {
        console.log(response)
        if (response.data.status === false) {
          setInactiveAccount(true)
          setLoading(false);
        } else if (response.status === 200) {
          
          localStorage.setItem('role', response.data.role); 
          localStorage.setItem('user', JSON.stringify(response.data));
          
          /*if (response.data.role == 4){
            history('/orders/request');
          } else if (response.data.role == 6) {
            history('/dashboard')
          }*/

          setLoading(false);

          //  if (response.data.user.email_verified_at == null) {
          //    history('/unverified')
          //  } else if (response.data.user.status == 2) {
          //    history('/error/401')
          //  } else if (response.data.user.status == 0) {
          //    history('/@c-@s')
          //  } else if ((response.data.user.role == 1 || response.data.user.role == 2 || response.data.user.role == 3)) {
          if ((response.data.role == 1 || response.data.role == 2 || response.data.role == 3)) {
            history('/dashboard')
          } else if (response.data.role == 4) {
            history(`/orders/all/1`)
            //history('/catalog')
          } else if (response.data.role == 5) {
            history(`/orders/all/1`)
          } else if (response.data.role == 6) {
            history(`/orders/all/1`)
          } else if (response.data.role == 9) {
            history(`/dashboard`)
          }

        } else {
        console.log(response);
          setError({
            status: true,
            msg: response.data.message
          })
          setLoading(false);
        }
      })
      .catch(error => {
        console.log(error);
        setError({
          status: true,
          msg: 'Usuario y/o contreseña incorrecta'
        })
        setLoading(false);
      })
  }

  return (
    <Layout>
      <Row justify='center'>
        <Col xs={24} md={16} lg={13} xl={10}>

          {
            error.status && (
              <Col xs={24} style={{ marginTop: 16, marginBottom: 16, textAlign: 'center' }}>
                <Alert
                  message={error.msg}
                  type='error'
                  closable
                />
              </Col>
            )
          }
          {
            inactiveAccount == true ? 
              <Col xs={24} style={{ marginTop: 16, marginBottom: 16, textAlign: 'center' }}>
              <Alert
                message="Tu cuenta esta temporalmente inactiva, estamos verificando tus datos."
                type="warning"
                closable
                afterClose={() => {setInactiveAccount(false)}}
              />
              </Col>
              : <></>
          }
          <Form
            name='normal_login'
            className='login-form'
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Favor de ingresar tu correo electronico',
                },
              ]}
            >
              <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Correo' />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Ingresa tu contraseña',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
                placeholder='Password'
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item>
              <Form.Item noStyle>
                <Link to='/register' style={{ color: '#000', fontSize: 16 }}> <Avatar shape='square' size={20} icon={<ThunderboltTwoTone style={{ fontSize: 16, marginTop: 3 }} />} style={{ marginRight: 10, backgroundColor: '#1890ff' }} />Cuenta nueva</Link>
              </Form.Item>


              {/* <Link className='login-form-forgot' to='/@r-@p-@l'>¿Olvidaste tu contraseña?</Link>*/}
            </Form.Item>
            <Form.Item shouldUpdate={true}>
              {() => (
                <Button
                  style={{ width: '100%' }}
                  type='primary'
                  htmlType='submit'
                  className='login-form-button'
                  loading={loading}
                  disabled={
                    !form.isFieldsTouched(true) ||
                    !!form.getFieldsError().filter(({ errors }) => errors.length).length
                  }
                >
                  Log in
                </Button>
              )}
            </Form.Item>

          </Form>
        </Col>
      </Row>
    </Layout>
  )
}
