import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function Country(){
    return request({
        url: API.REGISTER.COUNTRY,
        method: requestMethods.GET
    })
}

function State(request_body){
    return request({
        url: API.REGISTER.STATE.concat(request_body),
        method: requestMethods.GET
    })
}

function City(request_body){
    return request({
        url: API.REGISTER.CITY.concat(request_body),
        method: requestMethods.GET
    })
}

function PC(request_body){
    return request({
        url: API.REGISTER.PC.concat(request_body),
        method: requestMethods.GET
    })
}

function Colony(request_body){
    return request({
        url: API.REGISTER.COLONY.concat(request_body),
        method: requestMethods.GET
    })
}

function Categories(){
    return request({
        url: API.REGISTER.CATEGORIES,
        method: requestMethods.GET
    })
}

const RegisterService = { 
    Country,
    State,
    City,
    PC,
    Colony,
    Categories
}

export default RegisterService;