import React, { useState } from 'react';
import { Form, Button, Row, Col, Modal, Result, Steps } from 'antd';
import Layout from '../layouts/LayoutPage';
import '../scss/SolicitudSoftware.scss';
import StepForm from '../components/input/StepForm';
import StepFile from '../components/input/StepFile';
import { Link } from 'react-router-dom';
import OrderService from '../utils/api/orders';

export default function GeneralServices() {
	const { Step } = Steps;
	const user = JSON.parse(localStorage.getItem('user'))
	const userFcm = localStorage.getItem('fcm')
	const [loading, setLoading] = useState(false);

	const [current, setCurrent] = React.useState(0);

	const [formValue, setFormValue] = useState({
		title: '',
		time: '',
		cat1: 0,
		cat2: 0,
		services: []
	});

	const [modal, setModal] = useState({
		open: false,
		type: '',
		title: '',
		description: '',
		req_id: '',
	});

	const onFinish = () => {
		setLoading(true);
		console.log(formValue)
		console.log(user)

		let order = {
			client_id: user.id,
			client_name: user.name,
			client_bussiness: user.bussiness,
      client_fcm: userFcm,
      title: formValue.title,
      cat1: formValue.cat1,
      cat2: formValue.cat2 || '',
			client_due_date: formValue.time,
			services: formValue.services
		}

		console.log(order)

		OrderService.NewOrder(order).then(response => {
			if (response.data.success === true) {
				setTimeout(() => {
					setModal({
						open: true,
						type: 'success',
						title: '¡Solicitud enviada con exito!',
						description: 'Tu numero de orden es: ' + response.data.purchase_order + ', podras ver tu pedido, en apartado de ORDENES .',
						req_id: response.data.service_id,
					});
					setLoading(false);
				});
				setFormValue({
					title: '',
					description: '',
					time: '',
					fileList: [],
				});
			} else {
				setLoading(false);
			}
		}).catch(error => {
			setModal({
				open: true,
				type: 'error',
				description: 'Revisa tus datos e intentalo de nuevo',
				title: 'Algo salió mal',
				req_id: error,
			});
		})
		/*OrderService.NewService(service)
			.then((response) => {
				if (response.data.success === true) {
					setTimeout(() => {
						setModal({
							open: true,
							type: 'success',
							title: '¡Solicitud enviada con exito!',
							description: 'Tu numero de orden es: ' + response.data.purchase_order + ', podras ver tu pedido, en apartado de ORDENES .',
							req_id: response.data.service_id,
						});
						setLoading(false);
					});
					setFormValue({
						title: '',
						description: '',
						time: '',
						fileList: [],
					});
				} else {
					setLoading(false);
				}
			})
			.catch((error) => {
				setModal({
					open: true,
					type: 'error',
					description: 'Revisa tus datos e intentalo de nuevo',
					title: 'Algo salió mal',
					req_id: error,
				});
			});*/
	};
	
	const onCancel = (target) => {
		setModal((state) => ({
			...modal,
			open: false,
		}));
		setLoading(false);
	}
	const prev = () => {
		setCurrent(0);
	};

	const next = () => {
		setCurrent(1);
	};

	const steps = [
		{
			title: 'Paso 1',
			description: 'Genera tu solicitud',
			content: (
				<>
					<StepForm next={next} setFormValue={setFormValue} formValue={formValue} />
				</>
			),
		},
		{
			title: 'Paso 2',
			description: 'Sube archivos de especificación',
			content: (
				<>
					<StepFile
						setFormValue={setFormValue}
						filesArray={formValue.fileList}
					/>
				</>
			),
		},
	];

	return (
		<>
			<Layout>
				<Row>
					<Col xs={24}>
						{/* Main Form for OrderDetails */}
						<Steps current={current} responsive>
							{steps.map((item) => (
								<Step
									key={item.title}
									title={item.title}
									description={item.description}
								/>
							))}
						</Steps>
						<div style={{padding: '16px'}} className='steps-content'>
							{steps[current].content}
						</div>

						<Button
							type='primary'
							onClick={onFinish}
							loading={loading}
							
						>
							Subir y Finalizar
						</Button>
						{current > 0 && (
							<Button style={{ margin: '0 8px' }} onClick={prev}>
								Anterior
							</Button>
						)}
					</Col>
				</Row>
			</Layout>
			<Modal
				title='Notificación de solicitud'
				closable={true}
				open={modal.open}
				onCancel={onCancel}
				footer={[
					<Button key='submit' type='primary'>
						<Link to={`/orders/all/1`}>Aceptar</Link>
					</Button>,
				]}
			>
				<Result
					title={modal.title}
					status={modal.type}
					subTitle={modal.description}
				/>
			</Modal>
		</>
	);
}
