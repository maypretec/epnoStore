import React, { useState } from 'react';

import { Card, Col, Row, Button, Tooltip, Menu, Dropdown, Select, Modal, Badge, Popover, Image, message, InputNumber } from 'antd';
import { MinusOutlined, ShoppingCartOutlined, PlusOutlined, MoreOutlined, EyeOutlined, PicLeftOutlined } from '@ant-design/icons';
import "./ListProducts.scss";
import { Link } from 'react-router-dom';
import ProductService from '../../../utils/api/products';

export default function CardProducts(props) {
  const { productos, addProductCart, paquetes, busqueda } = props;

  return (
    <>
      {productos.filter((producto) => {
        if (busqueda == "") {
          return producto;
        } else if (
          producto.name.toString().toLowerCase().includes(busqueda.toLowerCase())
          || producto.part_no.toString().toLowerCase().includes(busqueda.toLowerCase())
          || producto.supplier_partno.toString().toLowerCase().includes(busqueda.toLowerCase())
          || producto.categoria.toString().toLowerCase().includes(busqueda.toLowerCase())) {
          return producto;
        }
      }).map((producto) => (
        <Col
          xs={24} md={12} lg={6} xl={5}

          key={producto.sp_id}
        >
          <CardProduct producto={producto} paquetes={paquetes} addProductCart={addProductCart} key={producto.sp_id} />
        </Col>
      ))}
    </>
  );
}

function CardProduct(props) {
  const { producto, addProductCart, paquetes } = props;
  const { Meta } = Card;
  const { SubMenu } = Menu;
  const { Option } = Select;

  const [cart, setCart] = useState(
    {
      qty: 1,
      price: producto.price,
      priceNew: producto.price,
    }
  );
  // const [isModalVisible, setIsModalVisible] = useState(false);

  // const [price, setPrice] = useState(producto.price);
  // console.log(producto);

  // const decrease = (event) => {
  //   if (cart.qty > 1) {
  //     setCart({ qty: parseInt(cart.qty) - 1 });
  //   }

  //   setCart((prevState) => ({
  //     ...prevState,
  //     price: cart.price,
  //     priceNew: prevState.qty * cart.price
  //   }));

  // }

  // const increase = (event) => {

  //   setCart({ qty: parseInt(cart.qty) + 1 });

  //   setCart((prevState) => ({
  //     ...prevState,
  //     price: cart.price,
  //     priceNew: prevState.qty * cart.price
  //   }));
  //   // console.log(cart.priceNew, cart.qty);
  // }

  const onFormChange = (value) => {
    if (value == null) {
      setCart({
        qty: 1,
      });

      setCart((prevState) => ({
        ...prevState,
        price: cart.price,
        priceNew: cart.price,
      }));

    } else {
      setCart({
        qty: value,
      });

      setCart((prevState) => ({
        ...prevState,
        price: cart.price,
        priceNew: prevState.qty * cart.price
      }));
    }

  };

  const onChange = (id) => (value) => {


    // console.log(`selected ${value}, ${id}`);
    ProductService.AddToPackage({
      "bundle_id": value,
      "qty": parseInt(cart.qty),
      "epno_part_id": id
    })
    .then(response => {
      message.success(response.data.message)

    })
    .catch(error => {
      console.log(error)
    })

  }

  const menu = (

    <Menu>
      <SubMenu
        title="Añadir a Mis cosas"
        onClick={e => e.stopPropagation()}
      >
        <Menu.Item>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Selecciona un paquete"
            optionFilterProp="children"
            onChange={onChange(producto.id)}
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              paquetes.map((pack) => (

                <Option value={pack.id} key={pack.id}>{pack.name}</Option>
              ))
            }

          </Select>

        </Menu.Item>

      </SubMenu>
    </Menu>
  );


  return (
    <Badge.Ribbon text={producto.current_qty == 0 ? "Agotado" : "Disponible"} color={producto.current_qty == 0 && "volcano"} placement="start" >
      <Card
        key={producto.sp_id}
        style={{ marginTop: 16 }}
        extra={<Dropdown overlay={menu} key={producto.sp_id}
        >
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <MoreOutlined className="colorText" />
          </a>
        </Dropdown>}
        cover={
          <a href={`/@p-@d/${producto.id}/${producto.part_category_id}`} key={producto.id} >
            <Image
              preview={false}
              height='250px'
              width="100%"
              alt={producto.name}
              src={`https://api.epno-app.com${producto.image}`}
            />
          </a>
        }
        actions={[
          <Col>  <p >${cart.priceNew}</p> </Col>,


          // <Button key={producto.sp_id} name={producto.sp_id} shape="circle" icon={<MinusOutlined />} onClick={(event) => decrease(event)} disabled={producto.current_qty == 0 && true} />,

          <InputNumber
            key={producto.sp_id}
            id={producto.sp_id}
            className="inputQty"
            name={producto.sp_id}
            onChange={onFormChange}
            value={cart.qty}
            defaultValue={1}
            min={1}
            max={producto.current_qty}
            step={1}
            parser={value => value.replace(null, 1)}
            required
            disabled={producto.current_qty == 0 && true}
          />,
          //  <div key={producto.id}> {qty} </div>,

          // <Button key={producto.sp_id} shape="circle" icon={<PlusOutlined />} onClick={(event) => increase(event)} disabled={producto.current_qty == 0 && true} />,
        ]}
      >
        <Meta

          avatar={

            <Tooltip title="Añadir a mi carrito">
              <Button size="large" type="primary" shape="circle" icon={<ShoppingCartOutlined />} onClick={() => addProductCart(producto.id, cart.price, cart.qty, producto.name, producto.current_qty, producto.sp_id)} disabled={producto.current_qty == 0 && true} />
            </Tooltip>

            // <Button shape="circle" icon={<SearchOutlined />} />
          }
          title={
            <Popover title={producto.name} content={
              <>
                <p><strong>Categoria: </strong>{producto.categoria}</p>
                <p><strong>Detalles: </strong><a href={`/@p-@d/${producto.id}/${producto.part_category_id}`} key={producto.id}> Ver más... </a></p>

                <p><strong>No. de parte: </strong>{producto.part_no}</p>

                <p><strong>Precio: </strong>${producto.price}</p>

                <label style={{ color: "#77A464" }}> <b style={{ color: "#000" }}>Disponibilidad: </b> {producto.current_qty} disponibles</label>

              </>
            } placement="topLeft" >
              <a href={`/@p-@d/${producto.id}/${producto.part_category_id}`} key={producto.id} style={{ color: "black" }}>{producto.name}</a>
            </Popover>
          }
          description={producto.part_no}
        />
      </Card>
    </Badge.Ribbon >
  )

}