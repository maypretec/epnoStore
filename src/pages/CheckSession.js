import React, {useState, useEffect} from 'react';
import { Card, Skeleton } from 'antd';
import AuthService from '../utils/api/auth';
import MerchantsService from '../utils/api/merchants';

export default function CheckSession() {
    useEffect(() => {
        MerchantsService.MerchantsDummy('98821d4a40fe4df088df01e8b49689f3');
    }, []);
    return (<></>);
}