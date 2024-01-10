import React, { useState } from 'react';
import { Drawer as Draw } from 'antd'

export default function Drawer(props) {
    const {footerContent, visible,title, children,setVisible}=props;
   
      const onClose = () => {
        setVisible(false);
      };
    return (
        <Draw
            title={title}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            closable
            footer={footerContent}

        >
            {children}
        </Draw>
    )
}

