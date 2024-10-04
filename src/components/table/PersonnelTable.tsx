import { useState } from "react";
import useFetchPersonnel from "../../hooks/useFetchPersonnel";
import "./styles.scss";
import AddPersonnelModal from "../modals/AddPersonnelModal";

const PersonnelTable = () => {
  const { personnel, isError, isLoading } = useFetchPersonnel();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isError) console.log(`error: ${isError}`);
  if (isLoading) return <p>Loading...</p>;

  if (!Array.isArray(personnel)) {
    return <p>No personnel Available.</p>;
  }

  console.log("personnel", personnel);

  const handleAddPersonnel = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button className="add-element" onClick={handleAddPersonnel}>
        Add Personnel
      </button>
      <table className="table-container">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Current Site Location</th>
          </tr>
        </thead>
        <tbody>
          {personnel?.map((person: any) => (
            <tr key={person.id}>
              <td>{person?.username}</td>
              <td>{person?.phoneNumber}</td>
              <td>On Duty</td>
              <td>Marimba Park</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddPersonnelModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default PersonnelTable;
