import React from 'react';
import { Col, Row } from 'antd';
import { useParams } from 'react-router-dom';
import RegisterCustomer from '../components/RegisterCustomer'
import RegisterSupplier from '../components/RegisterSupplier'

export default function CompetaRegistro() {
    let { role } = useParams();

    return (

        role == 8 ?
        <RegisterCustomer />
        :
        <RegisterSupplier/>

    )
}