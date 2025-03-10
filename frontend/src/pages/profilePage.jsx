import React, { useState, useEffect } from "react";
import { User, Mail, Edit3, MapPin } from "lucide-react";
import axios from "axios";
import Button from "../components/button";
import Footer from "../components/footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [editName, setEditName] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/user/profile", {
          headers: { Authorization: token },
        });
        setUser(response.data);
        setNewUsername(response.data.name);
      } catch (error) {
        console.error("Error fetching profile:", error.response || error);
      }
    };

    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error fetching location:", error);
          }
        );
      }
    };

    fetchUserProfile();
    fetchLocation();
  }, []);

  const handleNameUpdate = async () => {
    try {
      // Validate new username
      if (!newUsername.trim()) {
        console.error("Username cannot be empty");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:3000/api/user/update",
        { name: newUsername },
        { headers: { Authorization: token } }
      );

      if (response.status === 200) {
        setUser((prev) => ({ ...prev, name: newUsername }));
        setEditName(false);
        alert("Username updated successfully!");
      }
    } catch (error) {
      console.error("Error updating username:", error.response || error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Profile.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="w-[450px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl text-white">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={50} className="text-gray-700" />
            </div>

            {editName ? (
              <input
                className="text-2xl font-bold text-center bg-transparent border-b border-gray-300 outline-none"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            ) : (
              <h1 className="text-3xl font-bold">{user?.name}</h1>
            )}

            <div className="space-y-6 w-full">
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Mail className="text-yellow-500" size={20} />
                <p>{user?.email}</p>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <MapPin className="text-yellow-500" size={20} />
                <p>
                  {location.latitude ? (
                    <>
                      Lat: {location.latitude}, Lng: {location.longitude}
                    </>
                  ) : (
                    "Fetching location..."
                  )}
                </p>
              </div>
            </div>

            {editName ? (
              <Button className="bg-yellow-500 text-white py-3 px-6 rounded-lg" onClick={handleNameUpdate}>
                Save
              </Button>
            ) : (
              <Button
                className="bg-transparent border-2 border-yellow-500 text-yellow-500 py-3 px-6 rounded-lg flex items-center space-x-2"
                onClick={() => setEditName(true)}
              >
                <Edit3 size={18} />
                <span>Edit Name</span>
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
