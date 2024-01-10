import React, { useState, useEffect } from 'react';
import { Row, Col, Empty } from 'antd';
import MyPackage from "../MyPackage";


export default function ListMyPackages(props) {
    const { paquetes } = props; 

    return (

        <Row gutter={[12, 12]}>
            {
                paquetes == '' ?
                    <Row justify='center' style={{marginLeft:'auto',marginRight:'auto'}}>
                        <Col xs={24} >
                            <Empty description='No tienes ningún paquete creado aun.'/>
                        </Col>
                    </Row>
                    :
                    paquetes.map((pack) => (
                        <Col xs={24} md={12} lg={6} >

                            <MyPackage nombre={pack} index={pack.id} key={pack.id} />
                        </Col>
                    )

                    )
            }
        </Row>

    )
}

