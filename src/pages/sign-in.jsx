import { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button, Typography } from "@material-tailwind/react";
import { connect, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';  // Use redux selector for auth
import { loadingToggleAction,loginAction,
} from '../actions/AuthActions'; 

export function SignIn() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch(); // Get Redux dispatcher (add inside the component)
let errorsObj = { email: '', password: '' };
const [errors, setErrors] = useState(errorsObj);



const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
useEffect(() => {
  console.log("useEffect triggered, isAuthenticated:", isAuthenticated); // ✅ Debugging
  if (isAuthenticated) {
    console.log("Navigating to /dashboard..."); // ✅ Confirm before navigation
    navigate("/dashboard");
  }
}, [isAuthenticated, navigate]);



//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//         const res = await fetch("http://localhost:3006/api/user/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ email, password })
//         });

//         const data = await res.json();

//         if (res.status === 403) {
//             setError("Invalid email or password");
//         } else if (res.status === 404) {
//           setError("Email does not match any account");
//       }  
//         else if (res.ok) {
//             console.log("Login successful", data);
//             navigate("/home"); // ✅ Redirect to home.jsx after successful login
//         }
//     } catch (error) {
//         setError("Something went wrong. Please try again.");
//     } finally {
//         setLoading(false);
//     }
// };

const handleSubmit = async (e) => {
  e.preventDefault();

  let error = false;
  const errorObj = { email: "", password: "" };
  if (!email) {
      errorObj.email = "Email is required";
      error = true;
  }
  if (!password) {
      errorObj.password = "Password is required";
      error = true;
  }
  setErrors(errorObj);

  if (error) return;

  setLoading(true);
  dispatch(loadingToggleAction(true));

  const success = await dispatch(loginAction(email, password));

  if (success) {
    console.log("Login successful! Waiting for navigation...");
  } else {
    setLoading(false); // ✅ Stop loading if login failed
    setError("Invalid credentials. Please try again.");
  }
};


  return (
    <section className="m-8 flex gap-4">
            <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/background-2.jpg"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Welcome Back ! </Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Can't wait to have you back ^^.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <Typography className="text-red-500 mt-2">{error}</Typography>}

          <Button className="mt-6" fullWidth type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
