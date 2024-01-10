import { useEffect, useState } from 'react';
import AuthService from '../api/auth';

const [isAuthorized, setIsAuthorized] = useState();
const [loading, setLoading] = useState(true);
useEffect(() => {
    try {
        AuthService.check_session()
        .then( response => {
            setIsAuthorized(response.status === 200);
            setLoading(false)
        })
    } catch (error) {
        
    };
});

export default function CheckSessionState({children}) {
    return (
        <>
        { isAuthorized ? children : <h1>Unauthorized</h1>}
        </>
    );
}