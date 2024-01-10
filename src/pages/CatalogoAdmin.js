import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Divider, Input, Alert, Spin, message, Empty } from 'antd';
import CatalogoTable from '../components/Agent/CatalogoTable';
import Layout from "../layouts/ControlPanelLayout";

import '../scss/catalogos.scss'
import { PlusCircleTwoTone } from '@ant-design/icons';
import CatalogueService from '../utils/api/catalogues';
import Modal from '../components/Generals/MyModal'


export default function CatalogoAdmin() {
    const [visible, setVisible] = useState(false)
    const [option, setOption] = useState()
    const [title, setTitle] = useState()
    const [data, setData] = useState([])
    const [reload, setReload] = useState(false)
    const [modal, setModal] = useState({
        name: "",
    })
    let token = localStorage.getItem('token');

    useEffect(() => {
        CatalogueService.GetCatalogues()
        .then((response) => {
            return response.json()

        })
        .then((data) => {
            setData(data)

        }).catch(console.log)

    }, [reload])

    const addCatalogo = (title, visible, option) => {
        setVisible(visible);
        setTitle(title);
        setOption(option);
    }



    const onFormChange = event => {
        setModal({
            ...modal,
            [event.target.name]: event.target.value
        });
    };
    const handleOk = () => {
        CatalogueService.AddCatalogue({ 
            'data': modal.name, 
            'option': option 
        })
        .then(response => {
            if (response.data.success == true) {
                setReload(!reload)
                message.success('Dato agregado correctamente');
                setModal({ name: '' });
                setVisible(false)
            } else {
                message.error('Error al guardar información');
            }
        })
        .catch(error => {
            message.error('Error al guardar información');

        })

    };

    const handleCancel = () => {
        setVisible(false)
        setModal({ name: '' });
    };


    return (
        <Layout>
            {
                data == '' ?
                    <Row justify="center">
                        <Col xs={24} >
                            <Empty description='No hay catalogos que mostrar' />
                        </Col>
                    </Row>
                    :
                    <Row gutter={12}>

                        <Col xs={24} md={12} lg={8} xl={6}>
                            <Card title="Roles" bordered={false} className='card_style' extra={<PlusCircleTwoTone className='icon_style' twoToneColor='#40A9FF' onClick={() => addCatalogo('Roles', true, 1)} />} >
                                <CatalogoTable data={data.roles} />
                            </Card>
                        </Col>
                        <Col xs={24} md={12} lg={8} xl={6}>
                            <Card title="Unidades" bordered={false} className='card_style' extra={<PlusCircleTwoTone className='icon_style' twoToneColor='#40A9FF' onClick={() => addCatalogo('Unidades', true, 2)} />} >
                                <CatalogoTable data={data.units} />

                            </Card>
                        </Col>

                        <Col xs={24} md={12} lg={8} xl={6}>
                            <Card title="Categorias" bordered={false} className='card_style' extra={<PlusCircleTwoTone className='icon_style' twoToneColor='#40A9FF' onClick={() => addCatalogo('Categorias', true, 3)} />} >
                                <CatalogoTable data={data.categorias} />

                            </Card>
                        </Col>
                        <Col xs={24} md={12} lg={8} xl={6}>
                            <Card title="Valuestreams" bordered={false} className='card_style' extra={<PlusCircleTwoTone className='icon_style' twoToneColor='#40A9FF' onClick={() => addCatalogo('Valuestream', true, 4)} />} >
                                <CatalogoTable data={data.vs} />

                            </Card>
                        </Col>


                        <Modal title={title} visible={visible} onOk={handleOk} onCancel={handleCancel}>

                            <Input placeholder="Ingrese el dato" name='name' value={modal.name} required onChange={onFormChange} />
                        </Modal>
                    </Row>
            }

        </Layout>

    )

}