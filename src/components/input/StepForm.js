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

} from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;

export default function StepGeneralServiceForm(props) {
	const { next, setFormValue, formValue } = props;
	const categories = [
		{ id: 1, name: 'Servicios' },
		{ id: 2, name: 'Tecnologia' },
		{ id: 3, name: 'Maquinado' },
		{ id: 4, name: 'MRO' },
		{ id: 5, name: 'MRP' },
	];
		

	const onChange = (targetInput) => {
		setFormValue((state) => ({
			...state,
			[targetInput.target.name]: targetInput.target.value,
		}));
	};
	const onDateChange = (date, dateString) => {
		setFormValue((state) => ({
			...state,
			time: dateString,
		}));
	};

	const onCatChange = (value) => {
    setFormValue((state) => ({
			...state,
			cat1: value[0],
			cat2: value[1]
		}));
    
  };


	return (
		<>
			<Row gutter={12} justify="center">
				<Col xs={20}>
					<Typography.Paragraph mark>
						<Typography.Text
							type="secondary"
							style={{ fontSize: 14 }}
						>
							<Badge status="error" />
							Si no encuentras tu servicio deseado en nuestro
							catalogo, puedes solicitar tu servicio en particular
							aqui, no olvides llenar toda la información para
							obtener un mejor servicio de nuestra parte, si
							requieres mas de un servicio, no olvides separalos
							por una diagonal "/" indicando la cantidad; Ej.
							Servicio 1, Cantidad:1 / Servicio 2, Cantidad:2 /
							Servicio 3, Cantidad:3.
						</Typography.Text>
					</Typography.Paragraph>
				</Col>
			</Row>
			<Row gutter={12}>
				<Col
					xs={24}
					xl={14}
					style={{
						marginLeft: "auto",
						marginRight: "auto",
						marginTop: 16,
					}}
				>
					<Row>
						<Col xs={24}>
							<Form.Item
								label="¿Que servicio necesita?"
								rules={[
									{
										required: true,
										message:
											"Favor de ingresar un titulo para su proyecto",
									},
								]}
							>
								<Input
									name="title"
									onChange={onChange}
								/>
							</Form.Item>
							<Form.Item
								label="Descripcion de lo deseado"
								rules={[
									{
										required: true,
										message:
											"Favor de ingresar una pequeña descripcion de lo deseado",
									},
								]}
							>
								<Input.TextArea
									name="description"
									onChange={onChange}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={[12, 12]}>
						<Col xs={24} md={18}>
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
									name="time"
									onChange={onDateChange}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={[12, 12]}>
						<Col xs={24} md={18}>
							<Form.Item 
								label="Categoria(s)" 
								name="categories"
								rules={[{ required: true, message: 'Debes elegir almenos una categoria' }]}
							>
								<Select
										mode="multiple"
										allowClear
										onChange={onCatChange}
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
					</Row>

					<Row gutter={[12, 12]} justify="center" align="vertical">
						<Col md={12} xs={24}>
							<Form.Item>
								<Button
									type="primary"
									style={{ width: "100%" }}
									onClick={next}
								>
									Siguiente
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Col>
			</Row>
		</>
	);
}
