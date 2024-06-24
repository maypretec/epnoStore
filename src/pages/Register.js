import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Col,
  Alert,
  Select,
  Row,
  Checkbox,
  Upload,
  AutoComplete,
  message,
  InputNumber,
} from "antd";
import Layout from "../layouts/NavBar";
// import RegisterCustomer from '../components/RegisterCustomer'
// import RegisterSupplier from '../components/RegisterSupplier'
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../utils/api/auth";
import { PlusOutlined } from "@ant-design/icons";
import "../scss/register.scss";
import RegisterService from "../utils/api/register";

export default function RegisterX() {
  const { Option } = Select;
  const [form] = Form.useForm();

  const [error, setError] = useState(false);
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  const [load, setLoad] = useState(false);
  const [logo, setLogo] = useState({
    logoList: [],
  });
  const [base64Image, setBase64Image] = useState('');

  const [disabled, setDisabled] = useState({
    stateOrg: false,
    cityOrg: false,
    pcOrg: false,
    colonyOrg: false,
    statePlanta: false,
    cityPlanta: false,
    pcPlanta: false,
    colonyPlanta: false,
  });

  const [country, setCountry] = useState({ countries: [] });
  const [state, setState] = useState({ states: [] });
  const [city, setCity] = useState({ cities: [] });
  const [pc, setPC] = useState({ pcodes: [] });
  const [colony, setColony] = useState({ colonies: [] });
	const [categories, setCategories] = useState([]);

  let history = useNavigate();

  useEffect(() => {
		// Categories
		setCategories( [
				{ id: 1, name: 'Servicios' },
        { id: 2, name: 'Tecnologia' },
        { id: 3, name: 'Maquinado' },
        { id: 4, name: 'MRO' },
        { id: 5, name: 'MRP' },
		])

    //cuntry
		setCountry({
			countries: [
				{
					id: 1,
					name: "México",
					prefix: "es-mx",
					status: 1,
					created_at: "2023-02-27T18:13:15.000000Z",
					updated_at: "2023-02-27T18:13:15.000000Z",
				},
			],
		});

		setState({
      states: [
        { id: 1, name: 'Aguascalientes' },
        { id: 2, name: 'Baja California' },
        { id: 3, name: 'Baja California Sur' },
        { id: 4, name: 'Campeche' },
        { id: 5, name: 'Chiapas' },
        { id: 6, name: 'Chihuahua' },
        { id: 7, name: 'Coahuila' },
        { id: 8, name: 'Colima' },
        { id: 9, name: 'Durango' },
        { id: 10, name: 'Guanajuato' },
        { id: 11, name: 'Guerrero' },
        { id: 12, name: 'Hidalgo' },
        { id: 13, name: 'Jalisco' },
        { id: 14, name: 'México' },
        { id: 15, name: 'Michoacán' },
        { id: 16, name: 'Morelos' },
        { id: 17, name: 'Nayarit' },
        { id: 18, name: 'Nuevo León' },
        { id: 19, name: 'Oaxaca' },
        { id: 20, name: 'Puebla' },
        { id: 21, name: 'Querétaro' },
        { id: 22, name: 'Quintana Roo' },
        { id: 23, name: 'San Luis Potosí' },
        { id: 24, name: 'Sinaloa' },
        { id: 25, name: 'Sonora' },
        { id: 26, name: 'Tabasco' },
        { id: 27, name: 'Tamaulipas' },
        { id: 28, name: 'Tlaxcala' },
        { id: 29, name: 'Veracruz' },
        { id: 30, name: 'Yucatán' },
        { id: 31, name: 'Zacatecas' },
        { id: 32, name: 'Ciudad de México' },
      ],
    });

    RegisterService.Country()
      .then((countries) => {
        setCountry({
          countries: [
            {
              id: 1,
              name: "México",
              prefix: "es-mx",
              status: 1,
              created_at: "2023-02-27T18:13:15.000000Z",
              updated_at: "2023-02-27T18:13:15.000000Z",
            },
          ],
        });
        console.log(countries);
      })
      .catch(console.log);
    console.log(country);
  }, []);

  const onemailChange = (value) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        [
          "@live.com.mx",
          "@gmail.com",
          "@outlook.com",
          "@hotmail.com",
          "@yahoo.com",
          "@epno.com.mx",
        ].map((domain) => `${value}${domain}`)
      );
    }
  };
  const emailOptions = autoCompleteResult.map((email) => ({
    label: email,
    value: email,
  }));

  const onFormChangePais = (value) => {
    RegisterService.State(value)
      .then((response) => {
        return response.json();
      })
      .then((states) => {
        setState({ states: states });
        setDisabled({
          ...disabled,
          stateOrg: false,
        });
      })
      .catch(console.log);
  };

  const onFormChangeState = (value) => {
    RegisterService.City(value)
      .then((response) => {
        return response.json();
      })
      .then((cities) => {
        setCity({ cities: cities });
        setDisabled({
          ...disabled,
          cityOrg: false,
        });
      })
      .catch(console.log);
  };

  const onFormChangeCity = (value) => {
    //city
    RegisterService.PC(value)
      .then((response) => {
        return response.json();
      })
      .then((pcodes) => {
        setPC({ pcodes: pcodes });
        setDisabled({
          ...disabled,
          pcOrg: false,
        });
      })
      .catch(console.log);
    // console.log(value);
  };

  const onFormChangeCP = (value) => {
    //city
    RegisterService.Colony(value)
      .then((response) => {
        return response.json();
      })
      .then((colonies) => {
        setColony({ colonies: colonies });
        setDisabled({
          ...disabled,
          colonyOrg: false,
        });
      })
      .catch(console.log);
  };

  const { logoList } = logo;

  const propsLogo = {
    onRemove: (file) => {
      setLogo((state) => {
        const index = state.logoList.indexOf(file);
        const newFileList = state.logoList.slice();
        newFileList.splice(index, 1);
        return {
          logoList: newFileList,
        };
      });
    },
    beforeUpload: (file) => {
      setLogo((state) => ({
        logoList: [...state.logoList, file],
      }));
      return false;
    },
    logoList,
  };

  const onFinish = async (values) => {
    setLoad(true)
    console.log(values)
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("password", values.password);
    formData.append("bussiness", values.bussiness);
    formData.append("rfc", values.rfc);
    formData.append("country", values.country);
    formData.append("state", values.state);
    formData.append("city", values.city);
    formData.append("postal_code", values.postal_code);
    formData.append("colony", values.colony);
    formData.append("street", values.street);
    formData.append("ext_num", values.ext_num);
    formData.append("int_num", values.int_num);
    formData.append("logo", values.logo);
    formData.append("role", values.role);

    let role_data = {};

    if (values.role == 6) {
      role_data = {
        url: values.url,
        cat1: values.categories[0],
        cat2: values.categories[1],
        iva: values.iva,
        terms: values.terms
      };
    } else if (values.role == 4) {
      role_data = {
        pay_days: values.pay_days
      };
    }

    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    formDataObject.role_data = role_data;  // Aquí se asegura de que role_data se agregue correctamente

    AuthService.Register(formDataObject)
      .then((response) => {
        console.log(response)
        if (response.data.success == true) {
          message.success(
            "Registro creado correctamente, espere a iniciar sesión..."
          );
          AuthService.LoginEpno({email: formDataObject.email, password: formDataObject.password})
            .then(response => {
              localStorage.setItem('role', response.data.role)
              if (response.data.role == 4){
                history('/orders/request');
              } else if (response.data.role == 6) {
                history('/dashboard')
              }
            })
          // axios.post('https://api.epno-app.com/api/login', values)
          //     .then(response => {
          //         localStorage.setItem('token', response.data.token)
          //         localStorage.setItem('role', response.data.user.role_id)
          //         setLoad(false)
          //         if (response.data.user.email_verified_at == null) {
          //             history('/unverified')
          //         } else if (response.data.user.status == 2) {
          //             history('/error/401')
          //         } else if (response.data.user.status == 0) {
          //             history('/@c-@s')
          //         } else if ((response.data.user.role_id == 1 || response.data.user.role_id == 2 || response.data.user.role_id == 3)) {
          //             history('/dashboard')
          //         } else if (response.data.user.role_id == 4) {
          //             history('/catalog')
          //         } else if (response.data.user.role_id == 5) {
          //             history(`/orders/${response.data.user.id}/1`)
          //         } else if (response.data.user.role_id == 6) {
          //             history(`/orders/${response.data.user.id}/1`)
          //         }

          //     })
          //     .catch(error => {
          //         setLoad(false)
          //     })
        } else {
          setError(true);
          setLoad(false);
        }
      })
      .catch((error) => {
        console.log(error)
        setError(true);
        setLoad(false);
      });
  };

  return (
    <Layout>
      <Row>
        <Col xs={24} md={12} lg={8} xl={6}>
          <div id="mainLoginForm">
            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              style={{ margin: 16 }}
            ></Form>
          </div>
        </Col>
        <Col xs={24} md={12} lg={8} xl={6}></Col>
      </Row>
      <h2 style={{ textAlign: "center", marginTop: 15, color: '#000000' }}>INGRESA TUS DATOS</h2>
      {error && (
        <Col
          xs={24}
          style={{ marginTop: 16, marginBottom: 16, textAlign: "center" }}
        >
          <Alert
            message="El correo ya fue registrado con anterioridad"
            type="error"
            closable
          />
        </Col>
      )}
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        style={{ margin: 16 }}
        // scrollToFirstError
      >
        <Row gutter={[12, 12]} justify="center" align="middle">
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              name="name"
              label="Nombre"
              rules={[
                { required: true, message: "Ingresa el nombre de usuario!" },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "El correo agregado no es valido.",
                },
                {
                  required: true,
                  message: "Favor de ingresar un correo.",
                },
              ]}
            >
              <AutoComplete options={emailOptions} onChange={onemailChange}>
                <Input
                  className="login-input"
                  placeholder="Correo electronico"
                />
              </AutoComplete>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              name="phone"
              label="Telefono"
              rules={[
                {
                  required: true,
                  message: "Favor de agregar un numero de telefono.",
                },
                {
                  pattern: /^(?:\d*)$/,
                  message: "Favor de agregar un numero valido",
                },
                {
                  pattern: /^[\d]{10,13}$/,
                  message:
                    "El numero de telefono debe tener al menos 10 caracteres y no mayor a 13.",
                },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              name="password"
              label="Contraseña"
              rules={[
                {
                  required: true,
                  message: "Favor de agregar su contraseña.",
                },
                {
                  min: 8,
                  message: "La contraseña debe contener al menos 8 caracteres",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              name="confirm"
              label="Confirmar Contraseña"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Favor de confirmar la contraseña.",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Las contraseñas no coinciden.");
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              label="Nombre de la organización"
              name="bussiness"
              rules={[
                {
                  required: true,
                  message: "Debes ingresar el nombre de la organización",
                },
              ]}
            >
              <Input placeholder="Añadir nombre" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              label="RFC"
              name="rfc"
              rules={[
                {
                  required: true,
                  message: "Debes ingresar el RFC de la organización",
                },
              ]}
            >
              <Input maxLength={13} minLength={12} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              label="País"
              name="country"
              rules={[{ required: true, message: "Debes elegir un país" }]}
            >
              <Select
                showSearch
                name="pais"
                placeholder="Seleccionar país"
                optionFilterProp="children"
                onChange={onFormChangePais}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {country.countries.map((ct, index) => (
                  <Option key={index} value={ct.name}>
                    {ct.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              label="Estado"
              name="state"
              rules={[{ required: true, message: "Debes elegir un estado" }]}
            >
              <Select
                showSearch
                name="estado"
                placeholder="Seleccionar estado"
                optionFilterProp="children"
                disabled={disabled.stateOrg}
                onChange={onFormChangeState}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {state.states.map((st, index) => (
                  <Option key={index} value={st.name}>
                    {st.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              label="Ciudad"
              name="city"
              rules={[{ required: true, message: "Debes ingresar una ciudad" }]}
            >
								<Input style={{ width: "100%" }} />
              {/*
							<Select
                showSearch
                name="ciudad"
                placeholder="Seleccionar ciudad"
                optionFilterProp="children"
                disabled={disabled.cityOrg}
                onChange={onFormChangeCity}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {city.cities.map((cty, index) => (
                  <Option key={index} value={cty.id}>
                    {cty.name}
                  </Option>
                ))}
              </Select>
							*/}
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              label="Código postal"
              name="postal_code"
              rules={[
                { required: true, message: "Debes ingresar un codigo postal" },
              ]}
            >
							<Input style={{ width: "100%" }} />
							{/* 
              <Select
                showSearch
                name="codigo_postal"
                placeholder="Seleccionar código postal"
                optionFilterProp="children"
                disabled={disabled.pcOrg}
                onChange={onFormChangeCP}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {pc.pcodes.map((pcod, index) => (
                  <Option key={index} value={pcod.id}>
                    {pcod.name}
                  </Option>
                ))}
              </Select>
							*/}
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              label="Colonia"
              name="colony"
              rules={[{ required: true, message: "Debes ingresar una colonia" }]}
            >
							<Input style={{ width: "100%" }} />
							{/* 
              <Select
                showSearch
                name="colonia"
                placeholder="Seleccionar colonia"
                optionFilterProp="children"
                disabled={disabled.colonyOrg}
                // onChange={onFormChange}

                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {colony.colonies.map((col, index) => (
                  <Option key={index} value={col.id}>
                    {col.name}
                  </Option>
                ))}
              </Select>
							*/}
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              label="Calle"
              name="street"
              rules={[{ required: true, message: "Debes ingresar una calle" }]}
            >
              <Input placeholder="Ingresar calle" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              label="Número exterior"
              name="ext_num"
              rules={[
                {
                  required: true,
                  message: "Debes ingresar el número exterior",
                },
              ]}
            >
              <Input placeholder="Ingresar núm. ext" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              label="Número interior"
              name="int_num"
              rules={[
                {
                  required: false,
                  message: "Debes ingresar el número interior",
                },
              ]}
            >
              <Input placeholder="Ingresar núm. int" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              label="Mi logo"
              name="logo"
              rules={[{ required: false, message: "Debes agregar tu logo" }]}
            >
              <Upload
                name="logo"
                maxCount={1}
                {...propsLogo}
                beforeUpload={() => false}
                listType="picture-card"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item
              name="role"
              label="Tipo"
              rules={[
                {
                  required: true,
                  message: "Selecciona un tipo de usuario.",
                },
              ]}
            >
              <Select placeholder="Selecciona un tipo de usuario">
                <Option value={4}>Soy comprador</Option>
                <Option value={6}>Soy proveedor</Option>
              </Select>
            </Form.Item>
          </Col>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.role !== currentValues.role
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("role") === 6 ? (
                <>
                  <Col xs={24} md={12} lg={8} xl={6}>
                    <Form.Item
                      label="Página web"
                      name="url"
                      rules={[
                        {
                          required: true,
                          message: "Debes ingresar tu página web",
                        },
                      ]}
                    >
                      <Input placeholder="Ingresar página web" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={8} xl={6}>
                    <Form.Item 
											label="Categoria(s)" 
											name="categories"
                    	rules={[{ required: true, message: 'Debes elegir almenos una categoria' }]}
                  	>
                      <Select
                          mode="multiple"
                          allowClear
                          placeholder="Seleccionar la(s) categoria(s)"
                          name="categoria"
                          rules={[{ required: true }]}
                      >
                      { categories.map((category, index) => (
                        <Option key={index} value={category.id}>{category.name}</Option>
                      ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={8} xl={6}>
                    <Form.Item
                      label="Iva"
                      name="iva"
                      rules={[{
                        required: true,
                         message: "Debes seleccionar el iva al que facturas.",
											},]}
                    >
                      <Select
                        allowClear
                        placeholder="Seleccionar iva al que facturas"
                        name="iva"
                        rules={[{ required: true }]}
                      >
                        <Option value={0.16}>16%</Option>
                        <Option value={0.08}>8%</Option>
                      </Select>
                    </Form.Item>
                  </Col>
									<Col xs={24} md={12} lg={8} xl={6}>
                    <Form.Item
                      name="terms"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error("Should accept agreement")
                                ),
                        },
                      ]}
                    >
                      <Checkbox>Acepto los terminos y codiciones</Checkbox>
                    </Form.Item>
                  </Col>
                </>
              ) : (
                getFieldValue("role") === 4 && (
                  <Col xs={24} md={12} lg={8} xl={6}>
                    <Form.Item /* INPUT PAY DAYS*/
                      label="¿A cuántos días se paga?"
                      name="pay_days"
                      rules={[
                        {
                          required: true,
                          message:
                            "Debes mencionar en cuantos días realizas los pagos.",
                        },
                      ]}
                    >
                      <InputNumber placeholder="Ingresar los días" min={1} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                )
              )
            }
          </Form.Item>
        </Row>
        <Row justify="center">
          <Col xs={24} md={12} lg={8}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={load} style={{ width: "100%" }}>
                Registrarme
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
}
