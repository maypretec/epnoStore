import React, { useState, useEffect } from "react";
import UserService from "../utils/api/users";
import ValueStreamService from "../utils/api/valuestreams";
import UsersList from "../components/Agent/UsersList";
import Layout from "../layouts/ControlPanelLayout";
export default function Users(props) {
  let role = localStorage.getItem("role");
  const [reload, setReload] = useState(false);
  const [users, setUsers] = useState([]);
  const [vs, setVs] = useState([]);

  useEffect(() => {
    (role == 3 || role == 1) &&
      UserService.GetAll()
        .then((response) => {
          return response.data;
        })
        .then((users) => {
					console.log(users)
          setUsers(users);
        })
        .catch(console.log);

    ValueStreamService.All()
      .then((response) => {
        return response.data;
      })
      .then((valuestreams) => {
        setVs(valuestreams);
      })
      .catch(console.log);
  }, [reload]);


  return (
    <Layout>
      <UsersList
        reload={reload}
        setReload={setReload}
        users={users}
        valuestreams={vs}
        role={role}
      />
    </Layout>
  );
}
