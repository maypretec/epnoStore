import React from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';

export default function OrderByEmployee(props) {
  const { ordenesPro, type } = props;
  const columns = [

    {
      title: 'Nombre',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'Ordenes',
      dataIndex: 'order',
      responsive: ['md'],
    },
    {
      title: 'Gasto',
      dataIndex: 'price',
      responsive: ['md'],
    },
    {
      title: 'Detalles',
      dataIndex: 'details',
      // render: () => <Link to={`/orders/${role}`}>Ver más</Link>,
    },
  ];

  const data = [];
  {

    ordenesPro.map((ord) => {
      data.push(
        {
          key: ord.id,
          name: ord.name,
          order: ord.ordenes,
          price: '$' + ord.suma,
          details: (

            type == 2 ? (
              <Link to={`/orders/${ord.role_id}/${ord.id_user}/2`}>Ver más</Link>
            ) : type == 1 && (<Link to={`/ordenes-servicio/${ord.name}`}>Ver más</Link>)

          )
        }
      )
    })
  }

  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }


  return (
    <Table columns={columns} dataSource={data} onChange={onChange} />
  );
}
