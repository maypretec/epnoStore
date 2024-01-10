import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function Resend(){
    return request({
        url: API.EMAIL.RESEND,
        method: requestMethods.GET
    })
}

const EmailService = { 
    Resend
}

export default EmailService;