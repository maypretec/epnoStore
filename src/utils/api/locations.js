import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function Create(request_body){
    return request({
        url: API.LOCATIONS.CREATE,
        method: requestMethods.POST,
        data:{
            organization_id:    request_body.organization_id,
            name:               request_body.name,
            colony_id:          request_body.colony_id,
            street:             request_body.street,
            internal_number:    request_body.internal_number,
            external_number:    request_body.external_number,
            type:               request_body.type,
            status:             request_body.status
        }
    })
}

const LocationService ={
    Create
}

export default LocationService;