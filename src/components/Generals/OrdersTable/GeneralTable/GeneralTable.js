import React, { useState, useEffect } from "react";
import { Row, Col, Input, Table, Button, Tag } from "antd";
import Highlighter from "react-highlight-words";
import {
	PlusOutlined
} from "@ant-design/icons";
// import Layout from "../../views/layouts/LayoutPage";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import ServiceStatus from "../../ServiceStatus/ServiceStatus";

export default function AgentTable(props) {
	const { openOrders, loading } = props;
	let history = useNavigate();
	let role = localStorage.getItem("role");
	console.log(props)
	console.log(openOrders)

	const [tableData, setTableData] = useState(
		openOrders.map((order, index) => {
			return {
				key: index,
				order_id: order.id,
				order_title: order.title,
				client_name: order.userName,
				order_status: order.status,
				days_of_age: moment(order.createdAt).fromNow(), 
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
						order_id: order.id,
						order_title: order.title,
						client_name: order.userName,
						order_status: order.status,
						days_of_age: moment(order.createdAt).fromNow(), 
					};
				})
			);
	}, [searchedValue, openOrders, isDataFiltered]);

	const { Search } = Input;

	const handleSearch = (searchedText) => {
		setIsDataFiltered(true);
		setSearchedValue(searchedText);
	};

	const handleReset = () => {
		setIsDataFiltered(false);
		setSearchedValue(null);
	};

	const handleNav = (route) => {
    history(route)
  }

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
				<Col xs={20}>
					<Search
						placeholder="Filtrar por numero de orden"
						allowClear
						enterButton="Buscar"
						size="large"
						onSearch={handleSearch}
					/>
				</Col>
				{ role == 4 ? 
				<Col xs={4}>
					<Button type="primary" onClick={() => handleNav('/orders/request')} icon={<PlusOutlined/>} style={{width: '100%', height: '100%'}} >
						Nueva orden
					</Button>
				</Col>
				: <></>}
				
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
