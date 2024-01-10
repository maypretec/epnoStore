import React, { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';
import {

  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  CarOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,

} from '@ant-design/icons';
import moment from 'moment'

export default function StepsLogs(props) {
  const { step, tipo } = props;

  const columns = [
    {
      title: 'Step',
      dataIndex: 'step',

    },
   
      {

        title: 'Part.No',
        dataIndex: 'partno',
      }
    ,
    {
      title: 'Fecha de cambio',
      dataIndex: 'fecha',
      sorter: {
        compare: (a, b) => a.fecha - b.fecha,
        multiple: 3,
        responsive: ['lg'],
      },
    }



  ];

  const data = [];
  {
         step.map((st) => (
        data.push({
          key: st.id,
          step: <TagStep step={st.step_id} />,
          partno: st.partno,
          fecha: moment(st.created_at).format('DD/MM/YYYY'),
        })

      ))    


  }

  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }
  return (
    <Table columns={columns} dataSource={data}
      onChange={onChange}
      size="middle" />
  );
}


function TagStep(props) {
  const { step } = props;

  var statusLabel;
  switch (step) {
    case 1:
      statusLabel = <Tag icon={<CheckCircleOutlined />} color='success'>En cotización</Tag>;
      break;
    case 2:
      statusLabel = <Tag icon={<ClockCircleOutlined />} color="default">Pendiente de aprobación</Tag>;
      break;

    case 3:
      statusLabel = <Tag icon={<SyncOutlined spin />} color="processing">En construcción</Tag>;
      break;

    case 4:
      statusLabel = <Tag icon={<CarOutlined />} color='lime'>En camino</Tag>;
      break;
    case 5:
      statusLabel = <Tag icon={<MinusCircleOutlined />} color='cyan'>Auditando</Tag>;
      break;
    case 6:
      statusLabel = <Tag icon={<CheckCircleOutlined />} color='success'>Recibido</Tag>;
      break;
    case 7:
      statusLabel = <Tag icon={<CloseCircleOutlined />} color='error'>Rechazado</Tag>;
      break;
    case 8:
      statusLabel = <Tag icon={<CloseCircleOutlined />} color='magenta'>Cancelado</Tag>;
      break;

  }

  return statusLabel;
}