import request from '../services/HTTPClient'
import { requestMethods } from '../constants'

function MerchantsDummy(request_body) {
    return request({
        url: '/api/merchants'.concat('/', request_body),
        method: requestMethods.GET,
    })
}
function NewMerchant(request_body) {
    return request({
        url: 'api/merchants',
        method: requestMethods.POST,
        data: {
            ...request_body
        }
    });
}

const MerchantsDummyRequest = {MerchantsDummy, NewMerchant};

export default MerchantsDummyRequest;