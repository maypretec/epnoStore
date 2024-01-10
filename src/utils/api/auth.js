import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function Login(request_body) {
    return request({
        url: API.AUTH.LOGIN,
        method: requestMethods.POST,
        data: {
            email:      request_body.email,
            password:   request_body.password
        },
    });
}
function Register(request_body) {
    return request({
        url:    API.AUTH.REGISTER,
        method: requestMethods.POST,
        data: {
            name:           request_body.name,
            email:          request_body.email,
            password:       request_body.password,
            phone:          request_body.phone,
            calle:          request_body.calle,
            ciudad:         request_body.ciudad,
            codigo_postal:  request_body.codigo_postal,
            colonia:        request_body.colonia,
            estado:         request_body.estado,
            num_ext:        request_body.num_ext,
            num_int:        request_body.num_int,
            organizacion:   request_body.organizacion,
            pais:           request_body.pais,
            rfc:            request_body.rfc,
            role:           request_body.role,
            logo:           request_body.logo,
        }
    })
}

function PasswordReset(request_body) {
    return request({
        url:    API.AUTH.PASSWORD_RESET,
        method: requestMethods.POST,
        data: {
            email: request_body.email,
            password: request_body.password,
            token: request_body.token,
            password_confirmation: request_body.password_confirmation
        }
    })
}

function PasswordEmail(){
    return request({
        url:    API.AUTH.PASSWORD_EMAIL,
        method: requestMethods.POST,
    })
}

function CheckSession() {
    return request({
        url:    API.AUTH.CHECK_SESSION,
        method: requestMethods.POST,
    })
}

const AuthService = { 
    Login, 
    Register, 
    CheckSession,
    PasswordEmail,
    PasswordReset
};

export default AuthService;
