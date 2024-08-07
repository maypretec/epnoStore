import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function OpenOrders() {
  return request({
    url: API.ORDERS.OPEN,
    method: requestMethods.GET,
  });
}

function AddRequest(request_body) {
  return request({
    url: API.ORDERS.ADD_REQUEST,
    method: requestMethods.POST,
    data: {
      subtotal: request_body.subtotal,
      finalCost: request_body.finalCost,
      precio_iva: request_body.precio_iva,
      iva: request_body.iva,
      supp_total: request_body.supp_total,
      supp_subtotal: request_body.supp_subtotal,
      id_mro_parts: request_body.id_mro_parts,
    },
  });
}

function OrderDetailsOLD(request_body) {
  return request({
    url: API.ORDERS.DETAILS.concat(request_body),
    method: requestMethods.GET,
  });
}

function AddSubservice(request_body) {
  return request({
    url: API.ORDERS.SUBSERVICES.ADD,
    method: requestMethods.POST,
    data: {
      option: request_body.option,
      service: request_body.details.service,
      subservices: request_body.subservices,
    },
  });
}

function UploadQuote(request_body) {
  return request({
    url: API.ORDERS.AGENTS.UPLOAD_QUOTE,
    method: requestMethods.POST,
    data: {
      client_info: request_body.client_info,
      service_info: request_body.service_info,
      subservices: request_body.subservices,
      iva: request_body.iva,
      unidad: request_body.unidad,
      currency: request_body.currency,
      tipo_cambio: request_body.tipo_cambio,
      condiciones_pago: request_body.condiciones_pago,
      vigencia: request_body.vigencia,
    },
  });
}

function RecommendedSuppliers(request_body) {
  return request({
    url: API.ORDERS.SUPPLIERS.GET_RECOMMENDED,
    method: requestMethods.POST,
    data: {
      service: request_body.service,
      subservice: request_body.subservice,
      categoria: request_body.categoria,
      order_id: request_body.order_id,
    },
  });
}
function AddSuppliersToSubservice(request_body) {
  return request({
    url: API.ORDERS.SUPPLIERS.ADD_SUPPLIERS_TO_SUBSERVICE,
    method: requestMethods.POST,
    data: {
      service: request_body.service,
      subservice: request_body.subservice,
      values: request_body.values,
    },
  });
}
function RejectBidding(request_body) {
  return request({
    url: API.ORDERS.SUPPLIERS.REJECT_BIDDINGS,
    method: requestMethods.POST,
    data: {
      service: request_body.service,
      subservice: request_body.subservice,
      comentario: request_body.comentario,
      client_vs: request_body.client_vs,
      client_org_id: request_body.client_org_id,
      created_at: request_body.created_at,
      order_id: request_body.order_id,
      type_code: request_body.type_code,
      service_title: request_body.service_title,
    },
  });
}
function UpdateServiceInfo(request_body) {
  return request({
    url: API.ORDERS.SERVICES.CHANGE_INFO,
    method: requestMethods.POST,
    data: {
      client_info: request_body.client_info,
      service_info: request_body.service_info,
      subservice_id: request_body.subservice_id,
    },
  });
}

function ChangeServiceStep(request_body) {
  return request({
    url: API.ORDERS.SERVICES.CHANGE_STEP,
    method: requestMethods.POST,
    data: {
      service: request_body.service,
      step: request_body.step,
    },
  });
}

function AcceptOrReject(request_body) {
  return request({
    url: API.ORDERS.SUBSERVICES.ACCEPT_OR_REJECT,
    method: requestMethods.POST,
    data: {
      check: request_body.check,
      supplier_id: request_body.supplier,
      subservice_id: request_body.subservice,
      service_id: request_body.service,
    },
  });
}
function AcceptSubserviceList(request_body) {
  return request({
    url: API.ORDERS.SUBSERVICES.ACCEPT_SUBSERVICE_LIST.concat(
      "/",
      request_body.service
    ),
    method: requestMethods.GET,
  });
}

function GeneralServices(request_body) {
  console.log(request_body);
  return request({
    url: API.ORDERS.SERVICES.GENERAL_SERVICES,
    method: requestMethods.POST,
    data: {
      fileList: request_body.fileList,
      title: request_body.title,
      description: request_body.description,
      time: request_body.time,
    },
  });
}

function CancelRequest(request_body) {
  return request({
    url: API.ORDERS.SUPPLIERS.CANCEL_REQUEST,
    method: requestMethods.POST,
    data: {
      client_info: request_body.client_info,
      service_info: request_body.service_info,
      subservices: request_body.subservices,
      comentario: request_body.comentario,
      option: request_body.option.comentario,
    },
  });
}

function QuoteAgain(request_body) {
  return request({
    url: API.ORDERS.SUPPLIERS.QUOTE_AGAIN,
    method: requestMethods.POST,
    data: {
      supplier: request_body.supplier,
      service: request_body.service,
      subservice: request_body.subservice,
    },
  });
}

