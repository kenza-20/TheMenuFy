import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';
import { addAdmin } from './superAdminApi'; // Fonction pour envoyer les données

function AddAdmin() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newAdmin = {
            ...formData,
            role: "admin",
            approved: true,
            confirmed: true,
            isBlocked: false,
            resetCode: "",
            resetCodeExpiration: ""
        };

        try {
            const a=await addAdmin(newAdmin);
            alert("Administrateur ajouté avec succès !");
            navigate('/list-admin'); // Redirection après l'ajout
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'administrateur", error);
            alert("Échec de l'ajout de l'administrateur.");
        }
    };

    return (
        <Card className="p-4">
            <Card.Header>
                <h2><FaUserPlus /> Ajouter un administrateur</h2>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Ajouter
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default AddAdmin;
