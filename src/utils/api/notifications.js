import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function ChangeStatus(request_body){
    return request({
        method: requestMethods.POST,
        url: API.NOTIFICATIONS.CHANGE_STATUS.concat(request_body),
    })
}

function MarkAsRead(request_body){
    return request({
        method: requestMethods.POST,
        url: API.NOTIFICATIONS.MARK_AS_READ,
        data:{
            keys:   request_body.keys
        }
    })
}

function GetNotifications(){
    return request({
        url: API.NOTIFICATIONS.GET_NOTIFICATIONS,
        method: requestMethods.GET,
    })
}

function GetNotification(){
    return request({
        url: API.NOTIFICATIONS.GET_NOTIFICATION,
        method: requestMethods.GET,
    })
}

const NotificationService = { 
    ChangeStatus,
    MarkAsRead,
    GetNotifications,
    GetNotification,
}

export default NotificationService;