import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function All(request_body) {
  return request({
    url: API.USER.USERS.concat("/", request_body.role),
    method: requestMethods.GET,
  });
}

function Change_User(request_body) {
  return request({
    url: API.USER.CHANGE_USER,
    method: requestMethods.POST,
    data: {
      id: request_body.value,
      value: request_body.value,
    },
  });
}

function NewUser(request_body) {
  return request({
    url: API.USER.NEW_USER,
    method: requestMethods.POST,
    data: {
      organization_id: request_body.organization_id,
      name: request_body.name,
      colony_id: request_body.colony_id,
      street: request_body.street,
      internal_number: request_body.internal_number,
      external_number: request_body.external_number,
      type: request_body.type,
      status: request_body.status,
    },
  });
}

function NewUserRequest(request_body) {
  return request({
    url: API.USER.NEW_USER_REQUEST,
    method: requestMethods.POST,
    data: {
      user_id: request_body.user_id,
      role: request_body.role,
      response: request_body.response,
      email: request_body.email,
    },
  });
}

function UserRole() {
  return request({
    url: API.USER.ROLE,
    method: requestMethods.GET,
  });
}

function UpdownUser(request_body) {
  return request({
    url: API.USER.UPDOWN_USER,
    method: requestMethods.POST,
    data: {
      id: request_body.id,
      checked: request_body.checked,
    },
  });
}

function solicitudSoftware(request_body) {
  return request({
    url: API.USER.SOLICITUD_SOFTWARE,
    method: requestMethods.POST,
    data: {
      request: request_body,
    },
  });
}

function GetNewUserRequest() {
  return request({
    url: API.USER.GET_USER_REQUEST,
    method: requestMethods.GET,
  });
}

// EPNO API CALLS -----------------------------------------------------------------------------------------------------------------

function RegisterAdmin(data) {
	return request({
    url: API.AUTH.REGISTER_ADMIN,
    method: requestMethods.POST,
    data: data
  });
}

function GetAll(data){
  return request({
    url: API.USER.ALL,
    method: requestMethods.GET,
  });
}

function GetUserById(data){
  return request({
    url: API.USER.GET_USER_BY_ID,
    method: requestMethods.POST,
    data: data
  });
}

function UpdateStatus(data){
  return request({
    url: API.USER.UPDATE_STATUS,
    method: requestMethods.POST,
    data: data
  });
}

function SaveToken(data) {
  return request({
    url: API.USER.SAVE_TOKEN,
    method: requestMethods.POST,
    data: data
  });
}

const UserService = {
  All,
  Change_User,
  NewUser,
  NewUserRequest,
  UserRole,
  UpdownUser,
  solicitudSoftware,
  GetNewUserRequest,

	RegisterAdmin,
  GetUserById,
  GetAll,
  UpdateStatus,
   SaveToken
};

export default UserService;
