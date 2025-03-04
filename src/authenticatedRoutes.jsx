// authenticatedRoutes.js
import { Dashboard, Profile, Logout } from "@/pages";

export const authenticatedRoutes = [
  {
    name: "dashboard",
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    name: "profile",
    path: "/profile",
    element: <Profile />,
  },
  {
    name: "logout",
    path: "/logout", // Define the logout path if needed (optional)
    element: <Logout />,
  },
];

export default authenticatedRoutes;
