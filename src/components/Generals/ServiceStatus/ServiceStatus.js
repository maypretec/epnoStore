import { Tag } from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    CarOutlined,
    MinusCircleOutlined,
    FileSearchOutlined
} from '@ant-design/icons';

export default function ServiceStatus(props) {
    const {status} = props;

    const statusList = {
        1:{ icon:<FileSearchOutlined/>,     color:"purple",     text:"En revisión"},
        2:{ icon:<CheckCircleOutlined/>,    color:"gold",       text:"En cotización"},
        3:{ icon:<CheckCircleOutlined/>,    color:"default",    text:"Pendiente de aprobación"},
        4:{ icon:<SyncOutlined/>,           color:"processing", text:"En construcción"},
        5:{ icon:<MinusCircleOutlined/>,    color:"cyan",       text:"Inspección"},
        6:{ icon:<CarOutlined/>,            color:"geekblue",   text:"En camino"},
        7:{ icon:<CheckCircleOutlined/>,    color:"success",    text:"Entregado"},
        8:{ icon:<CloseCircleOutlined/>,    color:"error",      text:"Rechazado"},
        9:{ icon:<CloseCircleOutlined/>,    color:"magenta",    text:"Cancelado"},
        11:{icon:<CloseCircleOutlined/>,    color:"#F5222D",    text:"Cancelación solicitada"},
        12:{icon:<CloseCircleOutlined/>,    color:"#F5222D",    text:"En queja"},
    }  

    return(
    <Tag icon={statusList[status].icon} color={statusList[status].color}>
        {statusList[status].text}
    </Tag>
    );
}