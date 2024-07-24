import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import "../scss/reset-password.scss"
import { Table, Input, Button, Space, Tag, Rate, Switch, Col, Row, Avatar, message } from 'antd';
import moment from 'moment'
import LayoutPage from "../layouts/LayoutPage";
import SupplierLayout from "../layouts/SupplierLayout";
import CPLayout from "../layouts/ControlPanelLayout";
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { notificacionAction } from '../actions/notificationActions';
import Highlighter from 'react-highlight-words';
import Notification from '../utils/api/notifications';



export default function AllNotifications() {
    const [notifications, setNotifications] = useState([]);
    let token = localStorage.getItem('token');
    let role = localStorage.getItem('role');
    const [load, setLoad] = useState(true)
    var Layout = '';


    if (role == '4') {
        Layout = LayoutPage;
    } else if (role == 6) {
        Layout = SupplierLayout;
    } else if (role == 1 || role == 3 || role == 5) {
        Layout = CPLayout;
    }


    const [state, setState] = useState({
        searchText: '',
        searchedColumn: '',
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [loading, setLoading] = useState(false)
    const [reload, setReload] = useState(false)
    const searchInput = useRef(null);

    var color;
    const stateNotificaciones = useSelector(state => state.notifications.stateNotificacionesTotal);

    const dispatch = useDispatch();

    const notificacionesChange = state => {
        dispatch(notificacionAction(state));
    }

    useEffect(() => {
        Notification.GetNotifications()
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            setNotifications(data.notificaciones);
            setLoad(false)
        }).catch(console.log)
    }, [reload])

    const data = [];
    {
        notifications.map((ntf) => {
            var status = ntf.seen;
            var ntfS;
            if (status == 0) {
                ntfS = "No vista"

            } else if (status == 1) {
                ntfS = "Abierta"
            }
            data.push({
                key: ntf.id,
                notify: ntf.description,
                order: ntf.title,
                date: moment(ntf.created_at).format('L'),
                status: [ntfS],
                details: (<a href={`/#/orders/details/id/type`} onClick={() => ChangeNotification(ntf.id)} >Ver</a>),

            })
        })
    }
    const ChangeNotification = (id) => {
        Notification.ChangeStatus(id)
        .then(response => {
        })
        .catch(error => {
            console.log(error)
        })
    }
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
    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        role="primary"
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

    const columns = [

        {
            title: 'Notificación',
            dataIndex: 'notify',
            key: 'notify',
            // width: '30%',
            ...getColumnSearchProps('notify'),
            sorter: (a, b) => a.notify.length - b.notify.length,

        },
        {
            title: 'Orden',
            dataIndex: 'order',
            key: 'order',
            ...getColumnSearchProps('order'),
            sorter: (a, b) => a.order.length - b.order.length,

        },
        {
            title: 'Fecha',
            dataIndex: 'date',
            key: 'date',
            ...getColumnSearchProps('date'),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            ...getColumnSearchProps('status'),
            render: status => (
                <>
                    {status.map(status => {

                        if (status === "No vista") {
                            color = 'default';

                        } else if (status === "Abierta") {
                            color = 'green';
                        }
                        return (
                            <Tag color={color} key={status}>
                                {status}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Detalles',
            dataIndex: 'details',
            key: 'details',
        },
    ];
    const onSelectChange = selectedRowKeys => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const markRead = () => {
        setLoading(true)
        Notification.MarkAsRead( { 'keys': selectedRowKeys })
        .then(response => {
            if (response.data.success == true) {
                message.success('Información actualizada correctamente.')
                setReload(!reload)
                notificacionesChange(!stateNotificaciones);
                setSelectedRowKeys([])
                setLoading(false)
            } 
        })
        .catch(error => {
            console.log(error)
            message.error('Error al actualizar la información.')
            setLoading(false)
        })
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
        <Layout>
            <div style={{ marginBottom: 16 }}>
                <Button role="primary" onClick={markRead} disabled={!hasSelected} loading={loading}>
                    Marcar como leído
                </Button>
                <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `${selectedRowKeys.length} notificaciones seleccionadas` : ''}
                </span>
            </div>
            <Table columns={columns} dataSource={data} scroll={{ x: '100vh' }}
                rowClassName={(record) =>
                    record.status == "No vista" && 'table-row-blue'
                }
                rowSelection={rowSelection}
loading={load}
            />
        </Layout>
    )
}
