import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Card, Row, Col, Input, Table, Button, Space, Tag, Badge } from 'antd';
import Highlighter from 'react-highlight-words';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    CarOutlined,
    ClockCircleOutlined,
    MinusCircleOutlined,
    SearchOutlined,
    FileSearchOutlined,
    QuestionCircleOutlined,
    FieldTimeOutlined
} from '@ant-design/icons';
// import Layout from "../../views/layouts/LayoutPage";
import { Link } from 'react-router-dom';
import moment from 'moment'

export default function AgentTable(props) {
    const { openComplaints, loading } = props;

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
                queja: queja.complaint_num,
                ordenCompra: queja.order_num,
                titulo: queja.title,
                org: queja.organization.name,
                tipo: (queja.type == null ? '?' : queja.type),
                responsable: queja.responsible_user,
                costo: `$${queja.supplier_cost}`,
                venta: (queja.client_cost == null ? '-' : `$${queja.client_cost}`),
                rework: (queja.rework_cost == null ? '$--' : `$${queja.rework_cost}`),
                ganancia: `$${queja.return_amount}`,
                status: [queja.step_id],
                fechaInicio: moment(queja.created_at).format('L'),
                close_date: (queja.close_date == null ? '?' : moment(queja.close_date).diff(moment(queja.created_at), 'days')+' días'),
                detalles: (
                    <Link to={`/@q-@d/${queja.id}`}> Ver</Link>
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
            title: '#Queja',
            dataIndex: 'queja',
            key: 'queja',
            align: "center",
            ...getColumnSearchProps('queja'),
            // sorter: (a, b) => a.queja.length - b.queja.length,

        },
        {
            title: '#Orden',
            dataIndex: 'ordenCompra',
            key: 'ordenCompra',
            align: "center",
            ...getColumnSearchProps('ordenCompra'),
            // sorter: (a, b) => a.ordenCompra.length - b.ordenCompra.length,

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
            title: 'Organización',
            dataIndex: 'org',
            key: 'org',
            align: "center",
            ...getColumnSearchProps('org'),
            sorter: (a, b) => a.org.length - b.org.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
            align: "center",
            ...getColumnSearchProps('tipo'),
            sorter: (a, b) => a.tipo.length - b.tipo.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Responsable',
            dataIndex: 'responsable',
            key: 'responsable',
            align: "center",
            // ...getColumnSearchProps('responsable'),
            // sorter: (a, b) => a.responsable.length - b.responsable.length,
            // sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Costo',
            dataIndex: 'costo',
            key: 'costo',
            align: "center",
            ...getColumnSearchProps('costo'),
            sorter: (a, b) => a.costo.length - b.costo.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Venta',
            dataIndex: 'venta',
            key: 'venta',
            align: "center",
            ...getColumnSearchProps('venta'),
            sorter: (a, b) => a.venta.length - b.venta.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Retrabajo',
            dataIndex: 'rework',
            key: 'rework',
            align: "center",
            ...getColumnSearchProps('rework'),
            sorter: (a, b) => a.rework.length - b.rework.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Ganancia',
            dataIndex: 'ganancia',
            key: 'ganancia',
            align: "center",
            ...getColumnSearchProps('ganancia'),
            sorter: (a, b) => a.ganancia.length - b.ganancia.length,
            sortDirections: ['descend', 'ascend'],
        },

        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: "center",
            render: status => (

                status.map(status => {
                    if (status == 2) {
                        icon = <CheckCircleOutlined />
                        color = 'gold'
                        text = 'En cotización'
                    } else if (status == 3) {
                        icon = <ClockCircleOutlined />
                        color = 'default'
                        text = 'Pendiente de aprobación'
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
                    } else if (status == 7 ) {
                        icon = <CheckCircleOutlined />
                        color = 'success'
                        text = 'Entregado'
                    } else if (status == 14) {
                        icon = <CheckCircleOutlined />
                        color = 'success'
                        text = 'Cerrada'

                    } else if (status == 8) {
                        icon = <CloseCircleOutlined />
                        color = 'error'
                        text = 'Rechazado'
                    } else if (status == 9) {
                        icon = <CloseCircleOutlined />
                        color = 'magenta'
                        text = 'Cancelado'
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
            title: 'Inicio',
            dataIndex: 'fechaInicio',
            key: 'fechaInicio',
            align: "center",
            ...getColumnSearchProps('fechaInicio'),
            sorter: (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Cierre',
            dataIndex: 'close_date',
            key: 'close_date',
            align: "center",
            ...getColumnSearchProps('close_date'),
            // sorter: (a, b) => new Date(a.close_date) - new Date(b.close_date),
            sorter: (a, b) => a.close_date.length - b.close_date.length,
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

        <Table columns={columns}
            dataSource={data} scroll={{ x: '100vh' }}
            loading={loading}
        />


    );
}

