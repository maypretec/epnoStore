import React from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';

export default function UsersTable(props) {
  const { users, type } = props;
  console.log(users)

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'Correo electronico',
      dataIndex: 'email',
      responsive: ['md'],
    },
    {
      title: 'Empresa',
      dataIndex: 'org',
      responsive: ['md'],
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      responsive: ['md'],
    },
    {
      title: 'Detalles',
      dataIndex: 'details',
      // render: () => <Link to={`/orders/${role}`}>Ver más</Link>,
    },
  ];

  const data = [];

  users.map((user) => {
    data.push(
      {
        key: user.id,
        name: user.name,
        email: user.email,
        org: user.bussiness,
        role:  user.role == 1 ? 'Administrador' 
        : user.role == 3 ? 'VS Manager'
        : user.role == 4 ? 'Industria'
        : user.role == 5 ? 'Comprador'
        : user.role == 6 ? 'Proveedor'
        : user.role == 9 ? 'Repartidor' : '',
        details: (

          type == 2 ? (
            <Link to={`/@p/${user.id}`}>Ver más</Link>
          ) : type == 1 && (<Link to={`/@p/${user.id}`}>Ver más</Link>)

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
