import React from 'react';
import ReactDOM from 'react-dom';
import { Result, Button} from 'antd';
import { Link } from 'react-router-dom';



export default function SuspendedAccount() {
    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      }
    return (
        
        <Result
        style={{background:"#fff"}}
        status="500"
        title="Cuenta suspendida"
        subTitle="Esta cuenta esta suspendida, si tienes alguna duda, contacta a tu administrador."
        extra={
        <Button type="primary">
          <a onClick={logout} href="https://epno.com.mx/" >Volver a Inicio</a>
          </Button>
      }
      />             
      
    )
}
