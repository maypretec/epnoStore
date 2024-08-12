import React from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';

export default function UsersTable(props) {
  const { ordenesPro, type } = props;
  console.log(ordenesPro)

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'Empresa',
      dataIndex: 'order',
      responsive: ['md'],
    },
    {
      title: 'Rol',
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

  ordenesPro.map((ord) => {
    data.push(
      {
        key: ord.id,
        name: ord.name,
        order: ord.bussiness,
        price: ord.role,
        details: (

          type == 2 ? (
            <Link to={`/orders/details/${ord.id}`}>Ver más</Link>
          ) : type == 1 && (<Link to={`/orders/details/${ord.id}`}>Ver más</Link>)

        )
      }
    )
  })


  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }


  return (
    <Table columns={columns} dataSource={data} onChange={onChange} pagination={{pageSize: 5}} />
  );
}
