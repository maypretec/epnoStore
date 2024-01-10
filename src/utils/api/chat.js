import request from "../services/HTTPClient";
import { requestMethods, API } from "../constants";

function ChatMessages(request_body) {
    return request({
        url: API.CHAT.GET_MESSAGES,
        method: requestMethods.POST,
        data: {
            order:  request_body.order,
            user:   request_body.user,
        }
    })
}

const ChatService = { ChatMessages };

export default ChatService;