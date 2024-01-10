import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function AddCatalogue(request_body){
    return request({
        url: API.CATALOGUE.ADD,
        method: requestMethods.POST,
        data: {
            data:   request_body.data,
            option: request_body.option
        }
    })
}

function GetCatalogues(){
    return request({
        url: API.CATALOGUE.GET_CATALOGUES,
        method: requestMethods.GET
    })
}

const Catalogue = { 
    AddCatalogue,
    GetCatalogues
}

export default Catalogue;