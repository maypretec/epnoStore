import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function Send(request_body){
    return request({
        url: API.RATES.SEND,
        method: requestMethods.POST,
        data:{
            valor: request_body.valor,
            order: request_body.order
        }
    })
}

const RatesService ={
    Send
}

export default RatesService;