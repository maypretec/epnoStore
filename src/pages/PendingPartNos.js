import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    Table, Select, Popconfirm, Form, notification, Input, Tooltip,
    Row,
    Col,
    Button,
    Card,
    Alert, Typography, message, InputNumber
} from 'antd';
import { CheckOutlined, EditOutlined, QuestionCircleFilled } from '@ant-design/icons';
import "../scss/reset-password.scss"
import Modal from '../components/Generals/MyModal'
import Layout from "../layouts/ControlPanelLayout";
import SupplierService from '../utils/api/suppliers';
import CategoryService from '../utils/api/categories';
import ProductService from '../utils/api/products';

export default function PendingPartNos() {
    const [formEpnoPart] = Form.useForm();
    const [partno, setPartno] = useState([]);
    const [partCategories, setPartCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [partnoSupplier, setPartnoSupplier] = useState([]);
    const [value, setValue] = useState('');
    const [category_id, setCategory_id] = useState('');
    const [reload, setReload] = useState(false)
    const [category, setCategory] = useState(false);
    const [unit, setUnit] = useState(false);
    const titleCategory = "Agregar categoria";
    const titleUnit = "Agregar unidad";
    const [name, setName] = useState({
        name: "",
        alert: false,
    });
    let role = localStorage.getItem('role');
    const [load, setLoad] = useState(false)
    let token = localStorage.getItem('token');
    const [newCategory, setNewCategory] = useState(false);
    const [newUnit, setNewUnit] = useState(false);
    const [add, setAdd] = useState(false);
    const [formValue, setFormValue] = useState({
        nombre: "",
        partno: "",
    });
    const [formImage, setFormImage] = useState({
        image: null
    });
    const [formImageCategory, setFormImageCategory] = useState({
        image: null
    });

    const [errorName, setErrorName] = useState(false);
    const [errorPartno, setErrorPartno] = useState(false);

    useEffect(() => {

        role == 1 &&
            ProductService.GetParts()
            .then((partno) => {
                setPartno(partno)

            }).catch(console.log)

        SupplierService.GetPartnos()
        .then((response) => {
            // console.log(response);
            return response.json()
        })
        .then((partnoSupplier) => {
            setPartnoSupplier(partnoSupplier)

        }).catch(console.log)


    }, [reload]);

    useEffect(() => {
        role == 1 && (
            CategoryService.GetCategories()
            .then((response) => {
                // console.log(response);
                return response.json()

            })
            .then((partCategories) => {
                setPartCategories(partCategories)

            }).catch(console.log)
        )

    }, [newCategory])

    useEffect(() => {
        role == 1 && (
            SupplierService.GetUnit()
            .then((response) => {
                // console.log(response);
                return response.json()

            })
            .then((units) => {
                setUnits(units)

            }).catch(console.log)
        )
    }, [newUnit])


    const originData = [];

    {
        partnoSupplier.map((part) => {
            originData.push({
                key: part.id,
                name: part.name,
                price: `$${part.price}`,
                supplier_partno: part.supplier_partno,
                category_id: `Pending`,
                epno_partno: 'Agregar'
            });
        })
    }

    const { Option } = Select;
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
                        <Select
                            name={dataIndex}
                            showSearch
                            style={{ width: 200 }}
                            optionFilterProp="children"
                            onChange={onChange}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                partno.map((part) => (

                                    <Option value={part.id} key={part.id} title={part.part_category_id}>{part.name}</Option>
                                ))
                            }

                        </Select>
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };
    const onChange = (value, title) => {
        setValue(value);
        setCategory_id(title.title);

    }
    const [form] = Form.useForm();

    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            supplier_partno: '',
            epno_partno: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };


    const save = (key, supplier_partno) => {

        ProductService.SendEpnoPart({ 
            "epno_id": value, 
            "partno_id": key, 
            'part_category_id': category_id 
        })
        .then(response => {
            setReload(!reload);
            setValue('')
            setCategory('')
            setEditingKey('');
            openNotification(supplier_partno);

        })
        .catch(error => {
            message.error('Debes de seleccionar una opción.')
        })

    };

    const openNotification = (supplier_partno) => {
        notification.success({
            message: 'Numero de parte editado.',
            description:
                `Se ha agregado el numero de parte de epno a ${supplier_partno} correctamente.`,
        });
    };
    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            width: '25%',
            align: "center",
            editable: false,
        },
        {
            title: 'Numero de Parte de Proveedor',
            dataIndex: 'supplier_partno',
            width: '25%',
            align: "center",
            editable: false,
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            width: '25%',
            align: "center",
            editable: false,
        },

        {
            title: 'Numero de parte de EP&O',
            dataIndex: 'epno_partno',
            width: '25%',
            align: "center",
            editable: true,
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            align: "center",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <xs>
                        <a
                            onClick={() => save(record.key, record.supplier_partno)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Guardar
                        </a>
                        <Popconfirm title="¿Esta seguro de cancelar?" onConfirm={cancel}>
                            <a>Cancelar</a>
                        </Popconfirm>
                    </xs>
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
                inputType: col.dataIndex === 'supplier_partno' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


    const onFinish = (values) => {

        setLoad(true)

        const params = new FormData();
        params.append('myFile', formImage.image);
        params.append('nombre', values.nombre);
        params.append('partno', values.partno);
        params.append('categoria', values.categoria);
        params.append('unidad', values.unidad);
        params.append('description', values.description);
        params.append('precio', values.price);


        SupplierService.AddPartnos()
        .then(response => {
            setLoad(false);
            if (response.data.success) {
                formEpnoPart.resetFields();
                setAdd(!add);
                setReload(!reload);
            }
            if (response.data.existe_partname) {
                setErrorName(!errorName);
            }
            if (response.data.existe_partnumber) {
                setErrorPartno(!errorPartno);
            }


        })
        .catch(error => {
            // setFormEmpty(!formEmpty);
            console.log(error);
            setLoad(false);
        })



    };

    const onFormValueChange = event => {
        setFormValue({
            ...formValue,
            [event.target.name]: event.target.value
        });
    };

    const onFormChange = event => {
        setName({
            ...name,
            [event.target.name]: event.target.value
        });
    };
    const onFileChange = event => {
        // Update the state 
        setFormImage({ image: event.target.files[0] });
    };
    const onFileChangeCategory = event => {
        // Update the state 
        setFormImageCategory({ image: event.target.files[0] });
    };



    const onCancel = (tipo) => {
        if (tipo == 'category') {
            setCategory(false);
            setName({ name: "" });
        } else if (tipo == 'unit') {
            setUnit(false);
            setName({ name: "" });
        }
    }

    const addCategory = (event) => {
        event.preventDefault();
        const params = new FormData();
        params.append('image', formImageCategory.image);
        params.append('name', name.name);

        SupplierService.AddCategory (params)
        .then(response => {

            if (response.data.success) {
                setName({ name: '' });
                formEpnoPart.resetFields();
                setCategory(false);
                setNewCategory(!newCategory);
                setAdd(true);
            }
            if (response.data.existe_paquete) {

                setName({ ...name, alert: true });
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
    const addUnit = (event) => {
        event.preventDefault();

        SupplierService.AddUnit(name)
        .then(response => {

            if (response.data.success) {
                setName({ name: '' });
                setUnit(false);
                setNewUnit(!newUnit);
                setAdd(true);
            }
            if (response.data.existe_paquete) {
                setName({ ...name, alert: true });
            }

        })
        .catch(error => {
            console.log(error)
        })
    }
    return (
        <Layout>
            <Card title="Añadir nuevos numeros de parte" headStyle={{ background: "#f0f2f5" }} style={{ marginBottom: 20 }}>
                {add && (
                    <Alert message="Añadido correctamente" type="success" closable showIcon style={{ marginBottom: 20 }} />
                )}
                {errorName && (
                    <Alert message="Ya existe un número de parte con este nombre." type="error" closable showIcon style={{ marginBottom: 20 }} />
                )}
                {errorPartno && (
                    <Alert message="El numero de parte asignado ya existe." type="error" closable showIcon style={{ marginBottom: 20 }} />
                )}
               
                <Row gutter={[12, 12]}>
                    <Col xs={24} lg={20} xl={16} style={{ marginLeft: "auto", marginRight: "auto" }}>
                        <Form
                            form={formEpnoPart}

                            name="register"
                            method="POST"
                            onFinish={onFinish}
                        // scrollToFirstError
                        >
                            <Form.Item>
                                <Row gutter={[12, 12]} justify="center">
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="nombre"
                                            label="Nombre"
                                            rules={[

                                                {
                                                    required: true,
                                                    message: 'Favor de ingresar un nombre para el numero de parte.',
                                                },
                                            ]}
                                        >
                                            <Input
                                                name="nombre"
                                            // onChange={onFormValueChange}
                                            // value={formValue.nombre}

                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="partno"
                                            label="Numero de parte"
                                            rules={[

                                                {
                                                    required: true,
                                                    message: 'Favor de ingresar el numero de parte.',
                                                },
                                            ]}
                                        >
                                            <Input
                                                name="partno"
                                            // onChange={onFormValueChange}
                                            // value={formValue.partno}

                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item>
                                <Row gutter={[12, 12]} justify="center">
                                    <Col xl={10} md={12} xs={24}>
                                        <Form.Item
                                            name="categoria"
                                            label="Categoria"
                                            rules={[

                                                {
                                                    required: true,
                                                    message: 'Selecciona una categoria.',
                                                },
                                            ]}
                                        >
                                            <Select
                                                name="categoria"
                                                showSearch
                                                placeholder="Categoria"
                                                optionFilterProp="children"

                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    partCategories.map((category) => (
                                                        <Option value={category.id} key={category.id} required>{category.name}</Option>

                                                    ))
                                                }

                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xl={2} md={12} xs={24}>
                                        <Button danger onClick={() => setCategory(true)}
                                            style={{ width: "100%" }}
                                        >Add</Button>
                                    </Col>
                                    <Col xl={10} md={12} xs={24}>
                                        <Form.Item
                                            name="unidad"
                                            label="Unidad"
                                            rules={[

                                                {
                                                    required: true,
                                                    message: 'Selecciona una unidad.',
                                                },
                                            ]}
                                        >
                                            <Select
                                                name="unidad"
                                                showSearch
                                                placeholder="Unidad"
                                                optionFilterProp="children"

                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    units.map((unit) => (
                                                        <Option value={unit.id} key={unit.id} required>{unit.name}</Option>

                                                    ))
                                                }
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col md={12} xs={24} xl={2}>
                                        <Button danger onClick={() => setUnit(true)}
                                            style={{ width: "100%" }}

                                        >Add</Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>
                                <Col xs={24}>
                                    <Form.Item
                                        name="description"
                                        label="Descripción"
                                        rules={[

                                            {
                                                required: true,
                                                message: 'Favor de escribir una descripción.',
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Describelo para tener mejores referencias."
                                            name="description"
                                        // onChange={onFormValueChange}
                                        // value={formValue.nombre}

                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[12, 12]} justify='center'>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="price"
                                        label="Precio"
                                        rules={[

                                            {
                                                required: true,
                                                message: 'Favor de ingresar el precio de este número de parte.',
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            style={{ width: "100%" }}
                                            precision={2}
                                            min="1"
                                            step="1"
                                            stringMode
                                            addonAfter={
                                                <Tooltip title='Recuerda que en el precio debes de tomar en cuenta el porcentaje de ganancia,pero este debe ser libre de iva.'>
                                                    <QuestionCircleFilled />
                                                </Tooltip>
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={16}>
                                    <Form.Item
                                        name="image"
                                        label="Imagen"
                                        rules={[

                                            {
                                                required: true,
                                                message: 'Agrega una imagen al producto.',
                                            },
                                        ]}
                                    >
                                        <input type="file" onChange={onFileChange} name="image" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" style={{ width: "100%" }} loading={load} >
                                            Crear
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>


                        </Form>
                    </Col>
                </Row>

            </Card>

            <Typography.Title
                className="site-page-header-responsive"
                title="Autorizaciones de numero de parte"
                subTitle="Revisa los numeros de parte que tienes pendiente de autorizar"
                avatar={{ icon: <CheckOutlined /> }}
            />



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

            <Modal visible={category} title={titleCategory} onOk={addCategory} onCancel={() => onCancel('category')}>
                {name.alert && (
                    <Alert message="La categoria ya existe" type="error" closable showIcon />
                )}
                <Form
                    form={formEpnoPart}
                    layout="vertical"
                    name="register"
                    method="POST"

                // scrollToFirstError
                >
                    <Row gutter={[12, 12]} justify="center">
                        <Col xs={24}>
                            <Form.Item
                                name="name"
                                label="Nombre"
                                rules={[

                                    {
                                        required: true,
                                        message: 'Ingresa un nombre en la categoria.',
                                    },
                                ]}
                            >
                                <Input placeholder="Nombre de la categoria" name='name' value={name.name} onChange={onFormChange} required />

                            </Form.Item>
                        </Col>
                    </Row>

                    <Col xs={24}>
                        <Form.Item
                            name="category_name"
                            label="Imagen"
                            rules={[

                                {
                                    required: true,
                                    message: 'Agrega una imagen al producto.',
                                },
                            ]}
                        >
                            <input type="file" onChange={onFileChangeCategory} name="category_name" required />
                        </Form.Item>
                    </Col>
                </Form>



            </Modal>
            <Modal visible={unit} title={titleUnit} onOk={addUnit} onCancel={() => onCancel('unit')}>
                {name.alert && (
                    <Alert message="Ya existe una unidad con ese nombre" type="error" closable showIcon />
                )}
                <h5>Ingrese un nombre:</h5>

                <Input placeholder="Nombre de la unidad" name='name' value={name.name} required onChange={onFormChange} />


            </Modal>
        </Layout>
    );

}

