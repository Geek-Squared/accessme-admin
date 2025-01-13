import { useState } from "react";
import Table from "./Table";
import useFetchUsers from "../../hooks/useFetchUsers";
import DropdownMenu from "../modals/DropdownMenu";
import AddResidentModal from "../modals/AddResidentModal";
import "./styles.scss";
import useFetchSites from "../../hooks/useFetchSites";

const ResidentTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_, setIsConfirmationModalOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);

  const { users, userLoading, userError, refreshPersonnel } = useFetchUsers();
  const { sites } = useFetchSites();

  console.log("users", users);
  if (userError) console.log(`error: ${userError}`);
  if (userLoading) return <p>Loading...</p>;
  if (!Array.isArray(users)) {
    return <p>No personnel available.</p>;
  }

  const filteredPersonnel = users?.filter(
    (user: any) => user.role === "RESIDENT"
  );

  const getSiteName = (sitesId: string) => {
    const matchingSite = sites?.find((site: any) => site.id === sitesId);
    console.log("Matching site for sitesId:", sitesId, matchingSite);
    return matchingSite?.name || "Unknown Site";
  };

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
    setIsConfirmationModalOpen(true);
  };

  const handlePersonnelCreated = () => {
    refreshPersonnel();
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
        headers={["Name", "Phone Number", "Site", "Actions"]}
        data={filteredPersonnel}
        renderIcons={renderIcons}
        renderRow={(person) => (
          <>
            <td>
              {person?.firstName} {person?.lastName}
            </td>
            <td>{person?.phoneNumber}</td>
            {/* <td>Tenant</td> */}
            <td>{getSiteName(person.sitesId)}</td>
          </>
        )}
        buttonName="Add Resident"
        onButtonClick={handleAddPersonnel}
        emptyStateMessage="No resident available. To add resident, click the Add resident button."
        emptyStateImage="/personnel.svg"
        itemsPerPage={20}
      />
      <AddResidentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onFormCreated={handlePersonnelCreated}
      />
    </>
  );
};

export default ResidentTable;
