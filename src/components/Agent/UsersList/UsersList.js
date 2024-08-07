import React, { useState, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Rate,
  Switch,
  Select,
  message,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../../utils/constants";
import UserService from "../../../utils/api/users";

export default function UsersList(props) {
  const { Option } = Select;
  const { reload, setReload, users, role, valuestreams } = props;
  let token = localStorage.getItem("token");
  const searchInput = useRef(null);

  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
  });
  var color;

  const data = [];
  users.map((user) => {
    var status = user.status;
    var userS;
    if (status == false) {
      userS = "INACTIVO";
    } else if (status == true) {
      userS = "ACTIVO";
    } else if (status == 2) {
      userS = "PENDIENTE";
    }
    data.push({
      key: user.id,
      updown: [{ id: user.id, status: user.status }],
      name: user.name,
			email: user.email,
			phone: user.phone,
      calif: 3,
      type: user.role == 1 ? 'Administrador' 
					  : user.role == 3 ? 'VS Manager'
						: user.role == 4 ? 'Industria'
						: user.role == 5 ? 'Comprador'
						: user.role == 6 ? 'Provedor'
						: user.role == 9 ? 'Repartidor' : '',
      vs: [{ id: user.id, data: user.vs_id }],
      status: [userS],
      details: user.role == 4 || user.role == 6 ? <Link to={`/@p/${user.id}`}>Ver más</Link> : "",
    });
  });

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({ searchText: "" });
  };

  const chageStatus = (id) => (checked) => {
    UserService.UpdateStatus({
      id: id,
      status: checked,
    })
      .then((response) => {
        if (response.data.success == true) {
          setReload(!reload);
          message.success("Usuario actualizado correctamente.");
        } else {
          message.error("Hubo un problema al actualizar el usuario.");
        }
      })
      .catch((error) => {
        message.error("Hubo un problema al actualizar el usuario.");
      });
  };
  
  const onChangeVs = (id) => (value) => {
    UserService.Change_User({
      id: id,
      vs_id: value,
    })
      .then((response) => {
        if (response.data.success == true) {
          setReload(!reload);
          message.success("Usuario actualizado correctamente.");
        } else {
          message.error("Hubo un problema al actualizar el usuario.");
        }
      })
      .catch((error) => {
        message.error("Hubo un problema al actualizar el usuario.");
      });
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      // width: '30%',
      ...getColumnSearchProps("name"),
    },
		{
      title: "Correo",
      dataIndex: "email",
      key: "email",
      // width: '30%',
      ...getColumnSearchProps("email"),
    },
		{
      title: "Telefono",
      dataIndex: "phone",
      key: "phone",
      // width: '30%',
      ...getColumnSearchProps("phone"),
    },
    {/*
      title: "Calificacion",
      dataIndex: "calif",
      key: "calif",
      ...getColumnSearchProps("calif"),
      render: (calif) => (
        <span>
          <Rate disabled defaultValue={calif} />
        </span>
      ),
   */ },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      ...getColumnSearchProps("role"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (status) => (
        <>
          {status.map((status) => {
            if (status === "INACTIVO") {
              color = "volcano";
            } else if (status === "ACTIVO") {
              color = "green";
            } else if (status === "PENDIENTE") {
              color = "gold";
            }
            return (
              <Tag color={color} key={status}>
                {status}
              </Tag>
            );
          })}
        </>
      ),
    },
    {/*
      title: "VS",
      dataIndex: "vs",
      key: "vs",
      render: (vs) =>
        vs.map((vs) => (
          <Select
            key={vs.id}
            showSearch
            optionFilterProp="children"
            defaultValue={vs.data}
            disabled={role == 3 && true}
            onChange={onChangeVs(vs.id)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {valuestreams.map((d) => (
              <Option key={d.id} value={d.id}>
                {d.name}
              </Option>
            ))}
          </Select>
        )),
    */},

    {
      title: "Alta/Baja",
      dataIndex: "updown",
      key: "updown",
      render: (updown) => (
        <>
          {updown.map((ud) => (
            <Switch
              key={ud.id}
              disabled={ud.status == 2 && true}
              defaultChecked={ud.status == 1 ? true : false}
              onChange={chageStatus(ud.id)}
            />
          ))}
        </>
      ),
    },
    {
      title: "Detalles",
      dataIndex: "details",
      key: "details",
    },
  ];
  return <Table columns={columns} dataSource={data} scroll={{ x: "100vh" }} />;
}
