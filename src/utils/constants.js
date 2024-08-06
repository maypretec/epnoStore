//export const BASE_URL = 'https://us-central1-app-epno.cloudfunctions.net/app/api/';
export const BASE_URL = 'http://localhost:5000/app-epno/us-central1/app/api/';

//export const BASE_URL = 'https://dev.gw.client.epno.app';

export const FIREBASE_URL = 'https://us-central1-app-epno.cloudfunctions.net/app/api/'

export const requestMethods = {
    GET:        'GET',
    POST:       'POST',
    HEAD:       'HEAD',
    PUT:        'PUT',
    PATCH:      'PATCH',
    DELETE:     'DELETE',
    CONNECT:    'CONNECT',
};

export const API = {
    requestMethods: {
        GET:        'GET',
        POST:       'POST',
        HEAD:       'HEAD',
        PUT:        'PUT',
        PATCH:      'PATCH',
        DELETE:     'DELETE',
        CONNECT:    'CONNECT',
    },
    AUTH: {
        LOGIN_EPNO:         'auth/login',
        LOGIN:              '/api/self-service/sign-in',
        REGISTER:           'auth/register',
        CHECK_SESSION:      '/check-session',
        PASSWORD_RESET:     '/password/reset',
        PASSWORD_EMAIL:     '/password/email',

        // EPNO ------------------------------------------------------------
        REGISTER_ADMIN:     'auth/registerAdmin'
    },
    USER: {
        CHANGE_USER:        '/api/self-service/change_user_vs',
        NEW_USER:           '/api/self-service/create_new_user',
        NEW_USER_REQUEST:   '/api/self-service/response_new_user_request',
        GET_USER_REQUEST:   '/api/self-service/get_new_user_request',
        UPDOWN_USER:        '/api/self-service/updown_user',
        USERS:              '/api/self-service/get_all_users',
        ROLE:               '/api/self-service/user_role',
        SOLICITUD_SOFTWARE: '/api/self-service/solicitudSoftware',

        // EPNO --------------------------------------------------------------
        GET_USER_BY_ID:     'users/getById',
        ALL:                'users/'
        
    },
    CUSTOMER:{
        ADD:                '/api/self-service/perfilCustomer',
        CLIENT_CONSUME:     '/api/self-service/gastos_perfil',
        PROFILE_CONSUME:    '/api/self-service/gastos_perfilAdmin_client',
        CONSUME:            '/api/self-service/consumo_cliente',
        EARNINGS:           '/api/self-service/ganancias_client',
        EARNINGS_SUMMARY:   '/api/self-service/ganancias_resumen_client',
    },
    VALUESTREAM: {
        VALUESTREAMS:       '/api/self-service/get_vs',
    },
    ORDERS: {
        OPEN:               '/api/self-service/get_all_orders/1',
        ADD_REQUEST:        '/api/self-service/add_request',
        DETAILS:            '/api/self-service/get_order/',
        SERVICES: {
            CHANGE_INFO:        '/api/self-service/change_service_info',
            CHANGE_STEP:        '/api/self-service/service_change_step',
            GENERAL_SERVICES:   '/api/self-service/orders/new',
            NEW_SERVICE:        'services/new',
            GET_ALL:            'services/getAll',
            GET_BY_USER:        'services/getByUser',
            GET_BY_CATEGORY:    'services/getByCategory',

            //EPNO
            DETAILS:            'services/id/',
            UPDATE:             'services/update',
            UPDATE_PLACEMENT:   'services/updateProposal',
            APPLY:              'services/apply',
            GET_PROP_USER:      'services/getProposalByUser',
            GET_PROP_SERVICE:   'services/getProposalByService',
            CHOOSE_PROPOSAL:    'services/chooseProposal',
            UPLOAD_INDUSTRY_PO: 'services/uploadIndustryPO'
        },
        SUBSERVICES: {
            ADD:                    '/api/self-service/add_new_subservice',
            ACCEPT_OR_REJECT:       '/api/self-service/acept_decline_supplier',
            ACCEPT_SUBSERVICE_LIST: '/api/self-service/acept_cot_show_supp',
            CHANGE_STEP:            '/api/self-service/change_step'
        },
        SUPPLIERS: {
            GET_RECOMMENDED:                '/api/self-service/show_supplier_proposals',
            ADD_SUPPLIERS_TO_SUBSERVICE:    '/api/self-service/add_subservice_suppliers',
            ADD_PARTNOS:                    '/api/self-service/add_partnos',
            GET_PARTNOS:                    '/api/self-service/get_partnos',
            PARTNOS:                        '/api/self-service/partnos',
            ADD_CATEGORY:                   '/api/self-service/add_category',
            ADD_UNIT:                       '/api/self-service/add_unit',
            GET_UNIT:                       '/api/self-service/get_units',
            REJECT_BIDDING:                 '/api/self-service/rechazar_cot_supplier',
            CANCEL_REQUEST:                 '/api/self-service/order_cancel/request',
            QUOTE_AGAIN:                    '/api/self-service/supp_cot_again',
            CHANGE_STEP:                    '/api/self-service/change_step_supplier',
            COMPLAINT_SUPPLIER:             '/api/self-service/show_subservice_complaint_supplier'
        },
        AGENTS: {
            UPLOAD_QUOTE:   '/api/self-service/subir_client_cot',
        },
        COMMENTS:{
            SEND:           '/api/self-service/send_order_comment',
        },
    },
    CATEGORIES: {
        GET:                '/api/self-service/categories',
        GET_CATEGORIES:     '/api/self-service/get_categories'
    },
    UNITS:  {
        ALL:                '/api/self-service/get_units'
    },
    SUPPLIERS: {
        ADD_SUPPLIER:           '/api/self-service/perfilSupplier',
        ADD_COT:                '/api/self-service/add_supplier_cot',
        ADD_PART:               '/api/self-service/addPart',
        COT:                    '/api/self-service/po_to_supplier',
        SELECT_SUPPLIERS:       '/api/self-service/epno_select_suppliers',
        EDIT_SUPPLIER_PARTNO:   '/api/self-service/edit_supplier_partno'
    },
    CHAT: {
        GET_MESSAGES:       '/api/self-service/get_conversation_messages',
    },
    COMPLAINTS:{
        CHANGE_TYPE:            '/api/self-service/change_complaint_type',
        REJECT:                 'api//self-service/cancelar_rechazar_queja/',
        REQUEST:                '/api/self-service/complaint_request',
        GET_COMPLAINT:          '/api/self-service/get_complaint',
        GET_COMPLAINTS:         '/api/self-service/get_all_complaints',
        INTERNAL_COMPLAINT:     '/api/self_service/process_internal_complaint',
        SUPPLIERS_COMPLAINT:    '/api/self_service/add_suppliers_complaint',
        CLOSE_COMPLAINT:        '/api/self_service/close_complaint',
    },
    PRODUCTS: {
        ADD:                '/api/self-service/add_products',
        GET:                '/api/self-service/get_products',
        GET_DETAILS:        '/api/self-service/get_product_details/',
        ADD_BUNDLE:         '/api/self-service/add_bundle_products/',
        ADD_TO_PACKAGE:     '/api/self-service/add_product_to_package',
        ADD_PACKAGE:        '/api/self-service/add_package',
        GET_BUNDLE:         '/api/self-service/get_bundle_products/',
        GET_PACKAGES:       '/api/self-service/get_packages',
        ANSWER:             '/api/self-service/send_product_answer',
        DELETE_PRODUCTS:    '/api/self-service/delete_products',
        DELETE_BUNDLE_PART: '/api/self-service/delete_bundle_part/',
        SEND_COMMENT:       '/api/self-service/send_product_comment',
        GET_COMMENTS:        '/api/self-service/get_product_comments/',
        SEND_EPNO_PART:     '/api/self-service/send_epno_part',
        EDIT_EPNO_PART:     '/api/self-service/edit_epno_part',
        MRO_PART_UP:        '/api/self-service/mro_part_up_product_qty',
        GET_PARTS:          '/api/self-service/get_epno_parts'
    },
    LOCATIONS:{
       CREATE:              '/api/self-service/create_location' 
    },
    EVIDENCE:{
        RESPONSE:           '/api/self-service/response_evidence',
    },
    RATES:{
        SEND:               '/api/self-service/send_rate',
    },
    NOTIFICATIONS:{
        CHANGE_STATUS:      '/api/self-service/change_notification_status',
        MARK_AS_READ:       '/api/self-service/marcar_como_leido',
        GET_NOTIFICATION:   '/api/self-service/get_notifications/1',
        GET_NOTIFICATIONS:  '/api/self-service/get_notifications/2',
    },
    CATALOGUE:{
        ADD:                '/api/self-service/new_catalogo',
        GET_CATALOGUES:     '/api/self-service/get_all_catalogos',
    },
    EMAIL:{
        RESEND:             '/api/self-service/email/resend',
    },
    REGISTER:{
        COUNTRY:            '/api/self-service/country/',
        STATE:              '/api/self-service/state/',
        CITY:               '/api/self-service/city/',
        PC:                 '/api/self-service/pc/',
        COLONY:             '/api/self-service/colony/',
        CATEGORIES:         '/api/self-service/categories'
    },
    PROFILE:{
        INFO:               '/api/self_service/profile_info/'
    },
    REVIEW:{
        GET:                '/api/self_service/get_reviews'
    }
}
