import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Result, Button, Col, Row } from "antd";
import Layout from "../../layouts/NavBar";
import "./style.scss";

export default function RegisterConfirmPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true }); 
    }, 5000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Layout>
      <Row justify="center">
        <Col span={24}>
          <Result
            status="success"
            title="Bienvenido a EPNO!"
            subTitle="Tu registro ha sido exitoso, un agente se pondrá en contacto."
            extra={[
              <Button key="buy" onClick={() => navigate("/", { replace: true })}>
                Ir al inicio de sesión
              </Button>,
            ]}
          />
        </Col>
      </Row>
    </Layout>
  );
}
