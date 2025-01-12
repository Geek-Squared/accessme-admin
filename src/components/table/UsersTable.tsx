import { useState } from "react";
import "./styles.scss";
import AddUserModal from "../modals/AddUser";
import Table from "../table/Table";
import useFetchUsers from "../../hooks/useFetchUsers";
import DropdownMenu from "../modals/DropdownMenu";

const UserTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_, setIsConfirmationModalOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);

  const { users, userLoading, userError,  } = useFetchUsers();

  if (userError) console.log(`error: ${userError}`);
  if (userLoading) return <p>Loading...</p>;
  if (!Array.isArray(users)) {
    return <p>No users available.</p>;
  }

  const filteredUsers = users?.filter((user: any) => user.role === "ADMIN");

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const toggleDropdown = (userId: string) => {
    setDropdownVisible((prev) => (prev === userId ? null : userId));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    setIsConfirmationModalOpen(true);
  };

  const handleUserCreated = () => {
    refreshUsers();
  };

  const renderIcons = (user: any) => [
    <div className="actions-container" key={user.id}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 action-icon"
        width="25"
        height="25"
        onClick={() => toggleDropdown(user.id)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>

      <DropdownMenu
        key={`dropdown-${user.id}`}
        isOpen={dropdownVisible === user.id}
        itemId={user.id}
        onEdit={() => console.log(user.id)}
        onDelete={() => confirmDelete()}
        onClose={() => setDropdownVisible(null)}
      />
    </div>,
  ];

  return (
    <>
      <Table
        headers={[
          "Name",
          "Email",
          "Role",
          "Actions"
        ]}
        data={filteredUsers}
        renderIcons={renderIcons}
        renderRow={(user) => (
          <>
            <td>{user?.firstName} {user?.lastName}</td>
            <td>{user?.email}</td>
            <td>{user?.role}</td>
          </>
        )}
        buttonName="Add User"
        onButtonClick={handleAddUser}
        emptyStateMessage="No users available. To add a user, click the Add User button."
        emptyStateImage="/users.svg"
        itemsPerPage={20}
      />
      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        // onFormCreated={handleUserCreated}
      />
    </>
  );
};

export default UserTable;