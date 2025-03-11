import React, { useEffect, useState} from "react"; 
import { getByEmail} from "../../components/Dashboard/superAdminApi";

import { Link } from "react-router-dom";
/// Scroll
import { Dropdown } from "react-bootstrap";
import Logout from './Logout';
import profil from "../../../assets/images/profile/profil.jpg";


/// Image
import profile from "../../../assets/images/profile/17.jpg";
import avatar from "../../../assets/images/avatar/1.jpg";
import data from "../../components/table/tableData";

const Header = ({ onNote }) => {
  var path = window.location.pathname.split("/");
  var name = path[path.length - 1].split("-");
  var filterName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;
  var finalName = filterName.includes("app")
    ? filterName.filter((f) => f !== "app")
    : filterName.includes("ui")
    ? filterName.filter((f) => f !== "ui")
    : filterName.includes("uc")
    ? filterName.filter((f) => f !== "uc")
    : filterName.includes("basic")
    ? filterName.filter((f) => f !== "basic")
    : filterName.includes("jquery")
    ? filterName.filter((f) => f !== "jquery")
    : filterName.includes("table")
    ? filterName.filter((f) => f !== "table")
    : filterName.includes("page")
    ? filterName.filter((f) => f !== "page")
    : filterName.includes("email")
    ? filterName.filter((f) => f !== "email")
    : filterName.includes("ecom")
    ? filterName.filter((f) => f !== "ecom")
    : filterName.includes("chart")
    ? filterName.filter((f) => f !== "chart")
    : filterName.includes("editor")
    ? filterName.filter((f) => f !== "editor")
    : filterName;

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = JSON.parse(localStorage.getItem("userDetails"));    
            if (storedUser?.email) {
                try {
                    const response = await getByEmail(storedUser.email);
                    const data = response.data; // axios renvoie les données dans data    
                    setUser(data); // Stocker l'utilisateur dans l'état
                } catch (error) {
                    console.error("Erreur de récupération :", error);
                }
            }
        };
    
        fetchUser();
    }, []);
    



  return (
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              <div
                className="dashboard_bar"
                style={{ textTransform: "capitalize" }}
              >
                {finalName.join(" ").length === 0
                  ? "Dashboard"
                  : finalName.join(" ")}
                {filterName[0] === "" ? (
                  <span>Welcome to Sego Admin!</span>
                ) : filterName[0] === "orders" ? (
                  <span>Here is your order list data</span>
                ) : filterName[0] === "general" ? (
                  <span>Here is your general customers list data</span>
                ) : (
                  ""
                )}
              </div>
            </div>
            <ul className="navbar-nav header-right">
              <li className="nav-item">
                <div className="input-group search-area d-xl-inline-flex d-none">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search here..."
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">
                      <Link to="#">
                        <i className="flaticon-381-search-2" />
                      </Link>
                    </span>
                  </div>
                </div>
              </li>

            
         
              
              <Dropdown className="nav-item dropdown header-profile" as="li">
                <Dropdown.Toggle
                  as="a"
                  to="#"
                  variant=""
                  className="nav-link  i-false p-0c-pointer pointr"
                >
                  <img src={profil} width={20} alt="profile" />
                  <div className="header-info">
                    <span className="text-black">
                      <strong>{user?.name || "Chargement..."} {user?.surname || "Chargement..."}</strong>
                    </span>
                    <p className="fs-12 mb-0">{user?.role || "Chargement..."}</p>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="mt-2">
                  <Link to="/post-details" className="dropdown-item ai-icon">
                    <svg
                      id="icon-user1"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary"
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx={12} cy={7} r={4} />
                    </svg>
                    <span className="ms-2">Profile </span>
                  </Link>
                  <Link to="/email-inbox" className="dropdown-item ai-icon">
                    <svg
                      id="icon-inbox"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-success"
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span className="ms-2">Inbox </span>
                  </Link>
                  <Logout />
                </Dropdown.Menu>
              </Dropdown>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
