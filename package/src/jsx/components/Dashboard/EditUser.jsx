import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();



  // Vérifie si l'ID est vide
  if (!userId) {
    return <div className="text-center mt-5 text-danger">⚠️ Erreur : ID utilisateur non trouvé.</div>;
  }

  // Déclare API_URL AVANT de l'utiliser
  const API_URL = `http://localhost:3000/api/users/${userId}`;

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Utilisateur non trouvé");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setRole(data.role);
      })
      .catch((err) => {
        console.error("❌ Erreur lors de la récupération de l'utilisateur :", err);
        setErrorMessage("Impossible de récupérer les informations de l'utilisateur.");
      });
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = { name, email, password, role };

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        alert("Utilisateur modifié avec succès !");
        navigate("/Orders"); // Redirection après modification
      } else {
        console.error("❌ Erreur lors de la modification de l'utilisateur");
        setErrorMessage("Échec de la mise à jour de l'utilisateur.");
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
      setErrorMessage("Erreur réseau, veuillez réessayer plus tard.");
    }
  };

  if (!user) return <div className="text-center mt-5">Chargement des informations...</div>;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <Card className="shadow-lg p-4 rounded">
          <Card.Body>
            <h4 className="mb-4 text-center">Modifier un utilisateur</h4>
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
                <Form.Label>Mot de passe (laisser vide pour ne pas modifier)</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rôle</Form.Label>
                <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Modifier l'utilisateur
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default EditUser;
