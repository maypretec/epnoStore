import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

// MAYPRETEC --------------------------------------------------------
function ServiceChats(service_id) {
  return request({
    url: API.CHAT.GET_SERVICE_CHATS.concat(service_id),
    method: requestMethods.GET,
  });
}

function GetMessages(chat_id) {
  return request({
    url: API.CHAT.GET_MESSAGES.concat(chat_id),
    method: requestMethods.GET,
  });
}

function SendMessage(data) {
  return request({
    url: API.CHAT.SEND_MESSAGES,
    method: requestMethods.POST,
    data: data
  });
}

const ChatService = { 
	ServiceChats,
	GetMessages,
  SendMessage
 };

export default ChatService;
