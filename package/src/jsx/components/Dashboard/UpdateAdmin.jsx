import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { editAdmin } from './superAdminApi';
import { Card, Form, Button } from 'react-bootstrap'; // Importez les composants nécessaires de react-bootstrap

const UpdateAdmin = ({ admins }) => {
    const { id } = useParams();
    const [admin, setAdmin] = useState({ name: "", surname: "", email: "" });

    // Charger les données de l'admin ou faire un appel API
    useEffect(() => {
        if (admins && admins.length > 0) {
            const foundAdmin = admins.find((admin) => admin._id === id);
            if (foundAdmin) {
                setAdmin(foundAdmin);
            } else {
                console.error("Admin non trouvé");
            }
        } else {
            const fetchAdmin = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/superAdmin/admin/${id}`);
                    setAdmin(response.data.admin || { name: "", surname: "", email: "" });
                } catch (error) {
                    console.error("Erreur lors de la récupération de l'admin :", error);
                }
            };
            fetchAdmin();
        }
    }, [id, admins]);

    // Fonction pour mettre à jour les données de l'admin dans le state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmin((prevAdmin) => ({
            ...prevAdmin,
            [name]: value,
        }));
    };

    // Fonction de soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Met à jour l'admin via la fonction editAdmin
            const updatedAdmin = await editAdmin(id, admin);
            if (updatedAdmin) {
            }
        } catch (error) {
            console.error("Échec de la mise à jour de l'administrateur");
        }
    };

    return (
        <Card>
            <Card.Header>
                <Card.Title>Modifier l'administrateur</Card.Title>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 row">
                        <Form.Label className="col-lg-4 col-form-label">
                            Prénom
                            <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="col-lg-6">
                            <Form.Control
                                type="text"
                                name="name"
                                value={admin.name}
                                onChange={handleChange}
                                placeholder="Entrez le prénom"
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3 row">
                        <Form.Label className="col-lg-4 col-form-label">
                            Nom
                            <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="col-lg-6">
                            <Form.Control
                                type="text"
                                name="surname"
                                value={admin.surname}
                                onChange={handleChange}
                                placeholder="Entrez le nom"
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3 row">
                        <Form.Label className="col-lg-4 col-form-label">
                            Email
                            <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="col-lg-6">
                            <Form.Control
                                type="email"
                                name="email"
                                value={admin.email}
                                onChange={handleChange}
                                placeholder="Entrez l'email"
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3 row">
                        <div className="col-lg-8 ms-auto">
                            <Button type="submit" variant="primary">
                                Enregistrer
                            </Button>
                        </div>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default UpdateAdmin;