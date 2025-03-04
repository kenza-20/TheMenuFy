import { useState } from "react";
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export function SignUp() {
  const navigate = useNavigate();

  // State variables
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isRecaptchaChecked, setIsRecaptchaChecked] = useState(false);
  const [error, setError] = useState("");

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
        name,
        surname,  // ✅ Ensure this field is included
        email,
        password,
        role: "user" // Change based on user selection if needed
    };

    try {
        const response = await fetch("http://localhost:3006/api/user/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Signup failed");
        }

        console.log("Signup successful!");
    } catch (error) {
        console.error("Signup Error:", error);
    }
};

  

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/logout-background.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Welcome To The MenuFy  </Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            dear customer we love to know you more .
          </Typography>
        </div>
        
        {/* FORM */}
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-6">
            <Input size="lg" placeholder="First Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input size="lg" placeholder="Last Name" value={surname} onChange={(e) => setSurname(e.target.value)} required />
            <Input size="lg" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input size="lg" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <select
              className="border p-2 rounded-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>

          <Checkbox
            label={
              <Typography variant="small" color="gray" className="flex items-center font-medium">
                I agree to the&nbsp;
                <a href="#" className="text-black underline">Terms and Conditions</a>
              </Typography>
            }
          />
          
          {/* reCAPTCHA Checkbox */}
          <Checkbox
            label="I'm not a robot"
            checked={isRecaptchaChecked}
            onChange={() => setIsRecaptchaChecked(!isRecaptchaChecked)}
          />

          {/* Display error message */}
          {error && <Typography className="text-red-500 mt-2">{error}</Typography>}

          <Button className="mt-6" fullWidth type="submit" disabled={!isRecaptchaChecked}>
            Register Now
          </Button>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/sign-in" className="text-gray-900 ml-1">Sign in</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
