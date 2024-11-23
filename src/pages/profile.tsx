import { useState } from "react";
import "./styles.scss";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";

const Profile = () => {
  const [profile, setProfile] = useState({
    profilePicture: "default-picture.jpg",
    name: "Kevin Heart",
    username: "kevinunhuy",
    status: "On duty",
    about: "Discuss only on work hours, unless you wanna discuss music 🎶",
    availableChange: "25/04/2024",
  });

  const { user } = useFetchCurrentUser();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="profile-page">
   

      <div className="profile-container">
        <h2>Profile Settings</h2>
        <div className="profile-actions">
          <button className="change-btn">Change picture</button>
          <button className="delete-btn">Delete picture</button>
        </div>
        <div className="profile-info">
          <label>Profile Name</label>
          <input
            type="text"
            name="name"
            value={user.firstName}
            onChange={handleInputChange}
            disabled
          />
          <label>Email</label>
          <input type="email" name="email" value={user.email} disabled />
          <button className="save-btn">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
