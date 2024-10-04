import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchUsers from "../../hooks/useFetchUsers";
import AddUserModal from "../modals/AddUser";
import "./styles.scss";

const UserTable = () => {
  const { user, userError, userLoading } = useFetchUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  if (userError) console.log(`error: ${userError}`);
  if (userLoading) return <p>Loading...</p>;

  if (!Array.isArray(user)) {
    return <p>No Users Available.</p>;
  }

  console.table(user);

  const handleAddSite = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRowClick = (siteId: string) => {
    navigate(`visitors-log/${siteId}`);
  };

  return (
    <div>
      <button className="add-element" onClick={handleAddSite}>
        Add User
      </button>
      <table className="table-container">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {user?.map((item: any) => (
            <tr key={item._id} onClick={() => handleRowClick(item._id)}>
              <td>{item?.username}</td>
              <td>{item?.email}</td>
              <td>{item?.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddUserModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default UserTable;
