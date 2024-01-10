import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function GetComplaints(){
    return request({
        url:    API.COMPLAINTS.GET_COMPLAINTS,
        method: requestMethods.GET
    })
}

function ComplaintChangeType(request_body){
    return request({
        url:    API.COMPLAINTS.CHANGE_TYPE,
        method: requestMethods.POST,
        data: {
            id:     request_body.id,
            value:  request_body.value
        },
    })
}

function ComplaintReject(request_body) {
    return request({
        url:    API.COMPLAINTS.REJECT,
        method: requestMethods.POST,
        data: {
            opcion:         request_body.opcion,
            descripcion:    request_body.descripcion,
            complaint_id:   request_body.complaint_id,
            complaint_num:  request_body.complaint_num,
            service_title:  request_body.service_title,
            user_id:        request_body.user_id,
            user_email:     request_body.user_email
        }
    })
}

function GetComplaint(request_body) {
    return request({
        url:    API.COMPLAINTS.GET_COMPLAINT.concat(request_body),
        method: requestMethods.GET
    })
}

function ComplaintRequest(request_body){
    return request({
        url:    API.COMPLAINTS.REQUEST,
        method: requestMethods.POST,
        data: {
            evidencia:      request_body.evidencia,
            desc_evidencia: request_body.desc_evidencia,
            order_id:       request_body.order_id,
            service_id:     request_body.service_id,
            service_title:  request_body.service_title,
            client_id:      request_body.client_id,
            client_org:     request_body.client_org,
            client_mail:    request_body.client_mail,
            order_num:      request_body.order_num,
            client_cost:    request_body.client_cost,
            supplier_cost:  request_body.supplier_cost,
            return_amount:  request_body.return_amount,
            subservices:    request_body.subservices,
            descs:          request_body.descs,
            evidencias:     request_body.evidencias
        },
    })
}


function InternalComplaint(request_body){
    return request({
        url:    API.COMPLAINTS.INTERNAL_COMPLAINT,
        method: requestMethods.POST,
        data: {
            service:    request_body.service,
            subservice: request_body.subservice
        }
    })
}

function SuppliersComplaint(request_body) {
    return request({
        url:    API.COMPLAINTS.SUPPLIERS_COMPLAINT,
        method: requestMethods.POST,
        data: {
            subservice_complaint_id: request_body.subservice_complaint_id,
            complaint_id: request_body.complaint_id,
            complaint_step: request_body.complaint_step,
            complaint_num: request_body.complaint_num,
            step_name: request_body.step_name,
            service_title: request_body.service_title,
            client_evidencias: request_body.client_evidencias,
            epno_desc: request_body.epno_desc,
            epno_evidencias: request_body.epno_evidencias
        }
    })
}

function CloseComplaint(request_body) {
    return request({
        url:    API.COMPLAINTS.CLOSE_COMPLAINT,
        method: requestMethods.POST,
        data: {
            complaint_id:       request_body.complaint_id,
            complaint_num:      request_body.complaint_num,
            service_title:      request_body.service_title,
            user_id:            request_body.user_id,
            user_mail:          request_body.user_mail,
            user_phone:         request_body.user_phone,
            user_name:          request_body.user_name,
            root_cause:         request_body.root_cause,
            leccion_aprendida:  request_body.leccion_aprendida,
            primer_d:           request_body.primer_d,
            segunda_d:          request_body.segunda_d,
            tercer_d:           request_body.tercer_d,
            cuarta_d:           request_body.cuarta_d,
            quinta_d:           request_body.quinta_d,
            sexta_d:            request_body.sexta_d,
            septima_d:          request_body.septima_d,
            octava_d:           request_body.octava_d,
            suppliers:          request_body.suppliers
        }
    })
}

const ComplaintService={
    ComplaintChangeType,
    ComplaintReject,
    ComplaintRequest,
    GetComplaint,
    GetComplaints,
    InternalComplaint,
    SuppliersComplaint,
    CloseComplaint
}

export default ComplaintService;