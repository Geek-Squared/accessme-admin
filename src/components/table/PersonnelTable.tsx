import { useState } from "react";
import useFetchPersonnel from "../../hooks/useFetchPersonnel";
import "./styles.scss";
import AddPersonnelModal from "../modals/AddPersonnelModal";
import useFetchOrganization from "../../hooks/useFetchOrg";
import Table from "../table/Table";

const PersonnelTable = () => {
  const { personnel, isError, isLoading } = useFetchPersonnel();
  const { organization } = useFetchOrganization();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isError) console.log(`error: ${isError}`);
  if (isLoading) return <p>Loading...</p>;

  if (!Array.isArray(personnel)) {
    return <p>No personnel Available.</p>;
  }

  const findMatchingPersonnel = (organization: any, personnel: any) => {
    return organization?.personnel
      .map((personnelId: string) =>
        personnel?.find((person: any) => person?._id === personnelId)
      )
      .filter(Boolean);
  };

  const filteredPersonnel = findMatchingPersonnel(organization, personnel);

  console.log(JSON.stringify(filteredPersonnel, null, 2));

  const handleAddPersonnel = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Table
        headers={["Name", "Phone Number", "Status", "Current Site Location"]}
        data={filteredPersonnel}
        renderRow={(person) => (
          <>
            <td>{person.username}</td>
            <td>{person.phoneNumber}</td>
            <td>On Duty</td>
            <td>Marimba Park</td>
          </>
        )}
        buttonName="Add Personnel"
        onButtonClick={handleAddPersonnel}
      />
      <AddPersonnelModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default PersonnelTable;