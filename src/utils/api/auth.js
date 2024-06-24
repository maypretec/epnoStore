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

function LoginEpno(body) {
	return request({
		url: API.AUTH.LOGIN_EPNO,
		method: requestMethods.POST,
		data: {
			email: 		body.email,
			password: body.password
		} 
	})
}

function Register(request_body) {
    console.log(request_body)
    return request({
        url:    API.AUTH.REGISTER,
        method: requestMethods.POST,
        data: request_body
    }).catch(error => {console.log(error)})
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
		LoginEpno,
    Register, 
    CheckSession,
    PasswordEmail,
    PasswordReset
};

export default AuthService;
