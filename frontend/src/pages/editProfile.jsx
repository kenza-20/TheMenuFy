import React, { useState, useEffect } from "react";
import { User, Mail, Camera } from "lucide-react"; 
import BlurContainer from "../components/blurContainer";
import Button from "../components/button";
import Footer from "../components/footer";
import { jwtDecode } from "jwt-decode";


const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
  });

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Load user data from localStorage
  const token = localStorage.getItem("token");
  console.log("token", token);
  const Decode = jwtDecode(token); // ✅ jwtDecode doit être défini correctement
  console.log("Decode", Decode?.userId); // ❌ Corriger la faute de frappe "Docode" -> "Decode"
  

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setFormData({
        name: storedUser.name || "",
        surname: storedUser.surname || "",
        email: storedUser.email || "",
      });
      if (storedUser.profilePicture) {
        setImage(storedUser.profilePicture); // Load existing profile picture
      }
    }
  }, []);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Save file for uploading
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result); // Set preview image
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const userId = Decode?.userId;
  
    const { name, surname, email } = formData;
    
    //const data = new FormData();
   // data.append("userId", userId);
   // data.append("name", name);
    // data.append("surname", surname);
   // data.append("email", email);
   const data = JSON.stringify({"userId" : userId, "name" : name, "surname" :surname, "email" :email})
  console.log(data , "data")
    if (imageFile) {
      data.append("profile_picture", imageFile);
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",  // ✅ JSON header
          "Authorization": `Bearer ${token}`, // ✅ Ensure token is included
        },
        body: data,
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error("Error:", result);
        throw new Error(result.message || "Profile update failed");
      }
  
      localStorage.setItem("userDetails", JSON.stringify({ ...userDetails, user: result.user }));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update profile.");
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: "url('/Profile.jpg')", boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)" }}
      />

      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <BlurContainer className="w-[450px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl text-white">
          <h1 className="text-3xl font-bold text-center mb-6">Edit Profile</h1>

          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {image ? (
                <img src={image} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <User size={50} className="text-gray-700" />
              )}
            </div>
            <label className="cursor-pointer text-yellow-500 hover:text-yellow-300 flex items-center space-x-2">
              <Camera size={20} />
              <span>Upload Image</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <User className="text-yellow-500" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder=" Name"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <User className="text-yellow-500" size={20} />
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder="Surname"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Mail className="text-yellow-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder="Email"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-transparent hover:bg-yellow-500 text-white-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              Save Changes
            </Button>
          </form>
        </BlurContainer>
      </main>

      <Footer />
    </div>
  );
};

export default EditProfile;
