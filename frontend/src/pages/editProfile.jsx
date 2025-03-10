import React, { useState } from "react";
import { User, Mail, Lock, Camera } from "lucide-react"; // Camera icon for the upload button
import BlurContainer from "../components/blurContainer";
import Button from "../components/button";
import Footer from "../components/footer";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null); // State to store the selected image
  const [imageFile, setImageFile] = useState(null); // State to store the raw image file for uploading

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Save the file for uploading
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the image preview
      };
      reader.readAsDataURL(file); // Convert the file to a base64 URL
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Get the token from localStorage or your state management solution
    const token = localStorage.getItem("token"); // or use any other method to retrieve the token
  
    if (!token) {
      console.error("Token is missing");
      return; // Optionally handle this case, like showing an alert or redirecting
    }
  
    // Prepare the form data
    const formData = new FormData();
    formData.append("firstName", formData.firstName);
    formData.append("lastName", formData.lastName);
    formData.append("email", formData.email);
    formData.append("password", formData.password);
    
    if (imageFile) {
      formData.append("image", imageFile); // Add the image file if it's available
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/user/update-profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token here
        },
        body: formData, // Send the form data (including image) here
      });
  
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
  
      const data = await response.json();
      console.log("Profile updated:", data);
    } catch (error) {
      console.error("An error occurred while updating the profile", error);
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Profile.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <BlurContainer className="w-[450px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl text-white">
          <h1 className="text-3xl font-bold text-center mb-6">Edit Profile</h1>

          {/* Profile Image Upload */}
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
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* First Name */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <User className="text-yellow-500" size={20} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder="First Name"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <User className="text-yellow-500" size={20} />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder="Last Name"
                  required
                />
              </div>

              {/* Email */}
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

              {/* Password */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Lock className="text-yellow-500" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder="New Password (optional)"
                />
              </div>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              className="w-full bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300"
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
