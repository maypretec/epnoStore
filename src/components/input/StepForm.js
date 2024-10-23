import { PlusOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
	Row,
	Col,
	Badge,
	Form,
	Typography,
	Input,
	DatePicker,
	Button,
	Select,
	Divider,
	Upload,
} from "antd";
import { useState } from "react";

const { Option } = Select;

export default function StepGeneralServiceForm(props) {
	const { next, setFormValue } = props;
	const categories = [
		{ id: 1, name: 'Servicios' },
		{ id: 2, name: 'Tecnologia' },
		{ id: 3, name: 'Maquinado' },
		{ id: 4, name: 'MRO' },
		{ id: 5, name: 'MRP' },
	];

	const [numService, setNumService] = useState(1);
	const [services, setServices] = useState([{ title: '', description: '', file: null, fileName: '' }]);
	const [selectedCategories, setSelectedCategories] = useState([]);

	const onChange = (index, targetInput) => {
		const updatedServices = [...services];
		updatedServices[index][targetInput.target.name] = targetInput.target.value;
		setServices(updatedServices);

		// Actualiza también el valor global del formulario si es necesario
		setFormValue((state) => ({
			...state,
			services: updatedServices,
		}));
	};

	const onDateChange = (date, dateString) => {
		setFormValue((state) => ({
			...state,
			time: dateString,
		}));
	};

	const onCatChange = (value) => {
		if (value.length > 2) {
			// Permitir solo dos seleccionados, reemplazar el primero si se selecciona un tercero
			value = [value[1], value[2]];
		}
		setSelectedCategories(value);
		setFormValue((state) => ({
			...state,
			cat1: value[0] || null,
			cat2: value[1] || null,
		}));
	};


	// Función para convertir archivo a base64
	const getBase64 = (file, callback) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => callback(reader.result);
		reader.onerror = (error) => console.log('Error: ', error);
	};

	// Manejar la carga de archivos (solo permite un archivo por servicio)
	const handleFileChange = (index, file) => {
		getBase64(file, (base64) => {
			const updatedServices = [...services];
			updatedServices[index].file = base64;
			updatedServices[index].fileName = file.name; // Guardar el nombre del archivo
			setServices(updatedServices);

			// Actualiza el valor global del formulario si es necesario
			setFormValue((state) => ({
				...state,
				services: updatedServices,
			}));
		});
	};

	// Eliminar el archivo cargado
	const removeFile = (index) => {
		const updatedServices = [...services];
		updatedServices[index].file = null;
		updatedServices[index].fileName = ''; // Eliminar el nombre del archivo
		setServices(updatedServices);

		// Actualiza el valor global del formulario si es necesario
		setFormValue((state) => ({
			...state,
			services: updatedServices,
		}));
	};

	// Agrega un nuevo servicio
	const addService = () => {
		setNumService(numService + 1);
		setServices([...services, { title: '', description: '', file: null, fileName: '' }]);
	};

	// Elimina un servicio solo si hay más de uno
	const removeService = (index) => {
		if (services.length > 1) {
			const updatedServices = services.filter((_, i) => i !== index);
			setNumService(numService - 1);
			setServices(updatedServices);

			// Actualiza el valor global del formulario si es necesario
			setFormValue((state) => ({
				...state,
				services: updatedServices,
			}));
		}
	};

	return (
		<>
			<Row gutter={12} justify="center">
				<Col xs={20}>
					<Typography.Paragraph mark>
						<Typography.Text type="secondary" style={{ fontSize: 14 }}>
							<Badge status="error" />
							Si no encuentras tu servicio deseado en nuestro
							catálogo, puedes solicitar tu servicio en particular
							aquí, no olvides llenar toda la información para
							obtener un mejor servicio de nuestra parte. Si
							requieres más de un servicio, no olvides separarlos
							por una diagonal "/"; Ej. Servicio 1, Cantidad:1 / Servicio 2, Cantidad:2 / Servicio 3, Cantidad:3.
						</Typography.Text>
					</Typography.Paragraph>
				</Col>
			</Row>

			<Row gutter={12}>
				<Col xs={24} xl={14} style={{ marginLeft: "auto", marginRight: "auto", marginTop: 16 }}>
					<Row>
						<Col xs={24}>
							<Form.Item label="Título de la orden" rules={[{ required: true, message: "Favor de ingresar un título para su proyecto", }]}>
								<Input name="title" onChange={(e) => setFormValue((state) => ({ ...state, title: e.target.value }))} />
							</Form.Item>
						</Col>
					</Row>
					
					<Row gutter={[12, 12]}>
						<Col xs={24} md={18}>
							<Form.Item label="¿Cuándo espera recibir el servicio?" rules={[{ required: true, message: "Selecciona una fecha." }]}>
								<DatePicker style={{ width: "100%" }} placeholder="Seleccionar fecha" className="login-input" name="time" onChange={onDateChange} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={[12, 12]}>
						<Col xs={24} md={18}>
							<Form.Item label="Categoría(s)" name="categories" rules={[{ required: true, message: 'Debes elegir al menos una categoría' }]}>
								<Select
									mode="multiple"
									allowClear
									onChange={onCatChange}
									placeholder="Seleccionar la(s) categoría(s)"
									name="categoria"
									maxCount={2}
									maxTagCount={2} // Limitar la selección a 2 categorías
								>
									{categories.map((category, index) => (
										<Option key={index} value={category.id}>{category.name}</Option>
									))} 
								</Select>
							</Form.Item>
						</Col>
					</Row>

					{/* Dinámicamente agregamos los servicios */}
					<Divider>Servicios</Divider>
					{services.map((service, index) => (
						<Row key={index} gutter={16}>
							<Col xs={24} md={22}>
								<Typography style={{fontWeight: 'bold', textAlign: 'start'}}>Servicio {index + 1}</Typography>
								<Form.Item label="Título del servicio" rules={[{ required: true, message: "Favor de ingresar un título para el servicio", }]}>
									<Input name="title" value={service.title} onChange={(e) => onChange(index, e)} />
								</Form.Item>
								<Form.Item label="Descripción de lo deseado" rules={[{ required: true, message: "Favor de ingresar una pequeña descripción", }]}>
									<Input.TextArea name="description" value={service.description} onChange={(e) => onChange(index, e)} />
								</Form.Item>

								{/* Componente Upload para subir archivos */}
								<Form.Item label="Subir archivo">
									{!service.file ? (
										<Upload
											beforeUpload={(file) => {
												handleFileChange(index, file);
												// Return false to prevent automatic upload
												return false;
											}}
											showUploadList={false}
										>
											<Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
										</Upload>
									) : (
										<div>
											<Typography.Text>{service.fileName}</Typography.Text>
											<Button type="link" onClick={() => removeFile(index)}>
												Eliminar archivo
											</Button>
										</div>
									)}
								</Form.Item>
							</Col>
							<Col xs={24} md={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								{/* Botón de eliminar servicio circular */}
								{index !== 0 && (
									<Button
										shape="circle"
										type="danger"
										icon={<DeleteOutlined style={{ color: 'white' }} />}
										onClick={() => removeService(index)}
										disabled={services.length === 1} // Deshabilitar si solo hay un servicio
										style={{ backgroundColor: 'red', border: 'none' }}
									/>
								)}
							</Col>
						</Row>
					))}

						<Row style={{ marginBottom: '16px' }} gutter={[12, 12]} justify="center" align="vertical">
							<Col md={12} xs={24}>
								<Button
									type="primary"
									icon={<PlusOutlined />}
									onClick={addService}
									style={{
										marginTop: '16px',
										backgroundColor: '#1890ff',
										borderColor: '#1890ff',
									}}
								>
									Agregar servicio
								</Button>
							</Col>
						</Row>
				</Col>
			</Row>
		</>
	);
}
