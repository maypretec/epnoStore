import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function ADD(request_body){
    return request({
        url: API.CUSTOMER.ADD,
        method: requestMethods.POST,
        data:{
            myFile: request_body.myFile,
            organizacion: request_body.organizacion,
            rfc: request_body.rfc,
            pais: request_body.pais,
            estado: request_body.estado,
            ciudad: request_body.ciudad,
            codigo_postal: request_body.codigo_postal,
            colonia: request_body.colonia,
            calle: request_body.calle,
            numero_exterior: request_body.numero_exterior,
            numero_interior: request_body.numero_interior,
            nombre_planta: request_body.nombre_planta,
            tipo: request_body.tipo,
            paisP: request_body.paisP,
            estadoP: request_body.estadoP,
            ciudadP: request_body.ciudadP,
            codigo_postalP: request_body.codigo_postalP,
            coloniaP: request_body.coloniaP,
            calleP: request_body.calleP,
            numero_exteriorP: request_body.numero_exteriorP,
            numero_interiorP: request_body.numero_interiorP
        }
    })
}

function ClientConsume(){
    return request({
        url: API.CUSTOMER.CLIENT_CONSUME,
        method: requestMethods.GET
    })
}

function Consume(){
    return request({
        url: API.CUSTOMER.CONSUME,
        method: requestMethods.GET
    })
}

function ProfileConsume(){
    return request({
        url: API.CUSTOMER.PROFILE_CONSUME,
        method: requestMethods.GET
    })
} 

function Earnings(){
    return request({
        url: API.CUSTOMER.EARNINGS,
        method: requestMethods.GET
    })
}

function EarningsSummary(){
    return request({
        url: API.CUSTOMER.EARNINGS_SUMMARY,
        method: requestMethods.GET
    })
}

const CustomerService ={
    ADD,
    Consume,
    ClientConsume,
    ProfileConsume,
    Earnings,
    EarningsSummary
}

export default CustomerService;