import React, { useState, useEffect, useMemo } from "react";
import Layout from "../layouts/LayoutPage";
import { Card, Row, Col, Input, Empty, Skeleton, Pagination } from "antd";
import { Link } from "react-router-dom";
import CategorieService from "../utils/api/categories";

export default function Catalogo() {
  const { Meta } = Card;
  const { Search } = Input;

  const [categories, setCategories] = useState([]);
  let token = localStorage.getItem("token");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  // User is currently on this page
  const [currentPage, setCurrentPage] = useState(1);
  // Num of Records to be displayed on each page
  const [recordsPerPage] = useState(5);
  const [totalTodos, setTotalTodos] = useState(0);
  useEffect(() => {
    
    CategorieService.GetCategories()
    .then((response) => {
      return response.json();
    })
    .then((categorias) => {
      setCategories(categorias);
      setLoading(false);
    })
    .catch(console.log);
  }, []);

  const onChange = (page) => {
    setCurrentPage(page);
  };

  const CategoriesData = useMemo(() => {
    let filterCat = categories;

    if (busqueda) {
      filterCat = filterCat.filter((todo) =>
        todo.name.toString().toLowerCase().includes(busqueda.toLowerCase()),
      );
    }

    setTotalTodos(filterCat.length);

    return filterCat.slice(
      (currentPage - 1) * recordsPerPage,
      (currentPage - 1) * recordsPerPage + recordsPerPage
    );
  }, [categories, currentPage, busqueda]);

  return (
    <Layout>
      {loading ? (
        <>
          <Skeleton active />
          <Skeleton active />
        </>
      ) : categories == "" ? (
        <Empty description="No categories found" />
      ) : (
        <>
        <Row gutter={[12,12]} style={{ marginBottom: 25 }}>
          <Col xs={24} md={8}>
            <Search
              placeholder="Buscar categoria"
              enterButton
              onChange={(evento) => {
                setBusqueda(evento.target.value);
                setCurrentPage(1);
              }}
            />
          </Col>
         </Row>
        <Row gutter={[12,12]} style={{ marginBottom: 25 }}>

                {CategoriesData == "" ? (
                  <Col xs={24}>
                    <Empty description="No data found" />
                  </Col>
                ) : (
                  CategoriesData.map((ctg) => (
                    <Col xs={24} md={8} lg={6} xl={4} key={ctg.id}>
                      <Link to={`/@c-@p/${ctg.id}`} key={ctg.id}>
                        <Card
                          key={ctg.id}
                          hoverable
                          cover={
                            <img
                              height="250px"
                              alt={ctg.name}
                              src={`https://api.epno-app.com${ctg.image}`}
                            />
                          }
                        >
                          <Meta description={ctg.name} />
                        </Card>
                      </Link>
                    </Col>
                  ))
                )}

                <Col xs={24}>
                  <Pagination
                    defaultCurrent={1}
                    current={currentPage}
                    total={totalTodos}
                    onChange={onChange}
                    responsive={true}
                    showTotal={(total) => `${total} items`}
                    pageSize={recordsPerPage}
                  />
                </Col>
              </Row>
              </>
        
      )}
    </Layout>
  );
}
