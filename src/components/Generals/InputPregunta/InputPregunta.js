import React, { useState, useEffect } from 'react';
import {  Input, Form, Button,  message,  } from 'antd';
import { SendOutlined} from '@ant-design/icons';
import ProductService from '../../../utils/api/products';



export default function InputPregunta(props) {
const {id,reload, setReload,token}=props;
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false)

    const onFinish = (event) => {
        setLoading(true);
        
        ProductService.SendComment({
            comment: inputValue,
            epno_part_id: id
        })
        .then(response => {
            if (response.data.success == true) {
                setInputValue('');
                setReload(!reload);
                setLoading(false);
                message.success('Mensaje enviado correctamente.');
            } else {
                setLoading(false);
                message.error('Error al enviar mensaje');
            }
        })
        .catch(error => {
            // console.log(error.response.data.errors)
            // setInputValue('');
            setLoading(false);
            message.error('Error al enviar mensaje');
        })
    }
    const keyPress = (e) => {
        if (e.keyCode == 13) {
            onFinish();
            // put the login here
        }
    }

    const suffix = (
        <Button
            type="link"
            //  disabled={fileList.length === 0}
            loading={loading}
        >
            <SendOutlined
                onClick={onFinish}

                style={{
                    fontSize: 20,
                    color: '#1890ff',
                }} />

        </Button>
    );
    return (
        <Form onFinish={onFinish} style={{ marginBottom: 25 }}>

            <Input
                required
                name='inputValue'
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={keyPress}
                value={inputValue}
                // bordered={false}
                placeholder="Agregar una pregunta o comentario del producto..."
                suffix={suffix}
            // size="large"
            />
        </Form>
    );
}