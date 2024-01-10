import request from '../services/HTTPClient';
import { requestMethods, API } from '../constants';

function All() {
    return request({
        url: API.CATEGORIES.GET,
        method: requestMethods.GET,
    });
}
function GetCategories(){
    return request({
        url: API.CATEGORIES.GET_CATEGORIES,
        method: requestMethods.GET,
    });
}

const CategoryService = { 
    All,
    GetCategories
};

export default CategoryService;