import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert } from "react-bootstrap";

const AddUser = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState(""); // Ajout du prénom
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000/api/users";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const user = { name, surname, email, password, role, isBlocked: false, validated: false, confirmed: false };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setSuccessMessage("Utilisateur ajouté avec succès !");
        
        // Réinitialiser les champs après ajout
        setName("");
        setSurname("");
        setEmail("");
        setPassword("");
        setRole("user");

        setTimeout(() => navigate("/Orders"), 1500);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Erreur lors de l'ajout de l'utilisateur.");
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
            
            {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Prénom</Form.Label>
                <Form.Control 
                  type="text" 
                  value={surname} 
                  onChange={(e) => setSurname(e.target.value)} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rôle</Form.Label>
                <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                  <option value="kitchen">Cuisine</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="client">Client</option>
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
