import React,{useState} from 'react';
import { Row} from 'antd';
import Review from "../Review";


export default function ReviewList(props) {
  const {title}=props;
    const [valor, setValor] = useState(5);
     
    return (
        
            <>
               <Review title={title.purchase_order} valor={valor}/>
            </>
      
    )
}

