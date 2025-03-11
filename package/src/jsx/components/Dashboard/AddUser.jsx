import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000/api/users";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { name, email, password, role};

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert("Utilisateur ajouté avec succès !");
        navigate("/Orders");
      } else {
        setErrorMessage("Erreur lors de l'ajout de l'utilisateur.");
      }
    } catch (error) {
      setErrorMessage("Erreur réseau, veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <Card className="shadow-lg p-4 rounded">
          <Card.Body>
            <h4 className="mb-4 text-center">Ajouter un utilisateur</h4>
            {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rôle</Form.Label>
                <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Ajouter l'utilisateur
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AddUser;
