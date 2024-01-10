import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Space, Tooltip, Popconfirm, Form, Typography, message, InputNumber, Row, Col, Badge } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import './ListParts.scss';
import SupplierService from '../../../utils/api/suppliers';



export default function () {
    let token = localStorage.getItem('token');

    const [partno, setPartno] = useState(
        {
            partnos: [],
        }
    )
    const searchInput = useRef(null);
    const [state, setState] = useState({ searchText: '', searchedColumn: '' });
    const [reload, setReload] = useState(false)


    useEffect(() => {

        SupplierService.Partnos()
        .then((response) => {
            return response.json()
        })
        .then((partnos) => {
            setPartno({ partnos: partnos })
        }).catch(console.log)


    }, [reload]);

    const sampledata = [];
    {
        partno.partnos.map((part) =>

            sampledata.push({
                key: part.id,
                partno: part.supplier_partno,
                name: part.name,
                qty: part.current_qty,
                min: part.min_qty,
                max: part.max_qty,
                category: part.category,
            })

        )
    }

    const handleReset = clearFilters => {
        clearFilters();
        setState({ searchText: '', searchedColumn: '' });
    };
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
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
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Buscar
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Limpiar
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
        const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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
    // const [data, setData] = useState(originData);
    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            partno: '',
            location: '',
            category: '',
            qty: '',

            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };
    // activar/desactivar, ir al mercado de rangos, ir a editar la info, borrar, desempeño

    const save = async (key) => {
        try {
            const values = await form.validateFields();
            
            SupplierService.EditSupplierPartNormal({
                'id': key, 
                'nombre': values.name,
                'partno': values.partno, 
                'qty': values.qty
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
                    message.error('Error al actualizar numero de parte.');
                    console.log(error)
                })

           
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns =
        [
            {
                title: 'No. Parte',
                dataIndex: 'partno',
                key: 'partno',
                editable: true,
                ...getColumnSearchProps('partno')
            },
            {
                title: 'Nombre',
                dataIndex: 'name',
                key: 'name',
                editable: true,
                ...getColumnSearchProps('name')
            },
           
            {
                title: 'Categoria',
                dataIndex: 'category',
                key: 'category',
                ...getColumnSearchProps('category')
            },
            {
                title: 'Disponible',
                dataIndex: 'qty',
                key: 'qty',
                editable: true,
                ...getColumnSearchProps('qty')
            },
            {
                title: 'Min Cant',
                dataIndex: 'min',
                key: 'min',
                ...getColumnSearchProps('min')
            },
            {
                title: 'Max Cant',
                dataIndex: 'max',
                key: 'max',
                ...getColumnSearchProps('max')
            },
            // {
            //     title: '',
            //     dataIndex: 'ac',
            //     key: 'ac',
            //     width: '5%',
            //     render: (text, record) => (
            //         actionMenu(record.key)
            //     )
            // }
            {
                title: 'Editar',
                dataIndex: 'operation',
                align: "center",
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
                inputType: col.dataIndex === 'qty' && 'number',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Row gutter={[12, 12]}>
            <Col xs={24}>
                <Badge color="red" text="Producto agotado" /> &nbsp;
                <Badge color="yellow" text="Cantidad minima alcanzada" /> &nbsp;
                <Badge color="orange" text="Producto por agotarse" /> &nbsp;
            </Col>
            <Col xs={24}>
                <Form form={form} component={false}>
                    <Table
                        scroll={{ x: "80vh" }}
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        dataSource={sampledata}
                        columns={mergedColumns}
                        rowClassName={(record) =>
                            record.qty === 0 ? 'table-row-red' :
                                record.min === record.qty
                                    ? 'table-row-yellow' : record.qty < record.min && record.qty > 0 && 'table-row-orange'}
                        pagination={{
                            onChange: cancel,
                        }}
                    />
                </Form>
            </Col>
        </Row>
    );
}