function SendOrderComment(request_body) {
  return request({
    url: API.ORDERS.COMMENTS.SEND,
    method: requestMethods.POST,
    data: {
      comment: request_body.comment,
      service_id: request_body.service_id,
      setp_id: request_body.setp_id,
      order_num: request_body.order_num,
      order_id: request_body.order_id,
      receptor: request_body.receptor,
      receptor_mail: request_body.receptor_mail,
      conversacion: request_body.conversacion,
    },
  });
}

function ChangeStep(request_body) {
  return request({
    url: API.ORDERS.SUBSERVICES.CHANGE_STEP,
    method: requestMethods.POST,
    data: {
      opcion: request_body.opcion,
      complaint_id: request_body.complaint_id,
      complaint_num: request_body.complaint_num,
      service_title: request_body.service_title,
      user_id: request_body.user_id,
      user_email: request_body.user_email,
      costo: request_body.costo,
      descripcion: request_body.descripcion,
      po: request_body.po,
      nueva_cotizacion: request_body.nueva_cotizacion,
      suppliers: request_body.suppliers,
      subservice_complaint: request_body.subservice_complaint,
      supplier_desc: request_body.supplier_desc,
      subservice_title: request_body.subservice_title,
      supplier_id: request_body.supplier_id,
      supplier_email: request_body.supplier_email,
    },
  });
}

function NewService2(request_body) {
  return request({
    url: API.ORDERS.SERVICES.NEW_SERVICE,
    method: requestMethods.POST,
    data: {
      name: request_body.name,
      status: request_body.status,
    },
  });
}

/* MAYPRETEC ------------------------------------------------------------------------ */
function NewService(body) {
	return request({
    url: API.ORDERS.SERVICES.NEW_SERVICE,
    method: requestMethods.POST,
    data: body
  });
}

function GetServicesByUser(body) {
	return request({
    url: API.ORDERS.SERVICES.GET_BY_USER,
    method: requestMethods.POST,
    data: body
  });
}

function GetServicesByCategory(body){
  return request({
    url: API.ORDERS.SERVICES.GET_BY_CATEGORY,
    method: requestMethods.POST,
    data: body
  })
}

function GetAll(){
  return request({
    url: API.ORDERS.SERVICES.GET_ALL,
    method: requestMethods.GET,
  });
}

function ServiceDetails(request_body) {
  return request({
    url: API.ORDERS.SERVICES.DETAILS.concat(request_body),
    method: requestMethods.GET,
  });
}

function UpdateService(body) {
  return request({
    url: API.ORDERS.SERVICES.UPDATE,
    method: requestMethods.POST,
    data: body
  });
}

function UpdateServicePlacement(body) {
  return request({
    url: API.ORDERS.SERVICES.UPDATE_PLACEMENT,
    method: requestMethods.POST,
    data: body
  });
}

function ApplyService(body) {
  return request({
    url: API.ORDERS.SERVICES.APPLY,
    method: requestMethods.POST,
    data: body
  });
}

function GetProposalByService(body) {
  return request({
    url: API.ORDERS.SERVICES.GET_PROP_SERVICE,
    method: requestMethods.POST,
    data: body
  });
}

function GetProposalByUser(body) {
  return request({
    url: API.ORDERS.SERVICES.GET_PROP_USER,
    method: requestMethods.POST,
    data: body
  });
}

function ChooseProposal(body) {
  return request({
    url: API.ORDERS.SERVICES.CHOOSE_PROPOSAL,
    method: requestMethods.POST,
    data: body
  });
}

function UploadIndustryPO(body) {
  return request({
    url: API.ORDERS.SERVICES.UPLOAD_INDUSTRY_PO,
    method: requestMethods.POST,
    data: body
  });
}

function UploadSupplierPO(body) {
  return request({
    url: API.ORDERS.SERVICES.UPLOAD_SUPPLIER_PO,
    method: requestMethods.POST,
    data: body
  });
}

const OrderService = {
  OpenOrders,
  AddRequest,
  OrderDetailsOLD,
  AddSubservice,
  UploadQuote,
  RecommendedSuppliers,
  AddSuppliersToSubservice,
  RejectBidding,
  UpdateServiceInfo,
  ChangeServiceStep,
  AcceptOrReject,
  AcceptSubserviceList,
  CancelRequest,
  QuoteAgain,
  SendOrderComment,
  GeneralServices,
  ChangeStep,

  NewService,
  GetServicesByUser,
  ServiceDetails,
  GetAll,
  UpdateService,
  UpdateServicePlacement,
  GetServicesByCategory,
  ApplyService,
  GetProposalByService,
  GetProposalByUser,
  ChooseProposal,
  UploadIndustryPO,
  UploadSupplierPO
};

export default OrderService;
