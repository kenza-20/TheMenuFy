import React, { useEffect, useState, useReducer } from "react"; 
import { Button, Modal, Form } from "react-bootstrap";
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import { FaEdit } from "react-icons/fa";
import { getByEmail, updateProfileSuperAdmin } from "../../Dashboard/superAdminApi";
import profil from "../../../../assets/images/profile/profil.jpg";
import couverture from "../../../../assets/images/profile/admin-sticker.jpg";


// Reducer setup
const initialState = { sendMessage: false };
const reducer = (state, action) => {
  switch (action.type) {
    case 'sendMessageOpen':
      return { ...state, sendMessage: true };
    case 'sendMessageClose':
      return { ...state, sendMessage: false };
    default:
      return state;
  }
};

const PostDetails = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem("userDetails"));
      if (storedUser?.email) {
        try {
          const response = await getByEmail(storedUser.email);
          const data = response.data; // axios renvoie les données dans data

          setUser(data);
          setFormData({
            name: data.name || "",
            surname: data.surname || "",
            email: data.email || "",
            password: data.password
          });
        } catch (error) {
          console.error("Erreur de récupération :", error);
        }
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = () => {
    dispatch({ type: "sendMessageOpen" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await updateProfileSuperAdmin(user._id, formData); // Utilisation de user._id
        const updatedUser = response.data;

        setUser(updatedUser);
        dispatch({ type: "sendMessageClose" });
    } catch (error) {
        console.error("Erreur de mise à jour :", error.response ? error.response.data : error);
    }
};


  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="profile card card-body px-3 pt-3 pb-0">
            <div className="profile-head">
              <div className="photo-content">
                <img
                    src={couverture}
                    className="cover-photo rounded"
                  />
              </div>
              <div className="profile-info">
                <div className="profile-photo">
                  <img
                    src={profil}
                    className="img-fluid rounded-circle"
                    alt="profile"
                  />
                </div>
                <div className="profile-details">
                  <div className="profile-name px-3 pt-2">
                    <h4 className="text-primary mb-0">{user.name} {user.surname}</h4>
                  </div>
                  <div className="profile-email px-2 pt-2">
                    <h4 className="text-muted mb-0">{user.email}</h4>
                  </div>
                <button 
                  className="btn btn-primary light sharp i-false ml-auto" 
                  onClick={handleUpdate}
                  style={{ position: 'absolute', right: '10px' }} // optional, just to fine-tune the position
                >
                  <FaEdit size={20} />
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up pour la mise à jour du profil */}
      <Modal show={state.sendMessage} onHide={() => dispatch({ type: "sendMessageClose" })}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control type="text" name="surname" value={formData.surname} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>

            <Button variant="primary" type="submit">
              Mettre à jour
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PostDetails;
