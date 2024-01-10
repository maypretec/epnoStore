import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Input, Table, Button, Space, Tag } from 'antd';

import GeneralTable from '../components/Generals/ComplaintsTable/GeneralTable'
import AgentTable from '../components/Generals/ComplaintsTable/AgentTable'
// import Layout from "../../views/layouts/LayoutPage";
// import "../../sass/SeguimientoOrdenes.scss";
import LayoutPage from "../layouts/LayoutPage";
import SupplierLayout from "../layouts/SupplierLayout";
import CPLayout from "../layouts/ControlPanelLayout";

import { Link, useParams } from 'react-router-dom';
import ComplaintService from '../utils/api/complaints';

export default function SeguimientoQuejas() {
    let role_auth = localStorage.getItem('role');
    var Layout = '';
    let token = localStorage.getItem('token');
    const [openComplaints, setOpenComplaints] = useState([])
    const [loading, setLoading] = useState(false);

    if (role_auth == 4) {
        Layout = LayoutPage;
    } else if (role_auth == 6) {
        Layout = SupplierLayout;
    } else if (role_auth == 1 || role_auth == 3 || role_auth == 5 || role_auth == 2 || role_auth == 10) {
        Layout = CPLayout;
    }

    useEffect(() => {

        if (role_auth == 1 || role_auth == 3 || role_auth == 5 || role_auth == 2 || role_auth == 6 || role_auth == 4 || role_auth == 10) {
            setLoading(true)
            ComplaintService.GetComplaints()
            .then((response) => {
                return response.json()

            })
            .then((openComplaints) => {
                setOpenComplaints(openComplaints)
                setLoading(false)


            }).catch(console.log)
        }

    }, [])

    return (
        <Layout>
            <Row gutter={24}>
                <Col xs={24} >

                    {
                        (role_auth == 6 || role_auth == 4) ? (
                            <GeneralTable openComplaints={openComplaints} loading={loading} role={role_auth} />
                        ) :
                            (role_auth == 1 || role_auth == 5 || role_auth == 3 || role_auth == 2 || role_auth == 10) && (
                                <AgentTable openComplaints={openComplaints} loading={loading} />
                            )
                    }

                </Col>
            </Row>
        </Layout>
    );
}

