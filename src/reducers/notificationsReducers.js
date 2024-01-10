const initialProps = {
    stateUserNotifications: false,
    stateNotificacionesTotal: false,
}

export default function (state = initialProps, action) {
    switch (action.type) {
        case "STATE_USER_NOTIFICATIONS":
            return {
                ...state,
                stateUserNotifications: action.payload
            };
        case "STATE_NOTIFICACIONES_TOTAL":
            return {
                ...state,
                stateNotificacionesTotal: action.payload
            };

        default:
            return state;
    }
}