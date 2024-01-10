import React from 'react';
import { Modal} from 'antd';

export default function MyModal(props) {
    const { children, visible, title, onOk, onCancel } = props;
    return (
        <Modal
            title={title}
            centered
            closable
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}

        >
            {children}
        </Modal>
    );
}