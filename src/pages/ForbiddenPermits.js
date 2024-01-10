import { Result, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

export default function ForbiddenPermits() {
    const history = useNavigate();

    const onClick = () => {
        history(-1);
    };
    const subtitle = (
        <Typography.Title level={4}>
            Parece que no tienes permiso para entrar aqui. Intenta de nuevo o consulta a tu administrador.
        </Typography.Title>
    );
    const content = (
        <Button type="primary" size="large" onClick={onClick}>
            Regresar
        </Button>
    );

    return (
        <Result status="403" title="¡Oh, no!" subTitle={subtitle} extra={content}/>
    );
}
