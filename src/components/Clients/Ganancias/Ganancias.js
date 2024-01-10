import React, { useState } from 'react';
import {
    G2,
    Chart,
    Tooltip,
    Interval,
    Interaction
} from "bizcharts";
import { Card, Table, Input, Button, Space,Empty } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Link } from "react-router-dom";
const { Meta } = Card;


const scale = {
    month: {
        alias: '月份'
    },
    avgRainfall: {
        alias: '月均降雨量'
    }
}

export default function Ganancias(props) {
    const { ganancias,gananciasEmpty,role } = props;
    // console.log(ganancias);
    const [state, setState] = useState({
        searchText: '',
        searchedColumn: '',
    });
    const data1 = [];
    const data = [];
    {
        // ganancias['order'] !== '' &&
        // ganancias['order'].map((g) => {
        //     g.map((g)=>{

        //         data.push({
        //             key: g.id,
        //             orden: g.purchase_order,
        //             fecha: g.created_at,
        //             // mercado:`$ ${g.costo_mercado}`,
        //             pago:`$ ${g.final_cost}`,
        //             // ahorro:`$ ${g.ahorro}`,
        //             details:  (<Link to={`/orderdetails/${role}/${g.id}/${g.request_type_id}`} >Ver más</Link>)
        //         })
        //     }) 
               
           
        //     })

    }
    {
        // ganancias['orderSum'] !== '' &&
        // ganancias['orderSum'].map((g) => {
        //     g.map((g)=>{
        //         data1.push({
        //          name: g.service,
        //           month: g.month,
        //            avgRainfall: g.pagado
        //         })
        //     }) 
               
           
        //     })

    }

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input

                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        phone="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
              </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
              </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                // setTimeout(() => searchInput.select(), 100);
            }
        },
        render: text =>
            state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    const handleReset = clearFilters => {
        clearFilters();
        setState({ searchText: '' });
    };


    const columns = [
        {
            title: '# Orden',
            dataIndex: 'orden',
            key: 'orden',
            width: '30%',

            ...getColumnSearchProps('orden'),
        },
        {
            title: 'Fecha de solicitud',
            dataIndex: 'fecha',
            key: 'fecha',
            width: '20%',
            ...getColumnSearchProps('fecha'),
            responsive: ['md'],
        },
        // {
        //     title: 'Costo en el mercado',
        //     dataIndex: 'mercado',
        //     key: 'mercado',
        //     responsive: ['md'],
        //     ...getColumnSearchProps('mercado'),
        // },

        {
            title: 'Pago por el servicio',
            dataIndex: 'pago',
            key: 'pago',
            responsive: ['md'],
            ...getColumnSearchProps('pago'),


        },
        // {
        //     title: 'Ahorro',
        //     dataIndex: 'ahorro',
        //     key: 'ahorro',

        //     ...getColumnSearchProps('ahorro'),


        // },
        {
            title: 'Detalles',
            dataIndex: 'details',
            key: 'details',
            responsive: ['md'],
            // render: (_, record) => 
              
            
            

        },
    ];

    return (
        <>
            <Meta title="Reporte de ganancias" description="Pago por servicio contra el precio real del mercado." />
            {
                gananciasEmpty ?(
                   <Empty description="Aun no existen registros para poder mostrar la grafica." />
                ):(
                    <Chart height={450} padding="auto" data={data1} autoFit filter={[
                        ['avgRainfall', val => val != null] 
                    ]}>
                        <Interval
                            adjust={[
                                {
                                    type: 'dodge',
                                    marginRatio: 0,
                                },
                            ]}
                            color="name"
                            position="month*avgRainfall"
                        />
                        <Tooltip shared />
                        <Interaction type="active-region" />
                    </Chart>
                )
            }
            

            <Table columns={columns} dataSource={data} />


        </>
    );
}

