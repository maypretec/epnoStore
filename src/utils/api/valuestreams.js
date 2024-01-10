import request from '../services/HTTPClient';
import { requestMethods, API } from '../constants';

function All() { 
    return request({
        url: API.VALUESTREAM.VALUESTREAMS,
        method: requestMethods.GET,
    });
}

const ValueStreamService = { All }

export default ValueStreamService;
