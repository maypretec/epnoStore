import { Row, Col, Badge, Upload, Typography } from "antd";

import { InboxOutlined } from "@ant-design/icons";

export default function StepFile(props) {
	const { setFormValue, filesArray } = props;

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
		beforeUpload: (file) => {
			setFormValue((state) => ({
				...state,
				fileList: [...state.fileList, file],
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
						Recuerda que el nombre de tus archivos debe ser
						descriptivo: Ej. Servicio 1 especificaciones.
					</Typography.Text>
				</Typography.Paragraph>
			</Col>
			<Col xs={22}>
				<Upload.Dragger
					{...propsDrag}
					maxCount={25}
					listType="picture"
					name="files"
					multiple={true}
				>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">
						Arrastra o da click para subir archivos.
					</p>
					<p className="ant-upload-hint">
						Puedes subir archivos en uno en uno o seleccionar varios
						a la vez, solo puedes subir maximo 10 archivos.
					</p>
				</Upload.Dragger>
			</Col>
		</Row>
	);
}
