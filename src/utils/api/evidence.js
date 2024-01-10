import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function Response(request_body){
    return request({
        method: requestMethods.POST,
        url: API.EVIDENCE.RESPONSE,
        data: {
            descripcion: request_body.descripcion.descripcion,
            evidencia: request_body.evidencia,
            evidencia_id: request_body.evidencia_id,
            tabla: request_body.tabla,
            role: request_body.role,
            complaint_id: request_body.complaint_id,
            complaint_num: request_body.complaint_num,
            service_title: request_body.service_title,
            user_id: request_body.user_id,
            client_mail: request_body.client_mail
        }
    });
}

const EvidenceService = {
    Response
}; 

export default EvidenceService;