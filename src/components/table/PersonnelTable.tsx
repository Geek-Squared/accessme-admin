import { useState } from "react";
import useFetchPersonnel from "../../hooks/useFetchPersonnel";
import "./styles.scss";
import AddPersonnelModal from "../modals/AddPersonnelModal";
import Table from "../table/Table";
import useFetchUsers from "../../hooks/useFetchUsers";
import DropdownMenu from "../modals/DropdownMenu";

const PersonnelTable = () => {
  const { personnel, isError, isLoading } = useFetchPersonnel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_, setIsConfirmationModalOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);

  const { users } = useFetchUsers();

  if (isError) console.log(`error: ${isError}`);
  if (isLoading) return <p>Loading...</p>;
  if (!Array.isArray(personnel)) {
    return <p>No personnel available.</p>;
  }

  const filteredPersonnel = users?.filter(
    (user: any) => user.role === "PERSONNEL"
  );

  const handleAddPersonnel = () => {
    setIsModalOpen(true);
  };
  const toggleDropdown = (siteId: string) => {
    setDropdownVisible((prev) => (prev === siteId ? null : siteId));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    // setSiteIdToDelete(siteId);
    setIsConfirmationModalOpen(true);
  };

  const renderIcons = (site: any) => [
    <div className="actions-container" key={site.id}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 action-icon"
        width="25"
        height="25"
        onClick={() => toggleDropdown(site.id)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>

      <DropdownMenu
        key={`dropdown-${site.id}`}
        isOpen={dropdownVisible === site.id}
        itemId={site.id}
        onEdit={() => console.log(site.id)}
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
          "Phone Number",
          "Status",
          "Current Site Location",
          "Actions",
        ]}
        data={filteredPersonnel}
        renderIcons={renderIcons}
        renderRow={(person) => (
          <>
            <td>
              {person?.firstName}
              {person?.lastName}
            </td>
            <td>{person?.phoneNumber}</td>
            <td>On Duty</td>
            <td>Marimba Park</td>
          </>
        )}
        buttonName="Add Personnel"
        onButtonClick={handleAddPersonnel}
        emptyStateMessage="No personnel available. To add personnel, click the Add Personnel button."
        emptyStateImage="/personnel.svg"
        itemsPerPage={20}
      />
      <AddPersonnelModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default PersonnelTable;
