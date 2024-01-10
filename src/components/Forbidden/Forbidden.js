import React, { useState, useEffect } from 'react';
import { Result, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../utils/api/users'

export default function Forbidden() {
  let history = useNavigate();
  let role = localStorage.getItem('role');
  let token = localStorage.getItem('token');

  const [id, setId] = useState('');
  useEffect(() => {
    if (role == 6) {
      
      UserService.UserRole()
      .then((response) => {
        if (response.data.id) {
          setId(response.data.id);
        } else {
          localStorage.removeItem('token')
          history('/login')
        }

      }).catch((error) => {
        console.log(error);
      }
      )
    }

  }, [])

  const returnUser = () => {
    (role == 1 || role == 2 || role == 3 || role == 5) ? (
      history('/dashboard')
    ) : role == 4 ? (
      history('/catalogo')
    ) : role == 6 && (
      history(`/ordenes/${role}/${id}/1`)
    )
  }
  return (
    <Result
      style={{ background: "#fff" }}
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button onClick={returnUser} type="primary">
          Volver a Inicio
        </Button>
      }
    />
  )
}

