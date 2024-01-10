import React, { useState, useEffect } from "react";
import { Row, Empty, Button, Col, Skeleton } from "antd";
import MyPackagesDetails from "../components/Generals/MyPackageDetails";
import { isEmpty } from "lodash";
import { Link, useParams } from "react-router-dom";
import Layout from "../layouts/LayoutPage";
import ProductService from '../utils/api/products'

export default function ListMyPackagesDetails() {
  let { id } = useParams();
  const [bundles, setBundles] = useState([]);
  const [borrar, setBorrar] = useState(false);
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  let token = localStorage.getItem("token");

  useEffect(() => {
    ProductService.GetBundle(id)
    .then((response) => {
      // console.log(response);
      return response.json();
    }) 
    .then((bundles) => {
      setBundles(bundles);
      setLoading(false);
    })
    .catch(console.log);

    ProductService.GetPackages()
    .then((response) => {
      return response.json();
    })
    .then((paquetes) => {
      setPaquetes(paquetes);
      console.log(paquetes);
    })
    .catch(console.log);
  }, [borrar]);

  return (
    <Layout>
      {loading ? (
        <Skeleton />
      ) : bundles == "" ? (
        <Col xs={24}>
          <Empty
            imageStyle={{
              height: 200,
            }}
            description={<span>Este paquete esta vacio</span>}
          >
            <Button type="primary">
              <Link to="/@c">Agrega algo ahora</Link>
            </Button>
          </Empty>
        </Col>
      ) : (
        <Row gutter={[12, 12]}>
          {bundles.map((bundle) => (
            <MyPackagesDetails
              bundle={bundle}
              key={bundle.EpnoPartId}
              borrar={borrar}
              setBorrar={setBorrar}
              paquetes={paquetes}
            />
          ))}
        </Row>
      )}
    </Layout>
  );
}
