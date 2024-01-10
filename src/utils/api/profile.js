import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function ProfileInfo(request_body){
    return request({
        url: API.PROFILE.INFO.concat(request_body),
        method: requestMethods.GET
    })
}

const ProfileService = { 
    ProfileInfo
}

export default ProfileService;