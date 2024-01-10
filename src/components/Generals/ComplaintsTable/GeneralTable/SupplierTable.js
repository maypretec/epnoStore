import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Card, Row, Col, Input, Table, Button, Space, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    CarOutlined,
    ClockCircleOutlined,
    MinusCircleOutlined,
    SearchOutlined,
    FileSearchOutlined
} from '@ant-design/icons';
// import Layout from "../../views/layouts/LayoutPage";
import { Link } from 'react-router-dom';
import moment from 'moment'

export default function GeneralTable(props) {
    const { openComplaints, loading, role } = props;

    const searchInput = useRef(null);

    var icon;
    var color;
    var text;
    const [state, setState] = useState({
        searchText: '',
        searchedColumn: '',
    });


    const data = [];
    {
        openComplaints.map((queja, index) => {


            data.push({
                key: queja.id,
                titulo: queja.title,
                queja: queja.complaint_num,
                ordenCompra: queja.order_num,
                cost: (role == 6 ? queja.supplier_cost : queja.client_cost),
                fechaInicio: moment(queja.created_at).format('L'),
                tipo: (queja.type == null ? "?" : queja.type),
                status: [queja.step_id],
                detalles: (
                    <Link to={`/@q-@d/${queja.id}`}> Ver más</Link>
                )
            })
        }
        )

    };

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
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
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setState({
                                searchText: selectedKeys[0],
                                searchedColumn: dataIndex,
                            });
                        }}
                    >
                        Filter
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
                setTimeout(() => searchInput.current.select(), 100);
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
            title: '# Queja',
            dataIndex: 'queja',
            key: 'queja',
            align: "center",
            ...getColumnSearchProps('queja'),
        },
        {
            title: '# Orden',
            dataIndex: 'ordenCompra',
            key: 'ordenCompra',
            align: "center",
            ...getColumnSearchProps('ordenCompra'),
        },
        {
            title: 'Titulo',
            dataIndex: 'titulo',
            key: 'titulo',
            ...getColumnSearchProps('titulo'),
            sorter: (a, b) => a.titulo.length - b.titulo.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Costo',
            dataIndex: 'costo',
            key: 'costo',
            align: "center",
            ...getColumnSearchProps('costo'),
            sorter: (a, b) => a.costo - b.costo,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Fecha de inicio',
            dataIndex: 'fechaInicio',
            key: 'fechaInicio',
            align: "center",
            ...getColumnSearchProps('fechaInicio'),
            sorter: (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
            align: "center",
            sorter: (a, b) => a.tipo - b.tipo,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: "center",
            // ...getColumnSearchProps('status'),
            render: status => (

                status.map(status => {
                    if (status == 13) {
                        icon = <CheckCircleOutlined />
                        color = 'gold'
                        text = 'En disputa'
                    } else if (status == 4) {
                        icon = <SyncOutlined spin />
                        color = 'processing'
                        text = 'En construcción'

                    } else if (status == 6) {
                        icon = <CarOutlined />
                        color = 'geekblue'
                        text = 'En camino'

                    } else if (status == 5) {
                        icon = <MinusCircleOutlined />
                        color = 'cyan'
                        text = 'Inspección'
                    } else if (status == 14) {
                        icon = <CheckCircleOutlined />
                        color = 'success'
                        text = 'Cerrada'
                    } else if (status == 7) {
                        icon = <CheckCircleOutlined />
                        color = 'success'
                        text = 'Entregado'

                    } else if (status == 8) {
                        icon = <CloseCircleOutlined />
                        color = 'error'
                        text = 'Rechazado'
                    } else if (status == 1) {
                        icon = <FileSearchOutlined />
                        color = 'purple'
                        text = 'En revisión'
                    }
                    return (
                        <Tag icon={icon} color={color}>
                            {text}
                        </Tag>
                    );

                }
                )

            ),
            sorter: (a, b) => a.status - b.status,
            sortDirections: ['descend', 'ascend'],

        },



        {
            title: 'Detalles',
            dataIndex: 'detalles',
            key: 'detalles',
            align: "center",

        },
    ];
    return (

        // <Row gutter={24}>
        //     <Col xs={24} >
        <Table columns={columns} dataSource={data} scroll={{ x: '100vh' }}
            loading={loading}

        />
        //     </Col>

        // </Row>

    );
}

