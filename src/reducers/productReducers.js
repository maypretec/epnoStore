const initialProps={    
    stateShowProducts:false,
   
}

export default function (state= initialProps,action){
    switch (action.type){
        case "STATE_SHOW_PRODUCTS":
            return{
                ...state,
                stateShowProducts:action.payload
            };
          
            default:
                return state;
    }
}