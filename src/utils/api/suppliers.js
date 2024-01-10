import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function AddSupplier(request_body){
    return request({
        url: API.SUPPLIERS.ADD_SUPPLIER,
        method: requestMethods.POST,
        data: {
            myFile: request_body.myFile,
            organizacion: request_body.organizacion,
            rfc: request_body.rfc,
            pais: request_body.pais,
            estado: request_body.estado,
            ciudad: request_body.ciudad,
            codigo_postal: request_body.codigo_postal,
            colonia: request_body.colonia,
            calle: request_body.calle,
            no_exterior: request_body.no_exterior,
            no_interior: request_body.no_interior,
            url: request_body.url,
            categoria: request_body.categoria,
            terminos: request_body.terminos
        },
    });
}

function Quote(request_body) {
    return request({
        url: API.SUPPLIERS.ADD_COT,
        method: requestMethods.PATCH,
        data: {
            email:              request_body.email,
            password:           request_body.password,
            cotizacion:         request_body.cotizacion,
            subservice_id:      request_body.subservice_id,
            service_id:         request_body.service_id,
            purchase:           request_body.purchase,
            costo:              request_body.costo.costo,
            cantidad:           request_body.cantidad,
            fecha_entrega:      request_body.fecha_entrega,
            cliente_vs:         request_body.cliente_vs,
            cliente_org_id:     request_body.cliente_org_id,
            created_at:         request_body.created_at,
            order_id:           request_body.order_id,
            type_code:          request_body.type_code,
            subservice_title:   request_body.subservice_title
        },
    });
}

function AddPart(request_body){
    return request({
        url: API.SUPPLIERS.ADD_PART,
        method: requestMethods.PATCH,
        data: {
            subtotal: request_body.subtotal,
            name: request_body.name,
            max_qty: request_body.max_qty,
            min_qty: request_body.min_qty,
            current_qty: request_body.current_qty
        }
    });
}

function PurchaseOrder(request_body) {
    return request({ 
        url: API.SUPPLIERS.COT,
        method: requestMethods.PATCH,
        data: {
            service:        request_body.service,
            supplier:       request_body.supplier,
            option:         request_body.option,
            subservices:    request_body.subservices
        }
    });
    
}

function SelectSuppliers(request_body) {
    return request({ 
        url: API.SUPPLIERS.SELECT_SUPPLIERS,
        method: requestMethods.POST,
        data: {
            service: request_body.serviceName,
            subservice: request_body.subservice,
            supplier: request_body.supplier,
            entrega: request_body.entrega,
            description: request_body.description
        }
    });
}

function EditSupplierPartNo(request_body) {
    return request({ 
        url: API.SUPPLIERS.EDIT_SUPPLIER_PARTNO,
        method: requestMethods.PATCH,
        data: {
            id: request_body.id,
            nombre: request_body.nombre,
            part_no: request_body.part_no,
            qty: request_body.qty
        }
    });
}

function AddPartnos(request_body){
    return request({
        url: API.ORDERS.SUPPLIERS.ADD_PARTNOS,
        method: requestMethods.POST,
        data: {
            myFile: request_body.myFile,
            nombre: request_body.nombre,
            partno: request_body.partno,
            categoria: request_body.categoria,
            unidad: request_body.unidad,
            decription: request_body.decription,
            precio: request_body.precio
        }
    });
}

function GetPartnos(){
    return request({
        url: API.ORDERS.SUPPLIERS.PARTNOS,
        method: requestMethods.GET
    });
}

function Partnos(){
    return request({
        url: API.ORDERS.SUPPLIERS.PARTNOS,
        method: requestMethods.GET
    });
}

function AddCategory(request_body) {
    return request({
        url: API.ORDERS.SUPPLIERS.ADD_CATEGORY,
        method: requestMethods.POST,
        data: {
            image: request_body.image,
            name: request_body.name
        }
    });
}

function AddUnit(request_body) {
    return request({
        url: API.ORDERS.SUPPLIERS.ADD_UNIT,
        method: requestMethods.POST,
        data: {
            name: request_body.name,
            alert: request_body.alert
        }
    });
}

function GetUnit() {
    return request({
        url: API.UNITS.ALL
    });
}

function ChangeStep(request_body){
    return request({
        url: API.ORDERS.SUPPLIERS.CHANGE_STEP,
        method: requestMethods.POST,
        data: {
            opcion:             request_body.opcion,
            complaint_id:       request_body.complaint_id,
            complaint_num:      request_body.complaint_num,
            service_title:      request_body.service_title,
            user_id:            request_body.user_id,
            user_email:         request_body.user_email,
            costo:              request_body.costo,
            descripcion:        request_body.descripcion,
            po:                 request_body.po,
            nueva_cotizacion:   request_body.nueva_cotizacion,
            suppliers:          request_body.suppliers
        }
    });
}

function ComplaintSupplier(request_body) {
    return request({
        url: API.ORDERS.SUPPLIERS.COMPLAINT_SUPPLIER,
        method: requestMethods.POST,
        data: {
            service: request_body.service,
            subservice: request_body.subservice
        }
    })
}
const SupplierService = {
    AddSupplier,
    AddPartnos,
    GetPartnos,
    Partnos,
    AddCategory,
    AddUnit,
    Quote,
    AddPart,
    EditSupplierPartNo,
    PurchaseOrder,
    SelectSuppliers,
    ChangeStep,
    ComplaintSupplier,
    GetUnit
}; 

export default SupplierService;