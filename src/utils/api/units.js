import request from '../services/HTTPClient';
import { requestMethods, API } from '../constants';

function All() {
    return request({
        url: API.UNITS.ALL
    });
}

const UnitService = { All };

export default UnitService;