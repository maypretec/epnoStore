import { Row, Col, Badge, Upload, Typography } from "antd";

import { InboxOutlined } from "@ant-design/icons";

export default function StepFile(props) {
	const { setFormValue, filesArray } = props;

	const getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				const base64String = reader.result;
				resolve(base64String);
			};
			reader.onerror = (error) => reject(error);
		});
	};

	const propsDrag = {
		onRemove: (file) => {
			setFormValue((state) => {
				const newFileList = state.fileList.slice();
				newFileList.splice(state.fileList.indexOf(file), 1);
				return {
					...state,
					fileList: newFileList,
				};
			});
		},
		beforeUpload: async (file) => {
			const base64 = await getBase64(file);
			setFormValue((state) => ({
				...state,
				fileList: base64,
			}));
			return false;
		},
		filesArray,
	};

	return (
		<Row gutter={[12, 12]} justify="center" align="middle">
			<Col xs={22}>
				<Typography.Paragraph mark>
					<Typography.Text type="secondary" style={{ fontSize: 14 }}>
						<Badge status="error" />
						Recuerda que el nombre de tus archivo debe ser
						descriptivo: Ej. Servicio 1 especificaciones.
					</Typography.Text>
				</Typography.Paragraph>
			</Col>
			<Col xs={22}>
				<Upload.Dragger
					{...propsDrag}
					maxCount={1}
					listType='picture'
					name="files"
					multiple={false}
				>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">
						Arrastra o da click para subir el archivo.
					</p>
					<p className="ant-upload-hint">
						Por el momento solo puedes subir un solo archivo PDF
					</p>
				</Upload.Dragger>
			</Col>
		</Row>
	);
}
