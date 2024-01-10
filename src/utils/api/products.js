import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function AddProducts(request_body){
    return request({
        url: API.PRODUCTS.ADD,
        method: requestMethods.POST,
        data: {
            epno_part_id:   request_body.epno_part_id,
            cost:           request_body.cost,
            qty:            request_body.qty,
            current_qty:    request_body.current_qty,
            part_no_id:     request_body.part_no_id
        }
    });
        
}

function GetProducts(){
    return request({
        url: API.PRODUCTS.GET,
        method: requestMethods.GET,
    });
}

function DeleteProducts (request_body){
    return request({
        url: API.PRODUCTS.DELETE_PRODUCTS.concat(request_body),
        method: requestMethods.POST,
    });
}

function AddBundle(request_body) {
    return request({
        url: API.PRODUCTS.ADD_BUNDLE.concat(request_body),
        method: requestMethods.POST,
    });
}

function AddToPackage(request_body) {
    return request({
        url: API.PRODUCTS.ADD_TO_PACKAGE,
        method: requestMethods.POST,
        data: {
            bundle_id:      request_body.bundle_id,
            qty:            request_body.qty,
            epno_part_id:   request_body.epno_part_id
        }
    });
}

function AddPackage(request_body){
    return request({
        url: API.PRODUCTS.ADD_PACKAGE,
        method: requestMethods.POST,
        data:{
            name: request_body.name,
            alert: request_body.alert
        }
    });
}

function Answer(resquest_body){
    return request({
        url: API.PRODUCTS.ANSWER,
        method: requestMethods.POST,
        data: {
            respuesta: resquest_body.respuesta,
            id: resquest_body.id,
            user_comment: resquest_body.user_comment,
            epno_part_id: resquest_body.epno_part_id
        }
    });
}

function DeleteBundlePart(request_body) {
    return request({
        url: API.PRODUCTS.DELETE_BUNDLE_PART.concat(request_body),
        method: requestMethods.POST,
    });
}

function SendComment(request_body) {
    return request({
        url: API.PRODUCTS.SEND_COMMENT,
        method: requestMethods.POST,
        data: {
            comment:        request_body.comment,
            epno_part_id:   request_body.epno_part_id
        }
    });
}

function EditEpnoPart(request_body) {
    return request({
        url: API.PRODUCTS.EDIT_EPNO_PART,
        method: requestMethods.POST,
        data:{
            id:     request_body.id,
            nombre: request_body.nombre,
            partno: request_body.partno,
            desc:   request_body.desc
        }
    });
}

function SendEpnoPart(request_body) {
    return request({
        url: API.PRODUCTS.SEND_EPNO_PART_90,
        method: requestMethods.POST,
        data: {
            epno_id: request_body.epno_id,
            partno_id: request_body.partno_id,
            part_category_id: request_body.part_category_id
        }
});
}

function MroPartUp(request_body){
    return request({
        url: API.PRODUCTS.MRO_PART_UP,
        method: requestMethods.POST,
        data: {
            id: request_body.id,
            qty: request_body.qty
        }
    });
}

function GetParts() {
    return request({
        url: API.PRODUCTS.GET_PARTS,
        method: requestMethods.GET
    });
}

function GetPackages(){
    return request({
        url: API.PRODUCTS.GET_PACKAGES,
        method: requestMethods.GET
    });
}

function GetBundle(request_body) {
    return request({
        url: API.PRODUCTS.GET_BUNDLE.concat(request_body),
        method: requestMethods.GET
    });
}

function GetDetails(request_body) { 
    return request({
        url: API.PRODUCTS.GET_DETAILS.concat(request_body),
        method: requestMethods.GET
    });
}

function GetComments(request_body) {
    return request({
        url: API.PRODUCTS.GET_COMMENTS.concat(request_body),
        method: requestMethods.GET
    });
}

const ProductService = {
    AddProducts,
    GetProducts,
    DeleteProducts,
    AddBundle,
    AddToPackage,
    AddPackage,
    Answer,
    DeleteBundlePart,
    SendComment,
    EditEpnoPart,
    SendEpnoPart,
    MroPartUp,
    GetParts,
    GetPackages,
    GetBundle,
    GetDetails,
    GetComments
}

export default ProductService;