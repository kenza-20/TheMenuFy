import React, { useEffect, useState } from 'react';
import { getallAdmins, deleteAdmin, blockAdmin, unblockAdmin } from './superAdminApi';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Form, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaBan, FaUnlock, FaSortAlphaDown, FaSortAlphaUp, FaPlus } from "react-icons/fa";

function ListAdmins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc"); // État pour le tri
    const [filterStatus, setFilterStatus] = useState("all"); // État pour le filtre
    const navigate = useNavigate();

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await getallAdmins();
            if (Array.isArray(response.data)) {
                setAdmins(response.data);
            } else if (response.data && typeof response.data === 'object') {
                setAdmins(response.data.admins || []);
            } else {
                setAdmins([]);
            }
        } catch (err) {
            setError("Erreur de chargement des administrateurs");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (admin) => {
        navigate(`/update-admin/${admin._id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet administrateur ?")) {
            try {
                await deleteAdmin(id);
                setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== id));
            } catch (err) {
                console.error("Erreur lors de la suppression", err);
            }
        }
    };

    const handleBlock = async (id) => {
        try {
            await blockAdmin(id);
            alert("Administrateur bloqué avec succès");
            fetchAdmins();
        } catch (err) {
            console.error("Erreur lors du blocage", err);
        }
    };

    const handleUnblock = async (id) => {
        try {
            await unblockAdmin(id);
            alert("Administrateur débloqué avec succès");
            fetchAdmins();
        } catch (err) {
            console.error("Erreur lors du déblocage", err);
        }
    };

    // Fonction pour trier les admins par name
    const sortedAdmins = [...admins].sort((a, b) => {
        if (sortOrder === "asc") {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    // Fonction pour filtrer les admins selon leur statut (bloqué / non bloqué)
    const filteredAdmins = sortedAdmins.filter((admin) => {
        if (filterStatus === "all") return true;
        return filterStatus === "blocked" ? admin.isBlocked : !admin.isBlocked;
    });

    const handleAddAdmin = () => {
      navigate("/add-admin");
  };

    return (
        <>
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <Card.Title>Admins</Card.Title>
                    
                    {/* Filtres */}
                    <div className="d-flex gap-3">
                        <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="all">ALL</option>
                            <option value="blocked">Blocked</option>
                            <option value="unblocked">Unblocked</option>
                        </Form.Select>
                        
                        {/* Bouton de tri */}
                        <button className="btn btn-secondary" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                            {sortOrder === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
                        </button>

                        <Button variant="primary" onClick={handleAddAdmin}>
                            <FaPlus />
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th><strong>ID</strong></th>
                                <th><strong>FIRST NAME</strong></th>
                                <th><strong>LAST NAME</strong></th>
                                <th><strong>Email</strong></th>
                                <th><strong>Status</strong></th>
                                <th><strong>Action</strong></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6">Chargement...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="6">{error}</td></tr>
                            ) : filteredAdmins.length > 0 ? (
                                filteredAdmins.map((admin) => (
                                    <tr key={admin._id} className="hover-effect">
                                        <td>{admin._id}</td>
                                        <td>{admin.name}</td>
                                        <td>{admin.surname}</td>
                                        <td>{admin.email}</td>
                                        <td>{admin.isBlocked ? "Bloqué" : "Non bloqué"}</td>
                                        <td>
                                            <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(admin)}>
                                                <FaEdit />
                                            </button>
                                            <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(admin._id)}>
                                                <FaTrash />
                                            </button>
                                            {admin.isBlocked ? (
                                                <button className="btn btn-success btn-sm" onClick={() => handleUnblock(admin._id)}>
                                                    <FaUnlock />
                                                </button>
                                            ) : (
                                                <button className="btn btn-warning btn-sm" onClick={() => handleBlock(admin._id)}>
                                                    <FaBan />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6">Aucun administrateur trouvé</td></tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    );
}

export default ListAdmins;
