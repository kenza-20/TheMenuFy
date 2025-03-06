import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "@/widgets/layout";
import routes from "@/routes";
import Dashboard from "./components/admin/Dashboard";
import UserManagement from "./components/admin/UserManagement";
import AddUser from './components/admin/AddUser';
import EditUser from './components/admin/EditUser';
function App() {
  const { pathname } = useLocation();

  return (
    <>
      {/* Afficher la navbar sauf sur les pages de connexion */}
      {!(pathname === "/sign-in" || pathname === "/sign-up") && (
        <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
          <Navbar routes={routes} />
        </div>
      )}

      <Routes>
        {routes.map(({ path, element }, key) =>
          element && <Route key={key} exact path={path} element={element} />
        )}
        {/* Routes Admin */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/edit-user/:userId" element={<EditUser />} />
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
