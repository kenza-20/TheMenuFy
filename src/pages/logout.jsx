import { Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';

export function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handleLoginRedirect = () => {
  //   navigate("/sign-in");
  // };


  const handleLoginRedirect = () => {
      localStorage.removeItem('userDetails'); // Clear the token
      dispatch({ type: "LOGOUT_ACTION" }); // Dispatch LOGOUT_ACTION to update Redux state
      navigate("/sign-in");  // Redirect to login page
  };
  

  
  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
        <div className="absolute top-0 h-full w-full bg-[url('/img/logout-background.png')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography variant="h1" color="white" className="mb-6 font-black">
                You have been logged out.
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80 mb-6">
                Thank you for using our service. Click below to log in again.
              </Typography>
              <Button color="lightBlue" onClick={handleLoginRedirect}>
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Logout;
