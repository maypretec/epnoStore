import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Error404() {

    const navigate = useNavigate();

    const navigateBack = () => {
        navigate(-1);
    }
    return (
        <Result
            style={{ background: "#fff" }}
            status="404"
            title="¡Oh, no!"
            subTitle="No pudimos encontrar lo que buscas"
            extra={
                <Button type="primary" onClick={navigateBack}>
                    Volver a Inicio
                </Button>}
        />
    )
}

