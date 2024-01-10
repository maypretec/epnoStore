import React from 'react';
import { Collapse,Tag } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import {

  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  CarOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  FileSearchOutlined,

} from '@ant-design/icons';
import './StepsCollapse.scss'
import moment from 'moment'
const { Panel } = Collapse;


export default function StepsCollapse(props) {
  const { step } = props;

  return (
    <>
    {
      step.map((st) => (

        <Collapse
        key={st.id}
          bordered={false}

          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          className="site-collapse-custom-collapse"
        >
          <Panel header={ <TagStep step={st.step_id} />} className="site-collapse-custom-panel">
            <label>Fecha de cambio: {moment(st.created_at).format('DD/MM/YYYY')}</label>
          </Panel>

        </Collapse>
      ))
    }
</>
  );
}

function TagStep(props){
  const {step}=props;

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
      break;
    case 8:
      statusLabel = <Tag icon={<CloseCircleOutlined />} color='magenta'>Cancelado</Tag>;
      break;
    case 9:
      statusLabel = <Tag icon={<FileSearchOutlined />} color='purple'>En revisión</Tag>;
      break;

  }

  return (
    <label>Step: {statusLabel}</label>
  );
}