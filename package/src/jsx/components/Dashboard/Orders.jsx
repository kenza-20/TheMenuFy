import React, { useState, useEffect, useRef } from "react";
import {useNavigate } from "react-router-dom";
import { Button, Dropdown } from "react-bootstrap";
import { FaPlus, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import { Form } from "react-bootstrap";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const API_URL = "http://localhost:3000/api/users";
  const navigate = useNavigate();
  const activePag = useRef(0);
  const sort = 10;
  const [test, setTest] = useState(0);
  const [filterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");


  useEffect(() => {
    fetchUsers();
  }, [test]);

  const fetchUsers = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Erreur:", err));
  };

  const handleApprove = async (userId) => {
    await fetch(`${API_URL}/approve/${userId}`, { method: "PUT" });
    fetchUsers();
  };

  const handleBlock = async (userId) => {
    await fetch(`${API_URL}/block/${userId}`, { method: "PUT" });
    fetchUsers();
  };

  const handleDelete = async (userId) => {
    await fetch(`${API_URL}/${userId}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleAddUser = () => {
    navigate("/add-user");
  };

  const filteredUsers = users
    .filter((user) => {
      if (filterStatus === "blocked") return user.isBlocked;
      if (filterStatus === "unblocked") return !user.isBlocked;
      return true;
    })
    .filter((user) => {
      if (filterRole !== "all") return user.role === filterRole;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });


  return (
    <>
<div className="d-sm-flex mb-lg-4 mb-2">
  {/* Filtres */}
  <div className="d-flex gap-3 ms-auto">
    <Form.Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
      <option value="all">Tous</option>
      <option value="admin">Restaurant</option>
      <option value="user">Client</option>
      <option value="moderator">Cuisine</option>
    </Form.Select>

    {/* Bouton de tri */}
    <button className="btn btn-secondary" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
      {sortOrder === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
    </button>

    <Button variant="primary" onClick={handleAddUser}>
      <FaPlus />
    </Button>
  </div>
</div>

      <div className="row">
        <div className="col-lg-12">
          <div className="table-responsive rounded card-table">
            <table className="table border-no order-table mb-4 table-responsive-lg">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.surname}</td>
                    <td>{user.email}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="" className="i-false">
                          <i className="las la-ellipsis-h"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleEdit(user._id)}>
                            <i className="las la-edit text-warning me-3" /> Modifier
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDelete(user._id)}>
                            <i className="las la-trash text-danger me-3" /> Supprimer
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleApprove(user._id)}>
                            <i className="las la-check-circle text-success me-3" /> Approuver
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleBlock(user._id)}>
                            <i className="las la-ban text-danger me-3" /> {user.isBlocked ? "Débloquer" : "Bloquer"}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
