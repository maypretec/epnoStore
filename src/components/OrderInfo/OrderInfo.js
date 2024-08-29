import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Tag,
  Upload,
  Modal,
  Form,
  Input,
  Popconfirm,
  Collapse,
  Empty,
  Avatar,
  Radio,
  Badge,
  Typography,
  Tooltip,
  message,
  Checkbox,
  Select,
  InputNumber,
  Descriptions,
  DatePicker,
  Space,
  notification,
  List,
  Divider,
} from "antd";
import "./OrderInfo.scss";
import fileDownload from "js-file-download";
import {
  DownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  QuestionCircleOutlined,
  InboxOutlined,
  PlusOutlined,
  FileOutlined,
  DollarCircleOutlined,
  NumberOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import Rate from "../Rate";
import Drawer from "../Drawer";
import moment from "moment";
import OrderService from '../../utils/api/orders';
import SupplierService from "../../utils/api/suppliers";
import ComplaintService from "../../utils/api/complaints";
import ServiceStatus from "../Generals/ServiceStatus";
import UserService from "../../utils/api/users";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Panel } = Collapse;
const { Dragger } = Upload;
const { Option } = Select;

export default function OrderInfo(props) {
  const {serviceData, details, reload, setReload, role, token, categorias, unidades } = props;
  // const { id, type } = useParams();

  const userData = JSON.parse(localStorage.getItem('user'))
  const userFcm = localStorage.getItem('fcm') 
  const [service, setService] = useState(serviceData);
  const [user, setUser] = useState({});
  const [form] = Form.useForm();
  const [formR] = Form.useForm();
  const [formC] = Form.useForm();
  const [subserviceId, setSubserviceId] = useState();
  const [suppliersList, setSuppliersList] = useState([]);
  const [moreSuppliersList, setMoreSuppliersList] = useState([]);
  const [loadAddSuppCot, setLoadAddSuppCot] = useState(false);
  const [rechazarCotSupplierModal, setRechazarCotSupplierModal] =
    useState(false);
  const [loadRechazarCotSupp, setLoadRechazarCotSupp] = useState(false);
  const [aceptCotModal, setAceptCotModal] = useState(false);
  const [loadaceptCot, setLoadaceptCot] = useState(false);
  const [aceptCotSuppList, setAceptCotSuppList] = useState([]);
  const { Paragraph, Text } = Typography;
  const [fechaEntrega, setFechaEntrega] = useState();
  const [cotizacion, setCotizacion] = useState({
    cotfileList: [],
  });
  const [invoiceFileModal, setInvoiceFileModal] = useState(false);
  // cotizacionEpnoToClientModal se utiliza para mostrar el modal de generar cot al client
  const [cotizacionEpnoToClientModal, setCotizacionEpnoToClientModal] =
    useState(false);
  // cotizacionEpnoToClientModal se utiliza para mostrar el modal de generar la po al supplier
  const [poEpnoToSupplierModal, setPoEpnoToSupplierModal] = useState(false);

  const [showTipoCambio, setShowTipoCambio] = useState();
  const [tipoCambio, setTipoCambio] = useState(0);
  // loadGenerarClientCot se utiliza para poner el boton de generar cot y tambien de generar po en cargando.
  const [loadGenerarClientCot, setLoadGenerarClientCot] = useState(false);
  const [showPdfCot, setShowPdfCot] = useState(false);
  const [addService, setAddService] = useState(false);
  const [addUnicService, setAddUnicService] = useState(false);
  const [addSupplierModal, setAddSupplierModal] = useState(false);
  const [selectSuppRequired, setSelectSuppRequired] = useState(true);
  const [visible, setVisible] = useState(false);
  const [clientCotFile, setClientCotFile] = useState();
  const [loadSubservice, setLoadSubservice] = useState(false);
  const [loadAgregarSupp, setLoadAgregarSupp] = useState(false);
  const [loadCancelar, setLoadCancelar] = useState(false);
  const [solicitarCancelModal, setSolicitarCancelModal] = useState(false);
  const [option, setOption] = useState();
  const [title, setTitle] = useState();
  const [loadCotizarNuevamente, setLoadCotizarNuevamente] = useState(false);
  const [loadServiceChangeStep, setLoadServiceChangeStep] = useState(false);
  const [queja, setQueja] = useState({
    modal: false,
    load: false,
  });
  const types = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingm",
    "application/msword",
    "image/jpeg",
    "image/png",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  const defaultFileList = [];
  // supplierServices sirve para guardar los servicios que provee X supp, y con esto epno haga una Po hacia el supp.
  const [poToSupplier, setPoToSupplier] = useState({
    supplierServices: [],
    poFile: "",
  });

  {
    details.files.general !== "" &&
      details.files.general.map((c, index) => {
        defaultFileList.push({
          uid: index,
          name: c.file_name,
          status: "done",
          url: `https://api.epno-app.com${c.file_path}`,
        });
      });
  }
  
  const propiedades = {
    defaultFileList,
    onDownload: (file) => {
      fileDownload(file.url, file.name);
    },
    showUploadList: {
      showDownloadIcon: false,
      downloadIcon: <DownloadOutlined />,
      showRemoveIcon: false,
    },
  };

  const onFinish = (subservice, title) => (values) => {
    setLoadAddSuppCot(true);

    const { cotfileList } = cotizacion;

    const formData = new FormData();

    formData.append("cotizacion", cotfileList[0]);
    formData.append("subservice_id", subservice);
    formData.append("service_id", details.service.id);
    formData.append("purchase", details.service.order_num);
    formData.append("costo", values.cost);
    formData.append("cantidad", values.qty);
    formData.append("fecha_entrega", fechaEntrega);
    formData.append("client_vs", details.client.vs);
    formData.append("client_org_id", details.client.org_id);
    formData.append("created_at", details.order.created_at);
    formData.append("order_id", details.service.order_id);
    formData.append("type_code", details.service.type_code);
    formData.append("subservice_title", title);

      SupplierService.Quote(formData)
      .then((response) => {
        setLoadAddSuppCot(false);
        if (response.data.success == true) {
          message.success("Cotizacion enviada correctamente");
          setReload(!reload);
        } else {
          message.error("Hubo un error al enviar la cotización");
        }
      })

      .catch((error) => {
        message.error("Hubo un error al enviar la cotización");

      });
  };

  function onChangeDate(date, dateString) {
    setFechaEntrega(dateString);
  }
  const { cotfileList } = cotizacion;
  const propsCotizacion = {
    onRemove: (file) => {
      setCotizacion((state) => {
        const index = state.cotfileList.indexOf(file);
        const newFileList = state.cotfileList.slice();
        newFileList.splice(index, 1);
        return {
          cotfileList: newFileList,
        };
      });
    },
    beforeUpload: (file) => {
      setCotizacion((state) => ({
        cotfileList: [...state.cotfileList, file],
      }));
      return false;
    },
    cotfileList,
  };

  const addSubservice = (op, values) => {
    setLoadSubservice(true);
    let subservices;
    if (op == 1) {
      subservices = values.services;
    } else {
      subservices = values;
    }

    OrderService.AddSubservice({ option: op, service: details.service, subservices: subservices })
      .then((response) => {
        setLoadSubservice(false);
        if (response.data.success == true) {
          form.resetFields();
          setReload(!reload);
          if (op == 1) {
            setAddService(false);
          } else {
            setAddUnicService(false);
          }
          message.success(response.data.message);
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        setLoadSubservice(false);
      });
  };

  const AddSuppliers = (id, categoria) => {
    setLoadAgregarSupp(true);

    OrderService.RecommendedSuppliers({
      service: details.service.id,
      subservice: id,
      categoria: categoria,
      order_id: details.service.order_id,
    })
      .then((response) => {
        setSuppliersList(response.data.suppliers);
        setMoreSuppliersList(response.data.more_supp);
        setSubserviceId(id);
        setAddSupplierModal(true);
        setLoadAgregarSupp(false);
      })
      .catch((error) => {
        setLoadAgregarSupp(false);
      });
  };

  const AddServiceSuppliers = (values) => {

    OrderService.AddSuppliersToSubservice({ service: details.service.id, subservice: subserviceId, values })
      .then((response) => {
        message.success("Proveedores agregados correctamente");
        setReload(!reload);
        setAddSupplierModal(false);
        setSelectSuppRequired(true);
        form.resetFields();
      })
      .catch((error) => {
        message.error("Error al actualizar servicio");
      });
  };

  const cerrarModalAddSupplier = () => {
    setAddSupplierModal(false);
    setSelectSuppRequired(true);
    form.resetFields();
  };
  const cerrarModalRechazarCotSupp = () => {
    setRechazarCotSupplierModal(false);
    formR.resetFields();
  };

  const SupplierRechazarCot = (values) => {
    setLoadRechazarCotSupp(true);
    OrderService.RejectBidding({
      service: details.service.id,
      subservice: subserviceId,
      comentario: values.comentario,
      client_vs: details.client.vs,
      client_org_id: details.client.org_id,
      created_at: details.order.created_at,
      order_id: details.service.order_id,
      type_code: details.service.type_code,
      service_title: details.service.title,
    })
      .then((response) => {
        setLoadRechazarCotSupp(false);

        if (response.data.success == true) {
          message.success("¡Comentario enviado correctamente!");
          setReload(!reload);
          setRechazarCotSupplierModal(false);
          formR.resetFields();
        } else {
          message.error("¡No se pudo enviar el comentario!");
        }
      })
      .catch((error) => {
        message.error("¡No se pudo enviar el comentario!");
      });
  };

  const onChangeService = (type, value) => {

    OrderService.UpdateServiceInfo({ service: details.service.id, type: type, value: value })
      .then((response) => {
        if (response.data.success == true) {
          message.success("Servicio actualizado correctamente");
          setReload(!reload);
        } else {
          message.error("Error al actualizar servicio");
        }
      })
      .catch((error) => {
        message.error("Error al actualizar servicio");
      });
  };

  const openNotificationWithIcon = (type, title, desc, sub, code) => {
    notification[type]({
      message: title,
      description: `${code} - ${sub}: ${desc}`,
    });
  };

  const aceptSuppPropListClient = (
    e,
    supplier,
    subservice,
    service,
    desc,
    code,
    sub_name
  ) => {
    let check = e.target.checked;

    OrderService.AcceptOrReject({
      check: check,
      supplier_id: supplier,
      subservice_id: subservice,
      service_id: service,
    })
    .then((response) => {
      if (response.data.success == true) {
        if (check == true) {
          openNotificationWithIcon(
            "success",
            response.data.message,
            desc,
            sub_name,
            code
          );
          // setReload(!reload)
        } else {
          openNotificationWithIcon(
            "info",
            response.data.message,
            desc,
            sub_name,
            code
          );
        }
      } else {
        message.error(response.data.message);
      }
    })
    .catch((error) => {
      message.error("Hubo en error al hacer los cambios deseados");
    });
  };

  const aceptCotShowSupp = (service) => {
    setLoadaceptCot(true);

    OrderService.AcceptSubserviceList({service: service})
      .then((response) => {
        setLoadaceptCot(false);
        setAceptCotSuppList(response.data);
        setAceptCotModal(true);
      })
      .catch((error) => {
        message.error("Hubo al mostrar las cotizaciones de cada servicio.");
      });
  };

  const SuppCotizarNuevamente = (supplier, service, subservice) => {
    setLoadCotizarNuevamente(true);
    
    OrderService.QuoteAgainst({
      supplier: supplier,
      service: service,
      subservice: subservice,
    })
      .then((response) => {
        setLoadCotizarNuevamente(false);
        if (response.data.success == true) {
          message.success(response.data.message);
        } else {
          message.success(response.data.message);
        }
      })
      .catch((error) => {
        setLoadCotizarNuevamente(false);

        message.error("Hubo al actualizar este subservicio.");
      });
  };

  const IconText = ({ icon, text }) => (
    <Space>
      {icon}
      {text}
    </Space>
  );

  const propsPO = {
    name: "po",
    multiple: false,
    data: {
      service_id: details.service.id,
      client_vs: details.client.vs,
      client_org_id: details.client.org_id,
      created_at: details.order.created_at,
      order_id: details.service.order_id,
      type_code: details.service.type_code,
      title: details.service.title,
    },
    action: "https://api.epno-app.com/api/subir_client_po",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },

    onChange(info) {
      const { status } = info.file;

      if (status === "done") {
        if (info.file.response.success == true) {
          message.success(
            `${info.file.name} ${info.file.response.message}.`,
            10
          );
          setReload(!reload);
          setAceptCotModal(false);
          formC.resetFields();
        } else {
          message.error(
            `Hubo un error al subir el archivo ${info.file.name}, ${info.file.response.message}.`,
            10
          );
        }
      }
    },
    onDrop(e) {
    },

    beforeUpload: (file) => {
      if (!types.includes(file.type)) {
        message.error(
          `El documento ${file.name}, esta en un formato no permitido, 
       toma en cuenta que no sera subido`,
          10
        );
        return false;
      } else {
        return true;
      }
    },
  };
  const propsSendoPOSupplier = {
    name: "po",
    multiple: false,
    data: {
      subservices: JSON.stringify(poToSupplier.supplierServices),
      service: JSON.stringify(details.service),
    },
    action: "https://api.epno-app.com/api/subir_po_generada",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },

    onChange(info) {
      const { status } = info.file;

      if (status === "done") {
        if (info.file.response.success == true) {
          message.success(
            `${info.file.name}, ${info.file.response.message}.`,
            10
          );
          setReload(!reload);
          setPoEpnoToSupplierModal(false);
        } else {
          message.error(
            `Hubo un error al subir el archivo ${info.file.name}, ${info.file.response.message}.`,
            10
          );
        }
      }
    },
    onDrop(e) {
    },

    beforeUpload: (file) => {
      if (!types.includes(file.type)) {
        message.error(
          `El documento ${file.name}, esta en un formato no permitido, 
       toma en cuenta que no sera subido`,
          10
        );
        return false;
      } else {
        return true;
      }
    },
  };

  const propsFile = {
    name: "file",
    multiple: false,
    data: {
      user_name: details.client.contact_name,
      user_email: details.client.contact_email,
      user_role: 4,
      user_id: details.client.user_id,
      service_id: details.service.id,
      order_id: details.service.order_id,
      purchase_order: details.service.order_num,
      titulo: details.service.title,
    },
    action: "https://api.epno-app.com/api/subir_client_cot_generada",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        if (info.file.response.success == true) {
          setReload(!reload);
          message.success(
            `${info.file.name} ${info.file.response.message}.`,
            10
          );
          setCotizacionEpnoToClientModal(false);
          form.resetFields();
          setShowTipoCambio(false);
          setTipoCambio(0);
          form.setFieldsValue({ tipo_cambio: 0 });
        } else {
          message.error(
            `Hubo un error al subir el archivo ${info.file.name}, ${info.file.response.message}.`,
            10
          );
        }
      }
    },
    beforeUpload: (file) => {
      if (!types.includes(file.type)) {
        message.error(
          `El documento ${file.name}, esta en un formato no permitido, 
       toma en cuenta que no sera subido`,
          10
        );
        return false;
      } else {
        return true;
      }
    },
    onDrop(e) {
    },
  };
  const sendClientInvoice = {
    name: "invoice",
    multiple: false,
    data: {
      org_id: details.client.org_id,
      pay_days: details.client.pay_days,
      service_id: details.service.id,
      order_id: details.service.order_id,
    },
    action: "https://api.epno-app.com/api/send_invoice_file",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        if (info.file.response.success == true) {
          message.success(
            `${info.file.name} ${info.file.response.message}.`,
            10
          );
          setInvoiceFileModal(false);
          serviceChangeStep(null);
        } else {
          message.error(
            `Hubo un error al subir el archivo ${info.file.name}, ${info.file.response.message}.`,
            10
          );
        }
      }
    },
    beforeUpload: (file) => {
      if (!types.includes(file.type)) {
        message.error(
          `El documento ${file.name}, esta en un formato no permitido, 
       toma en cuenta que no sera subido`,
          10
        );
        return false;
      } else {
        return true;
      }
    },
    onDrop(e) {
    },
  };

  const sendCotClient = (values) => {
    setShowPdfCot(false);
    setLoadGenerarClientCot(true);
    OrderService.UploadQuote({
        client_info: details.client,
        service_info: details.service,
        subservices: details.subservices,
        iva: values.iva,
        unidad: values.unidad,
        currency: values.currency,
        tipo_cambio: tipoCambio,
        condiciones_pago: values.condiciones_pago,
        vigencia: values.vigencia,
      })
    .then((response) => {
      setLoadGenerarClientCot(false);
      if (response.data.success == true) {
        setClientCotFile(response.data.url);
        setShowPdfCot(true);
        form.resetFields();
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    })
    .catch((error) => {
      message.error("Hubo un error al enviar los datos.");
      setLoadGenerarClientCot(false);
    });
  };

  const SelectCalcelCot = (title, visible, option) => {
    setSolicitarCancelModal(visible);
    setTitle(title);
    setOption(option);
  };

  const SolicitarCancelacionCot = (values) => {
    setLoadCancelar(true);
      OrderService.CancelRequest({
          client_info: details.client,
          service_info: details.service,
          subservices: details.subservices,
          comentario: values.comentario,
          option: option,
        })
      .then((response) => {
        setLoadCancelar(false);
        if (response.data.success == true) {
          setReload(!reload);
          setSolicitarCancelModal(false);
          message.success(response.data.message);
          formR.resetFields();
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        message.error("Hubo un error al enviar los datos.");
        setLoadCancelar(false);
      });
  };

  const serviceChangeStep = (sub_id) => {
    setLoadServiceChangeStep(true);
      OrderService.ChangeServiceStep({
          client_info: details.client,
          service_info: details.service,
          subservice_id: sub_id,
        })
      .then((response) => {
        setLoadServiceChangeStep(false);
        if (response.data.success == true) {
          setReload(!reload);
          message.success("Actualizacion hecha correctamente");
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        message.error("Hubo un error al enviar los datos.");
        setLoadServiceChangeStep(false);
      });
  };

  const sendPoToSupplier = (option, values) => {
    setLoadGenerarClientCot(true);
    setShowPdfCot(false);
      SupplierService.purchase_orders({
          service: details.service,
          supplier: values,
          option: option,
          subservices: poToSupplier.supplierServices,
        })
      .then((response) => {
        setLoadGenerarClientCot(false);
        if (response.data.success == true) {
          message.success(response.data.message);

          if (option == 1) {
            setPoToSupplier({
              ...poToSupplier,
              supplierServices: response.data.services,
            });
            setPoEpnoToSupplierModal(true);
          } else {
            setShowPdfCot(true);
            setPoToSupplier({
              ...poToSupplier,
              poFile: response.data.url,
            });
          }
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        message.error("Hubo un error al realizar la acción.");
        setLoadGenerarClientCot(false);
      });
  };

  const RequestComplaint = (values) => {
    setQueja({ ...queja, load: true });
    const formData = new FormData();

    formData.append("evidencia", values.evidencia.fileList[0].originFileObj);
    formData.append("desc_evidencia", values.desc_evidencia);
    formData.append("order_id", details.order.id);
    formData.append("service_id", details.service.id);
    formData.append("service_title", details.service.title);
    formData.append("client_id", details.client.user_id);
    formData.append("client_org", details.client.org_id);
    formData.append("client_mail", details.client.contact_mail);
    formData.append("order_num", details.service.order_num);
    formData.append("client_cost", details.order.client_cost);
    formData.append("supplier_cost", details.order.supplier_cost);
    formData.append("return_amount", details.order.return_amount);

    values.subservices.forEach((service) => {
      formData.append("subservices[]", service);
    });

    if (values.more_queja !== undefined) {
      values.more_queja.forEach((file) => {
        formData.append("descs[]", file.desc_eviden);
        formData.append("evidencias[]", file.eviden.fileList[0].originFileObj);
      });
    }

      ComplaintService.ComplaintRequest(formData)
      .then((response) => {
        setQueja({ ...queja, load: false });
        if (response.data.success == true) {
          message.success("Queja creada correctamente.");
          setReload(!reload);
          setQueja({ ...queja, modal: false });
        } else {
          message.error("Hubo un error al levantar la queja.");
        }
      })
      .catch((error) => {
        setQueja({ ...queja, load: false });
        message.error("Hubo un error al levantar la queja.");
      });
  };

  // MAYPRETEC ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [proposals, setProposals] = useState([])
  const [positions, setPositions] = useState([])
  const [proposalPrice, setProposalPrice] = useState([])
  const [proposalFiles, setProposalFiles] = useState([])
  const [proposalFilesUrl, setProposalFilesUrl] = useState([])
  const [application, setApplication] = useState({
		description: '',
		price: 0,
		dueDate: '',
    type: '',
		fileList: [],
	});

  const [industryPO, setIndustryPO] = useState()
  const [supplierPO, setSupplierPO] = useState()

  /* USER DATA API CALL*/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await UserService.GetUserById({ id: service.userId });
        setUser(userResponse.data);

        const proposalsResponse = await OrderService.GetProposalByService({ serviceId: service.id });
        const filterPositions = proposalsResponse.data.map((prop) => prop.place)
        const filterPrices = proposalsResponse.data.map((prop) => prop.price_epno)
        const filterFiles =  proposalsResponse.data.map((prop) => prop.fileUrl_epno)
        setPositions(filterPositions)
        setProposalPrice(filterPrices)
        setProposalFilesUrl(filterFiles)

        if ((service.status >= 4 && (role == 1 || role == 4)) || (service.status == 3 && (role == 1 || role == 4) && service.supplier != '')) {
          const filteredProposalsDo = proposalsResponse.data.filter(proposal => proposal.status === true);
          setProposals(filteredProposalsDo);
        } else if (role === 6) {
          const filteredProposals = proposalsResponse.data.filter(proposal => proposal.userId === userData.id);
          setProposals(filteredProposals);
        } else { setProposals(proposalsResponse.data); } 

      } catch (error) {
      }
    };

    fetchData();
  }, [service.userId, service.id, role, userData.id]);

  // Updates service status -----------------------------------------------
  const onChange = (targetInput) => {
    console.log(targetInput)
		setApplication((state) => ({
			...state,
      
			[targetInput.target == undefined ? 'type' : targetInput.target.name]: targetInput.target == undefined ? targetInput : targetInput.target.value,
		}));
	};

	const onDateChange = (date, dateString) => {
		setApplication((state) => ({
			...state,
			dueDate: dateString,
		}));
	};

  const onChangePosition = (i, position) => {
    setPositions((state) => ({
      ...state,
      [i]: position.target.value
    }));
  }

  const onChangePropPrice = (i, price) => {
    setProposalPrice((state) => ({
      ...state,
      [i]: price.target.value
    }));
  }

  const onChangePropFile = (i, file) => {
    setProposalFiles((state) => ({
      ...state,
      [i]: file
    }));
  }

  const updateService = (id, status) => {
    setLoadServiceChangeStep(true);

    OrderService.UpdateService({
      id: id, 
      status: status, 
      clientId: service.userId || null,
      clientFcm: service.userFcm || null,
      supplierId: service.supplierId || null,
      supplierFcm: service.supplierFcm || null,
      cat1: service.cat1 || null,
      cat2: service.cat2 || null
    }).then(resp => {
      setLoadServiceChangeStep(false);
      if (resp.data.success === true) {
        setReload(!reload);
        message.success("Actualizacion hecha correctamente").then(() => {
          window.location.reload();
        });
      } else {
        message.error(resp.data.message);
      }
    }).catch((error) => {
      message.error("Hubo un error al enviar los datos.");
      setLoadServiceChangeStep(false);
    });
  }

  const updateServicePlacement = (id, place, price, file) => {
    setLoadServiceChangeStep(true);
    OrderService.UpdateServicePlacement({id: id, place: place, price_epno: price, fileUrl_epno: file, userId: userData.id}).then(resp => {
      if (resp.data.success === true) {
        setReload(!reload);
        message.success("Actualizacion exitosa", 1).then(() => {
          window.location.reload();
        });
      } else {
        message.error(resp.data.message);
      }
    }).catch((error) => {
      message.error("Hubo un error al enviar los datos.");
      setLoadServiceChangeStep(false);
    });
  }

  const applyToService = () => {

    const apply = {
      serviceId: service.id,
      userId: userData.id,
      userFcm: userFcm,
      name: userData.bussiness,
      description: application.description,
      price: application.price,
      changeType: application.type,
      dueDate: application.dueDate,
      fileBase64: application.fileList
    }

    console.log(apply)

    OrderService.ApplyService(apply).then(resp => {
      if (resp.data.success === true) {
        message.success("Aplicacion exitosa!", 1).then(() => {
          window.location.reload();
        });
      } else {
        message.error(resp.data.message);
      }
    }).catch((error) => {
      message.error("Hubo un error al enviar los datos.");
    });
  }

  const uploadIndustryPO = () => {
    const body = {
      userId: userData.id,
      serviceId: service.id,
      fileBase64: industryPO
    }

    OrderService.UploadIndustryPO(body).then(resp => {
      if (resp.data.success === true) {
        message.success("Actualizacion de datos exitoso!", 0.5).then(() => {
          window.location.reload();
        });
      } else {
        message.error(resp.data.message);
      }
    }).catch((error) => {
      message.error("Hubo un error al enviar los datos.");
    });
  }

  const uploadSupplierPO = () => {
    const body = {
      userId: userData.id,
      serviceId: service.id,
      clientId: service.userId,
      supplierId: service.supplierId,
      fileBase64: supplierPO
    }

    OrderService.UploadSupplierPO(body).then(resp => {
      if (resp.data.success === true) {
        message.success("Actualizacion de datos exitoso!", 0.5).then(() => {
          window.location.reload();
        });
      } else {
        message.error(resp.data.message);
      }
    }).catch((error) => {
      message.error("Hubo un error al enviar los datos.");
    });
  }

  const chooseProposal = (proposalId, supplierId, supplier, price, sup_price, changeType, dueDate, supplierFileUrl) => {
    const choosenProp = {
      proposalId: proposalId,
      serviceId: service.id,
      supplierId: supplierId,
      supplier: supplier,
      price: price,
      sup_price: sup_price,
      changeType: changeType,
      dueDate: dueDate,
      supplierFileUrl: supplierFileUrl,
      clientId: service.userId,
      clientName: service.userName,
      clientFcm: service.userFcm
    }
    console.log(choosenProp)
    OrderService.ChooseProposal(choosenProp).then((resp) => {
      if (resp.data.success === true) {
        setReload(!reload);
        message.success("Eleccion exitosa", 1).then(() => {
          window.location.reload();
        });
      } else {
        message.error(resp.data.message);
      }
    }).catch((error) => {
      message.error("Hubo un error al enviar los datos.");
      setLoadServiceChangeStep(false);
    });
  }

  // Upload file -------------------------------------------
  const getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				const base64String = reader.result.split(',')[1];
				resolve(base64String);
			};
			reader.onerror = (error) => reject(error);
		});
	};

  const propsDrag = {
		beforeUpload: async (file) => {
			const base64 = await getBase64(file);
			setApplication((state) => ({
				...state,
				fileList: base64,
			}));
			return false;
		},
		application
	}; 

  const propsProp = (i) => ({
    beforeUpload: async (file) => {
      const base64 = await getBase64(file);
      setProposalFiles((state) => ({
        ...state,  // mantener el estado anterior
        [i]: base64,  // actualizar la entrada correspondiente a 'i'
      }));
      return false;
    },
    application
  });

  const propsPOIndustry = {
    beforeUpload: async (file) => {
      const base64 = await getBase64(file);
      setIndustryPO(base64)
      return false;
    },
    application
  };

  const propsPOSupplier = {
    beforeUpload: async (file) => {
      const base64 = await getBase64(file);
      setSupplierPO(base64)
      return false;
    },
    application
  };

  const statusLogs = [
    'Nuestro equipo esta verificando que el servicio sea valido para su elaboracion',
    'Tu servicio se encuentra en cotizacion',
    'Selecciona el servicio que se adecue mejor a tus necesesidades',
    'Tu servicio se encuentra en elaboracion',
    'Estamos inspeccionando tu pedido para aseguranos que sea lo que solicitaste',
    'Tu pedido se encuentra en camino o listo para recoger. Por favor confirmanos cuando lo tengas en tu posesion.',
    'Gracias por confiar en EPNO! Cualquier duda o aclaracion, comunicate con nuestro equipo'
  ]

  const adminStatusLogs = [
    'Verifica que el cliente haya subido correctamente los datos de cotizacion. Si fue asi, envia a cotizacion el servicio.',
    'Espere a que los provedores cotizen el servicio. Una vez se tengan las cotizaciones deseadas, asigna un lugar a los provedores, actualiza el precio y archivo de cotizacion a cada uno. Al finalizar envia las cotizaciones a el cliente.',
    'El cliente se encuentra seleccionando la cotizacion. Una vez seleccione la cotizacion deseada y el cliente envie la orden de compra, debes de generar una orden de compra para enviar al provedor.',
    'El provedor se encuentra elaborando el servicio',
    'Verifica que el servicio solicitado sea el correcto para el cliente.',
    'El servicio se encuentra en camino o listo para recoger. Espera a que el cliente confirme que el pedido ya ha sido entregado.',
    'El servicio a concluido.'
  ]

  const supplierStatusLogs = [
    'Envia tu cotizacion con los datos requeridos.',
    'El cliente se encuentra seleccionando la cotizacion.',
    'Felicidades, tu cotizacion ha sido aceptada! Elabora el servicio solicitado. Una vez terminado, actualiza el estatus para que EPNO inspeccione el producto.',
    'EPNO se encuentra inspeccionando el servicio.',
    'Puedes entregar al servicio a tu cliente.',
    'El servicio a concluido. Cualquier duda o aclaracion, contacta a EPNO.'
  ]

  // ------------------------------------------------------------
  return (
    <Row gutter={[12, 12]} justify="center" align="middle">
      
      {/* HEADER ------------------------------------------------------------------------- */}
      {/* TODO: Change by status */}
      <Col xs={24}>
        <Row gutter={[12, 12]} justify="center" align="middle">
          {/* TITULO */ }
          <Col xs={24} md={18} xl={20}>
            <Row gutter={[12, 12]} justify="center">
              <Col xs={24}>
                <label style={{ fontWeight: 600, fontSize: 18, color: '#000000' }}>
                  {service.title} - {service.id}
                </label>
              </Col>
              <Col xs={24}>
                <label style={{ fontWeight: 600, color: "#888888" }}>
                  {moment(service.createdAt).format("DD/MM/YYYY H:ss")}{" "}
                  -
                </label>{" "}
                <ServiceStatus status={service.status}/>
               
              </Col>
            </Row>
            
          </Col>

          {/* BOTON DE SEGUIMIENTO DE PROCESOS */}        
          <Col xs={24} md={6} xl={4} style={{ textAlign: "center" }}>

          { /* Administrador */
          role === 1 ? 
            service.status === 1 ? // Aprovar 
            <Popconfirm
                title="¿Seguro que desea enviar a cotizacion?"
                onConfirm={() => updateService(service.id, 2)}
                okText="Si"
                cancelText="No"
              >
              <Button
                type="primary"
                icon={<UploadOutlined />}
                loading={loadServiceChangeStep}
                disabled={details.subservices == "" && true}
              >
                En verificacion
              </Button>
            </Popconfirm>
             
            : service.status === 2 ? 
            <Popconfirm
                title="¿Seguro que la orden esta lista para subir su cotizacion?"
                onConfirm={() => updateService(service.id, 3)}
                okText="Si"
                cancelText="No"
              >
              <Button type="primary" icon={<UploadOutlined />}>
                Subir COT
              </Button>
            </Popconfirm>

            : (service.status === 7 || service.status === 8) ?
              <Button type="dashed" danger /*onClick={() => }*/ >
                  Seguir proceso
              </Button>

            : service.status === 5 ?
            <Popconfirm
                title="¿Seguro que desea confirmar esta orden como lista?"
                onConfirm={() => updateService(service.id, 6)}
                okText="Si"
                cancelText="No"
              >
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={loadServiceChangeStep}
              >
                Orden Lista
              </Button>
            </Popconfirm>

            : <></>
          : <></>
          }
          { // Industry
            role === 4 ?
              /*service.status === 3 ?
              <Row gutter={[12, 12]}>
                <Col xs={24}>
                  <Button
                    type="primary"
                    onClick={() => aceptCotShowSupp(details.service.id)}
                    loading={loadaceptCot}
                  >
                    Aceptar COT
                  </Button>
                </Col>
                <Col xs={24}>
                  <Popconfirm
                    title="¿Seguro que deseas rechazar esta orden?"
                    onConfirm={() =>
                      SelectCalcelCot("Rechazar cotización", true, 3)
                    }
                    okText="Si"
                    cancelText="No"
                  >
                    <Button type="primary" danger loading={loadCancelar}>
                      Rechazar COT
                    </Button>
                  </Popconfirm>
                </Col>
              </Row>

              : */service.status === 6 ? 
              <Popconfirm
              title="¿Seguro que ha recibido su orden completa?"
              onConfirm={() => updateService(service.id, 7)}
              okText="Si"
              cancelText="No"
              >
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={loadServiceChangeStep}
                >
                  Entregado
                </Button>
              </Popconfirm>

              : <></>
            : <></>
          }
          { // Supplier
            role === 6 ? 
              service.status === 4 ?
              <Popconfirm
              title="¿Seguro que el servicio ha sido elaborado?"
              onConfirm={() => updateService(service.id, 5)}
              okText="Si"
              cancelText="No"
              >
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={loadServiceChangeStep}
                >
                  Servicio elaborado
                </Button>
              </Popconfirm>
              : <></>
            : <></>
          }
          </Col>

        </Row>
      </Col>

      {/* PROFILE INFO DIV --------------------------------------------------------------- */}
      {/* TODO: Show profile picture */}
      <Col xs={24}>
        <Card className="background-gris">
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24}>
              <Row gutter={[12, 12]}>
                <Col xs={24}>
                  <label className="gris-bold">Estatus del servicio: </label> <br />
                  {
                    role == 1 ?
                    <b>{adminStatusLogs[service.status - 1]}</b>
                    : role == 4 ? 
                    <b>{statusLogs[service.status - 1]}</b>
                    : role == 6 ? 
                    <b>{supplierStatusLogs[service.status - 2]} </b>
                    : <b>{adminStatusLogs[service.status]}</b>
                  }
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* PROFILE INFO DIV --------------------------------------------------------------- */}
      {/* TODO: Show profile picture */}
      <Col xs={24}>
        <Card className="background-gris">
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} md={6} style={{ textAlign: "center" }}>
              <Avatar
                src={`data:image/png;base64,${user.logo}`}
                size={{ xs: 150, md: 120, lg: 100, xl: 100, xxl: 150 }}
              />
            </Col>
            <Col xs={24} md={18}>
              <Row gutter={[12, 12]}>
                <Col xs={24} md={12} xl={8}>
                  <label className="gris-bold">Cliente</label> <br />
                  <b>{user.bussiness} </b>
                </Col>
                <Col xs={24} md={12} xl={5}>
                  <label className="gris-bold">Teléfono</label> <br />
                  <a href={`tel:${user.phone}`} style={{ fontWeight: 600 }} > {user.phone} </a>
                </Col>
                <Col xs={24} md={14} lg={24} xl={11}>
                  <label className="gris-bold">Correo</label> <br />
                  <a href={`mailto:${user.email}`} style={{ fontWeight: 600 }} > {user.email} </a>
                </Col>
                <Col xs={24} md={10} lg={24} xl={11}>
                  <label className="gris-bold">Requisitor</label> <br />
                  <b>{user.name}</b>
                </Col>
                <Col xs={24} xl={13}>
                  <label className="gris-bold">Dirección</label> <br />
                  <b>{user.street + ' ' + user.postal_code + ', ' + user.city + ', ' + user.state}</b>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* SERVICE INFO ------------------------------------------------------------------- */}
      <Col xs={24}>
        <Card
          headStyle={{ background: "#F4F6F6" }}
          className="actions-back"
          // Servicio y categoria de la orden
          title={
            <Row gutter={[12, 12]}>
              {/* CATEGORIAS */}
              <Col>
                <b>Tipo: </b>
                {
                <>
                  <Tag color={"#775dd9"}>
                  {
                    service.cat1 === 1 ? 'Servicios'
                    : service.cat1 === 2 ? 'Tecnologia'
                    : service.cat1 === 3 ? 'Maquinado'
                    : service.cat1 === 4 ? 'MRO'
                    : service.cat1 === 5 ? 'MRP' : ""
                  }
                  </Tag>

                  <Tag color={"#2caf8c"}>
                  {
                    service.cat2 === 1 ? 'Servicios'
                    : service.cat2 === 2 ? 'Tecnologia'
                    : service.cat2 === 3 ? 'Maquinado'
                    : service.cat2 === 4 ? 'MRO'
                    : service.cat1 === 5 ? 'MRP' : ""
                  }
                  </Tag>
                </>
                }
                
              </Col>
            </Row> 
          }
          extra={ <b> {
            role == 6 ? (!service.sup_price ? 'Precio: por definir' : service.sup_price + ' ' + service.changeType + " $") 
            : !service.price ? 'Precio: por definir' : service.price + ' ' + service.changeType +  " $"
             
          } </b> }
        >
          <Row gutter={[12, 12]} align="middle" justify="center">
            <Col xs={24} >
              <Row gutter={[12, 12]}>
                <Col xs={24}>
                  <b>Descripcion del servicio: </b>
                  <Paragraph > {service.description} </Paragraph>
                </Col>
                <Col xs={12} >
                  <b>Fecha de entrega esperada:</b>{" "}
                  <p style={{ fontSize: 16, margin: 0 }}>
                    { moment(service.estimatedDueDate).format("DD/MM/YYYY")}
                  </p>
                </Col>
                <Col xs={12} >
                  <b>Fecha de entrega:</b>{" "}
                  <p style={{ fontSize: 16, margin: 0 }}>
                    { service.dueDate === '' ? 'Por definir' : moment(service.dueDate).format("DD/MM/YYYY")}
                  </p>
                </Col>
                <Col xs={1224} >
                  <b>Archivo adjunto:</b> <br></br>
                  <Button href={service.fileUrl} target="blank">Documento</Button>
                </Col>
                
                { /* INDUSTRY ----------------------------------------------- */}
                { role == 4 && (service.status == 3 && service.supplier !== '') ? 
                <>
                  <Divider />
                  <Col xs={24}>
                    <b>Subir orden de compra</b>
                  </Col>
                  <Col xs={24}>
                    <Upload {...propsPOIndustry}>
                      <Button icon={<UploadOutlined />}>Selecciona tu Orden de compra</Button>
                    </Upload>
                  </Col>
                  <Col xs={24}>
                    <Button type="primary" onClick={() => {uploadIndustryPO()}} >Subir orden de compra </Button>
                  </Col>
                </>
                : role == 4 && service.status > 3 ? 
                <>
                  <Divider />
                  <Col xs={24}>
                    <b>Ver orden de compra</b><br></br>
                    <Button href={service.supplier.industryPOFileUrl} target="blank">Documento</Button>
                  </Col>
                </>
                : <></>}
                {
                role == 4 && service.status == 3 && service.industryPOFileUrl != '' ? 
                <>
                  <Divider />
                  <Col xs={24}>
                    <b>Ver orden de compra</b><br></br>
                    <Button href={service.industryPOFileUrl} target="blank">Documento</Button>
                  </Col>
                </>
                : <></>}

                {/* ADMIN ---------------------------------------------------- */}
                {
                role == 1 && service.status == 3 && service.industryPOFileUrl != '' ? 
                <>
                  <Divider />
                  <Col xs={24}>
                    <b>Ver orden de compra del cliente</b><br></br>
                    <Button href={service.industryPOFileUrl} target="blank">Documento</Button>
                  </Col>
                </>
                : <></>}
                { role == 1 && (service.status == 3 && (service.industryPOFileUrl != '')) ? 
                <>
                  <Divider />
                  <Col xs={24}>
                    <b>Subir orden de compra para provedor</b>
                  </Col>
                  <Col xs={24}>
                    <Upload {...propsPOSupplier}>
                      <Button icon={<UploadOutlined />}>Selecciona tu Orden de compra</Button>
                    </Upload>
                  </Col>
                  <Col xs={24}>
                    <Button type="primary" onClick={() => {uploadSupplierPO()}} >Subir orden de compra </Button>
                  </Col>
                </>
                : role == 1 && service.status > 3 ? 
                <>
                  <Divider />
                  <Col xs={24}>
                    <b>Ver orden de compra del cliente</b><br></br>
                    <Button href={service.supplierPOFileUrl} target="blank">Documento</Button>
                  </Col>
                </>
                : <></>}
                {
                (role == 1 && service.status >= 3 && service.supplierPOFileUrl !== '') ? 
                <>
                  <Divider />
                  <Col xs={24}>
                    <b>Ver orden de compra para provedor</b><br></br>
                    <Button href={service.supplier.supplierPOFileUrl} target="blank">Documento</Button>
                  </Col>
                </>
                : <></>}

                {/* SUPPLIER ---------------------------------------------------- */}
                {
                role == 6 && service.status > 3 ? 
                <>
                  <Divider />
                  <Col xs={24}>
                    <b>Ver orden de compra</b><br></br>
                    <Button href={service.supplierPOFileUrl} target="blank">Documento</Button>
                  </Col>
                </>
                : <></>}
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* APPLY TO SERVICE ------------------------------------------------------------------- */}
      {(role === 6) && service.status === 2 && proposals.length === 0 ? 
      <Col xs={24}>
        <Card
          headStyle={{ background: "#F4F6F6" }}
          className="actions-back"
          title={
            <Row gutter={[12, 12]}>
              <Col> <b>Cotiza el servicio</b> </Col>
            </Row>
          }
          actions={[
            <Row gutter={[12, 12]}>
              <Col xs={24} md={12} xl={8}>
                <Popconfirm
                  title="¿Seguro que deseas enviar la cotizacion?"
                  onConfirm={() => applyToService()}
                  okText="Si"
                  cancelText="No"
                >
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />} 
                    loading={loadCancelar}
                    disabled={application.fileList.length < 1 ||
                              application.type == '' || 
                              application.description == '' ||
                              application.dueDate == '' ||
                              application.price == 0
                    }
                    >
                    Enviar cotizacion
                  </Button>
                </Popconfirm>
              </Col>
            </Row>,
          ]}
        >
          <Row>
            <Col xs={24}>
              <Form.Item
                label="Descripcion"
                rules={[
                  {
                    required: true,
                    message:
                      "Favor de ingresar un titulo para su proyecto",
                  },
                ]}
              >
                <Input name="description" onChange={onChange} />
              </Form.Item>
            </Col>
            <Col xs={12} style={{marginRight: '8px'}}>
              <Form.Item
                label="Precio"
                rules={[
                  {
                    required: true,
                    message:
                      "Favor de ingresar una pequeña descripcion de lo deseado",
                  },
                ]}
              >
                <Input type="number" name="price"  onChange={onChange} />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item
                label="Denominacion"
                rules={[
                  {
                    required: true,
                    message:
                      "Favor de ingresar una pequeña descripcion de lo deseado",
                  },
                ]}
              > 
                <Select
                  style={{ width: 120 }}
                  name = "type"
                  onChange={onChange}
                  options={[{ value: 'MX', label: 'MX' },{ value: 'USA', label: 'USA' }]}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="¿Cuándo espera terminar la orden?"
                rules={[
                  {
                    required: true,
                    message: "Selecciona una fecha.",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Seleccionar fecha"
                  className="login-input"
                  name="dueDate"
                  onChange={onDateChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Upload 
                {...propsDrag}
                maxCount={1}
                name="files"
                listType='picture'
                multiple={false}
                >
                <Button icon={<UploadOutlined />}>Subir cotizacion</Button>
              </Upload>
            </Col>
          </Row>
        </Card>
      </Col>
      : <></> 
      }

      {/* PROPOSALS*/}
      {((role === 6  || role === 1) && service.status >= 2 && proposals.length !== 0) || (role === 4 && (service.status >= 3)) ? 
      <Col xs={24}>
      {proposals.map((sub, i) => (
        <Collapse bordered={false} className="background-gris">
          <Panel
            key={i}
            extra={
              <Col xs={24}>
                <Button
                  href={ role == 4 ? sub.fileUrl_epno : sub.fileUrl}
                  target="blank"
                  icon={<DownloadOutlined />}
                >
                  Documento
                </Button>
              </Col>
            }
            header={
              <Row gutter={[6, 12]}>
                <Col xs={24} md={18} xl={19}>
                  <b style={{marginRight: '16px'}}> Cotizacion: {sub.name} </b>
                </Col>
              </Row>
            }>
              <Row style={{backgroundColor: 'white', borderRadius: '8px', padding: '16px'}}>
                <Col xs={24}>
                  <p><b>Empresa: </b>{sub.name} </p>
                </Col>
                <Col xs={24}>
                  <p><b>Descripcion del trabajo: </b>{sub.description} </p>
                </Col>
                <Col xs={24} >
                  <p><b>Fecha de entrega: </b>{sub.dueDate} </p>
                </Col>
                <Col xs={24} >
                  <p><b>Precio: 
                  </b> { role === 4 ? sub.price_epno : sub.price } {' ' + sub.changeType + ' $'} </p>
                </Col>
                {role === 1 ?
                <Col xs={24} >
                  <p><b>Precio de EPNO: 
                  </b> {sub.price_epno + ' ' + sub.changeType + ' $'} </p>
                </Col>
                : <></>}
                {role === 1 && (proposalFilesUrl[i] !== undefined) ?
                <Col xs={24} >
                  <Button href={proposalFilesUrl[i]} target="blank">
                      Cotizacion EPNO
                    </Button>
                </Col>
                : <></>}
                <Col xs={24} >
                <div style={{display: "flex", alignItems: 'bottom'}}>
                  {service.status === 2 && userData.role === 1 ? 
                    <Form.Item label="Posicion: " >
                      <Input type="number" onChange={(value) => onChangePosition(i, value)} value={positions[i]} />
                    </Form.Item>
                  : <></>}
                  {service.status === 2 && userData.role === 1 ? 
                    <Form.Item label="Precio" style={{marginLeft: '8px', marginRight: '8px'}}>
                      <Input type="number" onChange={(value) => onChangePropPrice(i, value)} value={proposalPrice[i]}  />
                    </Form.Item>
                  : <></>}
                  {service.status === 2 && userData.role === 1 ? 
                  <Upload {...propsProp(i)} maxCount={1} multiple='false' style={{marginRight: '8px'}}>
                    <Button icon={<UploadOutlined />}>Cotizcion EPNO</Button>
                  </Upload>
                  : <></>}
                  {service.status === 2 && userData.role === 1 ? 
                    <Button style={{alignSelf: 'bottom', marginLeft: '8px'}} type="primary"
                    disabled={!positions[i] || !proposalPrice[i] || !proposalFiles[i]}
                      onClick={() => updateServicePlacement(sub.id, positions[i], proposalPrice[i], proposalFiles[i])}
                    >
                      Actualizar cambios
                    </Button>
                  : <></>}
                </div>
                </Col>
                { role == 4 && service.status == 3 && service.supplier === '' ?
                <Col xs={24} >
                  <Button 
                    type="primary" 
                    onClick={() => chooseProposal(sub.id, sub.userId, sub.name, sub.price_epno, sub.price, sub.changeType, sub.dueDate, sub.fileUrl_epno)}
                    >
                    Aceptar cotizacion</Button>
                </Col>
                : <></>}
                
              </Row>
          </Panel>
        </Collapse>
      ))}
      </Col>
      : <></>
      }
      

      <Drawer
        title={"Archivos Disponibles"}
        footerContent=""
        visible={visible}
        setVisible={setVisible}
      >
        <Upload {...propiedades}></Upload>
      </Drawer>

      <Modal
        title="Añadir proveedores al servicio."
        visible={addSupplierModal}
        onOk={cerrarModalAddSupplier}
        onCancel={cerrarModalAddSupplier}
        footer=""
      >
        <Form
          name="basic"
          // initialValues={{ remember: true }}
          onFinish={AddServiceSuppliers}
          layout="vertical"
          form={form}
        >
          <Form.Item
            label="Estos son los proveedores más aptos para el servicio, selecciona aquellos que te gustarían:"
            name="suppliers"
            rules={[
              {
                required: selectSuppRequired,
                message: "Debes seleccionar al menos un proveedor.",
              },
            ]}
          >
            <Checkbox.Group
              style={{ width: "100%" }}
              // onChange={onChange}
            >
              <Row gutter={[12, 12]}>
                {suppliersList == "" ? (
                  <Empty description="No hay proveedores para esta categoria, recuerda primero tener algunos asignados" />
                ) : (
                  suppliersList.map((sp) => (
                    <Col xs={24}>
                      <Checkbox value={sp.id}>
                        {sp.name} | {sp.org}{" "}
                      </Checkbox>
                    </Col>
                  ))
                )}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.List name="more_supp">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row guter={[12, 12]}>
                    <Col xs={22} md={23}>
                      <Form.Item
                        {...restField}
                        label="Más proveedores que puedes elegir."
                        name={name}
                        rules={[
                          {
                            required: true,
                            message: "Debes seleccionar al menos un proveedor.",
                          },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          allowClear
                          optionFilterProp="children"
                          defaultOpen={true}
                          style={{ width: "100%" }}
                          placeholder="Seleccionar proveedor"
                        >
                          {moreSuppliersList.map((sp, index) => (
                            <Option key={index} value={sp.id}>
                              {sp.name} | {sp.org}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={2} md={1}>
                      <Tooltip title="Remover componente">
                        <MinusCircleOutlined
                          style={{ color: "red" }}
                          onClick={() =>
                            remove(name, setSelectSuppRequired(true))
                          }
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                ))}
                {fields.length < 1 && (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add(setSelectSuppRequired(false))}
                      block
                      icon={<PlusOutlined />}
                    >
                      Agregar más
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>

          <Row gutter={[12, 12]} justify="center">
            {/* <Col xs={12} md={6}>
              <Button type='primary' danger onClick={() => setAddSupplierModal(false)}>Cancelar</Button>
            </Col> */}
            <Col xs={24} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                htmlType="submit"
                // loading={load}
              >
                Enviar listado
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Rechazar orden"
        visible={rechazarCotSupplierModal}
        onOk={cerrarModalRechazarCotSupp}
        onCancel={cerrarModalRechazarCotSupp}
        footer=""
      >
        <Form
          name="rechazo"
          // initialValues={{ remember: true }}
          method="POST"
          onFinish={SupplierRechazarCot}
          layout="vertical"
          form={formR}
        >
          <Form.Item
            label="Comentanos, ¿por qué no deseas cotizar esta orden?"
            name="comentario"
            rules={[
              { required: true, message: "Debes agregar una explicacion." },
            ]}
          >
            <TextArea
              showCount
              maxLength={1000}
              placeholder="Añade una breve explicación del por que no puedes cotizar esta orden"
            />
          </Form.Item>
          {/* <Row gutter={[12, 12]} justify='center'>
           */}
          <Col xs={24} style={{ textAlign: "right" }}>
            <Form.Item name="send_rechazo">
              <Button
                type="primary"
                htmlType="submit"
                loading={loadRechazarCotSupp}
              >
                Enviar
              </Button>
            </Form.Item>
          </Col>
          {/* </Row> */}
        </Form>
      </Modal>

      <Modal
        title={title}
        visible={solicitarCancelModal}
        onOk={() => setSolicitarCancelModal(false)}
        onCancel={() => setSolicitarCancelModal(false)}
        footer=""
      >
        <Form
          name="cancel"
          method="POST"
          onFinish={SolicitarCancelacionCot}
          layout="vertical"
          form={formR}
        >
          <Form.Item
            label="Comentanos de manera breve el motivo de tu solicitud."
            name="comentario"
            rules={[
              { required: true, message: "Debes agregar una explicacion." },
            ]}
          >
            <TextArea
              showCount
              maxLength={1000}
              placeholder="Añade una breve explicación, para comprender la situación."
            />
          </Form.Item>
          <Col xs={24} style={{ textAlign: "right" }}>
            <Form.Item name="send_rechazo">
              <Button type="primary" htmlType="submit" loading={loadCancelar}>
                Enviar
              </Button>
            </Form.Item>
          </Col>
        </Form>
      </Modal>

      <Modal
        title="Cotizaciones aceptadas"
        visible={aceptCotModal}
        onOk={() => setAceptCotModal(false)}
        onCancel={() => setAceptCotModal(false)}
        footer=""
      >
        <Row gutter={[12, 12]} justify="center">
          <Col xs={24}>
            {aceptCotSuppList == "" ? (
              <Empty description="No hay subservicios con cotizaciones aceptadas" />
            ) : (
              <>
                <Col xs={24} style={{ textAlign: "center" }}>
                  <Typography.Title
                    level={3}
                    type="warning"
                    style={{ margin: 0 }}
                  >
                    ¿Seguro desea enviar esta lista?
                  </Typography.Title>
                </Col>
                <Collapse ghost>
                  {aceptCotSuppList.map((sub) => (
                    <Panel header={`Subservicio: ${sub.name}`} key={sub.id}>
                      {sub.supplier_proposal == "" ? (
                        <Empty description="No has aceptado ninguna cotización aun" />
                      ) : (
                        <List
                          itemLayout="vertical"
                          // size="large"
                          bordered
                        >
                          {sub.supplier_proposal.map((sp) => (
                            <List.Item
                              key={sp.id}
                              actions={[
                                <IconText
                                  icon={<DollarCircleOutlined />}
                                  text={sp.epno_cost}
                                  key="list-dollar"
                                />,
                                <IconText
                                  icon={<ClockCircleOutlined />}
                                  text={sp.epno_deadline}
                                  key="list-clock"
                                />,
                                <IconText
                                  icon={<NumberOutlined />}
                                  text={sp.qty}
                                  key="list-number"
                                />,
                              ]}
                            >
                              <List.Item.Meta
                                title={`${sp.supplier_code} - Aceptada`}
                                description={sp.description}
                              />
                            </List.Item>
                          ))}
                        </List>
                      )}
                    </Panel>
                  ))}
                </Collapse>

                <Divider />
                <Col xs={24} style={{ textAlign: "center" }}>
                  <Form name="acept-supp" form={formC}>
                    <Form.Item
                      label="Subir orden de compra para aceptar cotización"
                      name="po"
                      rules={[
                        {
                          required: true,
                          message: "Debes subir la orden de compra.",
                        },
                      ]}
                    >
                      <Dragger
                        {...propsPO}
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.pptx,.pptm,.xlsx"
                        maxCount={1}
                        listType="picture"
                      >
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Arrastra o da click para subir archivos.
                        </p>
                        <p className="ant-upload-hint">
                          Puedes subir solo 1 archivo, los formatos aceptados
                          son: PDF,DOC,DOCX,PNG,JPG,JPEG,PPTX,PPTM Y XLSX
                          unicamente.
                        </p>
                      </Dragger>
                    </Form.Item>
                  </Form>
                </Col>
              </>
            )}
          </Col>
        </Row>
      </Modal>

      <Modal
        title="Subir cotización para el cliente"
        visible={cotizacionEpnoToClientModal}
        style={{ top: 20 }}
        onOk={() => setCotizacionEpnoToClientModal(false)}
        onCancel={() => setCotizacionEpnoToClientModal(false)}
        footer={""}
      >
        <Text type="danger">
          <AlertOutlined /> IMPORTANTE: Recuerda que si un SERVICIO no cuenta
          con proveedores y con cotizaciones aceptadas, este sera CANCELADO de
          manera automatica, por ende se puede llegar a CANCELAR la ORDEN por
          completo.
        </Text>
        <Form
          name="nest-messages"
          method="POST"
          form={form}
          onFinish={sendCotClient}
          layout="vertical"
        >
          <Collapse ghost accordion defaultActiveKey={["1"]}>
            <Panel
              header={
                <Text type="secondary">
                  <Badge status="purple" />
                  Información General
                </Text>
              }
              key="0"
            >
              <Row gutter={[12, 12]}>
                <Col md={12} xs={24}>
                  <b>Titulo: </b>
                  <label>{details.service.title} </label>
                </Col>

                <Col md={12} xs={24}>
                  <b>Tipo: </b>
                  <label>{details.service.type}</label>
                </Col>

                <Col xs={24}>
                  <b>Descripción: </b>
                  <label>{details.service.desc}</label>
                </Col>

                <Col xs={24}>
                  <b>Cliente: </b>
                  <label>
                    {details.client.org_name} - {details.client.contact_name}
                  </label>
                </Col>
              </Row>
            </Panel>
            <Panel
              header={
                <Text type="secondary">
                  <Badge status="blue" />
                  Paso 1: Generar cotización y descargar
                </Text>
              }
              key="1"
            >
              <Row gutter={[12, 12]} justify="center">
                <Col xs={24} md={12}>
                  <Form.Item
                    name="condiciones_pago"
                    label="Condiciones de pago"
                    rules={[{ required: true, message: "Ingresa los dias" }]}
                  >
                    <Input
                      name="condiciones_pago"
                      placeholder="Ingresa los dias"
                      // onChange={onFormChange}
                      // value={formValue.time}
                      min={1}
                      step={1}
                      type="number"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="vigencia"
                    label="Vigencia"
                    rules={[
                      {
                        required: true,
                        message: "Ingresa los días en que se vence la orden",
                      },
                    ]}
                  >
                    <Input
                      name="vigencia"
                      placeholder="Ingresa los días"
                      // onChange={onFormChange}
                      // value={formValue.time}
                      min={1}
                      step={1}
                      type="number"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="iva"
                    label="Iva"
                    rules={[
                      {
                        required: true,
                        message: "Debes de indicar el IVA",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={0}>No aplica</Radio>
                      <Radio value={8}>Iva al 8%</Radio>
                      <Radio value={16}>Iva al 16%</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="currency"
                    label="Divisa"
                    rules={[
                      {
                        required: true,
                        message: "Debes seleccionar un tipo de divisa",
                      },
                    ]}
                  >
                    <Select
                      name="currency"
                      showSearch
                      placeholder="Selecionar una divisa"
                      optionFilterProp="children"
                      onChange={(value) => {
                        if (value == "USD") {
                          setShowTipoCambio(true);
                        } else {
                          setShowTipoCambio(false);
                          setTipoCambio(0);
                          form.setFieldsValue({ tipo_cambio: 0 });
                        }
                      }}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="MXN">MXN</Option>
                      <Option value="USD">USD</Option>
                      <Option value="EUR">EUR</Option>
                    </Select>
                  </Form.Item>
                </Col>
                {showTipoCambio && (
                  <Col xs={24}>
                    <Form.Item
                      name="tipo_cambio"
                      initialValue={tipoCambio}
                      label="Tipo de cambio"
                      rules={[
                        {
                          required: true,
                          message: "Debes ingresar el tipo de cambio",
                        },
                        {
                          type: "number",
                          min: 1,
                          message: "El tipo de cambio no puede ser 0",
                        },
                      ]}
                    >
                      <InputNumber
                        name="tipo_cambio"
                        style={{ width: "100%" }}
                        min={1}
                        step={0.1}
                        value={tipoCambio}
                        onChange={(value) => setTipoCambio(value)}
                        precision={2}
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>
              <Row gutter={24} justify="center">
                <Col xs={12}>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      type="primary"
                      loading={loadGenerarClientCot}
                    >
                      Generar cotización
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              {showPdfCot && (
                <Row gutter={[12, 12]} justify="center">
                  <Col xs={24}>
                    <Text type="success">
                      ¡Tu archivo esta listo!, descargalo y no olvides subirlo
                      en el paso 2.
                    </Text>
                  </Col>
                  <Col xs={10}>
                    <a
                      href={`https://api.epno-app.com${clientCotFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Button icon={<DownloadOutlined />}>
                        <i className="fas fa-download" />
                        Cotización
                      </Button>
                    </a>
                  </Col>
                </Row>
              )}
            </Panel>

            <Panel
              header={
                <Text type="secondary">
                  <Badge status="green" />
                  Paso 2: Subir cotización y finalizar proceso
                </Text>
              }
              key="2"
              collapsible={!showPdfCot && "disabled"}
            >
              <Form.Item
                name="client_"
                label="Subir archivo de cotizacion"
                rules={[
                  {
                    required: true,
                    message: "Es necesario subir el archivo de cotizacion",
                  },
                 
                ]}
              >
                <Row gutter={[12, 12]} justify="center">
                  <Col xs={24}>
                    <Dragger {...propsFile} maxCount={1} accept=".pdf">
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Da click o arrastra el archivo para subirlo.
                      </p>
                      <p className="ant-upload-hint">
                        Solo se puede subir un archivo en esta sección, recuerda
                        que es para tu cotización en PDF.
                      </p>
                    </Dragger>
                  </Col>
                </Row>
              </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      </Modal>

      <Modal
        title="Subir PO al proveedor"
        closable={true}
        width={1000}
        bodyStyle={{ height: 600, overflow: "scroll" }}
        visible={poEpnoToSupplierModal}
        onOk={() => setPoEpnoToSupplierModal(false)}
        onCancel={() => setPoEpnoToSupplierModal(false)}
        footer={""}
        style={{ top: 20 }}
      >
        <Collapse ghost accordion defaultActiveKey={["0"]}>
          <Panel
            header={
              <Text type="secondary">
                <Badge status="red" />
                Subservicios
              </Text>
            }
            key="0"
          >
            <Row gutter={[12, 12]}>
              <Col xs={24}>
                {poToSupplier.supplierServices == "" ? (
                  <Empty description="Este proveedor no esta asignado a ningun subservicio.">
                    <Button
                      type="primary"
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => setPoEpnoToSupplierModal(false)}
                    >
                      Cerrar
                    </Button>
                  </Empty>
                ) : (
                  <List
                    itemLayout="vertical"
                    // size="large"
                    bordered
                  >
                    {poToSupplier.supplierServices.map((sp) => (
                      <List.Item
                        key={sp.id}
                        actions={[
                          <IconText
                            icon={<DollarCircleOutlined />}
                            text={`${sp.unitary_subtotal_cost} c/u`}
                            key="list-dollar"
                          />,
                          <IconText
                            icon={<DollarCircleOutlined />}
                            text={sp.total_cost}
                            key="list-dollar"
                          />,
                          <IconText
                            icon={<ClockCircleOutlined />}
                            text={sp.supplier_deadline}
                            key="list-clock"
                          />,
                          <IconText
                            icon={<NumberOutlined />}
                            text={sp.qty}
                            key="list-number"
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          title={`Subservicio: ${sp.name}`}
                          description={`Order: ${sp.order_num}, Codigo del proveedor: ${sp.supplier_code}, Categoria: ${sp.category_name}, 
                              Unidad: ${sp.unit_name}, Iva: $${sp.iva}, Revisión: ${sp.rev}`}
                        />
                      </List.Item>
                    ))}
                  </List>
                )}
              </Col>
            </Row>
          </Panel>

          <Panel
            header={
              <Text type="secondary">
                <Badge status="blue" />
                Paso 1: Generar PO y descargar
              </Text>
            }
            collapsible={poToSupplier.supplierServices == "" && "disabled"}
            key="1"
          >
            <Form
              name="send_po"
              onFinish={(values) => sendPoToSupplier(2, values)}
              layout="vertical"
              // form={form}
              autoComplete="off"
            >
              <Row gutter={[12, 6]} justify="center" align="middle">
                <Col xs={24} md={12}>
                  <Form.Item
                    name="special_inst"
                    label="Instrucciones especiales"
                    // rules={[{ required: true, message: 'Ingresa las descripcion de la orden' }]}
                  >
                    <Input.TextArea
                      name="special_inst"
                      placeholder="Agregar instrucciones para esta entrega"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="ordering_address"
                    label="Dirección del pedido"
                    // rules={[

                    //   {
                    //     required: true,
                    //     message: 'Agrega la dirección de este pedido',
                    //   },
                    // ]}
                  >
                    <Input
                      name="ordering_address"
                      placeholder="Agregar la dirección de este pedido"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="billing_address"
                    label="Dirección de envio"
                    // rules={[{ required: true, message: 'Ingresa la dirección del envio' }]}
                  >
                    <Input
                      name="billing_address"
                      placeholder="Agregar dirección de envio"
                      // onChange={onFormChange}
                      // value={formValue.time}
                      // min={1}
                      // step={1}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="currency"
                    label="Divisa"
                    rules={[
                      {
                        required: true,
                        message: "Debes seleccionar un tipo de divisa",
                      },
                    ]}
                  >
                    <Select
                      name="currency"
                      showSearch
                      placeholder="Selecionar una divisa"
                      optionFilterProp="children"
                      onChange={(value) => {
                        if (value == "USD") {
                          setShowTipoCambio(true);
                        } else {
                          setShowTipoCambio(false);
                          setTipoCambio(0);
                          form.setFieldsValue({ tipo_cambio: 0 });
                        }
                      }}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="MXN">MXN</Option>
                      <Option value="USD">USD</Option>
                      <Option value="EUR">EUR</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="condiciones_pago"
                    label="Condiciones de pago"
                    rules={[{ required: true, message: "Ingresa los dias" }]}
                  >
                    <Input
                      name="condiciones_pago"
                      placeholder="Ingresa los dias"
                      // onChange={onFormChange}
                      // value={formValue.time}
                      min={1}
                      step={1}
                      type="number"
                    />
                  </Form.Item>
                </Col>
                {showTipoCambio && (
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="tipo_cambio"
                      initialValue={tipoCambio}
                      label="Tipo de cambio"
                      rules={[
                        {
                          required: true,
                          message: "Debes ingresar el tipo de cambio",
                        },
                        {
                          type: "number",
                          min: 1,
                          message: "El tipo de cambio no puede ser 0",
                        },
                      ]}
                    >
                      <InputNumber
                        name="tipo_cambio"
                        style={{ width: "100%" }}
                        min={1}
                        step={0.1}
                        value={tipoCambio}
                        onChange={(value) => setTipoCambio(value)}
                        precision={2}
                      />
                    </Form.Item>
                  </Col>
                )}

                <Col xs={24} md={12}>
                  <Form.Item
                    name="delivery_address"
                    label="Dirección de entrega"
                    rules={[
                      {
                        required: true,
                        message:
                          "Ingresa la dirección donde se deberá hacer la entrega",
                      },
                    ]}
                  >
                    <Input
                      name="delivery_address"
                      placeholder="Agregar dirección de entrega"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="delivery_terms"
                    label="Terminos de entrega"
                    rules={[
                      {
                        required: true,
                        message:
                          "Ingresa los termino necesarios para realizar la entrega",
                      },
                    ]}
                  >
                    <Input
                      name="delivery_terms"
                      placeholder="Agregar terminos para la entrega"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="shipping_inst"
                    label="Instrucciones de envío"
                    rules={[
                      {
                        required: true,
                        message:
                          "Ingresa las instrucciones necesarias para su envio",
                      },
                    ]}
                  >
                    <Input
                      name="shipping_inst"
                      placeholder="Agregar instrucciones de envio"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loadGenerarClientCot}
                      style={{ width: "100%", marginTop: 28 }}
                    >
                      Generar PO
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            {showPdfCot && (
              <Row gutter={[12, 12]} justify="center">
                <Col xs={14}>
                  <Text type="success">
                    ¡Tu archivo esta listo!, descargalo y no olvides subirlo en
                    el paso 2.
                  </Text>
                </Col>
                <Col xs={12}>
                  <a
                    href={`https://api.epno-app.com${poToSupplier.poFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Button
                      icon={<DownloadOutlined />}
                      style={{ width: "65%" }}
                    >
                      &nbsp; PO
                    </Button>
                  </a>
                </Col>
              </Row>
            )}
          </Panel>

          <Panel
            header={
              <Text type="secondary">
                <Badge status="green" />
                Paso 2: Subir PO
              </Text>
            }
            // collapsible={(poToSupplier.supplierServices == "" || !showPdfCot) && "disabled"}
            key="2"
          >
            <Row gutter={[12, 12]} justify="center">
              <Col xs={20}>
                <Dragger
                  {...propsSendoPOSupplier}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.pptx,.pptm,.xlsx"
                  maxCount={1}
                  listType="picture"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Arrastra o da click para subir archivos.
                  </p>
                  <p className="ant-upload-hint">
                    Puedes subir solo 1 archivo, los formatos aceptados son:
                    PDF,DOC,DOCX,PNG,JPG,JPEG,PPTX,PPTM Y XLSX unicamente.
                  </p>
                </Dragger>
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </Modal>

      <Modal
        title="Subir archivo de factura"
        closable={true}
        visible={invoiceFileModal}
        onCancel={() => setInvoiceFileModal(false)}
        onOk={() => setInvoiceFileModal(false)}
        footer={""}
      >
        <Text type="warning">
          Para marcar la orden como lista, debes subir la factura
          obligatoriamente.
        </Text>{" "}
        <br />
        <Text type="danger">
          <AlertOutlined /> IMPORTANTE: Recuerda que si un SERVICIO no cuenta
          con proveedores, o con cotizaciones, este sera CANCELADO de manera
          automatica, por ende se puede llegar a CANCELAR la ORDEN por completo.
        </Text>
        <Dragger
          {...sendClientInvoice}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.pptx,.pptm,.xlsx"
          maxCount={1}
          listType="picture"
          style={{ marginTop: 15 }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Arrastra o da click para subir archivos.
          </p>
          <p className="ant-upload-hint">
            Puedes subir solo 1 archivo, los formatos aceptados son:
            PDF,DOC,DOCX,PNG,JPG,JPEG,PPTX,PPTM Y XLSX unicamente.
          </p>
        </Dragger>
      </Modal>

      <Modal
        title="Levantar queja"
        closable={true}
        visible={queja.modal}
        onCancel={() => setQueja({ ...queja, modal: false })}
        onOk={() => setQueja({ ...queja, modal: false })}
        footer={""}
      >
        <Form
          name="basic"
          // initialValues={{ remember: true }}
          onFinish={RequestComplaint}
          layout="vertical"
          form={form}
        >
          <Form.Item
            label="Selecciona los servicios con los que tuviste algun problema."
            name="subservices"
            rules={[
              {
                required: true,
                message: "Debes seleccionar al menos un servicio de la lista.",
              },
            ]}
          >
            <Checkbox.Group
              style={{ width: "100%" }}
              // onChange={onChange}
            >
              <Row gutter={[12, 12]}>
                {details.subservices.map((sp) => (
                  <Col xs={24}>
                    <Checkbox value={sp.id}>
                      {sp.name} | Qty: {sp.qty} ({sp.unit_name}){" "}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Divider>
            {" "}
            <Paragraph
              copyable={{
                icon: [
                  <QuestionCircleOutlined key="copy-icon" />,
                  <CheckCircleOutlined key="copied-icon" />,
                ],
                tooltips: [
                  "Recuerda subir las evidencias que requieras para sustentar tu queja.",
                  "¡Entendido!",
                ],
              }}
            >
              Sección de evidencias
            </Paragraph>
          </Divider>

          <Form.Item
            label="Escribe una breve descripcion de la evidencia."
            name="desc_evidencia"
            rules={[
              {
                required: true,
                message: "Debes agregar una descripcion de tu evidencia.",
              },
            ]}
          >
            <TextArea showCount allowClear maxLength={500} />
          </Form.Item>
          <Form.Item
            label="Evidencia de la queja"
            name="evidencia"
            rules={[
              { required: true, message: "Debes agregar una evidencia." },
            ]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.List name="more_queja">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row guter={[12, 12]} align="middle" justify="center">
                    <Col xs={24}>
                      <Form.Item
                        label="Escribe una breve descripcion de la evidencia."
                        {...restField}
                        name={[name, "desc_eviden"]}
                        rules={[
                          {
                            required: true,
                            message:
                              "Debes agregar una descripcion de tu evidencia.",
                          },
                        ]}
                      >
                        <TextArea showCount allowClear maxLength={500} />
                      </Form.Item>
                    </Col>
                    <Col xs={22}>
                      <Form.Item
                        {...restField}
                        name={[name, "eviden"]}
                        label="Evidencia de la queja"
                        rules={[
                          {
                            required: true,
                            message: "Debes agregar una evidencia.",
                          },
                        ]}
                      >
                        <Upload
                          listType="picture-card"
                          maxCount={1}
                          beforeUpload={() => false}
                        >
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col xs={2}>
                      <Tooltip title="Remover evidencia">
                        <MinusCircleOutlined
                          style={{ color: "red" }}
                          onClick={() => remove(name)}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                ))}
                {/* {fields.length < 1 && ( */}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add(setSelectSuppRequired(false))}
                    block
                    icon={<PlusOutlined />}
                  >
                    Agregar más
                  </Button>
                </Form.Item>
                {/* )} */}
              </>
            )}
          </Form.List>

          <Row gutter={[12, 12]} justify="center">
            <Col xs={24} style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit" loading={queja.load}>
                Enviar queja
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Row>
  );
}

function SelectSupplierComponent(props) {
  const { service, subservice, sub_step, supplier, reload, setReload, token } =
    props;
  const [showAddSuppForm, setShowAddSuppForm] = useState(false);
  const [formS] = Form.useForm();
  const [fechaEntregaEpno, setFechaEntregaEpno] = useState();
  const [loadUpSupp, setLoadUpSupp] = useState(false);

  useEffect(() => {
    if (
      supplier.epno_cost !== "" &&
      supplier.desc !== "" &&
      supplier.deadline !== null
    ) {
      setShowAddSuppForm(true);
    }
  }, []);

  const addAceptSuppList = (values) => {
    setLoadUpSupp(true);
    SupplierService.SelectSuppliers({
        service: service,
        subservice: subservice,
        supplier: supplier.id,
        entrega: fechaEntregaEpno,
        cost: values.cost,
        descripcion: values.descripcion,
        // is_winner: 1,
      })
      .then((response) => {
        setLoadUpSupp(false);
        if (response.data.success == true) {
          openNotification(
            "success",
            "Proveedor de la lista actualizado correctamente",
            supplier.org_name,
            supplier.unitary_subtotal
          );
          setReload(!reload);
          // formS.resetFields();
        } else {
          message.error("Hubo un error al actualizar el proveedor.");
        }
      })

      .catch((error) => {
        message.error("Hubo un error al actualizar el proveedor");

      });
  };

  function onChangeDateEpno(date, dateString) {
    setFechaEntregaEpno(dateString);
  }

  const openNotification = (type, title, name, cost) => {
    notification[type]({
      message: title,
      description: `${name}, costo: ${cost}`,
    });
  };

  const aceptSuppPropListEpno = (e) => {
    let check = e.target.checked;

    if (check == true) {
      setShowAddSuppForm(true);
      formS.resetFields();
    } else {
      setShowAddSuppForm(false);
      if (
        supplier.epno_cost !== null &&
        supplier.desc !== "" &&
        supplier.deadline !== ""
      ) {
        SupplierService.SelectSuppliers({
            service: service,
            subservice: subservice,
            supplier: supplier.id,
            entrega: null,
            cost: null,
            descripcion: null,
            // is_winner: 1,
          })
          .then((response) => {
            setLoadUpSupp(false);
            if (response.data.success == true) {
              openNotification(
                "info",
                "Proveedor eliminado de la lista de aceptados",
                supplier.org_name,
                supplier.unitary_subtotal
              );
              setReload(!reload);
              formS.resetFields();
            } else {
              message.error("Hubo un error al eliminar el proveedor");
            }
          })

          .catch((error) => {
            message.error("Hubo un error al eliminar el proveedor");
          });
      }
    }
  };

  return (
    <Col xs={24} xl={18}>
      <Checkbox
        checked={showAddSuppForm}
        onChange={(e) => aceptSuppPropListEpno(e)}
      >
        <b style={{ color: "blue" }}>Seleccionar para la orden</b>
      </Checkbox>

      {showAddSuppForm && (
        <Form
          name="nest-messages"
          method="POST"
          layout="vertical"
          onFinish={addAceptSuppList}
          style={{ marginTop: 15 }}
          form={formS}
        >
          <Row gutter={[12, 12]}>
            <Col xs={24}>
              <Form.Item
                name="descripcion"
                label="Descripción"
                initialValue={supplier.desc}
                rules={[
                  {
                    required: true,
                    message: "Ingresa el costo por unidad del producto",
                  },
                ]}
              >
                <TextArea
                  name="descripcion"
                  placeholder="Ingrese una breve descripcion del producto"
                  // onChange={onFormChange}
                  // value={formValue.cost}

                  suffix={
                    <Tooltip
                      placement="top"
                      title="Esta descripción es la que te proporciona el proveedor de su producto."
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="cost"
                label="Costo"
                initialValue={supplier.epno_cost}
                rules={[
                  { required: true, message: "Ingresa tu costo por favor." },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  name="cost"
                  placeholder="Ingresa tu costo"
                  // required
                  min={1}
                  step={0.1}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Fecha de entrega"
                name="date"
                initialValue={
                  supplier.deadline !== null ? moment(supplier.deadline) : ""
                }
                rules={[
                  {
                    required: true,
                    message: "Debes seleccionar la fecha de entrega.",
                  },
                ]}
              >
                <DatePicker
                  name="date"
                  style={{ width: "100%" }}
                  placeholder="Seleccionar fecha"
                  className="login-input"
                  onChange={onChangeDateEpno}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: "center" }}>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={loadUpSupp}
                  style={{ width: "100%" }}
                >
                  {supplier.epno_cost !== "" &&
                  supplier.desc !== "" &&
                  supplier.deadline !== null &&
                  sub_step == 2
                    ? "Actualizar"
                    : "Añadir"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Col>
  );
}
