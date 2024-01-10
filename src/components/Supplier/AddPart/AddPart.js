import React, { useState } from 'react';
import { Form, Input, notification, Tooltip, Cascader, Select, Row, Col, Button, AutoComplete, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './AddPart.scss';
import Lang from '../../Language';
import SupplierService from '../../../utils/api/suppliers';


export default function () {

    let token = localStorage.getItem('token');
    const [form] = Form.useForm();

    const [load, setLoad] = useState(false)

    const sendForm = (values) => {
        // setLoad(true)

        SupplierService.AddPart(values)
        .then(response => {
            if (response.data.success == true) {
                openNotification();
                form.resetFields();
                setLoad(false);
            } else {
                setLoad(false);
                message.error("Hubo un error al dar de alta el numero de parte.")
            }
        })
        .catch(error => {
            console.log(error.response.data.errors)
        })

    }


    const tooltipIcon = (labelNo) => {
        return (
            <span>
                <Tooltip title={Lang("AddPart", labelNo)}>
                    <QuestionCircleOutlined />
                </Tooltip>
            </span>
        );
    };
    const inputCompanion = (labelNo, tooltiplabel) => {
        return ({
            placeholder: Lang("AddPart", labelNo),
            suffix: tooltipIcon(tooltiplabel)
        });
    };


    const openNotification = () => {
        const key = `open${Date.now()}`;

        notification.open({
            message: 'Nuevo numero de parte',
            description:
                'Has agregado un nuevo numero de parte, recuerda que este no se vera reflejado en tu lista, hasta que un agente de EP&O lo confirme.',
            key,
        });
    };

    return (
        <Form

            name="nest-messages"
            form={form}
            method="POST"
            layout="vertical"
            onFinish={sendForm}
        >

            <Row gutter={[12, 12]} >
                <Col xs={24}>
                    <Form.Item
                        name="name"
                        label={Lang("AddPart", "1")}
                        rules=
                        {[{
                            type: "string",
                            required: true,
                            message: Lang("AddPart", "2")
                        }]}>
                        <Input {...inputCompanion("3", "4")}
                            name='name'
                        // onChange={onFormChange}
                        // value={formValue.name}
                        />
                    </Form.Item>

                    <Form.Item
                        name='supplier_partno'
                        label={Lang("AddPart", "5")}
                        rules=
                        {[{
                            type: "string",
                            required: true,
                            message: Lang("AddPart", "6")
                        }]}>
                        <Input {...inputCompanion("7", "8")}
                            name='supplier_partno'
                        // onChange={onFormChange}
                        // value={formValue.supplier_partno}
                        />
                    </Form.Item>

                    <Form.Item
                        name="max_qty"
                        initialValue={1}

                        label={Lang("AddPart", "9")}
                        rules=
                        {[{

                            required: true,
                            message: Lang("AddPart", "10")
                        }]}>
                        <Input
                            min={1}
                            // defaultValue={1}
                            // required
                            type="number"
                            name="max_qty"
                            {...inputCompanion("10", "11")}
                        // value={formValue.max_qty}
                        // onChange={onFormChange}
                        />
                    </Form.Item>
                    <Form.Item
                        name="min_qty"
                        initialValue={1}
                        label={Lang("AddPart", "18")}
                        rules=
                        {[{

                            required: true,
                            message: Lang("AddPart", "20")
                        }]}>
                        <Input
                            min={1}
                            // defaultValue={1}
                            // required
                            type="number"
                            name="min_qty"
                            {...inputCompanion("18", "19")}
                        // value={formValue.min_qty}
                        // onChange={onFormChange}
                        />
                    </Form.Item>
                    <Form.Item
                        initialValue={1}
                        name="current_qty"
                        label={Lang("AddPart", "22")}
                        rules=
                        {[{

                            required: true,
                            message: Lang("AddPart", "23")
                        }]}>
                        <Input
                            min={1}
                            // required
                            type="number"
                            name="current_qty"
                            {...inputCompanion("22", "24")}
                        // value={formValue.current_qty}
                        // onChange={onFormChange}
                        />
                    </Form.Item>
                    <Form.Item
                        name="subtotal"
                        label="Precio"
                        rules=
                        {[{

                            required: true,
                            message: 'Favor de agregar el precio del número de parte'
                        }]}>
                        <Input
                            min={1}
                            step="0.5"
                            type="number"
                            name="subtotal"
                            {...inputCompanion("21", "17")}
                        // value={formValue.price}
                        // onChange={onFormChange}
                        />
                    </Form.Item>
                </Col>
                {/* <Col span={6}> */}

                {/* </Col> */}

                <Col xs={24}>
                    <Form.Item >
                        <Button type="primary" htmlType="submit" loading={load} style={{ width: "100%" }} >
                            Crear
                        </Button>
                    </Form.Item>
                </Col>


            </Row>


        </Form>
    );
}