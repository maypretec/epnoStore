import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Input, Table, Button, Tag, Badge } from "antd";
import Highlighter from "react-highlight-words";
import {
	CheckCircleOutlined,
	SyncOutlined,
	CloseCircleOutlined,
	CarOutlined,
	ClockCircleOutlined,
	MinusCircleOutlined,
	FileSearchOutlined,
} from "@ant-design/icons";
// import Layout from "../../views/layouts/LayoutPage";
import { Link } from "react-router-dom";
import moment from "moment";
import ServiceStatus from "../../ServiceStatus";

export default function AgentTable(props) {
	const { openOrders, loading } = props;

	const [tableData, setTableData] = useState(
		openOrders.map((order, index) => {
			return {
				key: index,
				order_id: order.order_num,
				order_title: order.service.title,
				client_name: order.client_name,
				order_status: order.service.step_id,
				days_of_age: moment(order.created_at).fromNow(),
			};
		})
	);
	const [isDataFiltered, setIsDataFiltered] = useState(false);
	const [searchedValue, setSearchedValue] = useState();

	useEffect(() => {
		if (isDataFiltered)
			setTableData(
				openOrders
					.filter((order) =>
						order.order_num
							.toLowerCase()
							.includes(searchedValue.toLowerCase())
					)
					.map((order, index) => {
						return {
							key: index,
							order_id: order.order_num,
							order_title: order.service.title,
							client_name: order.client_name,
							order_status: [order.service.step_id],
							days_of_age: moment(order.created_at).fromNow(),
						};
					})
			);
		else
			setTableData(
				openOrders.map((order, index) => {
					return {
						key: index,
						order_id: order.order_num,
						order_title: order.service.title,
						client_name: order.client_name,
						order_status: [order.service.step_id],
						days_of_age: moment(order.created_at).fromNow(),
					};
				})
			);
	}, [searchedValue, openOrders, isDataFiltered]);

	var icon;
	var color;
	var text;

	const { Search } = Input;

	const handleSearch = (searchedText) => {
		setIsDataFiltered(true);
		setSearchedValue(searchedText);
	};

	const handleReset = () => {
		setIsDataFiltered(false);
		setSearchedValue(null);
	};

	const columns = [
		{
			title: "# Orden",
			dataIndex: "order_id",
			key: "order_id",
			filtered: isDataFiltered,
			align: "center",
			onFilter: (value, record) =>
				record.order_id.toLowerCase().includes(value.toLowerCase()),
			sorter: (a, b) => a.order_id.length - b.order_id.length,
			render: (text, record) =>
				isDataFiltered ? (
					<Highlighter
						highlightStyle={{
							backgroundColor: "#ffc069",
							padding: 0,
						}}
						searchWords={[searchedValue]}
						autoEscape
						textToHighlight={text ? text.toString() : ""}
					/>,
					record.order_id !== "" ? (
						<Link to={`/orders/details/${record.order_id}`}>{text}</Link>
					) : (
						<Tag color="volcano">unavailable</Tag>
					)
				) : record.order_id !== "" ? (
					<Link to={`/orders/details/${record.order_id}`}>{text}</Link>
				) : (
					<Tag color="volcano">unavailable</Tag>
				),
		},

		{
			title: "Titulo",
			dataIndex: "order_title",
			key: "order_title",
			sorter: (a, b) => a.order_title.length - b.order_title.length,
			sortDirections: ["descend", "ascend"],
		},

		{
			title: "Cliente",
			dataIndex: "client_name",
			key: "client_name",
			align: "center",
			sorter: (a, b) => a.client_name.length - b.client_name.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Status",
			dataIndex: "order_status",
			key: "order_status",
			align: "center",
			render: (status) => <ServiceStatus status={status}  />,
			sorter: (a, b) => (a.order_status - b.order_status),
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Antiguedad",
			dataIndex: "days_of_age",
			key: "days_of_age",
			align: "center",
			sorter: (a, b) => new Date(a.days_of_age) - new Date(b.days_of_age),
			sortDirections: ["descend", "ascend"],
		},
	];
	return (
		<>
			<Row gutter={[12, 12]}>
				<Col xs={24}>
					<Search
						placeholder="Filtrar por numero de orden"
						allowClear
						enterButton="Buscar"
						size="large"
						onSearch={handleSearch}
					/>
				</Col>
			</Row>
			<Row gutter={[12, 12]}>
				<Col xs={24}>
					<Table
						columns={columns}
						dataSource={tableData}
						scroll={{ x: "100vh" }}
						loading={loading}
					/>
				</Col>
			</Row>
		</>
	);
}
