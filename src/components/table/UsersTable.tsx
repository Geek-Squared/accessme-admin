import { useState } from "react";
import useFetchUsers from "../../hooks/useFetchUsers";
import AddUserModal from "../modals/AddUser";
import Table from "../table/Table";
import "./styles.scss";

const UserTable = () => {
  const { user, userError, userLoading } = useFetchUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (userError) console.log(`error: ${userError}`);
  if (userLoading) return <p>Loading...</p>;

  if (!Array.isArray(user)) {
    return <p>No Users Available.</p>;
  }

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredUserData = user.filter((item) => item.role === "admin");

  return (
    <div>
      <Table
        headers={["Name", "Email", "Role"]}
        data={filteredUserData}
        renderRow={(item) => (
          <>
            <td>{item?.username}</td>
            <td>{item?.email}</td>
            <td>{item?.role}</td>
          </>
        )}
        buttonName="Add User"
        onButtonClick={handleAddUser}
        emptyStateMessage="No Users Available."
        itemsPerPage={20}
      />
      <AddUserModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default UserTable;
