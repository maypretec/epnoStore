import React, { useState, useEffect } from "react";
import { Row, Col, Input, Empty, notification, Skeleton } from "antd";
// import { ToastContainer, toast } from 'react-toastify';
// import  '../../../../../node_modules/react-toastify/dist/ReactToastify.css'
import CardProducts from "../../Generals/ListProducts";
import { useDispatch, useSelector } from "react-redux";
import { showNewProductAction } from "../../../actions/productActions";
import { BASE_URL } from "../../../utils/constants";
import ProductService from "../../../utils/api/products";

export default function ProductsByCategory(props) {
  const { category, busqueda, url } = props;
  let token = localStorage.getItem("token");
  const [product, setProduct] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const showNewProducts = (state) => {
    dispatch(showNewProductAction(state));
  };
  const stateProducts = useSelector(
    (state) => state.products.stateShowProducts
  );

  useEffect(() => {
    //productos
    fetch(`${BASE_URL}/api/${url}/${category}`)
      .then((response) => {
        return response.json();
      })
      .then((productos) => {
        setProduct(productos);
        setLoading(false);
      })
      .catch(console.log);

    fetch(`${BASE_URL}/api/get_packages`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        // console.log(response);
        return response.json();
      })
      .then((paquetes) => {
        setPaquetes(paquetes);
      })
      .catch(console.log);
  }, []);

  const openNotificationWithIcon = (type, name, desc) => {
    notification[type]({
      message: name,
      description: desc,
    });
  };

  const addProductCart = (
    epno_part_id,
    price,
    qty,
    name,
    current_qty,
    part_no_id
  ) => {
    ProductService.addProduct(
      {
        epno_part_id: epno_part_id,
        cost: price,
        qty: qty,
        current_qty: current_qty,
        part_no_id: part_no_id,
      })
    .then((response) => {
      if (response.data.success == true) {
        openNotificationWithIcon(
          "success",
          name,
          "Ha sido añadido correctamente a tu carrito."
        );
        showNewProducts(!stateProducts);
      } else {
        openNotificationWithIcon(
          "error",
          name,
          "Hubo un problema al añadir a tu carrito."
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
  };
  return loading ? (
    <>
      <Skeleton active />
      <Skeleton active />
    </>
  ) : product == "" ? (
    <Row justify="center" align="middle">
      <Col>
        <Empty description="Aun no hay productos asignados a esta categoria." />
      </Col>
    </Row>
  ) : (
    <Row gutter={12} justify="center">
      <CardProducts
        busqueda={busqueda}
        productos={product}
        paquetes={paquetes}
        addProductCart={addProductCart}
      />
    </Row>
  );
}
