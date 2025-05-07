import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Button from "../components/button";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        console.log("Saved User:", savedUser); // Check if the user is retrieved from localStorage

        if (!savedUser) {
          const response = await fetch("http://localhost:3000/api/user/bytoken", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user)); // Save user to localStorage
            console.log("Fetched User:", data.user); // Check if the data is fetched from the backend
          } else {
            setError("Failed to fetch user data.");
          }
        } else {
          setUser(savedUser);
        }
      } catch (err) {
        setError("An error occurred while fetching the user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="mt-25 flex flex-col min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: "url('/Profile.jpg')" }}
      />
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md px-6 py-8 rounded-2xl bg-white/20 backdrop-blur-lg text-white">
          <div className="flex flex-col items-center space-y-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={user.profilePic || "/default-profile.jpg"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>

            {/* Name */}
            <h1 className="text-2xl font-bold">
              {user.name} {user.surname}
            </h1>

            {/* Profile Info */}
            <div className="space-y-4 w-full">
            <Link to="/dashboard">
               <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                 <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="20"
                     height="20"
                     fill="currentColor"
                     className="text-yellow-500"
                     viewBox="0 0 16 16"
                 >
                   <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4M3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.39.39 0 0 0-.029-.518z"/>
                   <path fillRule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A8 8 0 0 1 0 10m8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3"/>
                 </svg>
                 <p>Tableau de bord nutritionnel</p>
               </div>
               </Link>
               {/* Séparateur visuel / espace */}
               <div className="h-1" />
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Mail className="text-yellow-500" size={20} />
                <p>{user.email}</p>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <span className="text-yellow-500">Phone:</span>
                <p>{user.tel || "Not provided"}</p>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <span className="text-yellow-500">Role:</span>
                <p>{user.role}</p>
              </div>

              {/* User Preferences */}
              <div className="space-y-4 w-full mt-6">
                <div className="bg-white/10 p-4 rounded-lg">
                  <span className="text-yellow-500 font-semibold">Likes:</span>
                  <p>{user.foodLikes || "No preferences listed"}</p>
                </div>

                <div className="bg-white/10 p-4 rounded-lg">
                  <span className="text-yellow-500 font-semibold">Dislikes:</span>
                  <p>{user.foodHates || "No preferences listed"}</p>
                </div>

                <div className="bg-white/10 p-4 rounded-lg">
                  <span className="text-yellow-500 font-semibold">Allergies:</span>
                  <p>{user.allergies || "No allergies listed"}</p>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Link to="/EditProfile">
              <Button className="bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
