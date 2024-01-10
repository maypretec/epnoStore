import React, { useState, useEffect } from "react";
import { Row, Col, BackTop, Empty, Skeleton } from "antd";

import OrderInfo from "../components/OrderInfo";
import StepsGeneral from "../components/StepsLogsGeneral";
import Rate from "../components/Rate";
import LayoutPage from "../layouts/LayoutPage";
import SupplierLayout from "../layouts/SupplierLayout";
import CPLayout from "../layouts/ControlPanelLayout";
import { useParams } from "react-router-dom";
import OrderUsers from "../components/Generals/OrderUsers/OrderUsers";
import OrderService from '../utils/api/orders';
import CategoryService from '../utils/api/categories';
import SupplierService from '../utils/api/suppliers';

export default function OrderDetails() {
  const { id } = useParams();
  const role = localStorage.getItem("role");

  const [disabled, setDisabled] = useState({
    disabled: true,
    alert: false,
  });

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [order, setOrder] = useState({

  //   order: {
  //     id: 6,
  //     service_type_id: 2,
  //     created_at: '2022-03-09 17:34:19',
  //     is_po: 0,
  //     client_cost: 6609.60,
  //     client_subtotal: 6120.00,
  //     supplier_cost: 1626.00,
  //     supplier_subtotal: 1260.00,
  //     return_amount: 1260.00,
  //     expiration_date: "2022-07-10",
  //     expiration_days: 30,
  //     invoice_date: "2022-06-10",
  //   },
  //   client: {
  //     user_id: 6,
  //     org_name: "Prueba organizacion",
  //     org_id: 1,
  //     contact_name: "Stephanie Larissa Palma Jasso",
  //     address: "Calle Pedro de Leon 489,Juárez, Chihuahua",
  //     contact_phone: "6568975612",
  //     contact_mail: "stephanieljasso@gmail.com",
  //     vs: 2,
  //     pay_days: 90,
  //   },
  //   users: [
  //     {
  //       id: 6,
  //       role_id: 4,
  //       role_name: "Cliente",
  //       org_name: "BVI",
  //       org_id: 1,
  //       email: "larissa.jasso@epno.com.mx",
  //       user_name: "Larissa Jasso",
  //       logo: "/storage/uploads//376-3760478_coraline-png-ropa-de-coraline-y-la-puerta.png",
  //     },
  //     {
  //       id: 2,
  //       role_id: 6,
  //       role_name: "Proveedor",
  //       org_name: "Proveedor Taza 1",
  //       org_id: 1,
  //       email: "larissa.jasso@epno.com.mx",
  //       user_name: "Ricardo Juárez",
  //       logo: "/storage/uploads//376-3760478_coraline-png-ropa-de-coraline-y-la-puerta.png",
  //     },
  //     {
  //       id: 4,
  //       role_id: 6,
  //       role_name: "Proveedor",
  //       org_name: "Proveedor Taza 2",
  //       org_id: 2,
  //       email: "larissa.jasso@epno.com.mx",
  //       user_name: "Ricardo Rodriguez",
  //       logo: "/storage/uploads//376-3760478_coraline-png-ropa-de-coraline-y-la-puerta.png",
  //     },

  //   ],
  //   service_logs: [
  //     {
  //       id: 1,
  //       step: 1,
  //       user: 'Larissa Jasso',
  //       fecha: '11/07/2020'
  //     },
  //     {
  //       id: 2,
  //       step: 2,
  //       user: 'Larissa Jasso',
  //       fecha: '11/07/202'
  //     },
  //     {
  //       id: 3,
  //       step: 3,
  //       user: 'Larissa Jasso',
  //       fecha: '11/07/202'
  //     },
  //     {
  //       id: 4,
  //       step: 4,
  //       user: 'Larissa Jasso',
  //       fecha: '11/07/202'
  //     },
  //     {
  //       id: 5,
  //       step: 11,
  //       user: 'Larissa Jasso',
  //       fecha: '11/07/202'
  //     },
  //     {
  //       id: 6,
  //       step: 9,
  //       user: 'Larissa Jasso',
  //       fecha: '11/07/202'
  //     },
  //     {
  //       id: 7,
  //       step: 12,
  //       user: 'Larissa Jasso',
  //       fecha: '11/07/202'
  //     },
  //   ],
  //   service: {
  //     id: 5,
  //     order_id: 6,
  //     order_num: 'O-220420-303-8',
  //     title: 'Prueba de servicio',
  //     desc: 'Amet reprehenderit exercitation elit pariatur ipsum dolore proident dolore amet ipsum non officia minim tempor.Consectetur nulla in laboris ex non sit ea adipisicing consequat duis magna elit deserunt.Minim fugiat non dolore laboris in esse adipisicing occaecat eu aute aliquip irure pariatur.',
  //     created_at: '2022-03-09 17:34:19',
  //     step_name: 'Queja',
  //     step_id: 5,
  //     deadline: '2022-03-16',
  //     rev: 1,
  //     type: null,
  //     prioridad: "Media",
  //     type_code: '01',
  //     cantidad: 16,
  //     quote_file: "/storage/uploads//Organizacion-C-220421-303-13.pdf",

  //   },
  //   files: {
  //     spec_files: [
  //       {
  //         url: "/storage/uploads//Organizacion-C-220421-303-13.pdf"
  //       },
  //       {
  //         url: "/storage/uploads//376-3760478_coraline-png-ropa-de-coraline-y-la-puerta.png"
  //       },
  //       {
  //         url: "/storage/uploads//Factura_A579_EIN0306306H6_27042022_120000.pdf"
  //       },

  //     ],
  //     general: [
  //       {
  //         file_path: "/storage/uploads//Organizacion-C-220421-303-13.pdf"
  //         file_name: "Organizacion-C-220421-303-13.pdf"
  //       },
  //       {
  //         file_path: "/storage/uploads//376-3760478_coraline-png-ropa-de-coraline-y-la-puerta.png"
  //         file_name: "376-3760478_coraline-png-ropa-de-coraline-y-la-puerta.png"

  //       },
  //       {
  //         file_path: "/storage/uploads//Factura_A579_EIN0306306H6_27042022_120000.pdf"
  //         file_name: "3Factura_A579_EIN0306306H6_27042022_120000.pdf"

  //       },
  //     ]
  //   },
  //   subservices: [
  //     {
  //       id: 1,
  //       name: "Escafandra Ninja Hood (Caja con 100) servicio 1",
  //       step_name: 'Queja',
  //       step_id: 12,
  //       qty: 12,
  //       category_name: "Maquinados",
  //       category_id: 1,
  //       specs_file: "/storage/uploads//Organizacion-C-220421-303-13.pdf",
  //       unit_name: "cm",
  //       supp_deadline: "2022-03-18",
  //       supp_qty: 3,
  //       supp_unitary_subtotal: 125.32,
  //       supp_quote: "/storage/uploads//Organizacion-C-220421-303-13.pdf",
  //       proposals: [
  //         {
  //           id: 1,
  //           service_id: 5,
  //           status_supp: "Más bajo",
  //           subservice_id: 1,
  //           code: "E0322102",
  //           unitary_subtotal: 135.50,
  //           total_cost: 1235.50,
  //           desc: "Escafrandra Ninja Hood caja con 50 piezas, de color negro.",
  //           deadline: "2022-05-27",
  //           supp_deadline: "2022-05-25",
  //           epno_cost: 250.00,
  //           quote: "/storage/uploads//Factura_A579_EIN0306306H6_27042022_120000.pdf",
  //           qty: 12,
  //           rev: 2,
  //           user_id: 8,
  //           logo: "/storage/uploads//376-3760478_coraline-png-ropa-de-coraline-y-la-puerta.png",
  //           user_name: "supplier prueba",
  //           org_name: "supplier organizacion",
  //           direccion: "Calle Pedro de Leon 489",
  //           user_phone: "6568964632",
  //           user_email: "larissa.jasso@epno.com.mx",
  //           epno_po: "/storage/uploads//O-220420-303-8-Organizacion.pdf",
  //           is_winner: 1,
  //           status: 1,
  //           check: 1,
  //           rate: {
  //             user_id: 6,
  //             service_id: 2,
  //             calificacion: 5,
  //             comentario: "chidooooooooo"
  //           }

  //         },
  //         {
  //           id: 3,
  //           service_id: 5,
  //           subservice_id: 1,
  //           status_supp: "Más bajo",
  //           code: "F0322108",
  //           unitary_subtotal: 140.00,
  //           desc: "Escafrandra Ninja Hood caja con 50 piezas, de color rosa.",
  //           deadline: "2022-05-27",
  //           epno_cost: 260.00,
  //           total_cost: 1235.50,
  //           quote: "/storage/uploads//Prueba de org-C-220420-303-9.pdf",
  //           qty: 12,
  //           rev: 1,
  //           user_id: 4,
  //           logo: "/storage/uploads//29a2c6b2679c4c91408a8d9591574c30.png",
  //           user_name: "supplier prueba",
  //           org_name: "supplier organizacion",
  //           direccion: "Calle Pedro de Leon 489",
  //           user_phone: "6568964632",
  //           user_email: "larissa.jasso@epno.com.mx",
  //           epno_po: null,
  //           is_winner: 1,
  //           status: 1,
  //           check: 1,
  //           rate: {
  //             user_id: 6,
  //             service_id: 2,
  //             calificacion: null,
  //             comentario: ""
  //           }

  //         },
  //       ]
  //     },
  //     {
  //       id: 2,
  //       name: "Prueba de servicio 2",
  //       step_name: 'Cancelación solicitada',
  //       step_id: 7,
  //       qty: 12,
  //       category_name: "Maquinados",
  //       category_id: 2,
  //       specs_file: "/storage/uploads//Factura_A579_EIN0306306H6_27042022_120000.pdf",
  //       unit_name: "cm",
  //       proposals: [
  //         {
  //           id: 4,
  //           service_id: 6,
  //           subservice_id: 4,
  //           code: "R5622102",
  //           unitary_subtotal: 135.50,
  //           status_supp: "Más rapido",
  //           total_cost: 1235.50,
  //           desc: "Prueba de descripcion",
  //           deadline: "2022/05/05",
  //           epno_cost: 1896.35,
  //           quote: "/storage/uploads//Factura_A579_EIN0306306H6_27042022_120000.pdf",
  //           qty: 12,
  //           rev: 1,
  //           user_id: 5,
  //           logo: "/storage/uploads//275240112_1292998727863288_793957596337007265_n.jpg",
  //           user_name: "supplier prueba",
  //           org_name: "supplier organizacion",
  //           direccion: "Calle Pedro de Leon 489",
  //           user_phone: "6568964632",
  //           user_email: "larissa.inntech@gmail.com",
  //           epno_po: null,
  //           is_winner: 1,
  //           status: 1,
  //           check: 1,
  //           rate: {
  //             user_id: null,
  //             service_id: null,
  //             calificacion: null,
  //             comentario: ""
  //           }

  //         }
  //       ]
  //     },
  //   ],
  //   comments: [
  //     {
  //       id: 1,
  //       user_id: 1,
  //       user_name: 'Larissa Jasso',
  //       step_id: 8,
  //       step_name: 'En cotización',
  //       logo: '/storage/uploads//376-3760478_coraline-png-ropa-de-coraline-y-la-puerta.png',
  //       role: 4,
  //       comment: "Hola quiero saber como van?",
  //       file: null,
  //       file_name: null,
  //       created_at: '2022-03-09 12:08:52',
  //       my_comment: false,
  //     },
  //     {
  //       id: 2,
  //       user_id: 2,
  //       user_name: 'Larissa Jasso',
  //       step_id: 3,
  //       step_name: 'Pendiente de aprobación',
  //       logo: '/storage/uploads//29a2c6b2679c4c91408a8d9591574c30.png',
  //       role: 4,
  //       comment: "Le dejo foto del avance",
  //       file: '/storage/uploads//org-C-220421-303-10.pdf',
  //       file_name: 'org-C-220421-303-10.pdf',
  //       created_at: '2022-03-09 12:08:52',
  //       my_comment: true,
  //     },
  //     {
  //       id: 3,
  //       user_id: 2,
  //       user_name: 'Larissa Jasso',
  //       step_id: 11,
  //       step_name: 'Cancelación solicitada',
  //       logo: '/storage/uploads//29a2c6b2679c4c91408a8d9591574c30.png',
  //       role: 4,
  //       comment: "Requiero la cancelacion de mi orden, ya que logre conseguir por fuera un mejor precio.",
  //       file: null,
  //       file_name: null,
  //       created_at: '2022-03-09 12:08:52',
  //       my_comment: false,
  //     },
  //     {
  //       id: 4,
  //       user_id: 2,
  //       user_name: 'Larissa Jasso',
  //       step_id: 9,
  //       step_name: 'Cancelado',
  //       logo: '/storage/uploads//29a2c6b2679c4c91408a8d9591574c30.png',
  //       role: 4,
  //       comment: "Se cancelo la orden ya que no se logro llegar a un acuerdo con el cliente debido a los precios.",
  //       file: null,
  //       file_name: null,
  //       created_at: '2022-03-09 12:08:52',
  //       my_comment: true,
  //     },

  //   ],
  //   rate: {
  //     user_id: null,
  //     service_id: null,
  //     calificacion: null,
  //     comentario: ""
  //   }

  // });
  const [order, setOrder] = useState([]);

  const [reload, setReload] = useState(false);

  let token = localStorage.getItem("token");
  var type = role;
  var Layout = "";

  if (type === "4") {
    Layout = LayoutPage;
  } else if (type === 6) {
    Layout = SupplierLayout;
  } else if (type == 1 || type == 3 || type == 5 || type == 2 || type == 10) {
    Layout = CPLayout;
  }

  useEffect(() => {
    OrderService.OrderDetails(id)
      .then((response) => {
        setOrder(response.data);
        setLoading(false);
        if (
          // response.data.order.rate.calificacion == 0 &&
          // response.data.order.rate.comentario == "" &&
          response.data.service.step_id === 7
        ) {
          setDisabled({ disabled: false });
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [reload, id]);

  useEffect(() => {
    CategoryService.All()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error.response.data.errors);
      });

    SupplierService.GetUnit()
      .then((response) => {
        setUnits(response.data);
      })
      .catch((error) => {
        console.log(error.response.data.errors);
      });
  }, []);
    return (
      <Layout>
        {loading === true ? (
          <>
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </>
        ) : order === "" ? (
          <Empty description="No hay informacion sobre esta orden." />
        ) : (
          <Row gutter={[12, 12]}>
            <Col xs={24} lg={16} xl={16}>
              <OrderInfo
                details={order}
                reload={reload}
                role={role}
                token={token}
                setReload={setReload}
                categorias={categories}
                unidades={units}
              />
            </Col>
            <Col xs={24} md={24} lg={8} xl={8}>
              <Row gutter={[12, 12]}>
                <Col xs={24}>
                  <OrderUsers data={order} token={token} op={1} />
                </Col>
                <Col xs={24}>
                  <StepsGeneral steps={order.service_logs} />
                </Col>

                <Col xs={24}>
                  {role === 4 &&
                    order.service.step_id >= 7 &&
                    order.service.step_id < 11 && (
                      <Rate
                        rate={order.rate}
                        order={order.service}
                        id={order.service.id}
                        reload={reload}
                        setReload={setReload}
                        step={order.service.step_id}
                        title="Calificar orden"
                      />
                    )}
                </Col>
              </Row>
            </Col>
          </Row>
        )}
        <BackTop />
      </Layout>
    );
}

