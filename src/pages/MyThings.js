import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Tooltip, Button, Input, Alert } from 'antd';
import Layout from '../layouts/LayoutPage';
import { PlusOutlined } from '@ant-design/icons';
import ListMyPackage from "../components/Generals/ListMyPackages";
import Modal from '../components/Generals/MyModal'
import ProductService from "../utils/api/products";

export default function MyThings() {
    const [visible, setVisible] = useState(false);
    const [newProduct, setNewProduct] = useState(false);
    const title = "Agregar un nuevo paquete";
    let role = localStorage.getItem('role');

    let token = localStorage.getItem('token');
    const [name, setName] = useState({
        name: "",
        alert: false,
    });
    const [paquetes, setPaquetes] = useState([]);
    useEffect(() => {
        //paquetes
        role == 4 &&
            ProductService.GetPackages()
            .then((response) => {
                // console.log(response);
                return response.json()

            })
            .then((paquetes) => {
                setPaquetes(paquetes);
            }).catch(console.log)

    }, [newProduct]);

    const onFormChange = event => {
        setName({
            ...name,
            [event.target.name]: event.target.value
        });
    };

    const onCancel = () => {
        setVisible(false);
        setName({ name: "" });
    }

    const addPackage = (event) => {
        event.preventDefault();

        ProductService.AddPackage(name)
        .then(response => {

            if (response.data.success) {
                setName({ name: '' });
                setVisible(false);
                setNewProduct(!newProduct);
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
            <Row style={{ marginBottom: 16 }}>

                <Col>
                    <Tooltip title="Agregar un nuevo paquete">
                        <Button type="dashed" shape="square" icon={<PlusOutlined />} size="large" onClick={() => setVisible(true)} />
                    </Tooltip>

                </Col>
            </Row>

            <Modal setVisible={setVisible} visible={visible} title={title} onOk={(event) => addPackage(event)} onCancel={onCancel}>
                {name.alert ? (
                    <Alert message="Este paquete ya existe" type="error" closable showIcon />
                ) : null}
                <h5>Ingrese un nombre:</h5>

                <Input placeholder="Nombre del paquete" name='name' value={name.name} required onChange={onFormChange} />


            </Modal>
            <Row>
                <Col xs={24}>
                    <ListMyPackage paquetes={paquetes} />
                </Col>
            </Row>


        </Layout>
    )
}

