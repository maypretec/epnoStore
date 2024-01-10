import React,{useState} from 'react';
import { Chart, LineAdvance } from 'bizcharts';
import { Card, Table, Input, Button, Space,Empty} from "antd";
import { SearchOutlined} from '@ant-design/icons';
import {Link} from "react-router-dom";
import Highlighter from 'react-highlight-words';




export default function Ganancias(props) {
    const { ganancias,gananciasEmpty,role } = props;
    const [state, setState] = useState({
        searchText: '',
        searchedColumn: '',
    });
    
    const data1 = [];
    
    const data = [];
    {
        
        // ganancias['order'].map((g) => {
        //     g.map((g)=>{

        //         data.push({
        //             key: g.id,
        //             id:g.id,
        //             orden: g.purchase_order,
        //             fecha: g.created_at,
        //             mercado:`$ ${g.costo_mercado}`,
        //             costo:`$ ${g.cost}`,
        //             ahorro:`$ ${g.ahorro}`, 
        //             details: (<Link to={`/orderdetails/${role}/${g.id}/${g.request_type_id}`} >Ver más</Link>)
        //         })
        //     }) 
               
           
        //     })

    }
    {
        // ganancias['orderSum'].map((g) => {
        //     g.map((g)=>{
        //         data1.push({                
        //           month: g.month,
        //           ganado: g.ganado
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
            title: '#',
            dataIndex: 'id',
            key: 'id',
            responsive: ['md'],
            ...getColumnSearchProps('id'),
        },
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
       
    
        {
            title: 'Costo del servicio',
            dataIndex: 'costo',
            key: 'costo',
          
            ...getColumnSearchProps('costo'),
           
    
        },
       
        {
            title: 'Detalles',
            dataIndex: 'details',
            key: 'details',
            responsive: ['md'],
            // render: (_, record) => 
            // (<Link to={`/orderdetails/${role}/${record.key}/${ganancias.order[0].request_type_id}`} >Ver más</Link>)
    
        },
    ];
    return(
        <>
        {
             gananciasEmpty ?(
                <Empty description="Aun no existen registros para poder mostrar la grafica." />
             ):(
        <Chart padding={[10, 20, 50, 40]} autoFit height={450} data={data1} >
		<LineAdvance
			shape="hv"
			point
			area
			position="month*ganado"
			color="city"
		/>
	</Chart>
    )
        }
     <Table columns={columns} dataSource={data} />
     </>
    )
}