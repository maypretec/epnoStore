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

  console.log(role)
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

        console.log(error);
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
        console.log(error.response.data.errors);
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
        console.log(error);
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
        console.log(error.response.data.errors);
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
      console.log(error);
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
        console.log(error);
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
        console.log(error);
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
      console.log("Dropped files", e.dataTransfer.files);
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
      console.log("Dropped files", e.dataTransfer.files);
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
      console.log("Dropped files", e.dataTransfer.files);
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
      console.log("Dropped files", e.dataTransfer.files);
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
      console.log(error.response.data.errors);
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
        console.log(error.response.data.errors);
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
        console.log(error.response.data.errors);
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
		fileList: [],
	});

  const [industryPO, setIndustryPO] = useState()

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

        if (service.status >= 4 && (role == 1 || role == 4)){
          const filteredProposalsDo = proposalsResponse.data.filter(proposal => proposal.status === true);
          setProposals(filteredProposalsDo);
        } else if (role === 6) {
          const filteredProposals = proposalsResponse.data.filter(proposal => proposal.userId === userData.id);
          setProposals(filteredProposals);
          
        } else { setProposals(proposalsResponse.data); }

      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [service.userId, service.id, role, userData.id]);

  // Updates service status -----------------------------------------------
  const onChange = (targetInput) => {
		setApplication((state) => ({
			...state,
			[targetInput.target.name]: targetInput.target.value,
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

    OrderService.UpdateService({id: id, status: status}).then(resp => {
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
      console.log(error);
      message.error("Hubo un error al enviar los datos.");
      setLoadServiceChangeStep(false);
    });
  }

  const updateServicePlacement = (id, place, price, file) => {
    //setLoadServiceChangeStep(true);
    console.log(file)
    OrderService.UpdateServicePlacement({id: id, place: place, price_epno: price, fileUrl_epno: file, userId: userData.id}).then(resp => {
      console.log(resp)
      if (resp.data.success === true) {
        setReload(!reload);
        message.success("Actualizacion exitosa", 1).then(() => {
          window.location.reload();
        });
      } else {
        message.error(resp.data.message);
      }
    }).catch((error) => {
      console.log(error);
      message.error("Hubo un error al enviar los datos.");
      setLoadServiceChangeStep(false);
    });
  }

  const applyToService = () => {

    const apply = {
      serviceId: service.id,
      userId: userData.id,
      name: userData.bussiness,
      description: application.description,
      price: application.price,
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
      console.log(error);
      message.error("Hubo un error al enviar los datos.");
    });
  }

  const chooseProposal = (proposalId, supplierId, supplier, price, dueDate, supplierFileUrl) => {
    const choosenProp = {
      proposalId: proposalId,
      serviceId: service.id,
      supplierId: supplierId,
      supplier: supplier,
      price: price,
      dueDate: dueDate,
      supplierFileUrl: 'dasdasd'
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
      console.log(error);
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
      console.log(file)
      const base64 = await getBase64(file);
      console.log(base64)
      setIndustryPO(base64)
      console.log(base64)
      return false;
    },
    application
  };
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
          extra={ <b> {service.price === '' || service.price === null || service.price === undefined ? 'Precio: por definir' : service.price + ' $'} </b> }
          actions={[]}
        >
          <Row gutter={[12, 12]} align="middle" justify="center">
            <Col xs={24} >
              <Row gutter={[12, 12]}>
                <Col xs={24}>
                  <b>Descripcion del servicio: </b>
                  <Paragraph > {service.description} </Paragraph>
                </Col>
                <Col xs={12} >
                  <b>Archivo adjunto:</b> <br></br>
                  <Button href={service.fileUrl} target="blank">Documento</Button>
                </Col>
                <Col xs={12} >
                  <b>Fecha de entrega:</b>{" "}
                  <p style={{ fontSize: 16, margin: 0 }}>
                    { service.dueDate === '' ? 'Por definir' : moment(service.dueDate).format("DD/MM/YYYY")}
                  </p>
                </Col>
                { service.status == 4 ? 
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
                    <Button type="primary" onClick={() => {console.log(industryPO)}} >Subir orden de compra </Button>
                  </Col>
                </>
                : service.status > 4 ? 
                <>
                  <Divider />
                  <Col xs={24}>
                    <b>Ver orden de compra</b><br></br>
                    <Button href={service.fileUrl} target="blank">Documento</Button>
                  </Col>
                </>
                : <></>}
                
              </Row>
            </Col>

            <Col xs={24} md={6} lg={6} style={{ textAlign: "center" }}>
              {/*<Button onClick={() => setVisible(true)}>Documento</Button> */}
              <Button href={service.fileUrl} target="blank">Documento</Button>
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
                    disabled={application.fileList.length < 1}
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
              <Form.Item
                label="¿Cuándo espera recibir el servicio?"
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
      {((role === 6  || role === 1) && service.status >= 2 && proposals.length !== 0) || (userData.role === 4 && service.status >= 3) ? 
      <Col xs={24}>
      {proposals.map((sub, i) => (
        <Collapse bordered={false} className="background-gris">
          <Panel
            key="1"
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
                  </b> { role === 4 ? sub.price_epno : sub.price } </p>
                </Col>
                {role === 1 ?
                <Col xs={24} >
                  <p><b>Precio de EPNO: 
                  </b> {sub.price_epno} </p>
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
                    <Button style={{alignSelf: 'bottom', marginLeft: '8px'}}
                      onClick={() => updateServicePlacement(sub.id, positions[i], proposalPrice[i], proposalFiles[i])}
                    >
                      Actualizar cambios
                    </Button>
                  : <></>}
                </div>
                </Col>
                { role === 4 && service.status === 3 ?
                  <Col xs={24} >
                  <Button 
                    type="primary" 
                    onClick={() => chooseProposal(sub.id, sub.userId, sub.name, sub.price_epno, sub.dueDate, '')}
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
      

      {/*<Col xs={24}>
        {(role === 3 || role === 5 || role === 2 || role === 1) && (
          <Row gutter={[12, 12]} justify="center">
            <Col xs={24} md={12} xl={8}>
              <Badge color="#f50" text="Cotización por primera vez" />
            </Col>
            <Col xs={24} md={12} xl={8}>
              <Badge color="#d3adf7" text="Se ha cotizado más de una vez" />
            </Col>
          </Row>
        )}

        <h1>Servicios</h1>
        <Row gutter={[12, 12]} justify="center">
          {details.subservices == "" ? (
            <Col xs={24}>
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                description={<span>No tienes ningun servicio agregado.</span>}
              ></Empty>
            </Col>
          ) : (
            <Col xs={24}>
              {details.subservices.map((sub) => (
                <Collapse bordered={false} className="background-gris">
                  <Panel
                    extra={
                      details.subservices.length == 1 &&
                      details.files.spec_files.length > 1 ? (
                        <Col xs={24}>
                          <Button
                            icon={<DownloadOutlined />}
                            onClick={(event) => {
                              // If you don't want click extra trigger collapse, you can prevent this:
                              event.stopPropagation();
                              setVisible(true);
                            }}
                          >
                            Specs
                          </Button>
                        </Col>
                      ) : (
                        <Row gutter={[12, 12]} align="middle" justify="center">
                          <Col xs={24}>
                            <a
                              href={`https://api.epno-app.com${sub.specs_file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              style={{ fontWeight: "bold" }}
                              onClick={(event) => {
                                // If you don't want click extra trigger collapse, you can prevent this:
                                event.stopPropagation();
                              }}
                            >
                              <Button
                                icon={<DownloadOutlined />}
                                disabled={sub.specs_file == null && true}
                              >
                                Specs
                              </Button>
                            </a>
                          </Col>
                        </Row>
                      )
                    }
                    header={
                      <Row gutter={[6, 12]}>
                        <Col xs={24} md={18} xl={19}>
                          <b>
                            Servicio: {sub.name} | Categoria:{" "}
                            {sub.category_name} | Cant:{sub.qty}
                          </b>
                        </Col>
                        <Col
                          xs={24}
                          md={6}
                          xl={5}
                          style={{ textAlign: "center" }}
                        >
                          <Tag
                            color={
                              sub.step_id == 1
                                ? "purple"
                                : sub.step_id == 2
                                ? "brown"
                                : sub.step_id == 3
                                ? "default"
                                : sub.step_id == 4
                                ? "processing"
                                : sub.step_id == 5
                                ? "cyan"
                                : sub.step_id == 6
                                ? "geekblue"
                                : sub.step_id == 7
                                ? "success"
                                : sub.step_id == 8 ||
                                  sub.step_id == 9 ||
                                  sub.step_id == 12
                                ? "#ff0000"
                                : sub.step_id == 10
                                ? "#52c41a"
                                : sub.step_id == 11 && "#000"
                              // sub.step_id == 12 && '#f5222d'
                            }
                          >
                            {sub.step_name}
                          </Tag>
                        </Col>
                      </Row>
                    }
                    key="1"
                  >
                    {
                    role == 6 && sub.step_id == 1 ? (
                      <Row justify="center">
                        <Col xs={24} style={{ textAlign: "center" }}>
                          <Text type="danger">
                            Lo sentimos, aun no tienes permitido cotizar este servicio.
                          </Text>
                        </Col>
                      </Row>
                    )
                      :
                    role == 6 && sub.step_id == 8 ? (
                      <Row justify="center">
                        <Col xs={24} style={{ textAlign: "center" }}>
                          <Text type="danger">
                            Ya no puedes cotizar este subservicio debido a que
                            ya ha sido rechazado.
                          </Text>
                        </Col>
                      </Row>
                    ) : role == 6 && sub.supp_quote !== "" ? (
                      // anterior
                      // ) : role == 6 && (sub.step_id > 2 || sub.supp_quote !== "") ? (
                      <Card>
                        <Descriptions
                          title="Cotización"
                          bordered
                          style={{ textAlign: "center" }}
                          column={{ xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
                        >
                          <Descriptions.Item label="Cantidad">
                            {sub.supp_qty}{" "}
                          </Descriptions.Item>
                          <Descriptions.Item label="Precio (C/U)">
                            ${sub.supp_unitary_subtotal}{" "}
                          </Descriptions.Item>
                          <Descriptions.Item label="Unidad">
                            {sub.unit_name}
                          </Descriptions.Item>
                          <Descriptions.Item label="Fecha entrega">
                            {sub.supp_deadline}{" "}
                          </Descriptions.Item>
                          <Descriptions.Item label="Cotización">
                            <Row gutter={[12, 12]} justify="center">
                              <Col>
                                <a
                                  href={`https://api.epno-app.com${sub.supp_quote}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                >
                                  <Button
                                    icon={<DownloadOutlined />}
                                    onClick={(event) => {
                                      // If you don't want click extra trigger collapse, you can prevent this:
                                      event.stopPropagation();
                                    }}
                                    disabled={sub.supp_quote == "" && true}
                                  >
                                    <i className="fas fa-download" />
                                    &nbsp;Cotización
                                  </Button>
                                </a>
                              </Col>
                              {sub.step_id == 4 && role == 6 && (
                                //Falta aqui validar que exista la po para mostrar este boton de inspeccion
                                <Col>
                                  <Popconfirm
                                    title="¿Seguro que desea solicitar una auditoria?"
                                    onConfirm={() => serviceChangeStep(sub.id)}
                                    okText="Si"
                                    cancelText="No"
                                  >
                                    <Button
                                      type="primary"
                                      icon={<CheckCircleOutlined />}
                                      loading={loadServiceChangeStep}
                                      disabled={sub.epno_po == "" && true}
                                    >
                                      Inspección
                                    </Button>
                                  </Popconfirm>
                                </Col>
                              )}
                            </Row>
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    ) : role == 6 &&
                      sub.step_id == 2 &&
                      sub.supp_quote == "" ? (
                      <Row gutter={[12, 12]} justify="center" align="middle">
                        <Col xs={24}>
                          <Form
                            name="nest-messages"
                            method="POST"
                            // layout='vertical'
                            onFinish={onFinish(sub.id, sub.name)}
                            form={form}
                          >
                            <Row
                              gutter={[12, 12]}
                              justify="center"
                              align="middle"
                            >
                              <Col xs={24} md={12}>
                                <Form.Item
                                  name="cost"
                                  label="Costo por unidad"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Ingresa el costo por unidad del producto",
                                    },
                                  ]}
                                >
                                  <Input
                                    name="cost"
                                    placeholder="Ingrese el costo unitario"
                                    // onChange={onFormChange}
                                    // value={formValue.cost}
                                    min={1}
                                    step={0.1}
                                    precision={2}
                                    type="number"
                                    suffix={
                                      <Tooltip
                                        placement="top"
                                        title="Recuerda que el precio que debes ingresar es por unidad y LIBRE de iva."
                                      >
                                        <QuestionCircleOutlined />
                                      </Tooltip>
                                    }
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} md={12}>
                                <Form.Item
                                  name="qty"
                                  label="Cantidad"
                                  initialValue={sub.qty}
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Ingresa la cantidad que puede surtir",
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    style={{ width: "100%" }}
                                    name="qty"
                                    min={1}
                                    placeholder="Ingresa la cantidad que puede surtir"
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Fecha de entrega"
                                  name="date"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Debes seleccionar la fecha de entrega.",
                                    },
                                  ]}
                                >
                                  <DatePicker
                                    name="date"
                                    style={{ width: "100%" }}
                                    placeholder="Seleccionar fecha"
                                    className="login-input"
                                    onChange={onChangeDate}
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                md={12}
                                style={{ textAlign: "center" }}
                              >
                                <Form.Item
                                  name="quote_file"
                                  label="Cotización"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Favor de subir la cotización.",
                                    },
                                  ]}
                                >
                                  <Upload
                                    {...propsCotizacion}
                                    name="quote_file"
                                    maxCount={1}
                                    listType="picture-card"
                                  >
                                    <div>
                                      <PlusOutlined />
                                      <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                  </Upload>
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                md={6}
                                style={{ textAlign: "center" }}
                              >
                                <Form.Item name="rechazar_cot">
                                  <Popconfirm
                                    title="¿Seguro que deseas rechazar esta cotización?"
                                    onConfirm={() => {
                                      setRechazarCotSupplierModal(true);
                                      setSubserviceId(sub.id);
                                    }}
                                    okText="Si"
                                    cancelText="No"
                                  >
                                    <Button
                                      type="primary"
                                      danger
                                      icon={<CloseCircleOutlined />}
                                      loading={loadRechazarCotSupp}
                                    >
                                      Rechazar
                                    </Button>
                                  </Popconfirm>
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                md={6}
                                style={{ textAlign: "center" }}
                              >
                                <Form.Item name="subir_cot">
                                  <Button
                                    htmlType="submit"
                                    type="primary"
                                    icon={<CheckCircleOutlined />}
                                    loading={loadAddSuppCot}
                                  >
                                    Subir cotización
                                  </Button>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        </Col>
                      </Row>
                    ) : (role == 3 ||
                        role == 5 ||
                        role == 4 ||
                        role == 2 ||
                        role == 1 ||
                        role == 10) &&
                      sub.proposals == ""  ? (
                      <Row gutter={[12, 12]} justify="center">
                        <Col xs={24}>
                          <Empty
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            imageStyle={{
                              height: 60,
                            }}
                            description={
                              <span>
                               No hay proveedores para este servicio
                              </span>
                            }
                          >
                            {role != 4 && (sub.step_id <= 2) &&  (
                              <Button
                                type="dashed"
                                danger
                                loading={loadAgregarSupp}
                                onClick={() =>
                                  AddSuppliers(sub.id, sub.category_id)
                                }
                              >
                                Agregar
                              </Button>
                            )}
                          </Empty>
                        </Col>
                      </Row>
                    ) : role == 4 &&
                      (sub.step_id < 3 ||
                        sub.step_id == 11 ||
                        sub.step_id == 9) ? (
                      <Empty description="Aun no hay cotizaciones para revisar" />
                    ) : (
                      role != 6 &&
                      sub.proposals.map((sp) => {
                        var info = {
                          service_id: sp.service_id,
                          subservice_id: sp.subservice_id,
                          supplier_id: sp.id,
                          email: sp.user_email,
                          order_num: details.service.order_num,
                          desc: sp.desc,
                          order_id: details.service.order_id,
                        };
                        return role == 3 ||
                          role == 5 ||
                          role == 2 ||
                          role == 1 ||
                          role == 10 ? (
                          <Collapse defaultActiveKey="1">
                            <Panel
                              collapsible="header"
                              extra={
                                <>
                                  <Row
                                    gutter={[12, 12]}
                                    justify="center"
                                    align="middle"
                                  >
                                    <Col
                                      xs={24}
                                      md={12}
                                      style={{ textAlign: "center" }}
                                    >
                                      Costo (C/U):{" "}
                                      <b>${sp.unitary_subtotal} mxn</b>
                                    </Col>
                                    <Col
                                      xs={24}
                                      md={12}
                                      style={{ textAlign: "center" }}
                                    >
                                      Entrega:{" "}
                                      <b>
                                        {sp.supp_deadline == null
                                          ? "S/F"
                                          : moment(sp.supp_deadline).format(
                                              "DD/MM/YYYY"
                                            )}
                                      </b>
                                    </Col>
                                    <Col
                                      xs={24}
                                      md={12}
                                      style={{ textAlign: "center" }}
                                    >
                                      Cantidad: <b>{sp.qty}</b>
                                    </Col>
                                    <Col
                                      xs={24}
                                      md={12}
                                      style={{ textAlign: "center" }}
                                    >
                                      <a
                                        href={`https://api.epno-app.com${sp.quote}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                      >
                                        <Button
                                          icon={<DownloadOutlined />}
                                          onClick={(event) => {
                                            // If you don't want click extra trigger collapse, you can prevent this:
                                            event.stopPropagation();
                                          }}
                                          disabled={sp.quote == "" && true}
                                        >
                                          <i className="fas fa-download" />
                                          &nbsp;Cotización
                                        </Button>
                                      </a>
                                    </Col>
                                  </Row>
                                  {sub.step_id == 2 &&
                                    sp.status_supp !== "Pendiente" && (
                                      <Row
                                        gutter={[12, 12]}
                                        style={{ marginTop: 15 }}
                                      >
                                        <SelectSupplierComponent
                                          service={details.service.id}
                                          subservice={sub.id}
                                          sub_step={sub.step_id}
                                          supplier={sp}
                                          reload={reload}
                                          setReload={setReload}
                                          token={token}
                                        />
                                      </Row>
                                    )}
                                </>
                              }
                              header={
                                <Row
                                  gutter={[12, 12]}
                                  justify="center"
                                  align="middle"
                                >
                                  <Col
                                    xs={24}
                                    md={8}
                                    xl={4}
                                    style={{ textAlign: "center" }}
                                  >
                                    <Avatar
                                      src="https://joeschmoe.io/api/v1/random"
                                      size={{ xs: 60, md: 60, lg: 60, xl: 60 }}
                                    />
                                  </Col>
                                  <Col
                                    xs={24}
                                    md={16}
                                    xl={20}
                                    style={{ textAlign: "center" }}
                                  >
                                    <Row gutter={[12, 12]} justify="center">
                                      <Col xs={24}>
                                        <b>{sp.org_name}</b>
                                      </Col>
                                      <Col xs={24}>
                                        <Tag
                                          color={
                                            (sp.status_supp == "Pendiente" &&
                                              sp.rev > 0) ||
                                            sp.rev > 1
                                              ? "#d3adf7"
                                              : "#f50"
                                          }
                                        >
                                          {sp.status_supp}
                                        </Tag>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              }
                            >
                              <Row
                                gutter={[12, 12]}
                                justify="center"
                                align="middle"
                              >
                                <Col xs={24} md={18} lg={18} xl={20}>
                                  <Row gutter={[12, 12]} justify="center">
                                    <Col xs={24} md={12}>
                                      <label className="gris-bold">
                                        Contacto
                                      </label>{" "}
                                      <br />
                                      <b>{sp.user_name} </b>
                                    </Col>
                                    <Col xs={24} md={12}>
                                      <label className="gris-bold">
                                        Dirección
                                      </label>{" "}
                                      <br />
                                      <b>{sp.address} </b>
                                    </Col>
                                    <Col xs={24} md={12}>
                                      <label className="gris-bold">
                                        Teléfono
                                      </label>{" "}
                                      <br />
                                      <a
                                        href={`tel:${sp.user_phone}`}
                                        style={{ fontWeight: 600 }}
                                      >
                                        {sp.user_phone}{" "}
                                      </a>
                                    </Col>
                                    <Col xs={24} md={12}>
                                      <label className="gris-bold">
                                        Correo
                                      </label>{" "}
                                      <br />
                                      <a
                                        href={`mailto:${sp.user_email}`}
                                        style={{ fontWeight: 600 }}
                                      >
                                        {sp.user_email}{" "}
                                      </a>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col xs={24} md={6} lg={6} xl={4}>
                                  <label className="gris-bold">Total</label>{" "}
                                  <br />
                                  <b>${sp.total_cost}</b>
                                </Col>
                                {sub.step_id == 4 &&
                                sp.epno_po == "" &&
                                (role == 3 || role == 5) ? (
                                  <Col xs={24} style={{ textAlign: "center" }}>
                                    <Button
                                      icon={<UploadOutlined />}
                                      loading={loadGenerarClientCot}
                                      onClick={() => sendPoToSupplier(1, sp)}
                                    >
                                      Subir PO
                                    </Button>
                                  </Col>
                                ) : sub.step_id == 4 &&
                                  sp.epno_po !== "" &&
                                  (role == 3 || role == 5) ? (
                                  <Col
                                    xs={24}
                                    md={12}
                                    style={{ textAlign: "center" }}
                                  >
                                    <a
                                      href={`https://api.epno-app.com${sp.epno_po}`}
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
                                ) : sub.step_id == 7 &&
                                  (role == 3 || role == 5) ? (
                                  <Col xs={24} md={18}>
                                    <Rate
                                      rate={sp.rate}
                                      order={info}
                                      reload={reload}
                                      setReload={setReload}
                                      step={sub.step_id}
                                      title="Calificar proveedor"
                                    />
                                  </Col>
                                ) : (
                                  (sub.step_id == 11 || sub.step_id == 8) &&
                                  (role == 3 || role == 5) && (
                                    <Col
                                      xs={24}
                                      style={{ textAlign: "center" }}
                                    >
                                      <Button
                                        type="primary"
                                        danger
                                        loading={loadCotizarNuevamente}
                                        onClick={() =>
                                          SuppCotizarNuevamente(
                                            sp,
                                            details.service,
                                            sub.id
                                          )
                                        }
                                      >
                                        Cotizar de nuevo
                                      </Button>
                                    </Col>
                                  )
                                )}
                              </Row>
                            </Panel>
                          </Collapse>
                        ) : (
                          role == 4 && (
                            <Row gutter={[12, 12]} justify="center">
                              <Col xs={24}>
                                <Card>
                                  <Descriptions
                                    bordered
                                    size="small"
                                    title={sp.code}
                                    column={{
                                      xl: 3,
                                      lg: 3,
                                      md: 3,
                                      sm: 1,
                                      xs: 1,
                                    }}
                                  >
                                    <Descriptions.Item
                                      label="Descripción"
                                      span={3}
                                    >
                                      {sp.desc}{" "}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="$ C/U">
                                      ${sp.epno_cost}{" "}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Cant.">
                                      {sp.qty}{" "}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Fecha">
                                      {sp.deadline}{" "}
                                    </Descriptions.Item>
                                    <Descriptions.Item
                                      label="Opciones"
                                      span={3}
                                    >
                                      <Row gutter={[12, 12]} justify="center">
                                        <Col
                                          xs={24}
                                          md={12}
                                          style={{ textAlign: "center" }}
                                        >
                                          <a
                                            href={`https://api.epno-app.com${details.service.quote_file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                          >
                                            <DownloadOutlined />{" "}
                                            &nbsp;Cotizacion
                                          </a>
                                        </Col>
                                        {
                                          sp.is_winner == 2 &&
                                            sp.status == 1 &&
                                            sub.step_id == 3 && (
                                              <Col
                                                xs={24}
                                                md={12}
                                                style={{ textAlign: "center" }}
                                              >
                                                <Checkbox
                                                  defaultChecked={
                                                    sp.check == 1 ? true : false
                                                  }
                                                  onChange={(e) =>
                                                    aceptSuppPropListClient(
                                                      e,
                                                      sp.id,
                                                      sub.id,
                                                      details.service.id,
                                                      sp.desc,
                                                      sp.code,
                                                      sub.name
                                                    )
                                                  }
                                                >
                                                  <b>Aceptar</b>
                                                </Checkbox>
                                              </Col>
                                            )
                                          // Ya no se mostrara por que el step de entregado sera general y no individual
                                          //  : (
                                          //   <Col
                                          //     xs={24}
                                          //     md={12}
                                          //     style={{ textAlign: "center" }}
                                          //   >
                                          //     <Button
                                          //       type="primary"
                                          //       danger
                                          //       disabled={
                                          //         sub.step_id == 6 ? false : true
                                          //       }
                                          //     >
                                          //       Entregado
                                          //     </Button>
                                          //   </Col>
                                          // )
                                        }
                                      </Row>
                                    </Descriptions.Item>
                                  </Descriptions>
                                </Card>
                              </Col>
                            </Row>
                          )
                        );
                      })
                    )}
                  </Panel>
                </Collapse>
              ))}
            </Col>
          )}
          {(role == 3 || role == 5) && details.service.step_id == 1 && (
            <>
              <Col xs={24} md={6} style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  onClick={() => {
                    setAddService(!addService);
                    setAddUnicService(false);
                  }}
                  disabled={loadSubservice}
                >
                  Añadir subservicio
                </Button>
              </Col>
              {details.subservices.length == 0 && (
                <Col xs={24} md={6} style={{ textAlign: "center" }}>
                  <Button
                    type="default"
                    onClick={() => {
                      setAddUnicService(!addUnicService);
                      setAddService(false);
                    }}
                    disabled={loadSubservice}
                  >
                    Servicio unico
                  </Button>
                </Col>
              )}
            </>
          )}
          {addService && (
            <Col xs={24} style={{ textAlign: "center" }}>
              <Form
                name="dynamic_form_nest_item"
                onFinish={(values) => addSubservice(1, values)}
                layout="vertical"
                form={form}
                autoComplete="off"
              >
                <Form.List name="services">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row gutter={[12, 12]} align="middle" justify="center">
                          <Col xs={24} md={14}>
                            <Form.Item
                              {...restField}
                              name={[name, "name"]}
                              label="Nombre"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Falta agregar el nombre del servicio.",
                                },
                              ]}
                            >
                              <Input placeholder="Nombre" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={10}>
                            <Form.Item
                              {...restField}
                              label="Categoria"
                              name={[name, "category"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Debes seleccionar una categoria.",
                                },
                              ]}
                            >
                              <Select
                                showSearch
                                placeholder="Seleccionar categoría"
                                optionFilterProp="children"
                                // onChange={onChange}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {categorias.map((c) => (
                                  <Option value={c.id}>{c.name} </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item
                              {...restField}
                              label="Cantidad"
                              name={[name, "qty"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Ingresa la cantidad deseada.",
                                },
                              ]}
                            >
                              <Input
                                placeholder="Cantidad"
                                min={1}
                                type="number"
                              />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={8}>
                            <Form.Item
                              {...restField}
                              label="Archivo"
                              name={[name, "file"]}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Selecciona un archivo de especificación.",
                                },
                              ]}
                            >
                              <Select
                                showSearch
                                placeholder="Seleccionar archivo"
                                optionFilterProp="children"
                                // onChange={onChange}
                                // onSearch={onSearch}
                              >
                                {details.files.spec_files.map((file) => {
                                  return (
                                    <Option value={file.file_path}>
                                      <Tooltip title={file.file_name}>
                                        <FileOutlined /> {file.file_name}
                                      </Tooltip>
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={22} md={7}>
                            <Form.Item
                              {...restField}
                              label="Unidad"
                              name={[name, "unit"]}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Debes seleccionar un tipo de unidad.",
                                },
                              ]}
                            >
                              <Select
                                showSearch
                                placeholder="Seleccionar una unidad"
                                optionFilterProp="children"
                                // onChange={onChange}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {unidades.map((u) => (
                                  <Option value={u.id}>{u.name} </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          {fields.length > 1 && (
                            <Col xs={2} md={1}>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            </Col>
                          )}
                        </Row>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add field
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loadSubservice}
                  >
                    Enviar
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          )}
          {addUnicService && (
            <Col xs={24} style={{ textAlign: "center" }}>
              <Form
                name="unic_service"
                onFinish={(values) => addSubservice(2, values)}
                layout="vertical"
                form={form}
                autoComplete="off"
              >
                <Row gutter={[12, 12]} align="middle" justify="center">
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Cantidad"
                      name="qty"
                      rules={[
                        {
                          required: true,
                          message:
                            "Ingresa la cantidad de unidades que tendra este servicio.",
                        },
                      ]}
                    >
                      <Input placeholder="Cantidad" min={1} type="number" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Categoria"
                      name="category"
                      rules={[
                        {
                          required: true,
                          message: "Debes seleccionar una categoria.",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Seleccionar categoría"
                        optionFilterProp="children"
                        // onChange={onChange}
                        // onSearch={onSearch}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {categorias.map((c) => (
                          <Option value={c.id}>{c.name} </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Unidad"
                      name="unit"
                      rules={[
                        {
                          required: true,
                          message: "Debes seleccionar un tipo de unidad.",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Seleccionar una unidad"
                        optionFilterProp="children"
                        // onChange={onChange}
                        // onSearch={onSearch}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {unidades.map((u) => (
                          <Option value={u.id}>{u.name} </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loadSubservice}
                  >
                    Enviar
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          )}
        </Row>
      </Col>*/}

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

        console.log(error);
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

            console.log(error);
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
