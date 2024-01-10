import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Col, Row, Table, Input, InputNumber, Popconfirm, Form, Typography, Button, Space, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined,EditOutlined } from '@ant-design/icons';
import Layout from '../layouts/ControlPanelLayout';
import ProductService from '../utils/api/products';

export default function EpnoPartnos() {
    let role = localStorage.getItem('role');
    const searchInput = useRef(null);
    const [partno, setPartno] = useState([]);
    const [reload, setReload] = useState(false)

    useEffect(() => {

        role == 1 && (
            ProductService.GetParts()
            .then((response) => {
                // console.log(response);
                return response.json()

            })
            .then((partnos) => {
                setPartno(partnos)

            }).catch(console.log)
        )

    }, [reload]);
    // console.log(partno);
    const originData = [];

    {
        partno.map((part) => {
            originData.push({
                key: part.id,
                name: part.name,
                partno: part.part_no,
                descripcion: part.description,
            });
        })
    }

    const [state, setState] = useState({
        searchText: '',
        searchedColumn: '',
    })

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
    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        const inputNode = <Input />;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Favor de agregar ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;
    const [data, setData] = useState(originData);
    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            partno: '',
            descripcion: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const values = await form.validateFields();
            ProductService.EditEpnoPart({
                'id': key, 
                'nombre': values.name,
                'partno': values.partno, 
                'desc': values.descripcion
            })
            .then(response => {
                // console.log(response.data.success);
                if (response.data.success == true) {
                    setReload(!reload);
                    setEditingKey('');
                    message.success('Numero de parte actualizado correctamente');
                } else if (response.data.success == false) {
                    setEditingKey('');
                    message.error('Error al actualizar numero de parte.');
                }

            })
            .catch(error => {
                console.log(error)
            })          
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            editable: true,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Partno.',
            dataIndex: 'partno',
            editable: true,
            align:"center",
            ...getColumnSearchProps('partno')
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            editable: true,
            ...getColumnSearchProps('descripcion')
        },
        {
            title: 'Editar',
            dataIndex: 'operation',
            align:"center",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a
                            href="javascript:;"
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Guardar
                        </a>
                        <Popconfirm title="¿Esta seguro de cancelar?" onConfirm={cancel}>
                            <a>Cancelar</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} >
                        <EditOutlined />
                    </Typography.Link>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'partno' && 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Layout>
            <Form form={form} component={false}>
                <Table
                    scroll={{ x: "100vh" }}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={originData}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                />
            </Form>
        </Layout>
    );
}
