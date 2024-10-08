import React, { useState, useEffect } from 'react';
import { Badge, Card, Col, Comment, Empty, Row, Table, Tag, Timeline } from 'antd';
import {

  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  CarOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  FileOutlined,
  ExclamationCircleOutlined

} from '@ant-design/icons';
import moment from 'moment'
import Avatar from 'antd/lib/avatar/avatar';

export default function step_idsLogs(props) {
  const { steps } = props;
  steps.sort((a, b) => a.status - b.status);

  return (

    <Card title="Seguimiento de la orden"
      headStyle={{
        textAlign: "center",
        background: "#e8ebef",
        // color: "#fff",
        borderTopLeftRadius: '5px', borderTopRightRadius: '5px'
      }}
    >
      <Timeline mode="alternate">
        {steps == '' ?
          (<Empty />)
          :
          steps.map((s) => {
            var statusLabel;
            var iconStatus;
            if (s.status == 1) {
              statusLabel = <Tag color='purple'>Revisión</Tag>;
              iconStatus = <FileOutlined style={{ color: "purple" }} />;
            } else if (s.status == 2) {
              statusLabel = <Tag color='gold'>Cotización</Tag>;
              iconStatus = <CheckCircleOutlined style={{ color: 'gold' }} />;
            } else if (s.status == 3) {
              statusLabel = <Tag color="default">Pendiente aprobar</Tag>;
              iconStatus = <ClockCircleOutlined style={{ color: "gray" }} />;
            } else if (s.status == 4) {
              statusLabel = <Tag color="processing">Construcción</Tag>;
              iconStatus = <SyncOutlined spin color='processing' />;
            } else if (s.status == 5) {
              statusLabel = <Tag color='cyan'>Inspección</Tag>;
              iconStatus = <MinusCircleOutlined style={{ color: 'cyan' }} />;
            } else if (s.status == 6) {
              statusLabel = <Tag color='lime'>En camino</Tag>;
              iconStatus = <CarOutlined style={{ color: 'geekblue' }} />;
            } else if (s.status == 7) {
              statusLabel = <Tag color='success'>Entregado</Tag>;
              iconStatus = <CheckCircleOutlined style={{ color: 'green' }} />;
            } else if (s.status == 8) {
              statusLabel = <Tag color='warning'>Rechazado</Tag>;
              iconStatus = <ExclamationCircleOutlined style={{ color: 'orange' }} />;
            } else if (s.status == 9) {
              statusLabel = <Tag color='#ff7875'>Cancelado</Tag>;
              iconStatus = <CloseCircleOutlined style={{ color: '#ff7875' }} />;
            }else if (s.status == 11) {
              statusLabel = <Tag color='#000'>Cancelación solicitada</Tag>;
              iconStatus = <ExclamationCircleOutlined style={{ color: '#000' }} />;
            }else if (s.status == 12) {
              statusLabel = <Tag color='#f5222d'>Queja</Tag>;
              iconStatus = <ExclamationCircleOutlined style={{ color: '#f5222d' }} />;
            }

            return (
              <Timeline.Item dot={iconStatus} label={moment(s.updatedAt).format("DD/MM/YYYY H:mm")} key={s.id}>
                <Row gutter={[12, 2]} >
                  <Col xs={24}>
                    {statusLabel}
                  </Col>
                  <Col xs={24}>
                  {/* 
                    <Badge color='green' /> <label style={{ fontSize: 12, color: 'gray' }}>{s.user_name}</label>
                  */}
                  </Col>
                </Row>


              </Timeline.Item>

            )

          })
        }

      </Timeline>

    </Card>
  );
}





