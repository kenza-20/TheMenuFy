import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Alert } from "react-bootstrap";
import { FaPlus, FaSortAlphaDown, FaSortAlphaUp, FaEdit, FaTrash, FaCheckCircle, FaBan } from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [alertMessage, setAlertMessage] = useState("");
  const API_URL = "http://localhost:3000/api/users";
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((err) => console.error("Erreur:", err));
  };

  const handleApprove = async (userId, currentStatus) => {
    const newStatus = !currentStatus; // Inverser l'état
    await fetch(`${API_URL}/approve/${userId}`, { method: "PUT" });

    setAlertMessage(newStatus ? "Utilisateur approuvé !" : "Utilisateur désapprouvé !");
    
    // Mettre à jour l'état localement pour un affichage instantané
    setFilteredUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, validated: newStatus } : user
      )
    );

    setTimeout(() => setAlertMessage(""), 2000);
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

  // Filtrer par rôle
  const handleFilterChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    setFilteredUsers(role === "all" ? users : users.filter((user) => user.role === role));
  };

  // Trier les utilisateurs (croissant/décroissant)
  const handleSort = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) => (sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    setFilteredUsers(sortedUsers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <>
      {/* Affichage de l'alerte */}
      {alertMessage && <Alert variant="success" className="text-center">{alertMessage}</Alert>}

      <div className="d-sm-flex mb-lg-4 mb-2">
        {/* Filtres et tri */}
        <div className="d-flex gap-2 ms-auto">
          <Form.Select value={selectedRole} onChange={handleFilterChange} className="form-select-sm">
            <option value="all">Tous</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="kitchen">Cuisine</option>
            <option value="restaurant">Restaurant</option>
            <option value="client">Client</option>
          </Form.Select>

          {/* Bouton de tri */}
          <Button variant="secondary" size="xs" className="btn-sm" onClick={handleSort}>
            {sortOrder === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
          </Button>

          {/* Ajouter un utilisateur */}
          <Button variant="primary" size="xs" className="btn-sm" onClick={handleAddUser}>
            <FaPlus /> Ajouter
          </Button>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="row">
        <div className="col-lg-12">
          <div className="table-responsive rounded card-table">
            <table className="table border-no order-table mb-4 table-responsive-lg">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>État</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.surname}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className={user.isBlocked ? "text-danger" : "text-success"}>
                      {user.isBlocked ? "Bloqué" : "Non bloqué"}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button variant="warning" size="xs" className="btn-sm" onClick={() => handleEdit(user._id)}>
                          <FaEdit />
                        </Button>
                        <Button variant="danger" size="xs" className="btn-sm" onClick={() => handleDelete(user._id)}>
                          <FaTrash />
                        </Button>
                        <Button variant={user.isBlocked ? "success" : "secondary"} size="xs" className="btn-sm" onClick={() => handleBlock(user._id)}>
                          <FaBan /> {user.isBlocked ? "Débloquer" : "Bloquer"}
                        </Button>
                        <Button
                          variant={user.validated ? "success" : "outline-success"}
                          size="xs"
                          className="btn-sm"
                          onClick={() => handleApprove(user._id, user.validated)}
                        >
                          <FaCheckCircle /> {user.validated ? "Approuvé" : "Inapprouvé"}
                        </Button>
                      </div>
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
