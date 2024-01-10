import React, { useState, useEffect } from 'react';
import { Badge, Card, Col, Empty, Row, Steps, Table, Tag, Timeline } from 'antd';
import {

  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  CarOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  FileOutlined,
  ExclamationCircleOutlined,
  DollarCircleFilled

} from '@ant-design/icons';
import moment from 'moment'
import Avatar from 'antd/lib/avatar/avatar';
// import { info } from 'sass';

export default function ComplaintStep(props) {
  const { info } = props;


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
        {info == '' ?
          (<Empty />)
          :
          info.map((s) => {
            var statusLabel;
            var iconStatus;
            if (s.step_id == 1) {
              statusLabel = <Tag color='purple'>{s.step.name}</Tag>;
              iconStatus = <FileOutlined style={{ color: "purple" }} />;
            } else if (s.step_id == 3) {
              statusLabel = <Tag color='default'>{s.step.name}</Tag>;
              iconStatus = <ClockCircleOutlined style={{ color: 'default' }} />;
            } else if (s.step_id == 13) {
              statusLabel = <Tag color='gold'>{s.step.name}</Tag>;
              iconStatus = <CheckCircleOutlined style={{ color: 'gold' }} />;
            } else if (s.step_id == 4) {
              statusLabel = <Tag color="processing">{s.step.name}</Tag>;
              iconStatus = <SyncOutlined spin color='processing' />;
            } else if (s.step_id == 5) {
              statusLabel = <Tag color='cyan'>{s.step.name}</Tag>;
              iconStatus = <MinusCircleOutlined style={{ color: 'cyan' }} />;
            } else if (s.step_id == 6) {
              statusLabel = <Tag color='lime'>{s.step.name}</Tag>;
              iconStatus = <CarOutlined style={{ color: 'geekblue' }} />;
            } else if (s.step_id == 7 || s.step_id == 14) {
              statusLabel = <Tag color='success'>{s.step.name}</Tag>;
              iconStatus = <CheckCircleOutlined style={{ color: 'green' }} />;
            } else if (s.step_id == 8) {
              statusLabel = <Tag color='error'>{s.step.name}</Tag>;
              iconStatus = <ExclamationCircleOutlined style={{ color: 'red' }} />;
            }

            return (
              <Timeline.Item dot={iconStatus} label={moment(s.created_at).format('DD/MM/YYYY')} key={s.id}>
                <Row gutter={[12, 2]} >
                  <Col xs={24}>
                    {statusLabel}
                  </Col>
                  <Col xs={24}>
                    <label style={{ fontSize: 12, color: 'gray' }}>{s.description}</label>
                  </Col>
                  <Col xs={24}>
                    <DollarCircleFilled /> <label style={{ fontSize: 12, color: 'gray' }}>{s.cost}</label>
                  </Col>
                  <Col xs={24}>
                    <Badge color='green' /> <label style={{ fontSize: 12, color: 'gray' }}>{s.user.name}</label>
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





