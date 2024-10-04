import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import "./styles.scss";
import useFetchCurrentUser from "../../hooks/useFetchCurrentUser";

const Sidebar = () => {
  const { currentUser } = useFetchCurrentUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-profile">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile Avatar"
          className="profile-avatar"
        />
        <p className="profile-name">{currentUser?.username}</p>
      </div>
      <div className="sidebar-item">
        <Link className="nav-link" to="/">
          Dashboard
        </Link>
      </div>
      <div className="sidebar-item">
        <Link className="nav-link" to="/sites">
          Sites
        </Link>
      </div>
      <div className="sidebar-item">
        <Link className="nav-link" to="/personnel">
          Personnel
        </Link>
      </div>
      {/* <div className="sidebar-item">Profile</div>
      <div className="sidebar-item">Settings</div> */}

      <div className="logout-icon" onClick={handleLogout}>
        <p>Logout</p>
      </div>
    </div>
  );
};

export default Sidebar;
