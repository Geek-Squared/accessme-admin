import { useState } from "react";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";
import useFetchOrganization from "../hooks/useFetchOrg";
import useUpdateUser from "../hooks/useUpdateUser";
import "./styles.scss";

const Profile = () => {
  const { user } = useFetchCurrentUser();
  //@ts-ignore
  const { org, setOrg } = useFetchOrganization(user?.organizationId);
  const { updateUser } = useUpdateUser();

  const [orgDetails, setOrgDetails] = useState({
    name: org[0]?.name || "",
    logoUrl: org[0]?.logoUrl || "",
  });

  const [isEditingOrg, setIsEditingOrg] = useState(false);

  const handleOrgInputChange = (e: any) => {
    const { name, value } = e.target;
    setOrgDetails({ ...orgDetails, [name]: value });
  };

  const handleSaveOrgChanges = async () => {
    try {
      await updateUser(user.organizationId, {
        name: orgDetails.name,
        logoUrl: orgDetails.logoUrl,
      });
      setOrg(orgDetails);
      setIsEditingOrg(false);
      alert("Organization details updated successfully!");
    } catch (error) {
      console.error("Failed to update organization details:", error);
    }
  };

  return (
    <div className="profile-page">
      {/* Organization Section */}
      <div className="profile-header">
        <div className="org-logo">
          <img src={orgDetails.logoUrl} alt="Organization Logo" />
          {isEditingOrg && (
            <input
              type="text"
              name="logoUrl"
              value={orgDetails.logoUrl}
              onChange={handleOrgInputChange}
              placeholder="Enter new logo URL"
            />
          )}
        </div>
        {isEditingOrg ? (
          <input
            type="text"
            name="name"
            value={orgDetails.name}
            onChange={handleOrgInputChange}
            placeholder="Enter organization name"
          />
        ) : (
          <h1>{orgDetails.name}</h1>
        )}
        {/* <button onClick={() => setIsEditingOrg(!isEditingOrg)}>
          {isEditingOrg ? "Cancel" : "Edit Organization"}
        </button> */}
        {isEditingOrg && (
          <button onClick={handleSaveOrgChanges}>Save Changes</button>
        )}
      </div>

      {/* Profile Settings Section */}
      <div className="profile-container">
        <h2>Profile Settings</h2>
        <div className="profile-form">
          <button className="edit-profile-button">Edit Profile</button>
          <label>Full Name</label>
          <input
            type="text"
            value={`${user.firstName} ${user.lastName}`}
            readOnly
          />
          <label>Username</label>
          <input
            type="text"
            value={`${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`}
            readOnly
          />
          <label>Role</label>
          <input
            type="text"
            value={`${user.role.toLowerCase()}`}
            readOnly
          />
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
