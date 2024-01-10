import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function GetReviews(){
    return request.get({
        url: API.SUPPLIERS.ADD_SUPPLIER,
        method: requestMethods.GET,
    })
}

const ReviewService={
    GetReviews
}

export default ReviewService;